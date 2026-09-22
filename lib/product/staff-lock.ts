import { NextResponse } from "next/server";

/**
 * HARD PRODUCT LOCK — Gary, September 2026.
 *
 * Staff surfaces are browse + download only. This supersedes the typed Ask-as-swarm
 * experiment and any sentiment-on-input work for staff.
 *
 * In:
 *   - Browse published topics, paths, library items, and framework pages
 *   - Download receipts, PDFs, checklists, and other KB files
 *
 * Out for staff:
 *   - Ask typing / free-text fields that submit staff content
 *   - Server persistence of staff input
 *   - Practice fill-and-save
 *   - My Work uploads
 *   - Staff consult intake forms
 *
 * F-01 / F-02 stay: staff writes fail closed. Same-origin is not authorization.
 * Owner and consultant typed tools remain on their own authenticated routes.
 * `ownerFromRequest` / `ownerFromCookies` require a live, unrevoked owner session.
 */
export const STAFF_SURFACE_WRITES_CLOSED = true;

export const STAFF_WRITE_CLOSED_CODE = "staff_browse_download_only";

export const STAFF_WRITE_CLOSED_MESSAGE =
  "Staff pages are browse and download only. This program does not accept typed questions, saved notes, uploads, or consultation forms from staff.";

export function staffWritesAllowed(): boolean {
  return !STAFF_SURFACE_WRITES_CLOSED;
}

/** Fail-closed 403 for every staff mutation. Do not read or store the request body. */
export function staffWriteClosedResponse(): NextResponse {
  return NextResponse.json(
    { error: STAFF_WRITE_CLOSED_MESSAGE, code: STAFF_WRITE_CLOSED_CODE },
    { status: 403, headers: { "cache-control": "no-store" } },
  );
}
