import "server-only";

import { createHash, randomBytes } from "node:crypto";
import postgres from "postgres";
import { z } from "zod";
import { ACCESS_ASSIGNABLE_ROLES, ACCESS_ROLE_SCOPES } from "./program-access-contract";
import { hashProgramPassphrase, verifyProgramPassphrase } from "./program-credentials";

type Row = Record<string, unknown>;

export const PROGRAM_SESSION_COOKIE = "pac_program_session";
export const PROGRAM_SESSION_SECONDS = 8 * 60 * 60;
export const PROGRAM_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export const PROGRAM_SCOPES = ["one-dhs-pac", "one-dhs", "adsa", "dsd", "one-dsd-team"] as const;
export const PROGRAM_ROLES = [
  "content_contributor",
  "program_steward",
  "publishing_approver",
  "equity_director",
  "one_dsd_team_member",
  "owner",
] as const;
export const PROGRAM_ASSIGNABLE_ROLES = ACCESS_ASSIGNABLE_ROLES;
export const PROGRAM_ASSIGNABLE_ROLE_SCOPES = ACCESS_ROLE_SCOPES;

export type ProgramEnvironment = "local" | "preview" | "production";
export type ProgramScope = (typeof PROGRAM_SCOPES)[number];
export type ProgramRole = (typeof PROGRAM_ROLES)[number];
export type ProgramAssignableRole = (typeof PROGRAM_ASSIGNABLE_ROLES)[number];
export type ProgramAccountState = "active" | "suspended" | "revoked";

const ProgramGrantSchema = z.object({
  grant_id: z.string().uuid(),
  scope_id: z.enum(PROGRAM_SCOPES),
  role_key: z.enum(PROGRAM_ROLES),
  expires_at: z.union([z.string(), z.date()]).nullable(),
}).strict();

export type ProgramGrant = {
  grantId: string;
  scopeId: ProgramScope;
  role: ProgramRole;
  expiresAt: string | null;
};

export type ProgramIdentity = {
  sessionId: string;
  accountId: string;
  signInId: string;
  displayName: string;
  credentialId: string;
  issuedAt: string;
  expiresAt: string;
  grants: ProgramGrant[];
};

export type ProgramSignedInSession = {
  token: string;
  identity: ProgramIdentity;
};

export type ProgramInvitationReceipt = {
  invitationId: string;
  expiresAt: string;
  token: string;
};

export type ProgramAccessOverview = {
  accounts: Array<{
    accountId: string;
    signInId: string;
    displayName: string;
    identityVersion: number;
    state: ProgramAccountState;
    createdAt: string;
  }>;
  grants: Array<{
    grantId: string;
    accountId: string;
    scopeId: ProgramScope;
    role: ProgramRole;
    grantedAt: string;
    expiresAt: string | null;
    revokedAt: string | null;
  }>;
  openInvitations: Array<{
    invitationId: string;
    invitationType: "bootstrap_owner" | "new_account" | "credential_reset" | "owner_recovery";
    signInId: string;
    displayName: string;
    issuedAt: string;
    expiresAt: string;
  }>;
  pagination: {
    accountOffset: number;
    accountLimit: number;
    accountTotal: number;
    invitationOffset: number;
    invitationLimit: number;
    invitationTotal: number;
  };
};

export type ProgramAccessTarget = ProgramAccessOverview["accounts"][number];

export interface ProgramIdentityDatabase {
  query<T extends Row = Row>(statement: string, parameters?: readonly unknown[]): Promise<T[]>;
  close(): Promise<void>;
}

export type ProgramIdentityDatabaseFactory = (configuration: {
  databaseUrl: string;
  ssl: false | "verify-full";
}) => ProgramIdentityDatabase;

export type ProgramIdentityStoreOptions = {
  databaseUrl: string;
  sslMode?: string;
  authenticationDatabaseUrl?: string;
  authenticationSslMode?: string;
  environment?: ProgramEnvironment;
  activationEvidenceId?: string;
  activationBundleSha256?: string;
  databaseFactory?: ProgramIdentityDatabaseFactory;
  authenticationDatabaseFactory?: ProgramIdentityDatabaseFactory;
};

const STATEMENTS = {
  runtimeBoundary: `/* pac-identity:runtime-boundary */
    select runtime_role, session_role, installation_id, identity_tables_denied,
      authorization_allocator_denied, authorization_consumer_denied,
      rate_limit_policy_denied, owner_recovery_allocator_denied,
      feature_activation_allocator_denied,
      legacy_content_mutations_denied, login_credential_lookup_denied,
      session_start_denied, authentication_schema_denied,
      authentication_functions_denied, runtime_role_attributes_safe,
      runtime_memberships_denied
    from pac.attest_program_identity_runtime_boundary()`,
  authenticationBoundary: `/* pac-identity:authentication-boundary */
    select broker_role, session_role, installation_id, pac_schema_denied,
      auth_schema_create_denied, identity_tables_denied,
      direct_login_functions_denied, login_lookup_allowed,
      session_start_allowed, other_auth_functions_denied,
      auth_objects_denied, broker_role_attributes_safe,
      broker_memberships_denied
    from pac_auth.attest_authentication_broker_boundary()`,
  loginCredential: `/* pac-identity:login-credential */
    select account_id, display_name, credential_id, credential_hash, identity_version
    from pac_auth.lookup_program_login_credential($1, $2)`,
  startSession: `/* pac-identity:start-session */
    select session_id, account_id, display_name, expires_at
    from pac_auth.start_program_account_session($1::uuid, $2::uuid, $3, $4::integer, $5, $6, $7, $8)`,
  readSession: `/* pac-identity:read-session */
    select session_id, account_id, sign_in_id, display_name, credential_id,
      issued_at, expires_at, grants
    from pac.read_program_account_session($1, $2, $3, $4)`,
  endSession: `/* pac-identity:end-session */
    select pac.end_program_account_session($1, $2) as ended`,
  acceptInvitation: `/* pac-identity:accept-invitation */
    select session_id, account_id, sign_in_id, display_name, expires_at, bootstrap_owner
    from pac.accept_program_account_invitation($1, $2, $3, $4, $5, $6)`,
  inviteAccount: `/* pac-identity:invite-account */
    select invitation_id, expires_at
    from pac.create_program_account_invitation($1, $2, $3, $4, $5, $6, $7, $8::timestamptz)`,
  inviteCredentialReset: `/* pac-identity:invite-credential-reset */
    select invitation_id, expires_at
    from pac.create_program_credential_reset_invitation($1, $2, $3, $4, $5::uuid, $6, $7::timestamptz)`,
  issueGrant: `/* pac-identity:issue-grant */
    select grant_id, account_id, scope_id, role_key, granted_at, expires_at
    from pac.issue_program_access_grant($1, $2, $3, $4, $5::uuid, $6, $7, $8::timestamptz, $9)`,
  revokeGrant: `/* pac-identity:revoke-grant */
    select pac.revoke_program_access_grant($1, $2, $3, $4, $5::uuid, $6) as revoked`,
  revokeInvitation: `/* pac-identity:revoke-invitation */
    select pac.revoke_program_account_invitation($1, $2, $3, $4, $5::uuid, $6) as revoked`,
  changeAccountState: `/* pac-identity:change-account-state */
    select account_state_event_id, state, recorded_at
    from pac.change_program_account_state($1, $2, $3, $4, $5::uuid, $6, $7, $8)`,
  correctAccountIdentity: `/* pac-identity:correct-account-identity */
    select correction_id, account_id, identity_version, sign_in_id, display_name, corrected_at
    from pac.correct_program_account_identity(
      $1, $2, $3, $4, $5::uuid, $6::integer, $7, $8, $9, $10
    )`,
  transferOwner: `/* pac-identity:transfer-owner */
    select transfer_id, from_account_id, to_account_id, transferred_at
    from pac.transfer_program_owner($1, $2, $3, $4, $5::uuid, $6::integer, $7, $8)`,
  accountAccessTarget: `/* pac-identity:account-access-target */
    select account_id, sign_in_id, display_name, identity_version, state, created_at
    from pac.read_program_account_admin_target($1, $2, $3, $4, $5::uuid)`,
  accessOverview: `/* pac-identity:access-overview */
    select pac.read_program_access_overview(
      $1, $2, $3, $4, $5::integer, $6::integer, $7::integer, $8::integer
    ) as overview`,
  housekeeping: `/* pac-identity:security-housekeeping */
    select expired_invitations_closed, expired_sessions_deleted
    from pac.purge_expired_program_security_records()`,
} as const;

function isoInstant(value: unknown): string {
  const date = value instanceof Date ? value : typeof value === "string" ? new Date(value) : null;
  if (!date || !Number.isFinite(date.getTime())) throw new Error("The identity store returned an invalid timestamp.");
  return date.toISOString();
}

function parseJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    throw new Error("The identity store returned malformed JSON.");
  }
}

export function newProgramBearerToken(): string {
  return randomBytes(32).toString("base64url");
}

export function digestProgramBearerToken(kind: "session" | "invitation", token: string): string {
  if (!PROGRAM_TOKEN_PATTERN.test(token)) throw new Error("Invalid protected-workspace bearer token.");
  const decoded = Buffer.from(token, "base64url");
  if (decoded.byteLength !== 32 || decoded.toString("base64url") !== token) {
    throw new Error("Invalid protected-workspace bearer token.");
  }
  return createHash("sha256")
    .update(`pac:program-${kind}:v1\0`, "utf8")
    .update(token, "utf8")
    .digest("hex");
}

export function programSessionEnvironment(environment: NodeJS.ProcessEnv = process.env): ProgramEnvironment {
  const configured = environment.PAC_DATA_ENV;
  let vercelEnvironment: ProgramEnvironment | undefined;
  if (environment.VERCEL === "1") {
    if (environment.VERCEL_ENV === "preview" || environment.VERCEL_ENV === "production") {
      vercelEnvironment = environment.VERCEL_ENV;
    } else if (environment.VERCEL_ENV === "development") {
      vercelEnvironment = "local";
    } else {
      throw new Error("A deployed protected session requires a recognized Vercel environment.");
    }
  }
  if (configured !== undefined) {
    if (configured !== "local" && configured !== "preview" && configured !== "production") {
      throw new Error("PAC_DATA_ENV must be local, preview, or production for protected sessions.");
    }
    if (vercelEnvironment && configured !== vercelEnvironment) {
      throw new Error("PAC_DATA_ENV does not match the deployed Vercel environment.");
    }
    return configured;
  }
  if (vercelEnvironment) return vercelEnvironment;
  return "local";
}

export function programDatabaseSsl(
  databaseUrl: string,
  configured: string | undefined,
  environment: ProgramEnvironment,
  settingName = "PAC_CONTRIBUTOR_DATABASE_SSL",
): false | "verify-full" {
  let parsed: URL;
  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error(`${settingName.replace(/_SSL$/, "_URL")} must be a valid PostgreSQL connection string.`);
  }
  if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
    throw new Error(`${settingName.replace(/_SSL$/, "_URL")} must use the postgres or postgresql protocol.`);
  }
  const localHost = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  if (configured === undefined || configured === "") {
    if (environment !== "local" || !localHost) {
      throw new Error(`Protected identity requires ${settingName}=verify-full outside local PostgreSQL.`);
    }
    return false;
  }
  if (configured === "disable" && environment === "local" && localHost) return false;
  if (configured === "verify-full") return "verify-full";
  throw new Error("Protected identity requires verify-full, or disable only for local PostgreSQL.");
}

function defaultDatabaseFactory(configuration: {
  databaseUrl: string;
  ssl: false | "verify-full";
}, maxConnections = 3): ProgramIdentityDatabase {
  const client = postgres(configuration.databaseUrl, {
    ssl: configuration.ssl,
    max: maxConnections,
    idle_timeout: 20,
    connect_timeout: 10,
    max_lifetime: 30 * 60,
    prepare: false,
  });
  return {
    async query<T extends Row>(statement: string, parameters: readonly unknown[] = []): Promise<T[]> {
      const result = await client.unsafe<T[]>(statement, parameters as never[]);
      return Array.from(result);
    },
    async close(): Promise<void> {
      await client.end({ timeout: 5 });
    },
  };
}

function canonicalSignInId(value: string): string | null {
  if (value.length > 128) return null;
  const candidate = value.trim().toLocaleLowerCase("en-US");
  return /^[a-z0-9][a-z0-9._-]{2,63}$/.test(candidate) ? candidate : null;
}

function mapGrants(value: unknown): ProgramGrant[] {
  const parsed = z.array(ProgramGrantSchema).parse(parseJson(value));
  return parsed.map((grant) => ({
    grantId: grant.grant_id,
    scopeId: grant.scope_id,
    role: grant.role_key,
    expiresAt: grant.expires_at === null ? null : isoInstant(grant.expires_at),
  }));
}

type SessionRow = {
  session_id: string;
  account_id: string;
  sign_in_id: string;
  display_name: string;
  credential_id: string;
  issued_at: unknown;
  expires_at: unknown;
  grants: unknown;
};

function mapIdentity(row: SessionRow): ProgramIdentity {
  return {
    sessionId: z.string().uuid().parse(row.session_id),
    accountId: z.string().uuid().parse(row.account_id),
    signInId: z.string().regex(/^[a-z0-9][a-z0-9._-]{2,63}$/).parse(row.sign_in_id),
    displayName: z.string().min(2).max(120).parse(row.display_name),
    credentialId: z.string().uuid().parse(row.credential_id),
    issuedAt: isoInstant(row.issued_at),
    expiresAt: isoInstant(row.expires_at),
    grants: mapGrants(row.grants),
  };
}

function oneRow<T>(rows: T[], message: string): T {
  if (rows.length !== 1) throw new Error(message);
  return rows[0];
}

export class PostgresProgramIdentityStore {
  private readonly database: ProgramIdentityDatabase;
  private readonly authenticationDatabase: ProgramIdentityDatabase | undefined;
  private boundaryAttestation: Promise<string> | undefined;
  private authenticationBoundaryAttestation: Promise<string> | undefined;
  readonly environment: ProgramEnvironment;
  private readonly activationEvidenceId: string | undefined;
  private readonly activationBundleSha256: string | undefined;

  constructor(options: ProgramIdentityStoreOptions) {
    this.environment = options.environment ?? programSessionEnvironment();
    this.activationEvidenceId = options.activationEvidenceId ?? process.env.PAC_PROTECTED_IDENTITY_ACTIVATION_EVIDENCE_ID;
    this.activationBundleSha256 = options.activationBundleSha256 ?? process.env.PAC_PROTECTED_IDENTITY_ACTIVATION_BUNDLE_SHA256;
    this.database = (options.databaseFactory ?? defaultDatabaseFactory)({
      databaseUrl: options.databaseUrl,
      ssl: programDatabaseSsl(options.databaseUrl, options.sslMode, this.environment),
    });
    const authenticationDatabaseUrl = options.authenticationDatabaseUrl?.trim();
    this.authenticationDatabase = authenticationDatabaseUrl
      ? (options.authenticationDatabaseFactory ?? ((configuration) => defaultDatabaseFactory(configuration, 1)))({
          databaseUrl: authenticationDatabaseUrl,
          ssl: programDatabaseSsl(
            authenticationDatabaseUrl,
            options.authenticationSslMode,
            this.environment,
            "PAC_PROGRAM_AUTH_DATABASE_SSL",
          ),
        })
      : undefined;
  }

  private activationContext(): readonly [string, string] {
    if (!/^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$/.test(this.activationEvidenceId ?? "")
      || !/^[a-f0-9]{64}$/.test(this.activationBundleSha256 ?? "")) {
      throw new Error("Approved protected-identity activation evidence is required.");
    }
    return [this.activationEvidenceId!, this.activationBundleSha256!] as const;
  }

  private assertRuntimeBoundary(): Promise<string> {
    if (!this.boundaryAttestation) {
      const attempt = (async () => {
        const row = oneRow(await this.database.query<{
          runtime_role: string;
          session_role: string;
          installation_id: string;
          identity_tables_denied: boolean;
          authorization_allocator_denied: boolean;
          authorization_consumer_denied: boolean;
          rate_limit_policy_denied: boolean;
          owner_recovery_allocator_denied: boolean;
          feature_activation_allocator_denied: boolean;
          legacy_content_mutations_denied: boolean;
          login_credential_lookup_denied: boolean;
          session_start_denied: boolean;
          authentication_schema_denied: boolean;
          authentication_functions_denied: boolean;
          runtime_role_attributes_safe: boolean;
          runtime_memberships_denied: boolean;
        }>(STATEMENTS.runtimeBoundary), "The protected identity database did not attest its runtime boundary.");
        const attestation = z.object({
          runtime_role: z.literal("pac_contributor_runtime"),
          session_role: z.literal("pac_contributor_runtime"),
          installation_id: z.string().uuid(),
          identity_tables_denied: z.literal(true),
          authorization_allocator_denied: z.literal(true),
          authorization_consumer_denied: z.literal(true),
          rate_limit_policy_denied: z.literal(true),
          owner_recovery_allocator_denied: z.literal(true),
          feature_activation_allocator_denied: z.literal(true),
          legacy_content_mutations_denied: z.literal(true),
          login_credential_lookup_denied: z.literal(true),
          session_start_denied: z.literal(true),
          authentication_schema_denied: z.literal(true),
          authentication_functions_denied: z.literal(true),
          runtime_role_attributes_safe: z.literal(true),
          runtime_memberships_denied: z.literal(true),
        }).strict();
        const parsed = attestation.safeParse(row);
        if (!parsed.success) {
          throw new Error("The protected identity database role does not match the required least-privilege boundary.");
        }
        return parsed.data.installation_id;
      })();
      this.boundaryAttestation = attempt;
      void attempt.catch(() => {
        if (this.boundaryAttestation === attempt) this.boundaryAttestation = undefined;
      });
    }
    return this.boundaryAttestation;
  }

  private assertAuthenticationBoundary(): Promise<string> {
    if (!this.authenticationDatabase) {
      return Promise.reject(new Error(
        "PAC_PROGRAM_AUTH_DATABASE_URL is required for protected sign-in.",
      ));
    }
    if (!this.authenticationBoundaryAttestation) {
      const attempt = (async () => {
        const row = oneRow(await this.authenticationDatabase!.query<{
          broker_role: string;
          session_role: string;
          installation_id: string;
          pac_schema_denied: boolean;
          auth_schema_create_denied: boolean;
          identity_tables_denied: boolean;
          direct_login_functions_denied: boolean;
          login_lookup_allowed: boolean;
          session_start_allowed: boolean;
          other_auth_functions_denied: boolean;
          auth_objects_denied: boolean;
          broker_role_attributes_safe: boolean;
          broker_memberships_denied: boolean;
        }>(STATEMENTS.authenticationBoundary), "The authentication broker did not attest its boundary.");
        const attestation = z.object({
          broker_role: z.literal("pac_authentication_broker"),
          session_role: z.literal("pac_authentication_broker"),
          installation_id: z.string().uuid(),
          pac_schema_denied: z.literal(true),
          auth_schema_create_denied: z.literal(true),
          identity_tables_denied: z.literal(true),
          direct_login_functions_denied: z.literal(true),
          login_lookup_allowed: z.literal(true),
          session_start_allowed: z.literal(true),
          other_auth_functions_denied: z.literal(true),
          auth_objects_denied: z.literal(true),
          broker_role_attributes_safe: z.literal(true),
          broker_memberships_denied: z.literal(true),
        }).strict();
        const parsed = attestation.safeParse(row);
        if (!parsed.success) {
          throw new Error("The authentication broker does not match the required least-privilege boundary.");
        }
        return parsed.data.installation_id;
      })();
      this.authenticationBoundaryAttestation = attempt;
      void attempt.catch(() => {
        if (this.authenticationBoundaryAttestation === attempt) {
          this.authenticationBoundaryAttestation = undefined;
        }
      });
    }
    return this.authenticationBoundaryAttestation;
  }

  async contributorQuery<T extends Row = Row>(
    statement: string,
    parameters: readonly unknown[] = [],
  ): Promise<T[]> {
    await this.assertRuntimeBoundary();
    return this.database.query<T>(statement, parameters);
  }

  private async authenticationQuery<T extends Row = Row>(
    statement: string,
    parameters: readonly unknown[] = [],
  ): Promise<T[]> {
    const [runtimeInstallationId, authenticationInstallationId] = await Promise.all([
      this.assertRuntimeBoundary(),
      this.assertAuthenticationBoundary(),
    ]);
    if (runtimeInstallationId !== authenticationInstallationId) {
      throw new Error("The runtime and authentication broker do not belong to the same database installation.");
    }
    return this.authenticationDatabase!.query<T>(statement, parameters);
  }

  async signIn(signInId: string, passphrase: string): Promise<ProgramSignedInSession | null> {
    const canonicalId = canonicalSignInId(signInId);
    const rows = canonicalId
      ? await this.authenticationQuery<{
          account_id: string;
          display_name: string;
          credential_id: string;
          credential_hash: string;
          identity_version: number;
        }>(STATEMENTS.loginCredential, [canonicalId, this.environment])
      : [];
    if (rows.length > 1) throw new Error("The identity store returned more than one active credential.");
    const credential = rows[0];
    const matches = await verifyProgramPassphrase(passphrase, credential?.credential_hash);
    if (!credential || !matches || !canonicalId) return null;

    const token = newProgramBearerToken();
    const [activationEvidenceId, activationBundleSha256] = this.activationContext();
    const started = oneRow(
      await this.authenticationQuery<{
        session_id: string;
        account_id: string;
        display_name: string;
        expires_at: unknown;
      }>(STATEMENTS.startSession, [
        credential.account_id,
        credential.credential_id,
        canonicalId,
        z.number().int().positive().parse(credential.identity_version),
        digestProgramBearerToken("session", token),
        this.environment,
        activationEvidenceId,
        activationBundleSha256,
      ]),
      "The identity store did not create exactly one session.",
    );
    z.string().uuid().parse(started.session_id);
    z.string().uuid().parse(started.account_id);
    z.string().min(2).max(120).parse(started.display_name);
    isoInstant(started.expires_at);
    const identity = await this.readSession(token);
    if (!identity || identity.accountId !== credential.account_id || identity.signInId !== canonicalId) {
      throw new Error("The newly created protected session could not be verified.");
    }
    return { token, identity };
  }

  async readSession(token: string | null | undefined): Promise<ProgramIdentity | null> {
    if (!token || !PROGRAM_TOKEN_PATTERN.test(token)) return null;
    let digest: string;
    try {
      digest = digestProgramBearerToken("session", token);
    } catch {
      return null;
    }
    let activation: readonly [string, string];
    try {
      activation = this.activationContext();
    } catch {
      return null;
    }
    const rows = await this.contributorQuery<SessionRow>(STATEMENTS.readSession, [
      digest,
      this.environment,
      ...activation,
    ]);
    if (rows.length > 1) throw new Error("The identity store returned more than one active session.");
    return rows[0] ? mapIdentity(rows[0]) : null;
  }

  async signOut(token: string | null | undefined): Promise<boolean> {
    if (!token || !PROGRAM_TOKEN_PATTERN.test(token)) return false;
    const rows = await this.contributorQuery<{ ended: boolean }>(STATEMENTS.endSession, [
      digestProgramBearerToken("session", token),
      this.environment,
    ]);
    return rows.length === 1 && rows[0].ended === true;
  }

  async acceptInvitation(token: string, passphrase: string): Promise<ProgramSignedInSession> {
    const [activationEvidenceId, activationBundleSha256] = this.activationContext();
    const invitationDigest = digestProgramBearerToken("invitation", token);
    const credentialHash = await hashProgramPassphrase(passphrase);
    const sessionToken = newProgramBearerToken();
    const rows = await this.contributorQuery<{
      session_id: string;
      account_id: string;
      sign_in_id: string;
      display_name: string;
      expires_at: unknown;
      bootstrap_owner: boolean;
    }>(STATEMENTS.acceptInvitation, [
      invitationDigest,
      credentialHash,
      digestProgramBearerToken("session", sessionToken),
      this.environment,
      activationEvidenceId,
      activationBundleSha256,
    ]);
    const accepted = oneRow(rows, "The identity store did not accept exactly one invitation.");
    const sessionId = z.string().uuid().parse(accepted.session_id);
    const accountId = z.string().uuid().parse(accepted.account_id);
    const signInId = z.string().regex(/^[a-z0-9][a-z0-9._-]{2,63}$/).parse(accepted.sign_in_id);
    z.string().min(2).max(120).parse(accepted.display_name);
    isoInstant(accepted.expires_at);
    z.boolean().parse(accepted.bootstrap_owner);
    const identity = await this.readSession(sessionToken);
    if (!identity || identity.sessionId !== sessionId || identity.accountId !== accountId || identity.signInId !== signInId) {
      throw new Error("The accepted protected session could not be verified.");
    }
    return { token: sessionToken, identity };
  }

  private sessionDigest(token: string): string {
    return digestProgramBearerToken("session", token);
  }

  private protectedActionContext(token: string): readonly [string, ProgramEnvironment, string, string] {
    const [evidenceId, bundleSha256] = this.activationContext();
    return [this.sessionDigest(token), this.environment, evidenceId, bundleSha256] as const;
  }

  async inviteAccount(
    ownerSessionToken: string,
    input: { signInId: string; displayName: string; expiresAt: string },
  ): Promise<ProgramInvitationReceipt> {
    const signInId = canonicalSignInId(input.signInId);
    if (!signInId) throw new Error("Invalid sign-in identifier.");
    const invitationToken = newProgramBearerToken();
    const payload = { signInId, displayName: input.displayName, expiresAt: isoInstant(input.expiresAt) };
    const row = oneRow(await this.contributorQuery<{ invitation_id: string; expires_at: unknown }>(
      STATEMENTS.inviteAccount,
      [
        ...this.protectedActionContext(ownerSessionToken),
        payload.signInId,
        payload.displayName,
        digestProgramBearerToken("invitation", invitationToken),
        payload.expiresAt,
      ],
    ), "The identity store did not create exactly one invitation.");
    return { invitationId: z.string().uuid().parse(row.invitation_id), expiresAt: isoInstant(row.expires_at), token: invitationToken };
  }

  async inviteCredentialReset(
    ownerSessionToken: string,
    input: { accountId: string; expiresAt: string },
  ): Promise<ProgramInvitationReceipt> {
    const accountId = z.string().uuid().parse(input.accountId);
    const expiresAt = isoInstant(input.expiresAt);
    const invitationToken = newProgramBearerToken();
    const row = oneRow(await this.contributorQuery<{ invitation_id: string; expires_at: unknown }>(
      STATEMENTS.inviteCredentialReset,
      [
        ...this.protectedActionContext(ownerSessionToken),
        accountId,
        digestProgramBearerToken("invitation", invitationToken),
        expiresAt,
      ],
    ), "The identity store did not create exactly one credential-reset invitation.");
    return { invitationId: z.string().uuid().parse(row.invitation_id), expiresAt: isoInstant(row.expires_at), token: invitationToken };
  }

  async issueGrant(
    ownerSessionToken: string,
    input: { accountId: string; scopeId: ProgramScope; role: ProgramAssignableRole; expiresAt: string | null; reason: string },
  ): Promise<{ grantId: string }> {
    const role = z.enum(PROGRAM_ASSIGNABLE_ROLES).parse(input.role);
    const allowedScopes = PROGRAM_ASSIGNABLE_ROLE_SCOPES[role] as readonly ProgramScope[];
    const payload = {
      accountId: z.string().uuid().parse(input.accountId),
      scopeId: z.enum(PROGRAM_SCOPES).parse(input.scopeId),
      role,
      expiresAt: input.expiresAt === null ? null : isoInstant(input.expiresAt),
      reason: input.reason,
    };
    if (!allowedScopes.includes(payload.scopeId)) {
      throw new Error("That permission is not available for the selected program area.");
    }
    const row = oneRow(await this.contributorQuery<{ grant_id: string }>(STATEMENTS.issueGrant, [
      ...this.protectedActionContext(ownerSessionToken),
      payload.accountId,
      payload.scopeId,
      payload.role,
      payload.expiresAt,
      payload.reason,
    ]), "The identity store did not create exactly one grant.");
    return { grantId: z.string().uuid().parse(row.grant_id) };
  }

  async revokeGrant(ownerSessionToken: string, grantIdValue: string, reason: string): Promise<boolean> {
    const grantId = z.string().uuid().parse(grantIdValue);
    const rows = await this.contributorQuery<{ revoked: boolean }>(STATEMENTS.revokeGrant, [
      ...this.protectedActionContext(ownerSessionToken), grantId, reason,
    ]);
    return rows.length === 1 && rows[0].revoked === true;
  }

  async revokeInvitation(ownerSessionToken: string, invitationIdValue: string, reason: string): Promise<boolean> {
    const invitationId = z.string().uuid().parse(invitationIdValue);
    const rows = await this.contributorQuery<{ revoked: boolean }>(STATEMENTS.revokeInvitation, [
      ...this.protectedActionContext(ownerSessionToken), invitationId, reason,
    ]);
    return rows.length === 1 && rows[0].revoked === true;
  }

  async changeAccountState(
    ownerSessionToken: string,
    accountIdValue: string,
    state: ProgramAccountState,
    reason: string,
    confirmSignInId: string | null = null,
  ): Promise<boolean> {
    const accountId = z.string().uuid().parse(accountIdValue);
    const parsedState = z.enum(["active", "suspended", "revoked"]).parse(state);
    const rows = await this.contributorQuery(STATEMENTS.changeAccountState, [
      ...this.protectedActionContext(ownerSessionToken), accountId, parsedState, reason,
      confirmSignInId === null ? null : canonicalSignInId(confirmSignInId),
    ]);
    return rows.length === 1;
  }

  async correctAccountIdentity(
    ownerSessionToken: string,
    input: {
      accountId: string;
      expectedIdentityVersion: number;
      currentSignInId: string;
      signInId: string;
      displayName: string;
      reason: string;
    },
  ): Promise<{
    correctionId: string;
    accountId: string;
    identityVersion: number;
    signInId: string;
    displayName: string;
    correctedAt: string;
  }> {
    const currentSignInId = canonicalSignInId(input.currentSignInId);
    const signInId = canonicalSignInId(input.signInId);
    if (!currentSignInId || !signInId) throw new Error("Invalid sign-in identifier.");
    const row = oneRow(await this.contributorQuery<{
      correction_id: string;
      account_id: string;
      identity_version: number;
      sign_in_id: string;
      display_name: string;
      corrected_at: unknown;
    }>(STATEMENTS.correctAccountIdentity, [
      ...this.protectedActionContext(ownerSessionToken),
      z.string().uuid().parse(input.accountId),
      z.number().int().positive().parse(input.expectedIdentityVersion),
      currentSignInId,
      signInId,
      input.displayName,
      input.reason,
    ]), "The identity store did not complete exactly one identity correction.");
    return {
      correctionId: z.string().uuid().parse(row.correction_id),
      accountId: z.string().uuid().parse(row.account_id),
      identityVersion: z.number().int().positive().parse(row.identity_version),
      signInId: z.string().regex(/^[a-z0-9][a-z0-9._-]{2,63}$/).parse(row.sign_in_id),
      displayName: z.string().min(2).max(120).parse(row.display_name),
      correctedAt: isoInstant(row.corrected_at),
    };
  }

  async transferOwner(
    ownerSessionToken: string,
    successorAccountIdValue: string,
    expectedIdentityVersionValue: number,
    confirmSignInIdValue: string,
    reason: string,
  ): Promise<{ transferId: string; fromAccountId: string; toAccountId: string; transferredAt: string }> {
    const successorAccountId = z.string().uuid().parse(successorAccountIdValue);
    const expectedIdentityVersion = z.number().int().positive().parse(expectedIdentityVersionValue);
    const confirmSignInId = canonicalSignInId(confirmSignInIdValue);
    const row = oneRow(await this.contributorQuery<{
      transfer_id: string;
      from_account_id: string;
      to_account_id: string;
      transferred_at: unknown;
    }>(STATEMENTS.transferOwner, [
      ...this.protectedActionContext(ownerSessionToken), successorAccountId,
      expectedIdentityVersion, confirmSignInId, reason,
    ]), "The identity store did not complete exactly one owner transfer.");
    return {
      transferId: z.string().uuid().parse(row.transfer_id),
      fromAccountId: z.string().uuid().parse(row.from_account_id),
      toAccountId: z.string().uuid().parse(row.to_account_id),
      transferredAt: isoInstant(row.transferred_at),
    };
  }

  async accountAccessTarget(
    ownerSessionToken: string,
    accountIdValue: string,
  ): Promise<ProgramAccessTarget | null> {
    const activation = this.activationContext();
    const accountId = z.string().uuid().parse(accountIdValue);
    const rows = await this.contributorQuery<{
      account_id: string;
      sign_in_id: string;
      display_name: string;
      identity_version: number;
      state: ProgramAccountState;
      created_at: unknown;
    }>(STATEMENTS.accountAccessTarget, [
      this.sessionDigest(ownerSessionToken), this.environment, ...activation, accountId,
    ]);
    if (rows.length === 0) return null;
    const row = oneRow(rows, "The identity store returned more than one account target.");
    return {
      accountId: z.string().uuid().parse(row.account_id),
      signInId: z.string().regex(/^[a-z0-9][a-z0-9._-]{2,63}$/).parse(row.sign_in_id),
      displayName: z.string().min(2).max(120).parse(row.display_name),
      identityVersion: z.number().int().positive().parse(row.identity_version),
      state: z.enum(["active", "suspended", "revoked"]).parse(row.state),
      createdAt: isoInstant(row.created_at),
    };
  }

  async accessOverview(
    ownerSessionToken: string,
    page: {
      accountOffset?: number;
      accountLimit?: number;
      invitationOffset?: number;
      invitationLimit?: number;
    } = {},
  ): Promise<ProgramAccessOverview> {
    const activation = this.activationContext();
    const accountOffset = z.number().int().nonnegative().max(1_000_000).parse(page.accountOffset ?? 0);
    const accountLimit = z.number().int().min(1).max(100).parse(page.accountLimit ?? 50);
    const invitationOffset = z.number().int().nonnegative().max(1_000_000).parse(page.invitationOffset ?? 0);
    const invitationLimit = z.number().int().min(1).max(100).parse(page.invitationLimit ?? 50);
    const row = oneRow(await this.contributorQuery<{ overview: unknown }>(STATEMENTS.accessOverview, [
      this.sessionDigest(ownerSessionToken), this.environment, ...activation,
      accountOffset, accountLimit, invitationOffset, invitationLimit,
    ]), "The identity store did not return an access overview.");
    const value = parseJson(row.overview);
    const schema = z.object({
      accounts: z.array(z.object({
        account_id: z.string().uuid(), sign_in_id: z.string(), display_name: z.string(),
        identity_version: z.number().int().positive(), state: z.enum(["active", "suspended", "revoked"]),
        created_at: z.union([z.string(), z.date()]),
      }).strict()),
      grants: z.array(z.object({
        grant_id: z.string().uuid(), account_id: z.string().uuid(), scope_id: z.enum(PROGRAM_SCOPES),
        role_key: z.enum(PROGRAM_ROLES), granted_at: z.union([z.string(), z.date()]),
        expires_at: z.union([z.string(), z.date()]).nullable(), revoked_at: z.union([z.string(), z.date()]).nullable(),
      }).strict()),
      open_invitations: z.array(z.object({
        invitation_id: z.string().uuid(), invitation_type: z.enum(["bootstrap_owner", "new_account", "credential_reset", "owner_recovery"]),
        sign_in_id: z.string(), display_name: z.string(), issued_at: z.union([z.string(), z.date()]),
        expires_at: z.union([z.string(), z.date()]),
      }).strict()),
      pagination: z.object({
        account_offset: z.number().int().nonnegative(),
        account_limit: z.number().int().positive(),
        account_total: z.number().int().nonnegative(),
        invitation_offset: z.number().int().nonnegative(),
        invitation_limit: z.number().int().positive(),
        invitation_total: z.number().int().nonnegative(),
      }).strict(),
    }).strict();
    const parsed = schema.parse(value);
    return {
      accounts: parsed.accounts.map((item) => ({
        accountId: item.account_id, signInId: item.sign_in_id, displayName: item.display_name,
        identityVersion: item.identity_version, state: item.state, createdAt: isoInstant(item.created_at),
      })),
      grants: parsed.grants.map((item) => ({
        grantId: item.grant_id, accountId: item.account_id, scopeId: item.scope_id, role: item.role_key,
        grantedAt: isoInstant(item.granted_at), expiresAt: item.expires_at === null ? null : isoInstant(item.expires_at),
        revokedAt: item.revoked_at === null ? null : isoInstant(item.revoked_at),
      })),
      openInvitations: parsed.open_invitations.map((item) => ({
        invitationId: item.invitation_id, invitationType: item.invitation_type, signInId: item.sign_in_id,
        displayName: item.display_name, issuedAt: isoInstant(item.issued_at), expiresAt: isoInstant(item.expires_at),
      })),
      pagination: {
        accountOffset: parsed.pagination.account_offset,
        accountLimit: parsed.pagination.account_limit,
        accountTotal: parsed.pagination.account_total,
        invitationOffset: parsed.pagination.invitation_offset,
        invitationLimit: parsed.pagination.invitation_limit,
        invitationTotal: parsed.pagination.invitation_total,
      },
    };
  }

  async runSecurityHousekeeping(): Promise<{ expiredInvitationsClosed: number; expiredSessionsDeleted: number }> {
    const row = oneRow(await this.contributorQuery<{
      expired_invitations_closed: number | string;
      expired_sessions_deleted: number | string;
    }>(STATEMENTS.housekeeping), "Program identity housekeeping did not return a result.");
    const expiredInvitationsClosed = Number(row.expired_invitations_closed);
    const expiredSessionsDeleted = Number(row.expired_sessions_deleted);
    if (!Number.isSafeInteger(expiredInvitationsClosed) || expiredInvitationsClosed < 0
      || !Number.isSafeInteger(expiredSessionsDeleted) || expiredSessionsDeleted < 0) {
      throw new Error("Program identity housekeeping returned invalid counts.");
    }
    return { expiredInvitationsClosed, expiredSessionsDeleted };
  }

  async close(): Promise<void> {
    await Promise.all([
      this.database.close(),
      this.authenticationDatabase?.close() ?? Promise.resolve(),
    ]);
  }
}

let defaultStore: PostgresProgramIdentityStore | null = null;
let defaultStoreKey = "";

export function programIdentityConfigured(environment: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(environment.PAC_CONTRIBUTOR_DATABASE_URL?.trim());
}

export function programIdentityStore(): PostgresProgramIdentityStore {
  const databaseUrl = process.env.PAC_CONTRIBUTOR_DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("PAC_CONTRIBUTOR_DATABASE_URL is required for protected workspace identity.");
  const authenticationDatabaseUrl = process.env.PAC_PROGRAM_AUTH_DATABASE_URL?.trim();
  const environment = programSessionEnvironment();
  const key = [
    databaseUrl,
    process.env.PAC_CONTRIBUTOR_DATABASE_SSL ?? "",
    authenticationDatabaseUrl ?? "",
    process.env.PAC_PROGRAM_AUTH_DATABASE_SSL ?? "",
    environment,
    process.env.PAC_PROTECTED_IDENTITY_ACTIVATION_EVIDENCE_ID ?? "",
    process.env.PAC_PROTECTED_IDENTITY_ACTIVATION_BUNDLE_SHA256 ?? "",
  ].join("\0");
  if (!defaultStore || defaultStoreKey !== key) {
    defaultStore = new PostgresProgramIdentityStore({
      databaseUrl,
      sslMode: process.env.PAC_CONTRIBUTOR_DATABASE_SSL,
      authenticationDatabaseUrl,
      authenticationSslMode: process.env.PAC_PROGRAM_AUTH_DATABASE_SSL,
      environment,
      activationEvidenceId: process.env.PAC_PROTECTED_IDENTITY_ACTIVATION_EVIDENCE_ID,
      activationBundleSha256: process.env.PAC_PROTECTED_IDENTITY_ACTIVATION_BUNDLE_SHA256,
    });
    defaultStoreKey = key;
  }
  return defaultStore;
}

/** Dedicated contributor boundary; never falls back to the owner runtime connection. */
export function programContributorDatabase(): ProgramIdentityDatabase {
  const store = programIdentityStore();
  return { query: (statement, parameters) => store.contributorQuery(statement, parameters), close: async () => {} };
}
