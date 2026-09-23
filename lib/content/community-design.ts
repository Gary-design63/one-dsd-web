import "server-only";
import recovered from "./community-design-data.json";
import { BRIEFS } from "./briefs";
import { orderCommunities } from "./community-presentation";

// Owner-approved release, September 6, 2026. Presentation is shared across
// environments; actual content still requires its published editable surface.
export function communityDesignEnabled() {
  return true;
}

export function communityDesignEntries() {
  const entries = recovered.map(({ id, title }) => ({ id, title }));
  return orderCommunities([...entries, ...BRIEFS.filter(b => !entries.some(e => e.id === b.id)).map(({ id, title }) => ({ id, title }))]);
}

export function communityReading(id: string) {
  return recovered.find(brief => brief.id === id);
}
