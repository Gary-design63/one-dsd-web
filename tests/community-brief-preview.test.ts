import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('uses disclosures across briefs and preserves the editable content flow', () => {
  const page = readFileSync('app/minnesota-communities/[id]/page.tsx', 'utf8');
  expect(page).toContain('const compact = true');
  expect(page).toContain('applyCommunityBriefValues(raw, briefSurface.values)');
  expect(page).toContain('<EditableSurfaceRegion surface={briefSurface}>');
  expect(page).toContain('<details className="brief-disclosure" open={open}>');
  expect(page).toContain('if (!enabled) return children');
  expect(page).toContain('b.level2.map');
  expect(page).toContain('b.sources.map');
});
