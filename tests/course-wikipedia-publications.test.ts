import { afterEach, expect, it, vi } from "vitest";
import { prepareEditableSurface } from "@/lib/content/prepare-editable-surface";
import { AUTHORED_COURSES, RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import * as publications from "@/lib/content/editable-surfaces";
import type { PublishedEditableSurface } from "@/lib/content/editable-surfaces";

afterEach(() => vi.restoreAllMocks());

it.each([
  ["authored", AUTHORED_COURSES.find(pack => pack.course.id === "idi-denial")!],
  ["recovered", RECOVERED_COURSES.find(pack => pack.course.id === "cultural-intelligence-karen")!],
] as const)("keeps a stale %s database course publication from restoring Wikipedia references", async (_kind, original) => {
  const stale = {
    ...original,
    course: { ...original.course, subtitle: "Wikipedia was the source for this lesson." },
    sources: [
      ...original.sources,
      { title: "Old citation", href: "https://en.wikipedia.org/wiki/Unverified", note: "Do not publish this link." },
    ],
  };
  const row = {
    surfaceId: `course.${original.course.id}`,
    values: { pack: stale },
    source: "postgres",
  } as unknown as PublishedEditableSurface;
  vi.spyOn(publications, "loadPublishedEditableSurface").mockResolvedValue(row);

  const surface = await prepareEditableSurface(`course.${original.course.id}`, {
    scope: "one-dhs",
    includeOwner: false,
  });
  expect(surface.available).toBe(true);
  expect(JSON.stringify(surface.values.pack)).not.toMatch(/wikipedia/i);
  expect(JSON.stringify(row.values.pack)).toContain("wikipedia.org");
});
