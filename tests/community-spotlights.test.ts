import { expect, it } from 'vitest';
import { BRIEFS } from '@/lib/content/briefs';
import { communityBriefSurfaceId, getEditableSurfaceDefinition } from '@/lib/content/staff-surface-registry';
import { parseEditableSurfaceValues } from '@/lib/content/editable-surface-contract';

it('gives every brief a distinct editable opening, reflection and source link', () => {
  const titles = new Set<string>();
  for (const brief of BRIEFS) {
    const surface = getEditableSurfaceDefinition(communityBriefSurfaceId(brief.id))!;
    expect(surface).toBeTruthy();
    expect(parseEditableSurfaceValues(surface, surface.approvedValues)).toEqual(surface.approvedValues);
    expect(surface.approvedValues.spotlightBody).toBeTruthy();
    expect(surface.approvedValues.reflectionBody).toBeTruthy();
    expect(surface.approvedValues.spotlightHref).toMatch(/^https:\/\//);
    titles.add(surface.approvedValues.spotlightTitle as string);
  }
  expect(titles.size).toBe(BRIEFS.length);
});
