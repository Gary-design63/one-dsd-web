import recovered from "./community-design-data.json";
import { COMMUNITY_EDITABLE_SURFACE_REVIEWS, defineEditableSurface, type EditableRichBlock, type EditableSurfaceDefinition, type EditableSurfaceFieldDefinition, type EditableSurfaceValues } from "./editable-surface-contract";

function plain(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/(^|\s)\*([^*]+)\*(?=\s|[.,;:]|$)/g, "$1$2").replace(/`([^`]+)`/g, "$1");
}

export function communityReadingBlocks(body: string): EditableRichBlock[] {
  const links: Array<{ label: string; href: string }> = [];
  const text = body.replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, (_, label, href) => {
    if (!links.some(link => link.href === href)) links.push({ label: plain(label), href });
    return label;
  });
  const blocks: EditableRichBlock[] = text.split(/\n\s*\n/).filter(p => p.trim()).map(part => {
    const heading = part.match(/^#{1,6}\s+(.+)$/);
    if (heading) return { type: "heading", level: 3, text: plain(heading[1]) };
    const lines = part.split("\n");
    if (lines.every(line => /^\s*[-*]\s+/.test(line))) return { type: "bullet-list", items: lines.map(line => plain(line.replace(/^\s*[-*]\s+/, ""))) };
    if (lines.every(line => /^\s*\d+[.)]\s+/.test(line))) return { type: "numbered-list", items: lines.map(line => plain(line.replace(/^\s*\d+[.)]\s+/, ""))) };
    return { type: "paragraph", text: plain(part) };
  });
  if (links.length) blocks.push({ type: "link-list", items: links });
  return blocks;
}

const definitions = new Map<string, EditableSurfaceDefinition>();

export function communityReadingSurfaceId(id: string) { return `community-reading.${id}`; }

export function getCommunityReadingSurface(surfaceId: string): EditableSurfaceDefinition | undefined {
  if (!surfaceId.startsWith("community-reading.")) return undefined;
  const existing = definitions.get(surfaceId);
  if (existing) return existing;
  const source = recovered.find(b => communityReadingSurfaceId(b.id) === surfaceId);
  if (!source) return undefined;
  const fields: EditableSurfaceFieldDefinition[] = [{ key: "title", label: "Community name", kind: "short", maxLength: 300 }];
  const values: EditableSurfaceValues = { title: source.title };
  source.sections.forEach((chapter, i) => {
    fields.push({ key: `chapter${i}Title`, label: `Reading ${i + 1}: title`, kind: "short", maxLength: 500, group: `Reading ${i + 1}` });
    fields.push({ key: `chapter${i}Body`, label: `Reading ${i + 1}: full text`, kind: "rich-blocks", maxItems: 500, maxLength: 100000, group: `Reading ${i + 1}` });
    const heading = chapter.heading.replace(/^\d+[.)]\s+/, "");
    values[`chapter${i}Title`] = /^How it hits DHS gates/.test(heading) ? "Connections to human services" : heading === "A Note on This Guide" ? "People, place, and perspective" : heading;
    values[`chapter${i}Body`] = communityReadingBlocks(chapter.body);
  });
  const definition = defineEditableSurface({
    surfaceId, route: `/minnesota-communities/${source.id}`, label: `${source.title} readings`, scopePolicy: "inheritable",
    protectedFields: ["sourceId", "sourceKind", "tribalGate"], reviewDimensions: COMMUNITY_EDITABLE_SURFACE_REVIEWS,
    fields, approvedValues: values,
  });
  definitions.set(surfaceId, definition);
  return definition;
}
