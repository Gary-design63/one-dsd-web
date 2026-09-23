import { CORPUS } from "./corpus";
import { DOMAIN_CORPUS } from "./corpus-domains";
import type { ContentItem } from "./types";

/** Approved static collections; keep the frozen 25-resource seed source intact. */
export function staffCorpus(): ContentItem[] {
  return [...CORPUS, ...DOMAIN_CORPUS].filter(item => item.status === "approved");
}

/** Lookup across both approved collections; publication checks remain with the staff reader. */
export function getContent(id: string): ContentItem | undefined {
  return staffCorpus().find(item => item.id === id);
}
