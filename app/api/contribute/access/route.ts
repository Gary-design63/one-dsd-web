import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { ProgramAccessActionSchema, type ProgramAccessAction } from "@/lib/auth/program-access-contract";
import { programSessionCookieOptions } from "@/lib/auth/program-cookie";
import { PROGRAM_SESSION_COOKIE, programIdentityStore } from "@/lib/auth/program-identity";
import { protectedFeatureActivation } from "@/lib/auth/protected-feature-activation";
import { programMutationPrincipalFromRequest } from "@/lib/auth/program-request";
import { readBoundedJson } from "@/lib/http/request";

const NO_STORE = { "cache-control": "no-store" } as const;

function response(body: Record<string, unknown>, status = 200, clearSession = false) {
  const result = NextResponse.json(body, { status, headers: NO_STORE });
  if (clearSession) {
    result.cookies.set(PROGRAM_SESSION_COOKIE, "", programSessionCookieOptions(0));
  }
  return result;
}

function futureIso(amount: number, unit: "hours" | "days"): string {
  const milliseconds = amount * (unit === "hours" ? 60 * 60 * 1_000 : 24 * 60 * 60 * 1_000);
  return new Date(Date.now() + milliseconds).toISOString();
}

function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("code" in error)) return undefined;
  return typeof error.code === "string" ? error.code : undefined;
}

function failedAction(error: unknown) {
  const code = errorCode(error);
  if (code === "PAI01") {
    return response({ error: "Your named program session ended. Sign in again before continuing." }, 401, true);
  }
  if (code === "PAA01" || code === "42501") {
    return response({ error: "Your account cannot complete that access change." }, 403);
  }
  if (code === "PAF01") {
    return response({ error: "People and access changes are paused right now." }, 503);
  }
  if (code === "23505" || code === "40001") {
    return response({ error: "Access changed while you were working. Reload this page and try again." }, 409);
  }
  if (code === "22023") {
    return response({ error: "Check the access information and try again." }, 400);
  }
  if (code === "P0002") {
    return response({ error: "That account or invitation is no longer available." }, 404);
  }
  console.error("Named program access action failed.", error instanceof Error ? error.name : "Unknown error");
  return response({ error: "That access change could not be completed right now." }, 503);
}

async function applyAction(action: ProgramAccessAction, sessionToken: string, currentAccountId: string) {
  const store = programIdentityStore();
  if (action.action === "invite_account") {
    const receipt = await store.inviteAccount(sessionToken, {
      signInId: action.signInId,
      displayName: action.displayName,
      expiresAt: futureIso(action.expiresInHours, "hours"),
    });
    return response({
      ok: true,
      message: "Invitation created. Copy the one-time code now.",
      oneTimeCode: receipt.token,
      invitationId: receipt.invitationId,
      expiresAt: receipt.expiresAt,
    });
  }
  if (action.action === "invite_credential_reset") {
    const receipt = await store.inviteCredentialReset(sessionToken, {
      accountId: action.accountId,
      expiresAt: futureIso(action.expiresInHours, "hours"),
    });
    return response({
      ok: true,
      message: "Reset invitation created. Copy the one-time code now.",
      oneTimeCode: receipt.token,
      invitationId: receipt.invitationId,
      expiresAt: receipt.expiresAt,
    });
  }
  if (action.action === "issue_grant") {
    await store.issueGrant(sessionToken, {
      accountId: action.accountId,
      scopeId: action.scopeId,
      role: action.role,
      expiresAt: action.expiresInDays === null ? null : futureIso(action.expiresInDays, "days"),
      reason: action.reason,
    });
    return response({ ok: true, message: "Permission added." });
  }
  if (action.action === "revoke_grant") {
    await store.revokeGrant(sessionToken, action.grantId, action.reason);
    return response({ ok: true, message: "Permission removed." });
  }
  if (action.action === "revoke_invitation") {
    await store.revokeInvitation(sessionToken, action.invitationId, action.reason);
    return response({ ok: true, message: "The one-time invitation was closed." });
  }
  if (action.action === "change_account_state") {
    if (action.accountId === currentAccountId) {
      return response({ error: "The current program owner cannot change their own account access here." }, 400);
    }
    const target = await store.accountAccessTarget(sessionToken, action.accountId);
    if (!target) {
      return response({ error: "That account is not available in this program environment." }, 400);
    }
    if (target.state === "revoked") {
      return response({ error: "Access for that account ended permanently and cannot be restored or changed." }, 400);
    }
    if (target.state === action.state) {
      return response({ error: `That account is already ${action.state}.` }, 400);
    }
    if (action.state === "revoked") {
      if (target.signInId !== action.confirmSignInId) {
        return response({ error: "Enter that person's exact sign-in ID before ending access permanently." }, 400);
      }
    }
    await store.changeAccountState(
      sessionToken,
      action.accountId,
      action.state,
      action.reason,
      action.confirmSignInId ?? null,
    );
    const message = action.state === "active"
      ? "Account access restored. The person must sign in again."
      : action.state === "suspended"
        ? "Account access paused and current sessions ended."
        : "Account access ended, current sessions closed, and the credential verifier was removed.";
    return response({ ok: true, message });
  }
  if (action.action === "correct_account_identity") {
    const target = await store.accountAccessTarget(sessionToken, action.accountId);
    if (!target
      || target.identityVersion !== action.expectedIdentityVersion
      || target.signInId !== action.confirmCurrentSignInId) {
      return response({ error: "Those account details changed. Reload this page and try again." }, 409);
    }
    if (target.signInId === action.signInId && target.displayName === action.displayName) {
      return response({ error: "Change the sign-in ID or display name before saving." }, 400);
    }
    await store.correctAccountIdentity(sessionToken, {
      accountId: action.accountId,
      expectedIdentityVersion: action.expectedIdentityVersion,
      currentSignInId: action.confirmCurrentSignInId,
      signInId: action.signInId,
      displayName: action.displayName,
      reason: action.reason,
    });
    const currentSessionEnded = action.accountId === currentAccountId;
    return response({
      ok: true,
      currentSessionEnded,
      message: currentSessionEnded
        ? "Your sign-in details were corrected. Sign in again with the corrected ID."
        : "Sign-in details corrected. That person's current sessions and reset codes ended.",
    }, 200, currentSessionEnded);
  }

  const successor = await store.accountAccessTarget(sessionToken, action.successorAccountId);
  if (!successor
    || successor.accountId === currentAccountId
    || successor.state !== "active"
    || successor.identityVersion !== action.expectedIdentityVersion
    || successor.signInId !== action.confirmSignInId) {
    return response({ error: "Choose the current active successor and enter that person's exact sign-in ID." }, 400);
  }
  await store.transferOwner(
    sessionToken,
    successor.accountId,
    action.expectedIdentityVersion,
    action.confirmSignInId,
    action.reason,
  );
  return response({
    ok: true,
    transferred: true,
    message: "Program ownership transferred. Both people were signed out and the successor must sign in again.",
  }, 200, true);
}

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) {
    return response({ error: "Open People and access from the program before making changes." }, 403);
  }
  if (!protectedFeatureActivation("protected_identity").active) {
    return response({ error: "People and access is not active." }, 503);
  }
  const principal = await programMutationPrincipalFromRequest(request, "one-dhs-pac", "owner");
  if (!principal) {
    return response({ error: "Sign in with the named program-owner account to manage access." }, 401);
  }

  const body = await readBoundedJson(request, 8_192);
  if (!body.ok) return response({ error: body.message }, body.status);
  const parsed = ProgramAccessActionSchema.safeParse(body.value);
  if (!parsed.success) {
    return response({ error: "Check the access information and try again." }, 400);
  }

  try {
    return await applyAction(parsed.data, principal.sessionToken, principal.identity.accountId);
  } catch (error) {
    return failedAction(error);
  }
}
