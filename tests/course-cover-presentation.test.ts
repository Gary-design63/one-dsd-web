import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { AUTHORED_COURSES, RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import { withCourseCover } from "@/lib/content/courses/cover-overrides";

const originals = [...RECOVERED_COURSES, ...AUTHORED_COURSES];
const displayed = originals.map(withCourseCover);
const root = path.resolve(import.meta.dirname, "..");

describe("course cover presentation", () => {
  it("uses distinct, local, web-sized images for each replacement", () => {
    const originalById = new Map(originals.map(pack => [pack.course.id, pack.course]));
    const changed = displayed.filter(pack => pack.course.coverImage !== originalById.get(pack.course.id)?.coverImage);
    expect(changed.length).toBeGreaterThan(0);
    const replacementPaths = new Set<string>();
    for (const pack of changed) {
      const { coverImage, coverAlt } = pack.course;
      expect(coverImage).toMatch(/^\/images\/covers\/[a-z0-9-]+\.webp$/);
      expect(coverAlt.trim().length).toBeGreaterThan(30);
      expect(replacementPaths.has(coverImage)).toBe(false);
      replacementPaths.add(coverImage);
      const file = path.join(root, "public", coverImage.slice(1));
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeLessThan(350_000);
    }
  });

  it("does not alter the preserved course records", () => {
    for (let index = 0; index < originals.length; index++) {
      expect(displayed[index].course.id).toBe(originals[index].course.id);
      expect(displayed[index].course.title).toBe(originals[index].course.title);
      expect(displayed[index].course.lessons).toBe(originals[index].course.lessons);
    }
  });

  it("uses a unique image for every active course cover", () => {
    expect(displayed).toHaveLength(240);
    const hashes = new Map<string, string>();
    for (const pack of displayed) {
      const file = path.join(root, "public", pack.course.coverImage.split("?")[0].slice(1));
      expect(existsSync(file), `${pack.course.id}: missing ${pack.course.coverImage}`).toBe(true);
      const hash = createHash("sha256").update(readFileSync(file)).digest("hex");
      expect(hashes.get(hash), `${pack.course.id} duplicates ${hashes.get(hash)}`).toBeUndefined();
      hashes.set(hash, pack.course.id);
    }
    expect(hashes.size).toBe(displayed.length);
  });
});
