import "server-only";

import {
  digestProgramBearerToken,
  type ProgramEnvironment,
} from "./program-identity";
import { protectedFeatureActivation } from "./protected-feature-activation";

export const PROTECTED_CONTENT_MUTATION_STATEMENT = `/* pac-content:named-protected-mutation */
  select pac.run_protected_content_mutation(
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb
  ) as result`;

export type ProtectedMutationContext = Readonly<{
  sessionTokenDigest: string;
  environment: ProgramEnvironment;
  identityEvidenceId: string;
  identityBundleSha256: string;
  contributionEvidenceId: string;
  contributionBundleSha256: string;
}>;

export const PROTECTED_CONTENT_MUTATION_OPERATIONS = [
  "resource_draft_save",
  "resource_review_record",
  "resource_publish",
  "resource_withdraw",
  "resource_republish",
] as const;

export type ProtectedContentMutationOperation =
  (typeof PROTECTED_CONTENT_MUTATION_OPERATIONS)[number];

export type ProtectedMutationContextFactory = (
  sessionToken: string,
  operation: ProtectedContentMutationOperation,
) => ProtectedMutationContext;

export class ProtectedMutationFeatureUnavailableError extends Error {
  constructor() {
    super("Protected contribution is not available in this environment.");
    this.name = "ProtectedMutationFeatureUnavailableError";
  }
}

export class ProtectedMutationSessionError extends Error {
  constructor() {
    super("A current named program session is required.");
    this.name = "ProtectedMutationSessionError";
  }
}

export class ProtectedMutationAuthorizationError extends Error {
  constructor() {
    super("The named session no longer has authority for this action.");
    this.name = "ProtectedMutationAuthorizationError";
  }
}

/**
 * Builds server-held evidence immediately before a protected write. Callers
 * provide only the opaque browser session; feature evidence is never accepted
 * from a request body or query string.
 */
export function protectedMutationContextFromSessionToken(
  sessionToken: string,
  operation: ProtectedContentMutationOperation,
  environment: NodeJS.ProcessEnv = process.env,
): ProtectedMutationContext {
  let sessionTokenDigest: string;
  try {
    sessionTokenDigest = digestProgramBearerToken("session", sessionToken);
  } catch {
    throw new ProtectedMutationSessionError();
  }

  const identity = protectedFeatureActivation("protected_identity", environment);
  const contribution = protectedFeatureActivation(
    "protected_contribution",
    environment,
    undefined,
    operation === "resource_withdraw"
      ? "exposure_reduction"
      : "ordinary",
  );
  if (!identity.active
    || !contribution.active
    || identity.environment !== contribution.environment) {
    throw new ProtectedMutationFeatureUnavailableError();
  }

  return Object.freeze({
    sessionTokenDigest,
    environment: identity.environment,
    identityEvidenceId: identity.evidenceId,
    identityBundleSha256: identity.bundleSha256,
    contributionEvidenceId: contribution.evidenceId,
    contributionBundleSha256: contribution.bundleSha256,
  });
}

export function protectedMutationParameters(
  context: ProtectedMutationContext,
  scope: "one-dhs" | "dsd",
  operation: ProtectedContentMutationOperation,
  targetId: string,
  payload: Record<string, unknown>,
): readonly unknown[] {
  return [
    context.sessionTokenDigest,
    context.environment,
    context.identityEvidenceId,
    context.identityBundleSha256,
    context.contributionEvidenceId,
    context.contributionBundleSha256,
    scope,
    operation,
    targetId,
    payload,
  ];
}
