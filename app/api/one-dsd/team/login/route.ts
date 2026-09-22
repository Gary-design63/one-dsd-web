import { NextResponse } from "next/server";

/**
 * Retired endpoint. The One DSD Team workspace opens without a team key
 * (owner decision, Sept 9, 2026), so there is nothing to sign in to. Every
 * call answers 410 Gone with the open workspace address and leaves one log
 * line so a stray caller is visible instead of failing silently.
 */
const WORKSPACE = "/one-dsd/team/workspace";
const NO_STORE = { "cache-control": "no-store" };

function retired(method: string) {
  console.warn(`Retired endpoint called: ${method} /api/one-dsd/team/login. The One DSD Team workspace no longer uses a team key; use ${WORKSPACE}.`);
  return NextResponse.json(
    {
      error: `Team key sign-in has been retired. The One DSD Team workspace is open without a key at ${WORKSPACE}.`,
      workspace: WORKSPACE,
    },
    { status: 410, headers: NO_STORE },
  );
}

export function GET() {
  return retired("GET");
}

export function POST() {
  return retired("POST");
}
