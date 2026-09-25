import type { CoursePack } from "./source-types";

const BENNETT_WIKIPEDIA_URL = "https://en.wikipedia.org/wiki/Milton_J._Bennett";
const BENNETT_PRIMARY_URL = "https://www.idrinstitute.org/resources/chapters-on-dmis/";

function wikipediaUrl(value: string): boolean {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return host === "wikipedia.org" || host.endsWith(".wikipedia.org");
  } catch {
    return false;
  }
}

function displayText(value: string): string {
  return value
    .replaceAll("Wikipedia lines were not allowed to be the voice.", "Claims in the brief should be grounded in cited evidence.")
    .replaceAll(
      "Community and media estimates have been cited near 20,000 Karen in Minnesota (including Wikipedia-style round numbers and local news). Date them as estimates. They are not Compass.",
      "Community estimates vary and should not be treated as a Minnesota Compass count. Verify the source and date before using a figure.",
    )
    // Historical publications can contain other unsourced encyclopedia links.
    // Remove the address without changing the surrounding lesson claim.
    .replace(/https?:\/\/(?:[a-z0-9-]+\.)*wikipedia\.org\/[^\s"'<>]*/gi, "")
    .replace(/\bWikipedia-style\b/gi, "uncited")
    .replace(/\bWikipedia\b/gi, "an uncited source");
}

function displayCopy(value: unknown): unknown {
  if (typeof value === "string") return displayText(value);
  if (Array.isArray(value)) return value.map(displayCopy);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, displayCopy(child)]));
  }
  return value;
}

/** Presentation-only cleanup for old course publications; the stored record is unchanged. */
export function coursePackWithoutWikipedia(pack: CoursePack): CoursePack {
  const sources = pack.sources.flatMap(source => {
    if (source.href === BENNETT_WIKIPEDIA_URL) {
      return [{ ...source, title: displayText(source.title), href: BENNETT_PRIMARY_URL, note: displayText(source.note) }];
    }
    if (wikipediaUrl(source.href)) return [];
    return [{ ...source, title: displayText(source.title), note: displayText(source.note) }];
  });
  return {
    course: displayCopy(pack.course) as CoursePack["course"],
    jobAid: displayCopy(pack.jobAid) as CoursePack["jobAid"],
    sources,
  };
}
