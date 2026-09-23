import { NextResponse, type NextRequest } from "next/server";

const NO_STORE = { "cache-control": "private, no-store", "x-content-type-options": "nosniff" };
function removed() {
  return NextResponse.json({ error: "This authoring integration has been removed from the program." }, { status: 410, headers: NO_STORE });
}
/** Legacy URLs terminate here without authentication, body parsing, file discovery or execution. */
export function isLocalStudioRequest(request: NextRequest): boolean { void request; return false; }
export async function handleStudioGet(request: NextRequest) { void request; return removed(); }
export async function handleStudioPost(request: NextRequest) { void request; return removed(); }
export async function handleStudioAssetGet(request: NextRequest, id: string, kind: string) {
  void request; void id; void kind; return removed();
}
