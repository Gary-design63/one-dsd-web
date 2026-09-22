import "server-only";
import type { StaffProgramScope } from "@/lib/content/staff-publications";
import type { DownloadKind } from "./catalog";
import type { ResourceDocument } from "./model";

/** Fixed ids for the resources that exist once in the program. */
export const SINGLETON_IDS = {
  team: "one-dsd",
  leadership: "one-dsd",
  "equity-toolkit": "companion",
  "community-connections": "home",
  "learning-journey": "intercultural",
  measurement: "worksheet",
  sources: "register",
  "equity-framework": "framework",
  "operationalizing-equity": "program",
  "understanding-dhs": "reference",
  "support-directory": "dhs",
} as const;

export const TOOLKIT_STUDIO_IDS = ["insights-checklist", "one-pager", "blank-worksheet", "guardrails"] as const;

type AdapterLoader = () => Promise<ResourceDocument | null>;

/**
 * Load only the adapter for this kind. Eager imports previously pulled the full
 * content graph (and the client editor) into the download serverless function.
 */
async function adapterFor(kind: DownloadKind, id: string, scope: StaffProgramScope): Promise<AdapterLoader> {
  const singleton = (expected: string) => id === expected;
  switch (kind) {
    case "library":
      return async () => (await import("./adapters/library")).libraryDocument(id, scope);
    case "scenario":
      return async () => (await import("./adapters/one-dsd")).scenarioDocument(id);
    case "program":
      return async () => (await import("./adapters/one-dsd")).programDocument(id);
    case "amplify":
      return async () => (await import("./adapters/one-dsd")).amplifyDocument(id);
    case "brief":
      return async () => (await import("./adapters/community")).briefDocument(id, scope);
    case "path":
      return async () => (await import("./adapters/practice")).pathDocument(id, scope);
    case "area":
      return async () => (await import("./adapters/program")).areaDocument(id, scope);
    case "team":
      return async () => (singleton(SINGLETON_IDS.team) ? (await import("./adapters/one-dsd")).teamDocument() : null);
    case "leadership":
      return async () => (singleton(SINGLETON_IDS.leadership) ? (await import("./adapters/one-dsd")).leadershipDocument() : null);
    case "equity-toolkit":
      return async () => (singleton(SINGLETON_IDS["equity-toolkit"]) ? (await import("./adapters/learning")).equityToolkitDocument(scope) : null);
    case "community-connections":
      return async () => (singleton(SINGLETON_IDS["community-connections"]) ? (await import("./adapters/learning")).communityConnectionsDocument(scope) : null);
    case "learning-journey":
      return async () => (singleton(SINGLETON_IDS["learning-journey"]) ? (await import("./adapters/learning")).learningJourneyDocument(scope) : null);
    case "measurement":
      return async () => (singleton(SINGLETON_IDS.measurement) ? (await import("./adapters/practice")).measurementDocument(scope) : null);
    case "sources":
      return async () => (singleton(SINGLETON_IDS.sources) ? (await import("./adapters/learning")).sourcesDocument(scope) : null);
    case "equity-framework":
      return async () => (singleton(SINGLETON_IDS["equity-framework"]) ? (await import("./adapters/program")).equityFrameworkDocument(scope) : null);
    case "operationalizing-equity":
      return async () => (singleton(SINGLETON_IDS["operationalizing-equity"]) ? (await import("./adapters/program")).operationalizingEquityDocument(scope) : null);
    case "understanding-dhs":
      return async () => (singleton(SINGLETON_IDS["understanding-dhs"]) ? (await import("./adapters/program")).understandingDhsDocument(scope) : null);
    case "support-directory":
      return async () => (singleton(SINGLETON_IDS["support-directory"]) ? (await import("./adapters/program")).supportDirectoryDocument(scope) : null);
    case "toolkit-studio":
      return async () => (await import("./adapters/toolkit-studio")).toolkitStudioDocument(id, scope);
  }
}

export async function resolveDownloadDocument(kind: DownloadKind, id: string, scope: StaffProgramScope): Promise<ResourceDocument | null> {
  const load = await adapterFor(kind, id, scope);
  return load();
}
