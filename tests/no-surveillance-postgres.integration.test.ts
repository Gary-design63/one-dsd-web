import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import { ONE_DSD_TEAM_SEED } from "@/lib/collaboration/seed";
import { PostgresStore } from "@/lib/intelligence/memory/postgres-store";
import {
  collaborationScalarObjectAttacks,
  completeCollaborationWorkspace,
} from "./no-surveillance-fixtures";
import {
  buildTestConsultationRecord,
  buildTestConsultationTombstone,
  withConsultationStatus,
} from "./helpers/consultation-record";
import { testSpanId, testTraceId } from "./helpers/opaque-identifiers";

const ROOT = path.resolve(import.meta.dirname, "..");

function postgresBinary(name: "initdb" | "pg_ctl"): string | null {
  const executable = process.platform === "win32" ? `${name}.exe` : name;
  const candidates = [
    process.env.PAC_TEST_POSTGRES_BIN ? path.join(process.env.PAC_TEST_POSTGRES_BIN, executable) : "",
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

function run(executable: string, args: string[]): void {
  const result = spawnSync(executable, args, {
    stdio: "ignore",
    windowsHide: true,
    timeout: 60_000,
  });
  if (result.status !== 0) {
    throw new Error(`${path.basename(executable)} failed with status ${result.status ?? "unknown"}.`);
  }
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

describe.skipIf(!INITDB || !PG_CTL)("RG-2 PostgreSQL no-surveillance contracts", () => {
  let temporaryRoot = "";
  let dataDirectory = "";
  let runtimeDatabaseUrl = "";
  let admin: ReturnType<typeof postgres> | null = null;
  let runtime: ReturnType<typeof postgres> | null = null;

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-no-surveillance-test-"));
    dataDirectory = path.join(temporaryRoot, "data");
    const logFile = path.join(temporaryRoot, "postgres.log");
    const port = await unusedPort();

    run(INITDB!, [
      "-D", dataDirectory, "--username=pac_test", "--auth=trust",
      "--encoding=UTF8", "--no-locale",
    ]);
    run(PG_CTL!, [
      "-D", dataDirectory, "-l", logFile,
      "-o", localPostgresServerOptions(port, temporaryRoot), "-w", "start",
    ]);

    const adminUrl = `postgresql://pac_test@127.0.0.1:${port}/postgres`;
    admin = postgres(adminUrl, { ssl: false, max: 1, prepare: false });
    const migrations = readdirSync(path.join(ROOT, "db", "migrations"))
      .filter((name) => /^\d{4}_.+\.sql$/.test(name))
      .sort();
    expect(migrations).toContain("0014_pac_consultation_persistence_contract.sql");
    for (const migration of migrations) {
      try {
        await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", migration), "utf8"));
      } catch (error) {
        throw new Error(`Fresh migration sequence failed at ${migration}.`, { cause: error });
      }
    }
    runtimeDatabaseUrl = adminUrl.replace("pac_test@", "pac_app_runtime@");
    runtime = postgres(runtimeDatabaseUrl, {
      ssl: false,
      max: 1,
      prepare: false,
    });
  }, 120_000);

  afterAll(async () => {
    await runtime?.end({ timeout: 5 }).catch(() => undefined);
    await admin?.end({ timeout: 5 }).catch(() => undefined);
    if (PG_CTL && dataDirectory && existsSync(dataDirectory)) {
      spawnSync(PG_CTL, ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], {
        stdio: "ignore",
        windowsHide: true,
        timeout: 30_000,
      });
    }
    const safeTemporaryRoot = temporaryRoot
      && path.dirname(temporaryRoot) === path.resolve(tmpdir())
      && path.basename(temporaryRoot).startsWith("pac-no-surveillance-test-");
    if (safeTemporaryRoot) rmSync(temporaryRoot, { recursive: true, force: true });
  }, 45_000);

  it.each([
    "racialBiasScore",
    "participationByEmployee",
    "politicalBeliefs",
    "staffInclusionRanking",
    "equityReadinessRating",
    "guessed-gender-identity",
    "beliefs_by_worker",
    "ideology_by_employee",
    "learning_progress_by_employee",
    "completion_by_staff",
    "employee_equity_readiness",
    "worker_inclusion_maturity_score",
    "beliefs_by_supervisor",
    "participation_per_supervisor",
    "training_completion_by_employee",
    "inclusion_maturity_rating",
    "dei_readiness_score",
    "employee_bias_score",
  ])("rejects the semantic prohibited field %s at the database boundary", async (field) => {
    await expect(admin!.unsafe(
      "select pac.assert_no_prohibited_profile_fields($1::jsonb)",
      [{ nested: { [field]: "must-not-be-copied-to-an-error" } }],
    )).rejects.toMatchObject({ code: "22023" });
  });

  it("allows content and evaluation quality scores that do not describe people", async () => {
    await expect(admin!.unsafe(
      "select pac.assert_no_prohibited_profile_fields($1::jsonb)",
      [{ result: { score: 0.9, qualityScore: 4 }, knowledge: { trust_score: 0.8 } }],
    )).resolves.toHaveLength(1);
  });

  it("applies the semantic backstop to source, canonical, and review JSON carriers", async () => {
    const prohibited = { learning_progress_by_employee: { worker_17: "synthetic" } };
    await expect(admin!.unsafe(
      `insert into pac.source_carriers (logical_key, media_type, external_locator, captured_by)
       values ('profile-carrier-probe', 'text/plain', $1::jsonb, 'contract-test')`,
      [prohibited],
    )).rejects.toMatchObject({ code: "22023" });
    await expect(admin!.unsafe(
      `insert into pac.content_revisions
         (content_item_id, revision_number, canonical_payload, change_summary, created_by)
       values ('missing-profile-probe', 1, $1::jsonb, 'probe', 'contract-test')`,
      [prohibited],
    )).rejects.toMatchObject({ code: "22023" });
    await expect(admin!.unsafe(
      `insert into pac.source_review_records
         (source_item_id, dimension, status, reviewer_role, findings)
       values ('missing-profile-probe', 'scope', 'pending', 'contract-test', $1::jsonb)`,
      [prohibited],
    )).rejects.toMatchObject({ code: "22023" });
  });

  it("refuses a strict-contract upgrade until legacy-invalid rows are explicitly remediated", async () => {
    const databaseName = `pac_upgrade_preflight_${Date.now()}`;
    const adminUrl = runtimeDatabaseUrl.replace("pac_app_runtime@", "pac_test@");
    const upgradeUrl = adminUrl.replace(/\/postgres$/, `/${databaseName}`);
    const migrations = readdirSync(path.join(ROOT, "db", "migrations"))
      .filter((name) => /^\d{4}_.+\.sql$/.test(name))
      .sort();
    // Roles belong to the cluster, not an individual database. The fresh-build
    // fixture has already applied 0028 (32 connections), while this historical
    // upgrade must begin with the pre-0012 role contract (at most 20).
    const [runtimeRole] = await admin!.unsafe("select rolconnlimit from pg_roles where rolname = 'pac_app_runtime'");
    await admin!.unsafe(`create database ${databaseName}`);
    const upgrade = postgres(upgradeUrl, { ssl: false, max: 1, prepare: false });
    try {
      await admin!.unsafe("alter role pac_app_runtime connection limit 20");
      for (const migration of migrations.filter((name) => name < "0012_")) {
        await upgrade.unsafe(readFileSync(path.join(ROOT, "db", "migrations", migration), "utf8"));
      }

      await upgrade.unsafe(
        `insert into pac.runtime_work_objects (work_kind, object_id, value)
         values ('decision', 'legacy-unregistered', '{"note":"legacy"}'::jsonb)`,
      );
      await upgrade.unsafe(
        `insert into pac.runtime_audit_events (event, occurred_at)
         values ('{"trace_id":"legacy-free-form"}'::jsonb, now())`,
      );
      await upgrade.unsafe(
        `insert into pac.runtime_work_objects (work_kind, object_id, value)
         values ('decision', 'autonomy_policy', $1::jsonb)`,
        [{
          killed: false,
          max_autonomy: "A0",
          agents: {},
          flags: {},
          updated_at: "2026-09-05T00:00:00.000Z",
          by: "owner",
        }],
      );
      await upgrade.unsafe(
        `insert into pac.runtime_idempotency (idempotency_key, work_kind, object_id, value)
         values ('employee-17-equity-readiness-low', 'decision', 'autonomy_policy', $1::jsonb)`,
        [{ work_kind: "decision", object_id: "autonomy_policy" }],
      );
      const migration12 = readFileSync(
        path.join(ROOT, "db", "migrations", "0012_pac_no_surveillance_contracts.sql"),
        "utf8",
      );
      await expect(upgrade.unsafe(migration12)).rejects.toMatchObject({ code: "22023" });
      await upgrade.unsafe("rollback").catch(() => undefined);
      await upgrade.unsafe(
        "delete from pac.runtime_work_objects where object_id = 'legacy-unregistered'",
      );
      await expect(upgrade.unsafe(migration12)).rejects.toMatchObject({ code: "22023" });
      await upgrade.unsafe("rollback").catch(() => undefined);
      await upgrade.unsafe("select set_config('pac.allow_immutable_change', 'on', false)");
      await upgrade.unsafe("delete from pac.runtime_audit_events");
      await upgrade.unsafe("select set_config('pac.allow_immutable_change', 'off', false)");
      await expect(upgrade.unsafe(migration12)).rejects.toMatchObject({ code: "22023" });
      await upgrade.unsafe("rollback").catch(() => undefined);
      await upgrade.unsafe("select set_config('pac.allow_immutable_change', 'on', false)");
      await upgrade.unsafe("delete from pac.runtime_idempotency");
      await upgrade.unsafe("select set_config('pac.allow_immutable_change', 'off', false)");
      await expect(upgrade.unsafe(migration12)).resolves.toEqual([]);

      await upgrade.unsafe(readFileSync(
        path.join(ROOT, "db", "migrations", "0013_pac_security_housekeeping.sql"),
        "utf8",
      ));
      const validConsultation = buildTestConsultationRecord({
        createdAt: "2026-09-05T00:00:00.000Z",
        sequence: 9988,
      });
      const legacyConsultation = {
        ...validConsultation,
        work_name: "x",
      };
      await upgrade.unsafe(
        `insert into pac.runtime_work_objects (work_kind, object_id, value)
         values ('consult_request', $1, $2::jsonb)`,
        [validConsultation.request_id, legacyConsultation],
      );
      const migration14 = readFileSync(
        path.join(ROOT, "db", "migrations", "0014_pac_consultation_persistence_contract.sql"),
        "utf8",
      );
      await expect(upgrade.unsafe(migration14)).rejects.toMatchObject({ code: "22023" });
      await upgrade.unsafe("rollback").catch(() => undefined);
      await upgrade.unsafe(
        `update pac.runtime_work_objects set value = $2::jsonb
         where work_kind = 'consult_request' and object_id = $1`,
        [validConsultation.request_id, validConsultation],
      );
      await expect(upgrade.unsafe(migration14)).resolves.toEqual([]);
    } finally {
      await upgrade.end({ timeout: 5 }).catch(() => undefined);
      await admin!.unsafe(`alter role pac_app_runtime connection limit ${Number(runtimeRole.rolconnlimit)}`);
      await admin!.unsafe(`drop database if exists ${databaseName} with (force)`)
        .catch(() => undefined);
    }
  }, 120_000);

  it("accepts registered families and rejects generic decision and evaluation buckets", async () => {
    const resourceId = "pn-pg-resource";
    const staleDecision = {
      id: resourceId,
      title: "PostgreSQL fixture resource",
      owner: "Program steward",
      reviewDate: "2027-09-01",
      problem: "review_due_soon",
      cycle_id: `cycle-${testTraceId("pg-fixture-cycle")}`,
      flagged_at: "2026-09-05T00:00:00.000Z",
      disposition: "pending",
    };
    await runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('decision', $1, $2::jsonb)`,
      [`stale_flag:${resourceId}:review_due_soon`, staleDecision],
    );
    await expect(runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('decision', 'generic-profile-bucket', $1::jsonb)`,
      [{ id: "generic-profile-bucket", employee: "staff-17", notes: "hidden profile" }],
    )).rejects.toMatchObject({ code: "22023" });
    await expect(runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('eval_result', 'eval-generic', $1::jsonb)`,
      [{ id: "eval-generic", employee: "staff-17", result: "participated" }],
    )).rejects.toMatchObject({ code: "22023" });
  });

  it("keeps every decision and evaluation family at strict TypeScript parity", async () => {
    const at = "2026-09-05T00:00:00.000Z";
    const researchTraceId = testTraceId("postgres-research-contract");
    const researchUsageId = `ru_20260905000000_abcdef_${researchTraceId.slice(-4)}`;
    const cycleId = `cycle-${testTraceId("postgres-cycle-contract")}`;
    const resourceId = "pn-resource-contract";
    const proposalId = `${cycleId}-p1`;
    const evalId = "eval-1725494400000";
    const cases: Array<{
      name: string;
      kind: "decision" | "eval_result";
      id: string;
      valid: Record<string, unknown>;
      invalid: Record<string, unknown>;
    }> = [
      {
        name: "autonomy policy",
        kind: "decision",
        id: "autonomy_policy",
        valid: { killed: false, max_autonomy: "A0", agents: {}, flags: {}, updated_at: at, by: "owner" },
        invalid: { killed: false, max_autonomy: "A0", agents: {}, flags: {}, updated_at: { worker: "E17" }, by: "owner" },
      },
      {
        name: "research policy",
        kind: "decision",
        id: "research_policy",
        valid: {
          enabled: true,
          mode: "auto",
          provider_order: ["fixture"],
          daily_request_cap: 10,
          monthly_usd_cap: 5,
          allowed_domains: ["example.org"],
          recency: "any",
          deep_research_enabled: false,
        },
        invalid: {
          enabled: true,
          mode: "auto",
          provider_order: ["fixture"],
          allowed_domains: [{ worker: "E17" }],
        },
      },
      {
        name: "research usage",
        kind: "decision",
        id: `research_usage:${researchUsageId}`,
        valid: {
          id: researchUsageId, at, provider: "fixture", model: "fixture/research-1", depth: "current_web",
          query_hash: "abcdef0123456789", domains: ["example.org"], estimated_usd: 0, ok: true,
          latency_ms: 1, trace_id: researchTraceId,
        },
        invalid: {
          id: researchUsageId, at, provider: "fixture", model: "fixture/research-1", depth: "current_web",
          query_hash: "abcdef0123456789", domains: ["example.org"], estimated_usd: { worker: "E17" },
          ok: true, latency_ms: 1, trace_id: researchTraceId,
        },
      },
      {
        name: "cycle report",
        kind: "decision",
        id: `cycle:${cycleId}`,
        valid: {
          id: cycleId, at, by: "owner", policy: { max_autonomy: "A0", killed: false },
          effective_ceiling: "A0", generative: false,
          steps: [{ name: "read queue", autonomy: "A0", outcome: "done", detail: "Complete" }],
          triaged: [], expired_consultations: [], refreshed_packets: [], stale_flags: [],
          quality_problems: [], a11y: [], proposals: [], summary: "Cycle complete", exceptions: [],
        },
        invalid: {
          id: cycleId, at, by: "owner", policy: { max_autonomy: "A0", killed: false },
          effective_ceiling: "A0", generative: false,
          steps: [{ name: "read queue", autonomy: "A0", outcome: "done", detail: { worker: "E17" } }],
          triaged: [], expired_consultations: [], refreshed_packets: [], stale_flags: [],
          quality_problems: [], a11y: [], proposals: [], summary: "Cycle complete", exceptions: [],
        },
      },
      {
        name: "stale flag",
        kind: "decision",
        id: `stale_flag:${resourceId}:review_due_soon`,
        valid: {
          id: resourceId, title: "Resource", owner: "Program steward", reviewDate: "2027-01-01",
          problem: "review_due_soon", cycle_id: cycleId, flagged_at: at, disposition: "pending",
        },
        invalid: {
          id: resourceId, title: "Resource", owner: { worker: "E17" }, reviewDate: "2027-01-01",
          problem: "review_due_soon", cycle_id: cycleId, flagged_at: at, disposition: "pending",
        },
      },
      {
        name: "proposal apply patch",
        kind: "decision",
        id: `proposal:${proposalId}`,
        valid: {
          id: proposalId, cycle_id: cycleId, kind: "raise_autonomy",
          title: "Raise autonomy", rationale: "Reviewed evidence supports a proposal.",
          apply: { max_autonomy: "A1", flags: { "model.generative_pilot": true } },
          status: "proposed", created_at: at,
        },
        invalid: {
          id: proposalId, cycle_id: cycleId, kind: "raise_autonomy",
          title: "Raise autonomy", rationale: "Reviewed evidence supports a proposal.",
          apply: { flags: { "model.generative_pilot": { worker: "E17" } } },
          status: "proposed", created_at: at,
        },
      },
      {
        name: "rejected recommendation",
        kind: "decision",
        id: `rejected_rec:${proposalId}`,
        valid: { id: proposalId, at, title: "Rejected proposal", note: "Owner decision" },
        invalid: { id: proposalId, at, title: "Rejected proposal", note: { worker: "E17" } },
      },
      {
        name: "evaluation result",
        kind: "eval_result",
        id: evalId,
        valid: {
          id: evalId, at, suites: ["ask_mvp"],
          results: [{ id: "ASK-E1", suite: "ask_mvp", scenario: "Grounded answer", status: "pass", detail: "Complete", ms: 1 }],
          pass: 1, fail: 0, manual: 0, releaseBlocked: false,
        },
        invalid: {
          id: evalId, at, suites: ["ask_mvp"],
          results: [{ id: "ASK-E1", suite: "ask_mvp", scenario: { worker: "E17" }, status: "pass", detail: "Complete", ms: 1 }],
          pass: 1, fail: 0, manual: 0, releaseBlocked: false,
        },
      },
    ];

    for (const contractCase of cases) {
      await expect(admin!.unsafe(
        "select pac.assert_runtime_work_object_contract($1, $2, $3::jsonb)",
        [contractCase.kind, contractCase.id, admin!.json(contractCase.valid as never)],
      ), `${contractCase.name} valid`).resolves.toHaveLength(1);
      await expect(admin!.unsafe(
        "select pac.assert_runtime_work_object_contract($1, $2, $3::jsonb)",
        [contractCase.kind, contractCase.id, admin!.json(contractCase.invalid as never)],
      ), `${contractCase.name} invalid`).rejects.toMatchObject({ code: "22023" });
    }

    const validUsage = cases.find((entry) => entry.name === "research usage")!.valid;
    for (const [label, candidate] of [
      ["semantic trace", { ...validUsage, trace_id: "worker-17-equity-readiness-low" }],
      ["semantic provider trace", { ...validUsage, provider_trace_id: "worker-17-equity-readiness-low" }],
      ["non-hash query", { ...validUsage, query_hash: "ABC123" }],
      ["URL-shaped domain", { ...validUsage, domains: ["https://example.org/private"] }],
      ["unregistered model", { ...validUsage, model: "worker-17-equity-readiness-low" }],
      ["fractional counter", { ...validUsage, input_tokens: 1.5 }],
      ["negative latency", { ...validUsage, latency_ms: -1 }],
      ["missing failure code", { ...validUsage, ok: false }],
      ["semantic failure code", { ...validUsage, ok: false, error_code: "worker-17-equity-readiness-low" }],
    ] as const) {
      await expect(admin!.unsafe(
        "select pac.assert_runtime_work_object_contract('decision', $1, $2::jsonb)",
        [`research_usage:${researchUsageId}`, admin!.json(candidate as never)],
      ), label).rejects.toMatchObject({ code: "22023" });
    }

    const validResearchPolicy = cases.find((entry) => entry.name === "research policy")!.valid;
    for (const [label, candidate] of [
      ["negative daily cap", { ...validResearchPolicy, daily_request_cap: -1 }],
      ["fractional daily cap", { ...validResearchPolicy, daily_request_cap: 1.5 }],
      ["excess daily cap", { ...validResearchPolicy, daily_request_cap: 100_001 }],
      ["negative monthly cap", { ...validResearchPolicy, monthly_usd_cap: -0.01 }],
      ["excess monthly cap", { ...validResearchPolicy, monthly_usd_cap: 100_001 }],
      ["semantic domain", { ...validResearchPolicy, allowed_domains: ["employee-17-equity-readiness-low"] }],
      ["duplicate domain", { ...validResearchPolicy, allowed_domains: ["example.org", "example.org"] }],
    ] as const) {
      await expect(admin!.unsafe(
        "select pac.assert_runtime_work_object_contract('decision', 'research_policy', $1::jsonb)",
        [admin!.json(candidate as never)],
      ), label).rejects.toMatchObject({ code: "22023" });
    }
  });

  it("rejects disguised profile containers in consultation and autonomy-policy records", async () => {
    await expect(runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('consult_request', 'CR-20260905-9999', $1::jsonb)`,
      [{
        request_id: "CR-20260905-9999",
        beliefs_by_worker: { worker_17: "synthetic" },
      }],
    )).rejects.toMatchObject({ code: "22023" });

    await expect(runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('decision', 'autonomy_policy', $1::jsonb)`,
      [{
        killed: false,
        max_autonomy: "A0",
        agents: {
          employee_17: { enabled: true, ceiling: "A5", attitude: "synthetic" },
        },
        flags: {},
        updated_at: "2026-09-05T00:00:00.000Z",
        by: "owner",
      }],
    )).rejects.toMatchObject({ code: "22023" });
  });

  it("enforces the collaboration shape and audit-log contract", async () => {
    const validWorkspace = completeCollaborationWorkspace();
    await runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('collaboration_workspace', 'one_dsd_team', $1::jsonb)`,
      [validWorkspace],
    );
    const injected = structuredClone(ONE_DSD_TEAM_SEED) as typeof ONE_DSD_TEAM_SEED & {
      memberships: Array<Record<string, unknown>>;
    };
    injected.memberships[0].politicalBeliefs = "inferred";
    await expect(runtime!.unsafe(
      `update pac.runtime_work_objects set value = $1::jsonb
       where work_kind = 'collaboration_workspace' and object_id = 'one_dsd_team'`,
      [injected],
    )).rejects.toMatchObject({ code: "22023" });

    for (const attack of collaborationScalarObjectAttacks) {
      const scalarInjection = structuredClone(validWorkspace) as unknown as Record<string, unknown>;
      attack.mutate(scalarInjection);
      await expect(runtime!.unsafe(
        `update pac.runtime_work_objects set value = $1::jsonb
         where work_kind = 'collaboration_workspace' and object_id = 'one_dsd_team'`,
        [runtime!.json(scalarInjection as never)],
      ), attack.name).rejects.toMatchObject({ code: "22023" });
    }

    const brokenReference = structuredClone(validWorkspace);
    brokenReference.pollResponses[0].optionId = "not_an_option";
    await expect(runtime!.unsafe(
      `update pac.runtime_work_objects set value = $1::jsonb
       where work_kind = 'collaboration_workspace' and object_id = 'one_dsd_team'`,
      [brokenReference],
    )).rejects.toMatchObject({ code: "22023" });

    const surveillanceRequest = structuredClone(validWorkspace);
    surveillanceRequest.posts[0].body = "Rank staff by equity maturity and participation.";
    await expect(runtime!.unsafe(
      `update pac.runtime_work_objects set value = $1::jsonb
       where work_kind = 'collaboration_workspace' and object_id = 'one_dsd_team'`,
      [surveillanceRequest],
    )).rejects.toMatchObject({ code: "22023" });

    await expect(runtime!.unsafe(
      `insert into pac.runtime_audit_events (event, occurred_at)
       values ($1::jsonb, ($1::jsonb ->> 'at')::timestamptz)`,
      [{
        trace_id: testTraceId("postgres-profile-audit"), span_id: testSpanId("postgres-profile-audit"), at: "2026-09-05T00:00:00.000Z",
        agent_id: "system", agent_version: "0.1.0", tool_name: "corpus.search",
        autonomy_level_used: "A0", permission_mode: "owner_only", dry_run: false,
        content_ids_touched: [], allowlist_hit: true, ok: true,
        participationByEmployee: { employee_17: true },
      }],
    )).rejects.toMatchObject({ code: "22023" });

    await expect(runtime!.unsafe(
      `insert into pac.runtime_audit_events (event, occurred_at)
       values ($1::jsonb, ($1::jsonb ->> 'at')::timestamptz)`,
      [{
        trace_id: testTraceId("postgres-array-audit"), span_id: testSpanId("postgres-array-audit"), at: "2026-09-05T00:00:00.000Z",
        agent_id: "system", agent_version: "0.1.0", tool_name: "corpus.search",
        autonomy_level_used: "A0", permission_mode: "owner_only", dry_run: false,
        content_ids_touched: [{ worker: "E17", participated: true }],
        allowlist_hit: true, ok: true,
      }],
    )).rejects.toMatchObject({ code: "22023" });
  });


  it("retains negative scoring guidance in a real saved consultation packet", async () => {
    const record = buildTestConsultationRecord({ sequence: 9928 });
    const title = "Measuring whether equity work is working, without scoring people";
    record.packet.related_resources = [{
      id: "pn-measurement-without-surveillance", title,
      href: "/library/pn-measurement-without-surveillance",
      authority: "practice_note", authorityLabel: "Practice note", reviewDate: "2027-03-01",
      excerpt: "Use program outcomes and protect private learning.", citeable: true,
    }];
    await expect(runtime!.unsafe(
      "insert into pac.runtime_work_objects (work_kind, object_id, value) values ('consult_request', $1, $2::jsonb)",
      [record.request_id, runtime!.json(record as never)],
    )).resolves.toHaveLength(0);
    const [saved] = await runtime!.unsafe(
      "select value from pac.runtime_work_objects where work_kind = 'consult_request' and object_id = $1",
      [record.request_id],
    );
    expect(saved.value.packet.related_resources[0].title).toBe(title);
  });

  it.each([
    "Score employees by equity maturity.",
    "Rank staff by equity participation, without scoring people",
    "Measuring whether equity work is working, without scoring people. Rank staff by participation.",
    "Measure equity not without scoring people",
    "Measure equity, without not scoring people",
  ])("keeps the SQL text gate closed to affirmative or disguised scoring: %s", title => {
    return expect(admin!.unsafe(
      "select pac.assert_no_collaboration_surveillance_text($1::jsonb)",
      [admin!.json({ packet: { related_resources: [{ title }] } })],
    )).rejects.toMatchObject({ code: "22023" });
  });

  it("rejects porous consultation scalars, incomplete statuses, fractions, and noncanonical retention dates", async () => {
    const valid = buildTestConsultationRecord({
      createdAt: "2026-09-05T00:00:00.000Z",
      sequence: 9921,
    });
    const scheduled = withConsultationStatus(valid, "scheduled", "2026-09-05T01:00:00.000Z");
    const declined = withConsultationStatus(valid, "declined", "2026-09-05T01:00:00.000Z");
    declined.status_reason = "   ";
    const tombstone = buildTestConsultationTombstone(valid, "2026-09-05T02:00:00.000Z");
    const attacks: Array<{ name: string; value: Record<string, unknown> }> = [
      { name: "active work_name object", value: { ...valid, work_name: { worker: "E17" } } },
      { name: "scheduled without scheduled_for", value: scheduled },
      { name: "declined without a nonblank reason", value: declined },
      { name: "fractional version", value: { ...valid, version: 1.5 } },
      { name: "fractional pinned_order", value: { ...valid, pinned_order: 1.5 } },
      { name: "noncanonical retention instant", value: { ...valid, retention_expires_at: "9999" } },
      { name: "owner note email", value: { ...valid, owner_notes: "Write to person@example.org." } },
      { name: "owner note proper name", value: { ...valid, owner_notes: "Contact Gary Banks for details." } },
      { name: "owner note surveillance request", value: { ...valid, owner_notes: "Rank staff by equity maturity and participation." } },
      { name: "status reason employee identifier", value: { ...valid, status_reason: "Employee ID E17 requires follow-up." } },
      { name: "tombstone redacted_at object", value: { ...tombstone, redacted_at: { worker: "E17" } } },
    ];

    for (const attack of attacks) {
      await expect(runtime!.unsafe(
        `insert into pac.runtime_work_objects (work_kind, object_id, value)
         values ('consult_request', $1, $2::jsonb)`,
        [valid.request_id, runtime!.json(attack.value as never)],
      ), attack.name).rejects.toMatchObject({ code: "22023" });
    }
  });

  it("enforces the finite audit vocabulary and canonical content references", async () => {
    const validAudit = {
      trace_id: testTraceId("postgres-audit-contract"),
      span_id: testSpanId("postgres-audit-contract"),
      at: "2026-09-05T00:00:00.000Z",
      agent_id: "system",
      agent_version: "0.1.0",
      tool_name: "corpus.search",
      autonomy_level_used: "A0",
      permission_mode: "always",
      dry_run: false,
      content_ids_touched: ["pn-partnership-spine"],
      allowlist_hit: true,
      ok: true,
      latency_ms: 1,
    };
    await runtime!.unsafe(
      `insert into pac.runtime_audit_events (event, occurred_at)
       values ($1::jsonb, ($1::jsonb ->> 'at')::timestamptz)`,
      [validAudit],
    );
    await expect(runtime!.unsafe(
      `insert into pac.runtime_audit_events (event, occurred_at)
       values ($1::jsonb, ($1::jsonb ->> 'at')::timestamptz)`,
      [{
        ...validAudit,
        tool_name: "runtime.unknown_tool_refusal",
        allowlist_hit: false,
        allowlist_miss_reason: "tool not registered",
        ok: false,
        error_code: "tool_unknown",
      }],
    )).resolves.toEqual([]);
    for (const attack of [
      { ...validAudit, tool_name: "test.audit" },
      { ...validAudit, trace_id: "worker-17-equity-readiness-low" },
      { ...validAudit, span_id: "worker17" },
      { ...validAudit, agent_version: "worker-17-equity-readiness-low" },
      { ...validAudit, content_ids_touched: ["worker-17:equity-readiness:low"] },
      { ...validAudit, content_ids_touched: ["staff-jane-doe-equity-readiness-low"] },
      { ...validAudit, content_ids_touched: ["supervisor-a-inclusion-rating-low"] },
      { ...validAudit, ok: false, error_code: "worker-17 believes synthetic" },
    ]) {
      await expect(runtime!.unsafe(
        `insert into pac.runtime_audit_events (event, occurred_at)
         values ($1::jsonb, ($1::jsonb ->> 'at')::timestamptz)`,
        [attack],
      )).rejects.toMatchObject({ code: "22023" });
    }
    await expect(runtime!.unsafe(
      `insert into pac.runtime_audit_events (event, occurred_at)
       values ($1::jsonb, ($1::jsonb ->> 'at')::timestamptz)`,
      [{ ...validAudit, ok: false, error_code: "tool_execution_failed" }],
    )).resolves.toEqual([]);
  });

  it("binds idempotency receipts to the referenced work object", async () => {
    const mismatchKey = `idem-${testTraceId("pg-idempotency-mismatch")}`;
    await expect(runtime!.unsafe(
      `insert into pac.runtime_idempotency (idempotency_key, work_kind, object_id, value)
       values ($1, 'decision', 'autonomy_policy', $2::jsonb)`,
      [mismatchKey, { work_kind: "decision", object_id: "research_policy" }],
    )).rejects.toMatchObject({ code: "22023" });

    await expect(runtime!.unsafe(
      `insert into pac.runtime_idempotency (idempotency_key, work_kind, object_id, value)
       values ('employee-17-equity-readiness-low', 'decision', 'worker-17-equity-readiness-low', $1::jsonb)`,
      [{ work_kind: "decision", object_id: "worker-17-equity-readiness-low" }],
    )).rejects.toMatchObject({ code: "22023" });

    await expect(runtime!.unsafe(
      `insert into pac.runtime_idempotency (idempotency_key, work_kind, object_id, value)
       values ($1, 'decision', 'autonomy_policy', $2::jsonb)`,
      [
        `idem-${testTraceId("pg-idempotency-orphan")}`,
        { work_kind: "decision", object_id: "autonomy_policy" },
      ],
    )).rejects.toMatchObject({ code: "22023" });

    const validUuid = testTraceId("pg-idempotency-valid");
    const validResourceId = `pn-resource-${validUuid}`;
    const validObjectId = `stale_flag:${validResourceId}:review_due_soon`;
    await expect(runtime!.begin(async (transaction) => {
      await transaction.unsafe(
        `insert into pac.runtime_idempotency (idempotency_key, work_kind, object_id, value)
         values ($1, 'decision', $2, $3::jsonb)`,
        [
          `idem-${validUuid}`,
          validObjectId,
          { work_kind: "decision", object_id: validObjectId },
        ],
      );
      await transaction.unsafe(
        `insert into pac.runtime_work_objects (work_kind, object_id, value)
         values ('decision', $1, $2::jsonb)`,
        [validObjectId, {
          id: validResourceId,
          title: "Receipt reference fixture",
          owner: "Program steward",
          reviewDate: "2027-09-01",
          problem: "review_due_soon",
          cycle_id: `cycle-${validUuid}`,
          flagged_at: "2026-09-05T00:00:00.000Z",
          disposition: "pending",
        }],
      );
    })).resolves.toBeUndefined();
  });

  it("purpose-limits security housekeeping to expired records", async () => {
    const expiredHash = "c".repeat(64);
    const activeHash = "d".repeat(64);
    const revocation = (sessionHash: string, revokedAt: string, expiresAt: string) => ({
      kind: "owner_session_revocation",
      session_hash: sessionHash,
      revoked_at: revokedAt,
      expires_at: expiresAt,
    });
    await admin!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values
         ('decision', $1, $2::jsonb),
         ('decision', $3, $4::jsonb)`,
      [
        `owner-session-revoked-${expiredHash}`,
        revocation(expiredHash, "2020-01-01T00:00:00.000Z", "2020-01-01T08:00:00.000Z"),
        `owner-session-revoked-${activeHash}`,
        revocation(activeHash, "2098-01-01T00:00:00.000Z", "2099-01-01T00:00:00.000Z"),
      ],
    );
    await admin!.unsafe(
      `insert into pac.runtime_rate_limits (scope, subject_hash, request_count, reset_at)
       values
         ('staff-ask', $1, 1, now() - interval '1 minute'),
         ('owner-login', $2, 1, now() + interval '1 hour')`,
      [expiredHash, activeHash],
    );

    const housekeepingStore = new PostgresStore({
      databaseUrl: runtimeDatabaseUrl,
      sslMode: "disable",
    });
    await expect(housekeepingStore.purgeExpiredSecurityRecords()).resolves.toEqual({
      ownerSessionRevocations: 1,
      rateLimitBuckets: 1,
      auditEvents: 0,
      researchUsageRecords: 0,
      consultationTombstones: 0,
      idempotencyReceipts: 0,
    });

    const remainingRevocations = await admin!.unsafe<{ object_id: string }[]>(
      `select object_id from pac.runtime_work_objects
       where object_id in ($1, $2)
       order by object_id`,
      [`owner-session-revoked-${expiredHash}`, `owner-session-revoked-${activeHash}`],
    );
    expect(remainingRevocations.map((row) => row.object_id)).toEqual([
      `owner-session-revoked-${activeHash}`,
    ]);
    const remainingBuckets = await admin!.unsafe<{ scope: string }[]>(
      `select scope from pac.runtime_rate_limits
       where subject_hash = any($1::text[])
       order by scope`,
      [[expiredHash, activeHash]],
    );
    expect(remainingBuckets.map((row) => row.scope)).toEqual(["owner-login"]);

    await expect(runtime!.unsafe(
      "delete from pac.runtime_rate_limits where scope = 'owner-login' and subject_hash = $1",
      [activeHash],
    )).rejects.toMatchObject({ code: "42501" });
    await expect(housekeepingStore.purgeExpiredSecurityRecords()).resolves.toEqual({
      ownerSessionRevocations: 0,
      rateLimitBuckets: 0,
      auditEvents: 0,
      researchUsageRecords: 0,
      consultationTombstones: 0,
      idempotencyReceipts: 0,
    });
    await housekeepingStore.close();
  });

  it("rejects malformed revocation lifecycles instead of making them cleanup candidates", async () => {
    const sessionHash = "e".repeat(64);
    await expect(runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('decision', $1, $2::jsonb)`,
      [`owner-session-revoked-${sessionHash}`, {
        kind: "owner_session_revocation",
        session_hash: sessionHash,
        revoked_at: "2020-01-01 00:00:00Z",
        expires_at: "2020-01-01T08:00:00.000Z",
      }],
    )).rejects.toMatchObject({ code: "22023" });

    await expect(runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('decision', $1, $2::jsonb)`,
      [`owner-session-revoked-${sessionHash}`, {
        kind: "owner_session_revocation",
        session_hash: "f".repeat(64),
        revoked_at: "2020-01-01T00:00:00.000Z",
        expires_at: "2020-01-01T08:00:00.000Z",
      }],
    )).rejects.toMatchObject({ code: "22023" });
  });
});
