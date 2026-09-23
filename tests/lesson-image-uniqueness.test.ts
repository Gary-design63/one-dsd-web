import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import { lessonImageOverrides } from "@/lib/content/courses/lesson-image-overrides";
import { duplicateLessonImageKeys } from "@/lib/content/courses/lesson-image-repeat-suppression";

it("shows each lesson photograph once while retaining later lesson text", () => {
  const seenPaths = new Set<string>();
  const seenPhotoHashes = new Set<string>();
  let hidden = 0;
  for (const pack of RECOVERED_COURSES) {
    for (const lesson of pack.course.lessons) {
      lesson.blocks.forEach((block, index) => {
        if (block.type !== "image") return;
        const key = `${pack.course.id}|${lesson.id}|${index}`;
        const src = lessonImageOverrides[block.src]?.src ?? block.src;
        const file = `public${src.split("?")[0]}`;
        const hash = createHash("sha256").update(readFileSync(file)).digest("hex");
        const isPhoto = /\.(?:jpe?g|webp)$/i.test(file);
        const repeated = seenPaths.has(block.src) || (isPhoto && seenPhotoHashes.has(hash));
        expect(duplicateLessonImageKeys.has(key), `${pack.course.id}/${lesson.id}: ${src}`).toBe(repeated);
        if (repeated) hidden += 1;
        else {
          seenPaths.add(block.src);
          if (isPhoto) seenPhotoHashes.add(hash);
        }
      });
    }
  }
  expect(hidden).toBe(72);
});
