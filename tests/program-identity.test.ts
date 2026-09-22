import { beforeAll, describe, expect, it, vi } from "vitest";
import { hashProgramPassphrase } from "@/lib/auth/program-credentials";
import {
  digestProgramBearerToken,
  newProgramBearerToken,
  PostgresProgramIdentityStore,
  programSessionEnvironment,
  type ProgramIdentityDatabase,
} from "@/lib/auth/program-identity";

const ACCOUNT_ID = "11111111-1111-4111-8111-111111111111";
const CREDENTIAL_ID = "22222222-2222-4222-8222-222222222222";
const SESSION_ID = "33333333-3333-4333-8333-333333333333";
const GRANT_ID = "44444444-4444-4444-8444-444444444444";
const INSTALLATION_ID = "55555555-5555-4555-8555-555555555555";
const EXPIRES_AT = "2026-09-05T20:00:00.000Z";
const ACTIVATION_EVIDENCE_ID = "evidence:protected-identity-test-v1";
const ACTIVATION_BUNDLE_SHA256 = "a".repeat(64);
let credentialHash = "";

beforeAll(async () => {
  credentialHash = await hashProgramPassphrase("A careful river has 27 stones.");
}, 20_000);

function database() {
  const query = vi.fn(async (statement: string) => {
    if (statement.includes("runtime-boundary")) {
      return [{
        runtime_role: "pac_contributor_runtime",
        session_role: "pac_contributor_runtime",
        installation_id: INSTALLATION_ID,
        identity_tables_denied: true,
        authorization_allocator_denied: true,
        authorization_consumer_denied: true,
        rate_limit_policy_denied: true,
        owner_recovery_allocator_denied: true,
        feature_activation_allocator_denied: true,
        legacy_content_mutations_denied: true,
        login_credential_lookup_denied: true,
        session_start_denied: true,
        authentication_schema_denied: true,
        authentication_functions_denied: true,
        runtime_role_attributes_safe: true,
        runtime_memberships_denied: true,
      }];
    }
    if (statement.includes("authentication-boundary")) {
      return [{
        broker_role: "pac_authentication_broker",
        session_role: "pac_authentication_broker",
        installation_id: INSTALLATION_ID,
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
      }];
    }
    if (statement.includes("login-credential")) {
      return [{
        account_id: ACCOUNT_ID,
        display_name: "Named Contributor",
        credential_id: CREDENTIAL_ID,
        credential_hash: credentialHash,
        identity_version: 1,
      }];
    }
    if (statement.includes("start-session")) {
      return [{
        session_id: SESSION_ID,
        account_id: ACCOUNT_ID,
        display_name: "Named Contributor",
        expires_at: EXPIRES_AT,
      }];
    }
    if (statement.includes("read-session")) {
      return [{
        session_id: SESSION_ID,
        account_id: ACCOUNT_ID,
        sign_in_id: "named.contributor",
        display_name: "Named Contributor",
        credential_id: CREDENTIAL_ID,
        issued_at: "2026-09-05T12:00:00.000Z",
        expires_at: EXPIRES_AT,
        grants: [{
          grant_id: GRANT_ID,
          scope_id: "dsd",
          role_key: "content_contributor",
          expires_at: null,
        }],
      }];
    }
    if (statement.includes("end-session")) return [{ ended: true }];
    throw new Error(`Unexpected statement: ${statement}`);
  });
  const client: ProgramIdentityDatabase = {
    query: query as unknown as ProgramIdentityDatabase["query"],
    close: vi.fn(async () => undefined),
  };
  return { client, query };
}

describe("protected program identity runtime", () => {
  it("creates random canonical bearer values and domain-separates their stored digests", () => {
    const token = newProgramBearerToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(Buffer.from(token, "base64url")).toHaveLength(32);
    expect(digestProgramBearerToken("session", token)).toMatch(/^[a-f0-9]{64}$/);
    expect(digestProgramBearerToken("session", token)).not.toBe(digestProgramBearerToken("invitation", token));
    expect(() => digestProgramBearerToken("session", `${token}=`)).toThrow(/invalid/i);
  });

  it("binds sign-in to the exact environment and stores only a digest of the opaque session", async () => {
    const db = database();
    const factory = vi.fn(() => db.client);
    const store = new PostgresProgramIdentityStore({
      databaseUrl: "postgresql://pac_contributor_runtime:secret@localhost/pac",
      authenticationDatabaseUrl: "postgresql://pac_authentication_broker:secret@localhost/pac",
      sslMode: "verify-full",
      authenticationSslMode: "verify-full",
      environment: "preview",
      activationEvidenceId: ACTIVATION_EVIDENCE_ID,
      activationBundleSha256: ACTIVATION_BUNDLE_SHA256,
      databaseFactory: factory,
      authenticationDatabaseFactory: factory,
    });
    const signedIn = await store.signIn("  NAMED.CONTRIBUTOR ", "A careful river has 27 stones.");
    expect(signedIn?.identity).toMatchObject({
      accountId: ACCOUNT_ID,
      signInId: "named.contributor",
      displayName: "Named Contributor",
      grants: [{ grantId: GRANT_ID, scopeId: "dsd", role: "content_contributor" }],
    });
    expect(signedIn?.token).toMatch(/^[A-Za-z0-9_-]{43}$/);

    const calls = db.query.mock.calls as unknown as Array<[string, readonly unknown[]]>;
    const start = calls.find(([statement]) => statement.includes("start-session"));
    expect(start?.[1].slice(2, 4)).toEqual(["named.contributor", 1]);
    expect(start?.[1][4]).toBe(digestProgramBearerToken("session", signedIn!.token));
    expect(start?.[1][5]).toBe("preview");
    expect(start?.[1].slice(6)).toEqual([ACTIVATION_EVIDENCE_ID, ACTIVATION_BUNDLE_SHA256]);
    expect(JSON.stringify(calls)).not.toContain(signedIn!.token);

    await expect(store.signOut(signedIn!.token)).resolves.toBe(true);
    const end = (db.query.mock.calls as unknown as Array<[string, readonly unknown[]]>).find(
      ([statement]) => statement.includes("end-session"),
    );
    expect(end?.[1]).toEqual([digestProgramBearerToken("session", signedIn!.token), "preview"]);
  }, 20_000);

  it("performs a memory-hard generic mismatch for an unknown sign-in without starting a session", async () => {
    const db = database();
    db.query.mockImplementation(async (statement: string) => {
      if (statement.includes("runtime-boundary")) {
        return [{
          runtime_role: "pac_contributor_runtime",
          session_role: "pac_contributor_runtime",
          installation_id: INSTALLATION_ID,
          identity_tables_denied: true,
          authorization_allocator_denied: true,
          authorization_consumer_denied: true,
          rate_limit_policy_denied: true,
          owner_recovery_allocator_denied: true,
          feature_activation_allocator_denied: true,
          legacy_content_mutations_denied: true,
          login_credential_lookup_denied: true,
          session_start_denied: true,
          authentication_schema_denied: true,
          authentication_functions_denied: true,
          runtime_role_attributes_safe: true,
          runtime_memberships_denied: true,
        }];
      }
      if (statement.includes("authentication-boundary")) {
        return [{
          broker_role: "pac_authentication_broker",
          session_role: "pac_authentication_broker",
          installation_id: INSTALLATION_ID,
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
        }];
      }
      if (statement.includes("login-credential")) return [];
      throw new Error("No later query should run.");
    });
    const store = new PostgresProgramIdentityStore({
      databaseUrl: "postgresql://pac_contributor_runtime:secret@localhost/pac",
      authenticationDatabaseUrl: "postgresql://pac_authentication_broker:secret@localhost/pac",
      environment: "local",
      databaseFactory: () => db.client,
      authenticationDatabaseFactory: () => db.client,
    });
    await expect(store.signIn("unknown.person", "A careful river has 27 stones.")).resolves.toBeNull();
    expect(db.query).toHaveBeenCalledTimes(3);
  }, 20_000);

  it("attests distinct physical connections and refuses a mismatched database pair before credential lookup", async () => {
    const runtimeQuery = vi.fn(async (statement: string) => {
      if (!statement.includes("runtime-boundary")) throw new Error("Authentication work reached the runtime connection.");
      return [{
        runtime_role: "pac_contributor_runtime",
        session_role: "pac_contributor_runtime",
        installation_id: INSTALLATION_ID,
        identity_tables_denied: true,
        authorization_allocator_denied: true,
        authorization_consumer_denied: true,
        rate_limit_policy_denied: true,
        owner_recovery_allocator_denied: true,
        feature_activation_allocator_denied: true,
        legacy_content_mutations_denied: true,
        login_credential_lookup_denied: true,
        session_start_denied: true,
        authentication_schema_denied: true,
        authentication_functions_denied: true,
        runtime_role_attributes_safe: true,
        runtime_memberships_denied: true,
      }];
    });
    const brokerQuery = vi.fn(async (statement: string) => {
      if (!statement.includes("authentication-boundary")) throw new Error("Credential lookup must not run for a mismatched pair.");
      return [{
        broker_role: "pac_authentication_broker",
        session_role: "pac_authentication_broker",
        installation_id: "66666666-6666-4666-8666-666666666666",
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
      }];
    });
    const runtimeClient = { query: runtimeQuery, close: vi.fn() } as unknown as ProgramIdentityDatabase;
    const brokerClient = { query: brokerQuery, close: vi.fn() } as unknown as ProgramIdentityDatabase;
    const store = new PostgresProgramIdentityStore({
      databaseUrl: "postgresql://pac_contributor_runtime:secret@localhost/pac",
      authenticationDatabaseUrl: "postgresql://pac_authentication_broker:secret@localhost/pac",
      environment: "local",
      databaseFactory: () => runtimeClient,
      authenticationDatabaseFactory: () => brokerClient,
    });

    await expect(store.signIn("named.contributor", "A careful river has 27 stones."))
      .rejects.toThrow(/same database installation/i);
    expect(runtimeQuery).toHaveBeenCalledOnce();
    expect(brokerQuery).toHaveBeenCalledOnce();
  });

  it("requires the isolated authentication connection before any sign-in lookup", async () => {
    const db = database();
    const store = new PostgresProgramIdentityStore({
      databaseUrl: "postgresql://pac_contributor_runtime:secret@localhost/pac",
      environment: "local",
      databaseFactory: () => db.client,
    });
    await expect(store.signIn("named.contributor", "A careful river has 27 stones."))
      .rejects.toThrow(/PAC_PROGRAM_AUTH_DATABASE_URL/i);
    expect(db.query).toHaveBeenCalledOnce();
    expect(String(db.query.mock.calls[0]?.[0])).toContain("runtime-boundary");
  });

  it("refuses identity work when the database connection is not the restricted runtime role", async () => {
    const db = database();
    db.query.mockImplementation(async (statement: string) => {
      if (statement.includes("runtime-boundary")) {
        return [{
          runtime_role: "database_owner",
          session_role: "database_owner",
          installation_id: INSTALLATION_ID,
          identity_tables_denied: false,
          authorization_allocator_denied: false,
          authorization_consumer_denied: false,
          rate_limit_policy_denied: false,
          owner_recovery_allocator_denied: false,
          feature_activation_allocator_denied: false,
          legacy_content_mutations_denied: false,
          login_credential_lookup_denied: false,
          session_start_denied: false,
          authentication_schema_denied: false,
          authentication_functions_denied: false,
          runtime_role_attributes_safe: false,
          runtime_memberships_denied: false,
        }];
      }
      throw new Error("No identity query should run after a failed boundary attestation.");
    });
    const store = new PostgresProgramIdentityStore({
      databaseUrl: "postgresql://database_owner:secret@localhost/pac",
      environment: "local",
      activationEvidenceId: ACTIVATION_EVIDENCE_ID,
      activationBundleSha256: ACTIVATION_BUNDLE_SHA256,
      databaseFactory: () => db.client,
    });
    await expect(store.readSession(newProgramBearerToken()))
      .rejects.toThrow(/least-privilege boundary/i);
    expect(db.query).toHaveBeenCalledOnce();
  });

  it("retries runtime boundary attestation after a transient failure but retains a successful result", async () => {
    const db = database();
    const stableQuery = db.query.getMockImplementation()!;
    let boundaryAttempts = 0;
    db.query.mockImplementation(async (statement: string) => {
      if (statement.includes("runtime-boundary") && boundaryAttempts++ === 0) {
        throw new Error("temporary runtime connection failure");
      }
      return stableQuery(statement);
    });
    const store = new PostgresProgramIdentityStore({
      databaseUrl: "postgresql://pac_contributor_runtime:secret@localhost/pac",
      environment: "local",
      activationEvidenceId: ACTIVATION_EVIDENCE_ID,
      activationBundleSha256: ACTIVATION_BUNDLE_SHA256,
      databaseFactory: () => db.client,
    });
    const token = newProgramBearerToken();

    await expect(store.readSession(token)).rejects.toThrow(/temporary runtime/i);
    await expect(store.readSession(token)).resolves.toMatchObject({ accountId: ACCOUNT_ID });
    await expect(store.readSession(token)).resolves.toMatchObject({ accountId: ACCOUNT_ID });

    expect(db.query.mock.calls.filter(([statement]) => String(statement).includes("runtime-boundary"))).toHaveLength(2);
  });

  it("retries authentication-broker attestation after a transient failure", async () => {
    const runtime = database();
    const broker = database();
    const stableBrokerQuery = broker.query.getMockImplementation()!;
    let boundaryAttempts = 0;
    broker.query.mockImplementation(async (statement: string) => {
      if (statement.includes("authentication-boundary") && boundaryAttempts++ === 0) {
        throw new Error("temporary broker connection failure");
      }
      return stableBrokerQuery(statement);
    });
    const store = new PostgresProgramIdentityStore({
      databaseUrl: "postgresql://pac_contributor_runtime:secret@localhost/pac",
      authenticationDatabaseUrl: "postgresql://pac_authentication_broker:secret@localhost/pac",
      environment: "local",
      activationEvidenceId: ACTIVATION_EVIDENCE_ID,
      activationBundleSha256: ACTIVATION_BUNDLE_SHA256,
      databaseFactory: () => runtime.client,
      authenticationDatabaseFactory: () => broker.client,
    });

    await expect(store.signIn("named.contributor", "A careful river has 27 stones."))
      .rejects.toThrow(/temporary broker/i);
    await expect(store.signIn("named.contributor", "A careful river has 27 stones."))
      .resolves.toMatchObject({ identity: { accountId: ACCOUNT_ID } });

    expect(broker.query.mock.calls.filter(([statement]) => String(statement).includes("authentication-boundary"))).toHaveLength(2);
  }, 20_000);

  it("binds an identity correction to the observed account version and exact current ID", async () => {
    const db = database();
    const stableQuery = db.query.getMockImplementation()!;
    db.query.mockImplementation(async (statement: string) => {
      if (statement.includes("correct-account-identity")) {
        return [{
          correction_id: "66666666-6666-4666-8666-666666666666",
          account_id: ACCOUNT_ID,
          identity_version: 4,
          sign_in_id: "corrected.person",
          display_name: "Corrected Person",
          corrected_at: "2026-09-05T13:00:00.000Z",
        }] as never;
      }
      return stableQuery(statement);
    });
    const store = new PostgresProgramIdentityStore({
      databaseUrl: "postgresql://pac_contributor_runtime:secret@localhost/pac",
      environment: "local",
      activationEvidenceId: ACTIVATION_EVIDENCE_ID,
      activationBundleSha256: ACTIVATION_BUNDLE_SHA256,
      databaseFactory: () => db.client,
    });
    const receipt = await store.correctAccountIdentity("s".repeat(43), {
      accountId: ACCOUNT_ID,
      expectedIdentityVersion: 3,
      currentSignInId: "before.person",
      signInId: "corrected.person",
      displayName: "Corrected Person",
      reason: "Correct a verified entry error",
    });
    expect(receipt).toMatchObject({
      accountId: ACCOUNT_ID,
      identityVersion: 4,
      signInId: "corrected.person",
    });
    const call = (db.query.mock.calls as unknown as Array<[string, readonly unknown[]]>).find(
      ([statement]) => statement.includes("correct-account-identity"),
    );
    expect(call?.[1].slice(4)).toEqual([
      ACCOUNT_ID,
      3,
      "before.person",
      "corrected.person",
      "Corrected Person",
      "Correct a verified entry error",
    ]);
  });

  it("fails closed on ambiguous deployed environment and SSL configuration", () => {
    expect(programSessionEnvironment({ NODE_ENV: "test" })).toBe("local");
    expect(programSessionEnvironment({ NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "preview" })).toBe("preview");
    expect(() => programSessionEnvironment({ NODE_ENV: "production", VERCEL: "1" })).toThrow(/recognized/i);
    expect(() => new PostgresProgramIdentityStore({
      databaseUrl: "postgresql://pac_contributor_runtime:secret@db.example.test/pac",
      sslMode: "off",
      environment: "preview",
      databaseFactory: () => database().client,
    })).toThrow(/verify-full/i);
    expect(() => new PostgresProgramIdentityStore({
      databaseUrl: "postgresql://pac_contributor_runtime:secret@db.example.test/pac",
      sslMode: "require",
      environment: "production",
      databaseFactory: () => database().client,
    })).toThrow(/verify-full/i);
    expect(() => programSessionEnvironment({
      NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "production", PAC_DATA_ENV: "preview",
    })).toThrow(/does not match/i);
  });
});
