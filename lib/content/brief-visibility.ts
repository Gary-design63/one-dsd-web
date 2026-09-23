import type { CommunityBrief } from "@/lib/content/briefs";

/**
 * One visibility decision for pages, browse, search, Ask, and citations.
 * A content owner's approval to ingest a source is intentionally separate from
 * permission to place a reviewed brief in front of staff. The pure check below
 * identifies material that has cleared the staff-release boundary.
 */
export function briefReleasedToStaff(brief: CommunityBrief): boolean {
  return brief.status === "approved" || brief.status === "gated";
}

/** Staff projections never include held drafts. A future protected review view must use a separate owner-only reader. */
export function briefVisibleToStaff(brief: CommunityBrief): boolean {
  return briefReleasedToStaff(brief);
}

export function briefVisibilityKey(): string {
  return "released";
}
