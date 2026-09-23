import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe,expect,it } from "vitest";
import { DOMAIN_CORPUS } from "@/lib/content/corpus-domains";
import { CORPUS } from "@/lib/content/corpus";
import { getContent, staffCorpus } from "@/lib/content/staff-corpus";
import { ReleaseResourcePayloadSchema, staffReleaseValidationIssues } from "@/lib/content/resource-release-contract";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import { canonicalStaffHref } from "@/lib/product/routes";
const originalSource = readFileSync('data/source-snapshots/donor-library/domain-candidates.jsonl');
const originals = originalSource.toString('utf8').trim().split(/\r?\n/).map(line => JSON.parse(line).richOriginal.contentItem);
describe('intact domain resource recovery',()=>{
 it('preserves original evidence and all fields except the explicit stay-interview clarification',()=>{
  expect(createHash('sha256').update(originalSource).digest('hex').toUpperCase()).toBe('E3EBAC1A09DD1FE6BF3208FA031D2515C2C4D12559F78143A758CDF3D13593FE');
  // September 14, 2026: the owner's IDI-as-theory-of-change directive added a personal-growth
  // tag lane to these four intercultural-development-adjacent items so introspective, own-culture
  // content is as discoverable as service-delivery content. Only their tags changed.
  const personalGrowthTagAdditions: Record<string, string[]> = {
    'lm-power-and-positional-authority': ['personal growth', 'self-reflection'],
    'pn-idi-and-tool-registry': ['personal growth', 'own culture', 'self-reflection'],
    'tool-idi': ['personal growth', 'own culture', 'self-reflection'],
    'tool-implicit-association': ['personal growth', 'own culture', 'self-reflection'],
  };
  const current = originals.map(original => original.id === 'pn-stay-interviews-and-retention' ? {
    ...original,
    body: [
      'Before. Tell the person what the conversation is and is not. Explain that the conversation is for understanding the employee experience rather than assigning a performance rating. Agree what may be recorded or shared and explain applicable limits; do not promise absolute confidentiality or that no record can exist. Offer to hold it in whatever setting works for them.',
      ...original.body.slice(1),
    ],
  } : original.id === 'tool-idi' ? {
    ...original,
    // September 14, 2026: the owner's IDI-as-theory-of-change directive expanded this tool card's
    // purpose line to name all six continuum stages, so the framework is explicit wherever it's referenced.
    body: [
      original.body[0],
      "Purpose: describes a developmental orientation toward cultural difference along a continuum from monocultural to intercultural mindsets. This program's continuum draws on both: the licensed IDI instrument describes five orientations — Denial, Polarization, Minimization, Acceptance, and Adaptation — and Bennett's developmental model contributes the sixth, Integration. The full continuum moves from not noticing cultural difference, through judging it, through treating it as unimportant next to human sameness, toward genuinely valuing, adapting to, and integrating multiple cultural frames. Used for coaching, group development, and planning.",
      ...original.body.slice(2),
    ],
    tags: [...original.tags, ...personalGrowthTagAdditions[original.id]],
  } : personalGrowthTagAdditions[original.id] ? {
    ...original,
    tags: [...original.tags, ...personalGrowthTagAdditions[original.id]],
  } : original);
  expect(DOMAIN_CORPUS).toEqual(current);expect(CORPUS).toHaveLength(25);expect(DOMAIN_CORPUS).toHaveLength(34);
  expect(new Set(staffCorpus().map(item=>item.id)).size).toBe(59);
  for(const item of DOMAIN_CORPUS){expect(getContent(item.id)).toEqual(item);expect(staffReleaseValidationIssues(ReleaseResourcePayloadSchema.parse(item))).toEqual([]);expect(item.accessibility).toBe('pending');}
 });
 it.each(['one-dhs','dsd'] as const)('reads all34 intact resources through the %s staff reader',async scope=>{
  const snapshot=await loadStaffContentSnapshot({source:'static',scope});expect(snapshot.items).toHaveLength(59);
  for(const original of DOMAIN_CORPUS)expect(snapshot.items.find(item=>item.id===original.id)).toEqual({...original,nextActions:original.nextActions.map(action=>({...action,href:canonicalStaffHref(action.href)}))});
 });
 it('uses complete flat resources and does not publish course packs',()=>{
  for(const item of DOMAIN_CORPUS){expect(item.body.length).toBeGreaterThan(0);expect(item).not.toHaveProperty('richOriginal');expect(item).not.toHaveProperty('lessons');}
 });
});
