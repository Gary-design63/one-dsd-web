import "server-only";

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { contributorPublicationStopped } from "./protected-feature-activation";
import { protectedFeatureActivation } from "./protected-feature-activation";
import {
  PROGRAM_SESSION_COOKIE,
  programIdentityStore,
  type ProgramIdentity,
  type ProgramRole,
  type ProgramScope,
} from "./program-identity";

function ownerGrant(identity: ProgramIdentity): boolean {
  return identity.grants.some((grant) =>
    grant.role === "owner"
    && grant.scopeId === "one-dhs-pac"
    && (grant.expiresAt === null || Date.parse(grant.expiresAt) > Date.now()));
}

/**
 * The identity store could not answer. This is different from "no valid
 * session": callers must answer 503 (temporarily unavailable), never 401.
 */
export class ProgramIdentityUnavailableError extends Error {
  readonly status = 503;
  constructor() {
    super("Program sign-in is temporarily unavailable. Please try again in a few minutes.");
    this.name = "ProgramIdentityUnavailableError";
  }
}

/** Log-safe summary: error name and driver code only, never the message (it can carry hosts). */
function failureSummary(error: unknown): string {
  if (!(error instanceof Error)) return "Unknown error";
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? `${error.name} (${code})` : error.name;
}

export async function programIdentityFromToken(token: string | null | undefined): Promise<ProgramIdentity | null> {
  if (!protectedFeatureActivation("protected_identity").active) return null;
  try {
    return await programIdentityStore().readSession(token);
  } catch (error) {
    console.error("Program identity lookup failed; answering temporarily unavailable, not sign-in.", failureSummary(error));
    throw new ProgramIdentityUnavailableError();
  }
}

export async function programIdentityFromCookies(): Promise<ProgramIdentity | null> {
  const store = await cookies();
  return programIdentityFromToken(store.get(PROGRAM_SESSION_COOKIE)?.value);
}

export async function programIdentityFromRequest(request: NextRequest): Promise<ProgramIdentity | null> {
  return programIdentityFromToken(request.cookies.get(PROGRAM_SESSION_COOKIE)?.value);
}

export async function programOwnerFromCookies(): Promise<ProgramIdentity | null> {
  const identity = await programIdentityFromCookies();
  return identity && ownerGrant(identity) ? identity : null;
}

export async function programOwnerFromRequest(request: NextRequest): Promise<ProgramIdentity | null> {
  const identity = await programIdentityFromRequest(request);
  return identity && ownerGrant(identity) ? identity : null;
}

export type ProgramMutationPrincipal = Readonly<{
  identity: ProgramIdentity;
  sessionToken: string;
}>;

export async function programMutationPrincipalFromRequest(
  request: NextRequest,
  scope: ProgramScope,
  role: ProgramRole,
): Promise<ProgramMutationPrincipal | null> {
  const sessionToken = request.cookies.get(PROGRAM_SESSION_COOKIE)?.value;
  if (!sessionToken) return null;
  const identity = await programIdentityFromToken(sessionToken);
  if (!identity || !programIdentityHasRole(identity, scope, role)) return null;
  return Object.freeze({ identity, sessionToken });
}

export async function programMutationPrincipalFromCookies(
  scope: ProgramScope,
  role: ProgramRole,
): Promise<ProgramMutationPrincipal | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(PROGRAM_SESSION_COOKIE)?.value;
  if (!sessionToken) return null;
  const identity = await programIdentityFromToken(sessionToken);
  if (!identity || !programIdentityHasRole(identity, scope, role)) return null;
  return Object.freeze({ identity, sessionToken });
}

const PARENT_SCOPE: Partial<Record<ProgramScope, ProgramScope>> = {
  "one-dhs": "one-dhs-pac",
  adsa: "one-dhs",
  dsd: "adsa",
  "one-dsd-team": "dsd",
};

export function programIdentityHasRole(
  identity: ProgramIdentity,
  scope: ProgramScope,
  role: ProgramIdentity["grants"][number]["role"],
): boolean {
  let current: ProgramScope | undefined = scope;
  while (current) {
    const match = identity.grants.some((grant) =>
      grant.scopeId === current
      && grant.role === role
      && (grant.expiresAt === null || Date.parse(grant.expiresAt) > Date.now()));
    if (match) return true;
    current = PARENT_SCOPE[current];
  }
  return false;
}

export type ProgramContributionAccess = Readonly<{
  identity: ProgramIdentity | null;
  ordinaryActive: boolean;
  containmentActive: boolean;
  canReadWorkingContent: boolean;
  canDraft: boolean;
  canReview: boolean;
  canPublish: boolean;
  canWithdraw: boolean;
}>;

/**
 * Resolve named contribution capabilities without reading a session or any
 * working content until the applicable committed feature boundary is active.
 * Exposure-reducing withdrawal remains reachable during an operational stop.
 */
export async function programContributionAccessFromCookies(
  scope: Extract<ProgramScope, "one-dhs" | "dsd">,
): Promise<ProgramContributionAccess> {
  const ordinary = protectedFeatureActivation("protected_contribution");
  const containment = ordinary.active
    ? ordinary
    : protectedFeatureActivation("protected_contribution", process.env, undefined, "exposure_reduction");
  if (!ordinary.active && !containment.active) {
    return Object.freeze({
      identity: null,
      ordinaryActive: false,
      containmentActive: false,
      canReadWorkingContent: false,
      canDraft: false,
      canReview: false,
      canPublish: false,
      canWithdraw: false,
    });
  }

  const identity = await programIdentityFromCookies();
  if (!identity) {
    return Object.freeze({
      identity: null,
      ordinaryActive: ordinary.active,
      containmentActive: containment.active,
      canReadWorkingContent: false,
      canDraft: false,
      canReview: false,
      canPublish: false,
      canWithdraw: false,
    });
  }

  const contributor = programIdentityHasRole(identity, scope, "content_contributor");
  const steward = programIdentityHasRole(identity, scope, "program_steward");
  const approver = programIdentityHasRole(identity, scope, "publishing_approver");
  const publicationAvailable = ordinary.active && !contributorPublicationStopped();
  const canDraft = ordinary.active && contributor;
  const canReview = ordinary.active && steward;
  const canPublish = publicationAvailable && approver;
  const canWithdraw = containment.active && approver;

  return Object.freeze({
    identity,
    ordinaryActive: ordinary.active,
    containmentActive: containment.active,
    canReadWorkingContent: canDraft || canReview || canPublish || canWithdraw,
    canDraft,
    canReview,
    canPublish,
    canWithdraw,
  });
}
