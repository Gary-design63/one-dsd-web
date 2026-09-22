import { describe, it, expect } from 'vitest';
import { COMMUNITY_CONNECTIONS_SURFACE as surface, CONNECTION_TOPICS } from '@/lib/content/community-connections';
import { parseEditableSurfaceValues } from '@/lib/content/editable-surface-contract';
import { getEditableSurfaceDefinition } from '@/lib/content/staff-surface-registry';
describe('community engagement companion',()=>{
  it('registers valid editable wording',()=>{expect(getEditableSurfaceDefinition(surface.surfaceId)).toBe(surface);expect(parseEditableSurfaceValues(surface,surface.approvedValues)).toEqual(surface.approvedValues);});
  it('covers four themes and four observable objectives',()=>{expect(CONNECTION_TOPICS).toHaveLength(4);expect(surface.approvedValues.objectives).toHaveLength(4);expect(surface.approvedValues.questions).toHaveLength(7);});
  it('separates participation counts, outcomes and relationship claims',()=>{expect(surface.approvedValues.activity).toContain('does not establish');expect(surface.approvedValues.relationshipNote).toContain('not a claim');expect(surface.approvedValues.result).toContain('does not infer');});
});
