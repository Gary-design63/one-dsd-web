import type { GraduationPath } from "./paths";

/** Staff practice paths are published reading and downloads, not writable worksheets. */
export const PUBLISHED_PATH_STORAGE_NOTICE =
  "This page does not save your answers or progress. Notes saved through an earlier version may still be in this browser's site data; this page does not show or delete them.";

export const PUBLISHED_PATH_DOWNLOAD_NOTICE =
  "Use the downloaded checklist to write your answers in a tool you normally use. This page does not save them.";

export const PUBLISHED_PATH_FILE_NOTICE =
  "This is a blank published checklist. If you complete a downloaded copy, store and share that file according to DHS requirements. Nothing you write in that file is saved back to this page.";

const SAVED_HERE_CLAIM = /\b(?:sav(?:e|ed|es|ing)|stor(?:e|ed|es|ing)|stay|stays|remain|remains|kept)\b[^.!?]{0,120}\b(?:browser|device|computer|here)\b|\b(?:this page|this path|here)\b[^.!?]{0,100}\b(?:sav(?:e|ed|es|ing)|stor(?:e|ed|es|ing))\b/i;

/** Remove inherited save claims after owner-published copy has been applied. */
export function withoutPublishedSaveClaims(value: string): string {
  return value
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !SAVED_HERE_CLAIM.test(sentence))
    .join(" ")
    .replace(/notes you can keep/gi, "a checklist you can download")
    .trim();
}

export function publishedPracticePath(path: GraduationPath): GraduationPath {
  return {
    ...path,
    startingCompetence: withoutPublishedSaveClaims(path.startingCompetence),
    graduatedLooksLike: withoutPublishedSaveClaims(path.graduatedLooksLike),
    steps: path.steps.map((step) => {
      const guidance = withoutPublishedSaveClaims(step.guidance);
      return {
        ...step,
        guidance: step.key === "artifact"
          ? `${guidance ? `${guidance} ` : ""}${PUBLISHED_PATH_DOWNLOAD_NOTICE}`
          : guidance,
      };
    }),
    privacy: `${withoutPublishedSaveClaims(path.privacy)} ${PUBLISHED_PATH_STORAGE_NOTICE}`.trim(),
  };
}
