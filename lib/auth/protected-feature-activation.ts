import "server-only";
import { createHash } from "node:crypto";
import { z } from "zod";
import register from "@/config/contributor-access.json";
import { programDatabaseSsl, programSessionEnvironment, type ProgramEnvironment } from "./program-identity";

export const PROTECTED_FEATURES = ["protected_identity", "protected_contribution"] as const;
export type ProtectedFeature = (typeof PROTECTED_FEATURES)[number];
const common = { evidence_id: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$/), policy_version: z.literal("contributor-access-v1") };
const RegisterSchema = z.object({
  schema_version: z.literal("1.0.0"),
  features: z.object({
    protected_identity: z.object({ ...common, bindings: z.object({
      identity_contract_version: z.literal("program-identity-v1"),
      credential_contract_version: z.literal("pac-scrypt-v1"),
      identity_correction_contract_version: z.literal("program-identity-correction-v1"),
      session_audience: z.literal("pac-protected-workspace"), session_hours: z.literal(8),
      runtime_database_role: z.literal("pac_contributor_runtime"),
      authentication_broker_database_role: z.literal("pac_authentication_broker"),
    }).strict() }).strict(),
    protected_contribution: z.object({ ...common, bindings: z.object({
      identity_contract_version: z.literal("program-identity-v1"),
      mutation_contract_version: z.literal("named-resource-mutation-v1"),
      scopes: z.tuple([z.literal("one-dhs"), z.literal("dsd")]),
      operations: z.tuple([z.literal("resource_draft_save"), z.literal("resource_review_record"), z.literal("resource_publish"), z.literal("resource_withdraw"), z.literal("resource_republish")]),
    }).strict() }).strict(),
  }).strict(),
}).strict();
type Register = z.infer<typeof RegisterSchema>;
export type ProtectedFeatureActivation =
  | Readonly<{ active: false; feature: ProtectedFeature; reason: string }>
  | Readonly<{ active: true; feature: ProtectedFeature; reason: "active"; environment: ProgramEnvironment; evidenceId: string; bundleSha256: string; policyVersion: string; bindings: Register["features"][ProtectedFeature]["bindings"] }>;

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  if (value !== null && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return "{" + Object.keys(object).sort().map((key) => JSON.stringify(key) + ":" + canonicalJson(object[key])).join(",") + "}";
  }
  return JSON.stringify(value);
}
export function protectedActivationBundleSha256(candidate: unknown, feature: ProtectedFeature): string {
  const parsed = RegisterSchema.parse(candidate);
  return createHash("sha256").update(canonicalJson({ schema_version: parsed.schema_version, feature, contract: parsed.features[feature] })).digest("hex");
}

/** This additive named-access configuration is separate from consultation activation.
 * SQL independently checks the latest environment activation within each operation. */
export function protectedFeatureActivation(
  feature: ProtectedFeature, environment: NodeJS.ProcessEnv = process.env,
  candidate: unknown = register, purpose: "ordinary" | "exposure_reduction" = "ordinary",
): ProtectedFeatureActivation {
  const inactive = (reason: string): ProtectedFeatureActivation => Object.freeze({ active: false, feature, reason });
  const parsed = RegisterSchema.safeParse(candidate);
  if (!parsed.success) return inactive("invalid_contract");
  const prefix = feature === "protected_identity" ? "PAC_PROTECTED_IDENTITY" : "PAC_PROTECTED_CONTRIBUTION";
  const containment = feature === "protected_contribution" && purpose === "exposure_reduction";
  if (!containment && environment[prefix + "_ENABLED"] !== "on") return inactive("not_enabled");
  if (!containment && feature === "protected_contribution" && contributorPublicationStopped(environment)) return inactive("writes_paused");
  let targetEnvironment: ProgramEnvironment;
  try {
    targetEnvironment = programSessionEnvironment(environment);
    const contributorUrl = environment.PAC_CONTRIBUTOR_DATABASE_URL?.trim();
    const brokerUrl = environment.PAC_PROGRAM_AUTH_DATABASE_URL?.trim();
    if (!contributorUrl || !brokerUrl || contributorUrl === brokerUrl) return inactive("separate_connections_required");
    programDatabaseSsl(contributorUrl, environment.PAC_CONTRIBUTOR_DATABASE_SSL, targetEnvironment);
    programDatabaseSsl(brokerUrl, environment.PAC_PROGRAM_AUTH_DATABASE_SSL, targetEnvironment, "PAC_PROGRAM_AUTH_DATABASE_SSL");
  } catch { return inactive("invalid_environment_or_transport"); }
  const selected = parsed.data.features[feature];
  const bundleSha256 = protectedActivationBundleSha256(parsed.data, feature);
  if (environment[prefix + "_ACTIVATION_EVIDENCE_ID"] !== selected.evidence_id || environment[prefix + "_ACTIVATION_BUNDLE_SHA256"] !== bundleSha256) return inactive("binding_mismatch");
  if (feature === "protected_contribution" && !protectedFeatureActivation("protected_identity", environment, parsed.data).active) return inactive("identity_not_active");
  return Object.freeze({ active: true, feature, reason: "active", environment: targetEnvironment, evidenceId: selected.evidence_id, bundleSha256, policyVersion: selected.policy_version, bindings: selected.bindings });
}

/** Stop ordinary named contribution writes while keeping withdrawal reachable. */
export function contributorPublicationStopped(environment: NodeJS.ProcessEnv = process.env): boolean {
  return environment.PAC_CONTRIBUTOR_WRITES_PAUSED !== undefined && environment.PAC_CONTRIBUTOR_WRITES_PAUSED !== "off";
}
