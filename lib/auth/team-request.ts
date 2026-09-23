import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { TEAM_COOKIE, isTeamSession } from "./team";
import { ownerFromCookies, ownerFromRequest } from "./request";

/** Server component helper: a team member holding the shared key, or the consultant. */
export async function teamMemberFromCookies(): Promise<boolean> {
  const store = await cookies();
  if (isTeamSession(store.get(TEAM_COOKIE)?.value)) return true;
  return ownerFromCookies();
}

/** Route handler helper. */
export async function teamMemberFromRequest(request: NextRequest): Promise<boolean> {
  if (isTeamSession(request.cookies.get(TEAM_COOKIE)?.value)) return true;
  return ownerFromRequest(request);
}
