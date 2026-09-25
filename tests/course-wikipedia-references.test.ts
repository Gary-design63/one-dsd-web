import { expect, it } from "vitest";
import type { CoursePack } from "@/lib/content/courses/source-types";
import { coursePackWithoutWikipedia } from "@/lib/content/courses/source-cleanup";
import { AUTHORED_COURSES, RECOVERED_COURSES } from "@/lib/content/courses/definitions";

it("keeps current course records free of Wikipedia references", () => {
  expect(JSON.stringify([...AUTHORED_COURSES, ...RECOVERED_COURSES])).not.toMatch(/wikipedia/i);
});

it("cleans older published course copy without changing the stored pack", () => {
  const base = AUTHORED_COURSES.find(pack => pack.course.id === "idi-denial")!;
  const old: CoursePack = {
    ...base,
    course: {
      ...base.course,
      introTranscript: "Wikipedia lines were not allowed to be the voice.",
      subtitle: "Community and media estimates have been cited near 20,000 Karen in Minnesota (including Wikipedia-style round numbers and local news). Date them as estimates. They are not Compass.",
    },
    sources: [
      { title: "Bennett (1993)", href: "https://en.wikipedia.org/wiki/Milton_J._Bennett", note: "Developmental model" },
      { title: "Other article", href: "https://en.wikipedia.org/wiki/Unverified", note: "Unverified" },
      { title: "Author site", href: "https://www.idrinstitute.org/dmis/", note: "Primary background" },
    ],
  };

  const display = coursePackWithoutWikipedia(old);
  expect(display.course.introTranscript).toBe("Claims in the brief should be grounded in cited evidence.");
  expect(display.course.subtitle).toBe("Community estimates vary and should not be treated as a Minnesota Compass count. Verify the source and date before using a figure.");
  expect(display.sources.map(source => source.href)).toEqual([
    "https://www.idrinstitute.org/resources/chapters-on-dmis/",
    "https://www.idrinstitute.org/dmis/",
  ]);
  expect(JSON.stringify(display)).not.toMatch(/wikipedia/i);
  expect(old.sources[0].href).toContain("wikipedia.org");
});
