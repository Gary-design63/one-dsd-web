import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";

const ROOT = path.resolve(__dirname, "..");
const ENVIRONMENT = "local";
const IDENTITY_EVIDENCE = "rg6-identity-evidence";
const IDENTITY_BUNDLE = "a".repeat(64);

type Database = ReturnType<typeof postgres>;

function postgresBinary(name: "initdb" | "pg_ctl"): string | null {
  const executable = process.platform === "win32" ? `${name}.exe` : name;
  const candidates = [
    process.env.PAC_TEST_POSTGRES_BIN
      ? path.join(process.env.PAC_TEST_POSTGRES_BIN, executable)
      : "",
    process.platform === "win32"
      ? path.join(process.env.ProgramFiles ?? "C:\\Program Files", "PostgreSQL", "16", "bin", executable)
      : "",
    `/usr/lib/postgresql/16/bin/${executable}`,
    `/usr/lib/postgresql/15/bin/${executable}`,
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

const INITDB = postgresBinary("initdb");
const PG_CTL = postgresBinary("pg_ctl");
const REQUIRE_POSTGRES = true;

if (REQUIRE_POSTGRES && (!INITDB || !PG_CTL)) {
  throw new Error(
    "RG-6 requires PostgreSQL initdb and pg_ctl. Set PAC_TEST_POSTGRES_BIN to the PostgreSQL bin directory.",
  );
}

function run(executable: string, args: string[]) {
  const result = spawnSync(executable, args, {
    stdio: "ignore",
    windowsHide: true,
    timeout: 60_000,
  });
  if (result.status !== 0) throw new Error(`${path.basename(executable)} failed.`);
}

async function unusedPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not allocate a local PostgreSQL test port."));
        return;
      }
      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}

async function waitForAdvisoryWait(database: Database, applicationName: string): Promise<void> {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    const rows = await database.unsafe<{ waiting: boolean }[]>(
      `select exists (
         select 1 from pg_catalog.pg_stat_activity
         where application_name = $1
           and wait_event_type = 'Lock'
           and wait_event = 'advisory'
       ) waiting`,
      [applicationName],
    );
    if (rows[0]?.waiting) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`${applicationName} did not reach the expected advisory-lock wait.`);
}

async function waitForLockWait(database: Database, applicationName: string): Promise<void> {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    const rows = await database.unsafe<{ waiting: boolean }[]>(
      `select exists (
         select 1 from pg_catalog.pg_stat_activity
         where application_name = $1
           and wait_event_type = 'Lock'
       ) waiting`,
      [applicationName],
    );
    if (rows[0]?.waiting) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`${applicationName} did not reach the expected lock wait.`);
}

function digest(label: string): string {
  return createHash("sha256").update(`pac-rg6:${label}`, "utf8").digest("hex");
}

function credential(marker: string): string {
  const salt = marker.slice(0, 1).repeat(22);
  const verifier = marker.slice(-1).repeat(43);
  return `$pac-scrypt$v=1$ln=17$r=8$p=1$${salt}$${verifier}`;
}

describe("RG-6 named protected identity and contribution", () => {
  let temporaryRoot = "";
  let dataDirectory = "";
  let adminUrl = "";
  let runtimeUrl = "";
  let admin: Database | null = null;
  let runtime: Database | null = null;
  let broker: Database | null = null;

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-rg6-identity-"));
    dataDirectory = path.join(temporaryRoot, "data");
    const logFile = path.join(temporaryRoot, "postgres.log");
    const port = await unusedPort();
    run(INITDB!, [
      "-D",
      dataDirectory,
      "--username=pac_test",
      "--auth=trust",
      "--encoding=UTF8",
      "--no-locale",
    ]);
    run(PG_CTL!, [
      "-D",
      dataDirectory,
      "-l",
      logFile,
      "-o",
      localPostgresServerOptions(port, temporaryRoot),
      "-w",
      "start",
    ]);

    const adminOptions = { ssl: false as const, max: 1, prepare: false, onnotice: () => undefined };
    const runtimeOptions = { ...adminOptions, max: 6 };
    adminUrl = `postgresql://pac_test@127.0.0.1:${port}/postgres`;
    runtimeUrl = adminUrl.replace("pac_test@", "pac_contributor_runtime@");
    admin = postgres(adminUrl, adminOptions);
    const migrations = readdirSync(path.join(ROOT, "db", "migrations"))
      .filter((name) => /^\d{4}_.+\.sql$/.test(name))
      .sort();
    expect(migrations).toContain("0045_pac_contributor_resource_workflow.sql");
    for (const migration of migrations) {
      try {
        await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", migration), "utf8"));
      } catch (error) {
        throw new Error(`Fresh RG-6 migration sequence failed at ${migration}.`, { cause: error });
      }
    }
    runtime = postgres(runtimeUrl, runtimeOptions);
    broker = postgres(adminUrl.replace("pac_test@", "pac_authentication_broker@"), {
      ssl: false,
      max: 1,
      prepare: false,
      onnotice: () => undefined,
    });
  }, 120_000);

  afterAll(async () => {
    await broker?.end({ timeout: 5 }).catch(() => undefined);
    await runtime?.end({ timeout: 5 }).catch(() => undefined);
    await admin?.end({ timeout: 5 }).catch(() => undefined);
    if (PG_CTL && dataDirectory && existsSync(dataDirectory)) {
      spawnSync(PG_CTL, ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], {
        stdio: "ignore",
        windowsHide: true,
        timeout: 30_000,
      });
    }
    if (
      temporaryRoot
      && path.dirname(temporaryRoot) === path.resolve(tmpdir())
      && path.basename(temporaryRoot).startsWith("pac-rg6-identity-")
    ) {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  }, 45_000);

  it("permits only the database owner's non-usable administrative membership and rejects inherited, SET or other membership paths", async () => {
    const targets = [
      { role: "pac_contributor_runtime", connection: runtime!, query: "select runtime_memberships_denied as denied from pac.attest_program_identity_runtime_boundary()" },
      { role: "pac_authentication_broker", connection: broker!, query: "select broker_memberships_denied as denied from pac_auth.attest_authentication_broker_boundary()" },
    ];
    await admin!.unsafe("create role pac_membership_probe nologin noinherit");
    try {
      for (const target of targets) {
        await admin!.unsafe("grant " + target.role + " to pac_test with admin true, inherit false, set false");
        expect((await target.connection.unsafe(target.query))[0].denied).toBe(true);
        await admin!.unsafe("grant " + target.role + " to pac_test with set true");
        expect((await target.connection.unsafe(target.query))[0].denied).toBe(false);
        await admin!.unsafe("grant " + target.role + " to pac_test with set false, inherit true");
        expect((await target.connection.unsafe(target.query))[0].denied).toBe(false);
        await admin!.unsafe("grant " + target.role + " to pac_test with inherit false");
        expect((await target.connection.unsafe(target.query))[0].denied).toBe(true);
        await admin!.unsafe("grant " + target.role + " to pac_membership_probe with admin true, inherit false, set false");
        expect((await target.connection.unsafe(target.query))[0].denied).toBe(false);
        await admin!.unsafe("revoke " + target.role + " from pac_membership_probe");
        await admin!.unsafe("grant pac_membership_probe to " + target.role + " with inherit false, set false");
        expect((await target.connection.unsafe(target.query))[0].denied).toBe(false);
        await admin!.unsafe("revoke pac_membership_probe from " + target.role);
        await admin!.unsafe("revoke " + target.role + " from pac_test");
        expect((await target.connection.unsafe(target.query))[0].denied).toBe(true);
      }
    } finally {
      for (const target of targets) {
        await admin!.unsafe("revoke " + target.role + " from pac_membership_probe,pac_test").catch(() => undefined);
        await admin!.unsafe("revoke pac_membership_probe from " + target.role).catch(() => undefined);
      }
      await admin!.unsafe("drop role pac_membership_probe");
    }
  });

  it("proves named recovery, atomic succession, corrections, concurrent grant changes and expired-secret cleanup", async () => {
    const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const ownerInvitation = digest("owner-invitation");
    const ownerSession = digest("owner-session");

    const runtimeBoundary = await runtime!.unsafe<{
      installation_id: string;
      login_credential_lookup_denied: boolean;
      session_start_denied: boolean;
      authentication_schema_denied: boolean;
      authentication_functions_denied: boolean;
      runtime_role_attributes_safe: boolean;
      runtime_memberships_denied: boolean;
    }[]>("select * from pac.attest_program_identity_runtime_boundary()");
    expect(runtimeBoundary[0]).toMatchObject({
      login_credential_lookup_denied: true,
      session_start_denied: true,
      authentication_schema_denied: true,
      authentication_functions_denied: true,
      runtime_role_attributes_safe: true,
      runtime_memberships_denied: true,
    });
    expect(runtimeBoundary[0].installation_id).toMatch(/^[0-9a-f-]{36}$/i);
    await expect(
      runtime!.unsafe("select * from pac.lookup_program_login_credential($1,$2)", ["initial.owner", ENVIRONMENT]),
    ).rejects.toMatchObject({ code: "42501" });
    await expect(
      runtime!.unsafe("select * from pac_auth.lookup_program_login_credential($1,$2)", ["initial.owner", ENVIRONMENT]),
    ).rejects.toMatchObject({ code: "42501" });
    await expect(
      runtime!.unsafe(
        "select * from pac.start_program_account_session($1::uuid,$2::uuid,$3,$4::integer,$5,$6,$7,$8)",
        [randomUUID(), randomUUID(), "forged.account", 1, digest("forged-runtime-session"), ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
      ),
    ).rejects.toMatchObject({ code: "42501" });
    const brokerBoundary = await broker!.unsafe("select * from pac_auth.attest_authentication_broker_boundary()");
    expect(brokerBoundary[0]).toMatchObject({
      broker_role: "pac_authentication_broker",
      session_role: "pac_authentication_broker",
      pac_schema_denied: true,
      auth_schema_create_denied: true,
      identity_tables_denied: true,
      direct_login_functions_denied: true,
      login_lookup_allowed: true,
      session_start_allowed: true,
      other_auth_functions_denied: true,
      auth_objects_denied: true,
      broker_role_attributes_safe: true,
      broker_memberships_denied: true,
    });
    expect(brokerBoundary[0].installation_id).toBe(runtimeBoundary[0].installation_id);
    await expect(broker!.unsafe("select * from pac.program_accounts")).rejects.toMatchObject({
      code: "42501",
    });

    await admin!.unsafe("select pac.record_protected_feature_activation($1,$2,$3,$4,$5,$6)",
      [ENVIRONMENT, "protected_identity", "active", IDENTITY_EVIDENCE, IDENTITY_BUNDLE, "Synthetic local identity activation."]);
    await admin!.unsafe(
      "select * from pac.bootstrap_program_owner_invitation($1,$2,$3,$4,$5::timestamptz,$6,$7)",
      [ENVIRONMENT, "initial.owner", "Initial Owner", ownerInvitation, expiry, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
    );
    const ownerRows = await runtime!.unsafe<{ account_id: string; session_id: string }[]>(
      "select * from pac.accept_program_account_invitation($1,$2,$3,$4,$5,$6)",
      [ownerInvitation, credential("CD"), ownerSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
    );
    expect(ownerRows).toHaveLength(1);
    const owner = ownerRows[0];

    const ownerCredentialBeforeRecovery = await admin!.unsafe<{ credential_id: string }[]>(
      "select credential_id::text from pac.program_account_credentials where account_id=$1::uuid order by credential_version desc",
      [owner.account_id],
    );
    expect(ownerCredentialBeforeRecovery).toHaveLength(1);

    const recoveryInvitation = digest("owner-recovery-invitation");
    await admin!.unsafe(
      "select invitation_id,expires_at from pac.create_program_owner_recovery_invitation($1,$2::uuid,$3,$4::timestamptz,$5,$6,$7)",
      [ENVIRONMENT, owner.account_id, recoveryInvitation, expiry, "rg6-owner-recovery", IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
    );
    const oldSessionAfterRecovery = await runtime!.unsafe(
      "select * from pac.read_program_account_session($1,$2,$3,$4)",
      [ownerSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
    );
    expect(oldSessionAfterRecovery).toHaveLength(0);
    const oldCredentialSecrets = await admin!.unsafe<{ count: number }[]>(
      "select count(*)::int count from pac.program_account_credential_secrets where credential_id=$1::uuid",
      [ownerCredentialBeforeRecovery[0].credential_id],
    );
    expect(oldCredentialSecrets[0].count).toBe(0);

    const recoveredSession = digest("recovered-owner-session");
    const recoveredRows = await runtime!.unsafe<{ account_id: string; session_id: string; bootstrap_owner: boolean }[]>(
      "select * from pac.accept_program_account_invitation($1,$2,$3,$4,$5,$6)",
      [recoveryInvitation, credential("EF"), recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
    );
    expect(recoveredRows[0]).toMatchObject({ account_id: owner.account_id, bootstrap_owner: false });

    const raceResults = await Promise.allSettled([
      runtime!.unsafe(
        "select * from pac.create_program_account_invitation($1,$2,$3,$4,$5,$6,$7,$8::timestamptz)",
        [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, "parallel.person", "Parallel Person", digest("parallel-a"), expiry],
      ),
      runtime!.unsafe(
        "select * from pac.create_program_account_invitation($1,$2,$3,$4,$5,$6,$7,$8::timestamptz)",
        [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, "parallel.person", "Parallel Person", digest("parallel-b"), expiry],
      ),
    ]);
    expect(raceResults.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    const raceFailure = raceResults.find((result) => result.status === "rejected");
    expect(raceFailure).toMatchObject({ status: "rejected", reason: { code: "23505" } });

    const resetTargetInvitation = digest("reset-target-invitation");
    await runtime!.unsafe(
      "select * from pac.create_program_account_invitation($1,$2,$3,$4,$5,$6,$7,$8::timestamptz)",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, "reset.target", "Reset Target", resetTargetInvitation, expiry],
    );
    const resetTargetRows = await runtime!.unsafe<{ account_id: string }[]>(
      "select * from pac.accept_program_account_invitation($1,$2,$3,$4,$5,$6)",
      [resetTargetInvitation, credential("LM"), digest("reset-target-session"), ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
    );
    const resetTargetAccountId = resetTargetRows[0].account_id;
    const firstResetInvitation = digest("reset-target-first-code");
    await runtime!.unsafe(
      "select * from pac.create_program_credential_reset_invitation($1,$2,$3,$4,$5::uuid,$6,$7::timestamptz)",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, resetTargetAccountId, firstResetInvitation, expiry],
    );

    const blocker = postgres(adminUrl, { ssl: false, max: 1, prepare: false, onnotice: () => undefined });
    const resetReissue = postgres(runtimeUrl, { ssl: false, max: 1, prepare: false, onnotice: () => undefined });
    const resetAccept = postgres(runtimeUrl, { ssl: false, max: 1, prepare: false, onnotice: () => undefined });
    try {
      await resetReissue.unsafe("set application_name = 'rg6_reset_reissue'");
      await resetAccept.unsafe("set application_name = 'rg6_reset_accept'");
      await blocker.unsafe("begin");
      await blocker.unsafe(
        "select pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('pac-program-account:' || $1::text, 0))",
        [resetTargetAccountId],
      );

      const reissuePromise = Promise.resolve(resetReissue.unsafe(
        "select * from pac.create_program_credential_reset_invitation($1,$2,$3,$4,$5::uuid,$6,$7::timestamptz)",
        [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, resetTargetAccountId, digest("reset-target-second-code"), expiry],
      ));
      await waitForAdvisoryWait(admin!, "rg6_reset_reissue");
      const acceptPromise = Promise.resolve(resetAccept.unsafe(
        "select * from pac.accept_program_account_invitation($1,$2,$3,$4,$5,$6)",
        [firstResetInvitation, credential("NO"), digest("reset-target-accepted-session"), ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
      ));
      await waitForAdvisoryWait(admin!, "rg6_reset_accept");
      await blocker.unsafe("commit");

      const [reissueResult, acceptResult] = await Promise.allSettled([reissuePromise, acceptPromise]);
      expect(reissueResult.status).toBe("fulfilled");
      expect(acceptResult).toMatchObject({ status: "rejected", reason: { code: "42501" } });
      for (const result of [reissueResult, acceptResult]) {
        if (result.status === "rejected") expect(result.reason).not.toMatchObject({ code: "40P01" });
      }
    } finally {
      await blocker.unsafe("rollback").catch(() => undefined);
      await resetAccept.end({ timeout: 5 }).catch(() => undefined);
      await resetReissue.end({ timeout: 5 }).catch(() => undefined);
      await blocker.end({ timeout: 5 }).catch(() => undefined);
    }

    const resetTargetCredential = await admin!.unsafe<{ credential_id: string }[]>(
      "select credential_id::text from pac.program_account_credentials where account_id=$1::uuid order by credential_version desc limit 1",
      [resetTargetAccountId],
    );
    await expect(runtime!.unsafe(
      "select * from pac.change_program_account_state($1,$2,$3,$4,$5::uuid,$6,$7,$8)",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, resetTargetAccountId, "revoked", "R".repeat(484), "reset.target"],
    )).rejects.toMatchObject({ code: "22023" });
    const terminalState = await runtime!.unsafe<{ state: string }[]>(
      "select * from pac.change_program_account_state($1,$2,$3,$4,$5::uuid,$6,$7,$8)",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, resetTargetAccountId, "revoked", "R".repeat(483), "reset.target"],
    );
    expect(terminalState[0].state).toBe("revoked");
    const terminalCredentialSecrets = await admin!.unsafe<{ count: number }[]>(
      "select count(*)::int count from pac.program_account_credential_secrets where credential_id=$1::uuid",
      [resetTargetCredential[0].credential_id],
    );
    expect(terminalCredentialSecrets[0].count).toBe(0);
    const terminalSession = await runtime!.unsafe(
      "select * from pac.read_program_account_session($1,$2,$3,$4)",
      [digest("reset-target-session"), ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
    );
    expect(terminalSession).toHaveLength(0);
    await expect(runtime!.unsafe(
      "select * from pac.change_program_account_state($1,$2,$3,$4,$5::uuid,$6,$7,$8)",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, resetTargetAccountId, "active", "Attempt to reverse terminal access", null],
    )).rejects.toMatchObject({ code: "42501" });
    await expect(runtime!.unsafe(
      "select * from pac.change_program_account_state($1,$2,$3,$4,$5::uuid,$6,$7,$8)",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, resetTargetAccountId, "revoked", "Attempt to repeat terminal access", "reset.target"],
    )).rejects.toMatchObject({ code: "42501" });
    const terminalEventCount = await admin!.unsafe<{ count: number }[]>(
      "select count(*)::int count from pac.program_account_state_events where account_id=$1::uuid and state='revoked'",
      [resetTargetAccountId],
    );
    expect(terminalEventCount[0].count).toBe(1);

    const successorInvitation = digest("successor-invitation");
    await runtime!.unsafe(
      "select * from pac.create_program_account_invitation($1,$2,$3,$4,$5,$6,$7,$8::timestamptz)",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, "successor.owner", "Successor Owner", successorInvitation, expiry],
    );
    const successorSessionBeforeTransfer = digest("successor-session-before-transfer");
    const successorRows = await runtime!.unsafe<{ account_id: string; session_id: string }[]>(
      "select * from pac.accept_program_account_invitation($1,$2,$3,$4,$5,$6)",
      [successorInvitation, credential("GH"), successorSessionBeforeTransfer, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
    );
    expect(successorRows).toHaveLength(1);
    const successor = successorRows[0];

    const successorLookupBeforeCorrection = await broker!.unsafe<{
      account_id: string;
      credential_id: string;
      identity_version: number;
    }[]>(
      "select account_id,credential_id,identity_version from pac_auth.lookup_program_login_credential($1,$2)",
      ["successor.owner", ENVIRONMENT],
    );
    expect(successorLookupBeforeCorrection[0]).toMatchObject({
      account_id: successor.account_id,
      identity_version: 1,
    });
    const correctionResetCode = digest("successor-reset-before-correction");
    await runtime!.unsafe(
      "select * from pac.create_program_credential_reset_invitation($1,$2,$3,$4,$5::uuid,$6,$7::timestamptz)",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, successor.account_id, correctionResetCode, expiry],
    );
    const correctionRows = await runtime!.unsafe<{
      correction_id: string;
      account_id: string;
      identity_version: number;
      sign_in_id: string;
      display_name: string;
    }[]>(
      "select * from pac.correct_program_account_identity($1,$2,$3,$4,$5::uuid,$6::integer,$7,$8,$9,$10)",
      [
        recoveredSession,
        ENVIRONMENT,
        IDENTITY_EVIDENCE,
        IDENTITY_BUNDLE,
        successor.account_id,
        1,
        "successor.owner",
        "successor.corrected",
        "Corrected Successor",
        "Correct a verified entry error",
      ],
    );
    expect(correctionRows[0]).toMatchObject({
      account_id: successor.account_id,
      identity_version: 2,
      sign_in_id: "successor.corrected",
      display_name: "Corrected Successor",
    });
    const oldIdentityLookup = await broker!.unsafe(
      "select * from pac_auth.lookup_program_login_credential($1,$2)",
      ["successor.owner", ENVIRONMENT],
    );
    expect(oldIdentityLookup).toHaveLength(0);
    const correctedIdentityLookup = await broker!.unsafe<{
      account_id: string;
      credential_id: string;
      identity_version: number;
    }[]>(
      "select account_id,credential_id,identity_version from pac_auth.lookup_program_login_credential($1,$2)",
      ["successor.corrected", ENVIRONMENT],
    );
    expect(correctedIdentityLookup[0]).toEqual({
      account_id: successor.account_id,
      credential_id: successorLookupBeforeCorrection[0].credential_id,
      identity_version: 2,
    });
    await expect(broker!.unsafe(
      "select * from pac_auth.start_program_account_session($1::uuid,$2::uuid,$3,$4::integer,$5,$6,$7,$8)",
      [
        successorLookupBeforeCorrection[0].account_id,
        successorLookupBeforeCorrection[0].credential_id,
        "successor.owner",
        1,
        digest("stale-identity-start"),
        ENVIRONMENT,
        IDENTITY_EVIDENCE,
        IDENTITY_BUNDLE,
      ],
    )).rejects.toMatchObject({ code: "42501" });
    expect(await runtime!.unsafe(
      "select * from pac.read_program_account_session($1,$2,$3,$4)",
      [successorSessionBeforeTransfer, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
    )).toHaveLength(0);
    const resetSecretAfterCorrection = await admin!.unsafe<{ count: number }[]>(
      "select count(*)::int count from pac.program_account_invitation_secrets where token_digest=$1",
      [correctionResetCode],
    );
    expect(resetSecretAfterCorrection[0].count).toBe(0);
    const correctionEvidence = await admin!.unsafe<{ count: number }[]>(`
      select count(*)::int count
      from pac.program_account_identity_corrections correction
      join pac.protected_action_consumptions consumption
        on consumption.authorization_id=correction.authorization_id
      where correction.correction_id=$1::uuid
        and consumption.result_record_type='account_identity_correction'
        and consumption.action_record_id=correction.correction_id::text
    `, [correctionRows[0].correction_id]);
    expect(correctionEvidence[0].count).toBe(1);
    await expect(runtime!.unsafe(
      "select * from pac.program_account_identity_corrections",
    )).rejects.toMatchObject({ code: "42501" });
    await expect(admin!.unsafe(
      "update pac.program_account_identity_corrections set reason='Rewritten evidence' where correction_id=$1::uuid",
      [correctionRows[0].correction_id],
    )).rejects.toMatchObject({ code: "P0001" });
    await expect(runtime!.unsafe(
      "select * from pac.correct_program_account_identity($1,$2,$3,$4,$5::uuid,$6::integer,$7,$8,$9,$10)",
      [
        recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE,
        successor.account_id, 1, "successor.owner", "successor.again",
        "Successor Again", "Stale correction must fail",
      ],
    )).rejects.toMatchObject({ code: "40001" });
    await expect(runtime!.unsafe(
      "select * from pac.create_program_account_invitation($1,$2,$3,$4,$5,$6,$7,$8::timestamptz)",
      [
        recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE,
        "successor.owner", "Different Person", digest("historical-id-reuse"), expiry,
      ],
    )).rejects.toMatchObject({ code: "23505" });

    const correctionRace = postgres(runtimeUrl, { ssl: false, max: 1, prepare: false, onnotice: () => undefined });
    const transferRace = postgres(runtimeUrl, { ssl: false, max: 1, prepare: false, onnotice: () => undefined });
    try {
      await transferRace.unsafe("set application_name = 'rg6_stale_owner_transfer'");
      await correctionRace.unsafe("begin");
      const racedCorrection = await correctionRace.unsafe<{ identity_version: number; sign_in_id: string }[]>(
        "select identity_version,sign_in_id from pac.correct_program_account_identity($1,$2,$3,$4,$5::uuid,$6::integer,$7,$8,$9,$10)",
        [
          recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE,
          successor.account_id, 2, "successor.corrected", "successor.raced",
          "Corrected Successor", "Correct identity while succession is being prepared",
        ],
      );
      expect(racedCorrection[0]).toEqual({ identity_version: 3, sign_in_id: "successor.raced" });
      const staleTransferPromise = Promise.resolve(transferRace.unsafe(
        "select * from pac.transfer_program_owner($1,$2,$3,$4,$5::uuid,$6::integer,$7,$8)",
        [
          recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE,
          successor.account_id, 2, "successor.corrected", "Prepared before identity correction",
        ],
      ));
      await waitForLockWait(admin!, "rg6_stale_owner_transfer");
      await correctionRace.unsafe("commit");
      await expect(staleTransferPromise).rejects.toMatchObject({ code: "40001" });
    } finally {
      await correctionRace.unsafe("rollback").catch(() => undefined);
      await transferRace.end({ timeout: 5 }).catch(() => undefined);
      await correctionRace.end({ timeout: 5 }).catch(() => undefined);
    }

    const firstAccountPage = await runtime!.unsafe<{ overview: {
      accounts: Array<{ account_id: string }>;
      grants: Array<{ account_id: string }>;
      pagination: { account_total: number; account_offset: number; account_limit: number };
    } }[]>(
      "select pac.read_program_access_overview($1,$2,$3,$4,$5::integer,$6::integer,$7::integer,$8::integer) overview",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, 0, 1, 0, 1],
    );
    const secondAccountPage = await runtime!.unsafe<{ overview: {
      accounts: Array<{ account_id: string }>;
      grants: Array<{ account_id: string }>;
    } }[]>(
      "select pac.read_program_access_overview($1,$2,$3,$4,$5::integer,$6::integer,$7::integer,$8::integer) overview",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, 1, 1, 0, 1],
    );
    expect(firstAccountPage[0].overview.pagination).toMatchObject({
      account_offset: 0,
      account_limit: 1,
      account_total: expect.any(Number),
    });
    expect(firstAccountPage[0].overview.pagination.account_total).toBeGreaterThan(1);
    expect(firstAccountPage[0].overview.accounts).toHaveLength(1);
    expect(secondAccountPage[0].overview.accounts).toHaveLength(1);
    expect(secondAccountPage[0].overview.accounts[0].account_id)
      .not.toBe(firstAccountPage[0].overview.accounts[0].account_id);
    for (const grant of firstAccountPage[0].overview.grants) {
      expect(grant.account_id).toBe(firstAccountPage[0].overview.accounts[0].account_id);
    }
    const exactSuccessor = await runtime!.unsafe<{ account_id: string; identity_version: number; sign_in_id: string }[]>(
      "select account_id,identity_version,sign_in_id from pac.read_program_account_admin_target($1,$2,$3,$4,$5::uuid)",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, successor.account_id],
    );
    expect(exactSuccessor[0]).toEqual({
      account_id: successor.account_id,
      identity_version: 3,
      sign_in_id: "successor.raced",
    });

    await expect(runtime!.unsafe(
      "select * from pac.transfer_program_owner($1,$2,$3,$4,$5::uuid,$6::integer,$7,$8)",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, successor.account_id, 3, "successor.raced", "T".repeat(472)],
    )).rejects.toMatchObject({ code: "22023" });
    const transferRows = await runtime!.unsafe<{ transfer_id: string; from_account_id: string; to_account_id: string }[]>(
      "select * from pac.transfer_program_owner($1,$2,$3,$4,$5::uuid,$6::integer,$7,$8)",
      [recoveredSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, successor.account_id, 3, "successor.raced", "T".repeat(471)],
    );
    expect(transferRows[0]).toMatchObject({
      from_account_id: owner.account_id,
      to_account_id: successor.account_id,
    });
    for (const revokedSession of [recoveredSession, successorSessionBeforeTransfer]) {
      const rows = await runtime!.unsafe(
        "select * from pac.read_program_account_session($1,$2,$3,$4)",
        [revokedSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
      );
      expect(rows).toHaveLength(0);
    }

    const activeOwners = await admin!.unsafe<{ account_id: string }[]>(`
      select account_id::text
      from pac.access_grants
      where environment=$1 and scope_id='one-dhs-pac' and role_key='owner'
        and grant_contract_version='protected-v1' and revoked_at is null
        and (expires_at is null or expires_at>clock_timestamp())
    `, [ENVIRONMENT]);
    expect(activeOwners).toEqual([{ account_id: successor.account_id }]);

    const login = await broker!.unsafe<{ account_id: string; credential_id: string; identity_version: number }[]>(
      "select account_id,credential_id,identity_version from pac_auth.lookup_program_login_credential($1,$2)",
      ["successor.raced", ENVIRONMENT],
    );
    let successorSession = digest("successor-session-after-transfer");
    const restarted = await broker!.unsafe(
      "select * from pac_auth.start_program_account_session($1::uuid,$2::uuid,$3,$4::integer,$5,$6,$7,$8)",
      [login[0].account_id, login[0].credential_id, "successor.raced", login[0].identity_version, successorSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
    );
    expect(restarted).toHaveLength(1);

    const resetInvitation = digest("successor-credential-reset");
    await runtime!.unsafe(
      "select * from pac.create_program_credential_reset_invitation($1,$2,$3,$4,$5::uuid,$6,$7::timestamptz)",
      [successorSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, successor.account_id, resetInvitation, expiry],
    );
    const resetSession = digest("successor-session-after-reset");
    const resetRows = await runtime!.unsafe<{ account_id: string; bootstrap_owner: boolean }[]>(
      "select * from pac.accept_program_account_invitation($1,$2,$3,$4,$5,$6)",
      [resetInvitation, credential("JK"), resetSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
    );
    expect(resetRows[0]).toMatchObject({ account_id: successor.account_id, bootstrap_owner: false });
    const preResetSession = await runtime!.unsafe(
      "select * from pac.read_program_account_session($1,$2,$3,$4)",
      [successorSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE],
    );
    expect(preResetSession).toHaveLength(0);
    successorSession = resetSession;

    for (const [scope, role] of [
      ["one-dsd-team", "content_contributor"],
      ["one-dhs", "one_dsd_team_member"],
      ["one-dhs", "equity_director"],
      ["one-dhs-pac", "owner"],
    ] as const) {
      await expect(runtime!.unsafe(
        "select * from pac.issue_program_access_grant($1,$2,$3,$4,$5::uuid,$6,$7,$8::timestamptz,$9)",
        [successorSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, successor.account_id, scope, role, null, "RG6 invalid role and scope pair."],
      )).rejects.toMatchObject({ code: "22023" });
    }

    const expiredGrantId = randomUUID();
    await admin!.unsafe(`
      insert into pac.access_grants (
        grant_id, principal_id, scope_id, role_key, granted_by, granted_at,
        account_id, environment, expires_at, issued_by_account_id,
        issued_by_session_id, grant_reason, grant_contract_version
      ) values (
        $1::uuid, $2::uuid::text, 'dsd', 'program_steward', $2::uuid::text,
        clock_timestamp() - interval '2 days', $2::uuid, $3,
        clock_timestamp() - interval '1 day', $2::uuid, $4::uuid,
        'Expired permission fixture.', 'protected-v1'
      )
    `, [expiredGrantId, successor.account_id, ENVIRONMENT, randomUUID()]);
    const renewedGrant = await runtime!.unsafe<{ grant_id: string }[]>(
      "select * from pac.issue_program_access_grant($1,$2,$3,$4,$5::uuid,$6,$7,$8::timestamptz,$9)",
      [
        successorSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE,
        successor.account_id, "dsd", "program_steward", null,
        "Renew an expired named responsibility.",
      ],
    );
    expect(renewedGrant).toHaveLength(1);
    const closedExpiredGrant = await admin!.unsafe<{
      revoked_at: string | Date | null;
      revocation_reason: string | null;
    }[]>(
      "select revoked_at,revocation_reason from pac.access_grants where grant_id=$1::uuid",
      [expiredGrantId],
    );
    expect(closedExpiredGrant[0].revoked_at).not.toBeNull();
    expect(closedExpiredGrant[0].revocation_reason).toMatch(/replacement was issued/i);
    const expiredGrantClosureEvidence = await admin!.unsafe<{ count: number }[]>(`
      select count(*)::int count
      from pac.protected_action_authorizations auth_record
      join pac.protected_action_consumptions consumption
        on consumption.authorization_id=auth_record.authorization_id
      where auth_record.action_kind='grant_revoke'
        and auth_record.target_type='grant'
        and auth_record.target_id=$1::uuid::text
        and consumption.result_record_type='grant'
        and consumption.action_record_id=$1::uuid::text
    `, [expiredGrantId]);
    expect(expiredGrantClosureEvidence[0].count).toBe(1);

    const duplicateGrantRace = await Promise.allSettled([
      runtime!.unsafe(
        "select * from pac.issue_program_access_grant($1,$2,$3,$4,$5::uuid,$6,$7,$8::timestamptz,$9)",
        [successorSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, successor.account_id, "one-dsd-team", "one_dsd_team_member", null, "RG6 concurrent team permission A."],
      ),
      runtime!.unsafe(
        "select * from pac.issue_program_access_grant($1,$2,$3,$4,$5::uuid,$6,$7,$8::timestamptz,$9)",
        [successorSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE, successor.account_id, "one-dsd-team", "one_dsd_team_member", null, "RG6 concurrent team permission B."],
      ),
    ]);
    expect(duplicateGrantRace.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(duplicateGrantRace.find((result) => result.status === "rejected"))
      .toMatchObject({ status: "rejected", reason: { code: "23505" } });


    // Configuration cannot keep old sessions or invitation acceptance alive after
    // the database authority records the identity feature as inactive.
    const heldInvitation=digest("held-invitation-during-pause");
    await runtime!.unsafe("select * from pac.create_program_account_invitation($1,$2,$3,$4,$5,$6,$7,$8::timestamptz)",
      [successorSession,ENVIRONMENT,IDENTITY_EVIDENCE,IDENTITY_BUNDLE,"held.person","Held Person",heldInvitation,expiry]);
    await admin!.unsafe("select pac.record_protected_feature_activation($1,$2,$3,$4,$5,$6)",
      [ENVIRONMENT,"protected_identity","inactive",IDENTITY_EVIDENCE,IDENTITY_BUNDLE,"Synthetic database pause."]);
    expect(await runtime!.unsafe("select * from pac.read_program_account_session($1,$2,$3,$4)",[successorSession,ENVIRONMENT,IDENTITY_EVIDENCE,IDENTITY_BUNDLE])).toHaveLength(0);
    await expect(runtime!.unsafe("select * from pac.create_program_account_invitation($1,$2,$3,$4,$5,$6,$7,$8::timestamptz)",
      [successorSession,ENVIRONMENT,IDENTITY_EVIDENCE,IDENTITY_BUNDLE,"blocked.person","Blocked Person",digest("blocked-invite"),expiry])).rejects.toMatchObject({code:"42501"});
    await expect(runtime!.unsafe("select * from pac.accept_program_account_invitation($1,$2,$3,$4,$5,$6)",
      [heldInvitation,credential("LM"),digest("blocked-accept"),ENVIRONMENT,IDENTITY_EVIDENCE,IDENTITY_BUNDLE])).rejects.toMatchObject({code:"42501"});
    const pausedLogin=await broker!.unsafe<{account_id:string;credential_id:string;identity_version:number}[]>("select * from pac_auth.lookup_program_login_credential($1,$2)",["successor.raced",ENVIRONMENT]);
    await expect(broker!.unsafe("select * from pac_auth.start_program_account_session($1::uuid,$2::uuid,$3,$4::integer,$5,$6,$7,$8)",
      [pausedLogin[0].account_id,pausedLogin[0].credential_id,"successor.raced",pausedLogin[0].identity_version,digest("blocked-login"),ENVIRONMENT,IDENTITY_EVIDENCE,IDENTITY_BUNDLE])).rejects.toMatchObject({code:"42501"});
    await admin!.unsafe("select pac.record_protected_feature_activation($1,$2,$3,$4,$5,$6)",
      [ENVIRONMENT,"protected_identity","active",IDENTITY_EVIDENCE,IDENTITY_BUNDLE,"Synthetic reactivation before cleanup."]);

    const housekeepingInvitationDigest = digest("housekeeping-invitation");
    await runtime!.unsafe(
      "select * from pac.create_program_account_invitation($1,$2,$3,$4,$5,$6,$7,$8::timestamptz)",
      [
        successorSession, ENVIRONMENT, IDENTITY_EVIDENCE, IDENTITY_BUNDLE,
        "housekeeping.person", "Housekeeping Person", housekeepingInvitationDigest, expiry,
      ],
    );
    const housekeepingInvitation = await admin!.unsafe<{ invitation_id: string }[]>(`
      select invitation_id::text
      from pac.program_account_invitation_secrets
      where token_digest = $1
      limit 1
    `, [housekeepingInvitationDigest]);
    expect(housekeepingInvitation).toHaveLength(1);
    await admin!.unsafe("alter table pac.program_account_invitation_secrets disable trigger program_account_invitation_secret_guard");
    try {
      await admin!.unsafe(
        "update pac.program_account_invitation_secrets set expires_at=clock_timestamp()-interval '1 minute' where invitation_id=$1::uuid",
        [housekeepingInvitation[0].invitation_id],
      );
    } finally {
      await admin!.unsafe("alter table pac.program_account_invitation_secrets enable trigger program_account_invitation_secret_guard");
    }
    await admin!.unsafe(`
      update pac.program_account_sessions
      set issued_at=clock_timestamp()-interval '9 hours',
          expires_at=clock_timestamp()-interval '1 hour'
      where token_digest=$1
    `, [successorSession]);
    const housekeeping = await runtime!.unsafe<{
      expired_invitations_closed: number;
      expired_sessions_deleted: number;
    }[]>("select * from pac.purge_expired_program_security_records()");
    expect(housekeeping[0]).toEqual({
      expired_invitations_closed: 1,
      expired_sessions_deleted: 1,
    });
    expect(await admin!.unsafe(
      "select 1 from pac.program_account_invitation_secrets where invitation_id=$1::uuid",
      [housekeepingInvitation[0].invitation_id],
    )).toHaveLength(0);
    expect(await admin!.unsafe(
      "select 1 from pac.program_account_sessions where token_digest=$1",
      [successorSession],
    )).toHaveLength(0);

  }, 90_000);
});
