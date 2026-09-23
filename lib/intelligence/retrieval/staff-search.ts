import { citationEvidenceFromDocs } from "./evidence";
import "server-only";

import {
  loadStaffContentSnapshot,
  type StaffProgramScope,
} from "@/lib/content/staff-publications";
import {
  docsFromStaffContent,
  searchDocs,

  type Citation,
  type Doc,
  type SearchHit,
  type SearchOptions,
} from "./search";
import type { AskIntent } from "@/lib/content/types";

export async function indexedStaffDocs(scope?: StaffProgramScope): Promise<Doc[]> {
  return docsFromStaffContent(await loadStaffContentSnapshot({ scope }));
}

export async function corpusSearchAsync(
  query: string,
  options: SearchOptions = {},
  scope?: StaffProgramScope,
): Promise<SearchHit[]> {
  return searchDocs(query, await indexedStaffDocs(scope), options);
}

export async function semanticRetrieveAsync(
  query: string,
  intents: AskIntent[],
  limit = 5,
  scope?: StaffProgramScope,
): Promise<SearchHit[]> {
  const { localSemanticRetrieve } = await import("./local-semantic"); return localSemanticRetrieve(query, intents, await indexedStaffDocs(scope), limit);
}

export async function citationAttachAsync(hits: SearchHit[], scope?: StaffProgramScope): Promise<Citation[]> {
  return citationEvidenceFromDocs(hits, await indexedStaffDocs(scope));
}

