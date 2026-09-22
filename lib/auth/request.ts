import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { OWNER_COOKIE } from "./owner";
import { ownerSessionIsActive } from "./owner-session";

export const EDITING_COOKIE = "pac_editing";

/** Server component helper. A live, unrevoked owner session is required. */
export async function ownerFromCookies(): Promise<boolean> {
  try {
    const store = await cookies();
    return ownerSessionIsActive(store.get(OWNER_COOKIE)?.value);
  } catch {
    return false;
  }
}

/** Route handler helper. A live, unrevoked owner session is required. */
export async function ownerFromRequest(request: NextRequest): Promise<boolean> {
  return ownerSessionIsActive(request.cookies.get(OWNER_COOKIE)?.value);
}

/**
 * Inline editing controls on staff pages appear only while the owner has turned editing on
 * from the Consultant Workspace. Staff never see them by default.
 */
export async function editingModeFromCookies(): Promise<boolean> {
  try {
    const store = await cookies();
    return store.get(EDITING_COOKIE)?.value === "on";
  } catch {
    return false;
  }
}
