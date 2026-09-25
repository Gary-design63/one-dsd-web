import { describe, expect, it } from "vitest";
import { displayLegacyHomeCopy, displayProgramName } from "@/lib/brand/legacy-program-name";
import { STATIC_HOME_COPY } from "@/lib/content/page-copy-contract";

describe("older published program names", () => {
  it("shows the approved name in a legacy header or footer without changing other wording", () => {
    expect(displayProgramName("One DHS People, Access and Culture Program"))
      .toBe("One DHS People, Access and Culture");
    expect(displayProgramName("One DSD People, Access and Culture Program"))
      .toBe("One DSD People, Access and Culture");
    expect(displayProgramName("About the program and its services"))
      .toBe("About the program and its services");
  });

  it("removes the old third headline line while preserving the rest of the published page", () => {
    const published = {
      ...STATIC_HOME_COPY,
      heroKicker: "One DHS People, Access and Culture Program",
      headlineLine3: "Program",
      heroLede: "Custom published introduction.",
    };
    const shown = displayLegacyHomeCopy(published);
    expect(shown.headlineLine3).toBe("");
    expect(shown.heroKicker).toBe("One DHS People, Access and Culture");
    expect(shown.heroLede).toBe("Custom published introduction.");
    expect(published.headlineLine3).toBe("Program");
  });

  it("preserves a different owner-authored heading", () => {
    const custom = { ...STATIC_HOME_COPY, headlineLine1: "A different title,", headlineLine3: "Program" };
    expect(displayLegacyHomeCopy(custom)).toBe(custom);
  });
});
