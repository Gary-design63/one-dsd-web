import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { programSessionCookieOptions } from "@/lib/auth/program-cookie";
import { protectedFeatureActivation } from "@/lib/auth/protected-feature-activation";
import { PROGRAM_SESSION_COOKIE, programIdentityStore } from "@/lib/auth/program-identity";
import {
  PassphrasePolicyError,
  ProgramCredentialCapacityError,
  withProgramCredentialWork,
} from "@/lib/auth/program-credentials";
import { readBoundedFormUrlEncoded } from "@/lib/http/request";
import {
  consumePseudonymousLimit,
  consumeRequestLimit,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";

const NO_STORE = { "cache-control": "no-store" };

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json(
      { error: "Open the invitation page before continuing." },
      { status: 403, headers: NO_STORE },
    );
  }
  if (!protectedFeatureActivation("protected_identity").active) {
    return NextResponse.json(
      { error: "Contributor invitations are not being accepted yet." },
      { status: 503, headers: NO_STORE },
    );
  }

  let limit;
  try {
    limit = await consumeRequestLimit(request, {
      scope: "program-invitation-network",
      limit: 20,
      windowSeconds: 15 * 60,
    });
  } catch {
    return NextResponse.json(
      { error: "Invitation acceptance is not available just now." },
      { status: 503, headers: NO_STORE },
    );
  }
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Please wait before trying the invitation again." },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  const form = await readBoundedFormUrlEncoded(request, 4_096);
  if (!form.ok) {
    return NextResponse.json(
      { error: form.status === 413 ? "That invitation request is too large." : "Open the invitation page before continuing." },
      { status: form.status, headers: NO_STORE },
    );
  }
  if (form.value.getAll("invitationCode").length !== 1
    || form.value.getAll("passphrase").length !== 1
    || form.value.getAll("confirmPassphrase").length !== 1) {
    return NextResponse.json(
      { error: "Enter the invitation code and passphrase." },
      { status: 400, headers: NO_STORE },
    );
  }
  const suppliedInvitationCode = form.value.get("invitationCode") ?? "";
  const codeSubject = suppliedInvitationCode.length <= 128
    ? suppliedInvitationCode || "invalid-invitation"
    : "invalid-invitation";
  let codeLimit;
  try {
    codeLimit = await consumePseudonymousLimit(codeSubject, {
      scope: "program-invitation-code",
      limit: 10,
      windowSeconds: 15 * 60,
    });
  } catch {
    return NextResponse.json(
      { error: "Invitation acceptance is not available just now." },
      { status: 503, headers: NO_STORE },
    );
  }
  if (!codeLimit.allowed) {
    return NextResponse.json(
      { error: "Please wait before trying the invitation again." },
      { status: 429, headers: rateLimitHeaders(codeLimit) },
    );
  }
  const passphrase = form.value.get("passphrase") ?? "";
  if (passphrase !== (form.value.get("confirmPassphrase") ?? "")) {
    return NextResponse.json(
      { error: "The two passphrase entries do not match." },
      { status: 422, headers: NO_STORE },
    );
  }

  try {
    const accepted = await withProgramCredentialWork(() => programIdentityStore().acceptInvitation(
      suppliedInvitationCode,
      passphrase,
    ));
    const response = NextResponse.redirect(new URL("/contribute", request.url), {
      status: 303,
      headers: NO_STORE,
    });
    response.cookies.set(PROGRAM_SESSION_COOKIE, accepted.token, programSessionCookieOptions());
    return response;
  } catch (error) {
    if (error instanceof ProgramCredentialCapacityError) {
      return NextResponse.json(
        { error: "Invitation acceptance is busy. Wait a moment and try again." },
        { status: 503, headers: NO_STORE },
      );
    }
    if (error instanceof PassphrasePolicyError) {
      return NextResponse.json(
        { error: "Use a passphrase of 15 to 128 characters that is not an obvious repeated pattern." },
        { status: 422, headers: NO_STORE },
      );
    }
    const destination = new URL("/contribute/accept", request.url);
    destination.searchParams.set("denied", "1");
    return NextResponse.redirect(destination, { status: 303, headers: NO_STORE });
  }
}
