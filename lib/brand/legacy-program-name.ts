import { PROGRAM } from "@/lib/constants";
import type { HomePageCopy } from "@/lib/content/page-copy-contract";

/** Keep an older published name from overriding the owner's current program name. */
export function displayProgramName(value: string): string {
  return value
    .replaceAll(`${PROGRAM.staffBrand} Program`, PROGRAM.staffBrand)
    .replaceAll(`${PROGRAM.oneDsdProgramName} Program`, PROGRAM.oneDsdProgramName);
}

/** The original published home block split its name across three lines. */
export function displayLegacyHomeCopy(copy: HomePageCopy): HomePageCopy {
  const heroKicker = displayProgramName(copy.heroKicker);
  if (
    copy.headlineLine1 === "One DHS People," &&
    copy.headlineLine2 === "Access and Culture" &&
    copy.headlineLine3 === "Program"
  ) {
    return { ...copy, heroKicker, headlineLine3: "" };
  }
  return heroKicker === copy.heroKicker ? copy : { ...copy, heroKicker };
}
