import { describe, expect, it } from 'vitest';
import plan from '../lib/content/courses/authored/gap-plan.json';
import themes from '../lib/content/courses/theme-memberships.json';
import { publishedCourses } from '../lib/content/courses/published';

describe('owner supplied thirty-course integration', () => {
  for (const scope of ['one-dhs', 'dsd'] as const) {
    it(`publishes all thirty courses with lessons and theme placement in ${scope}`, async () => {
      const published = await publishedCourses(scope);
      expect(plan).toHaveLength(30);
      for (const row of plan) {
        const matches = published.filter(({ pack }) => pack.course.id === row.id);
        expect(matches, row.id).toHaveLength(1);
        const course = matches[0].pack.course;
        expect(course.title).toBe(row.title);
        expect(course.coverImage).toBe(row.coverImage);
        expect(course.lessons.length).toBeGreaterThanOrEqual(4);
        for (const theme of row.themes) {
          expect(themes[theme as keyof typeof themes], row.id).toContain(`course-${row.id}`);
        }
      }
    }, 30000);
  }
});
