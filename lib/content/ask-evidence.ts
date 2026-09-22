import { z } from "zod";
const Hash = z.string().regex(/^[a-f0-9]{64}$/);
export const EvidenceRevisionSchema = z.object({
  sourceId:z.string().min(1).max(200), revisionId:z.string().uuid().nullable(),
  payloadHash:Hash, scope:z.string().min(1).max(60),
}).strict();
export const EvidenceSpanSchema = z.object({
  start:z.number().int().min(0), end:z.number().int().min(1), quote:z.string().min(1).max(1500),
}).strict().refine(value=>value.end-value.start===Array.from(value.quote).length,"Passage offsets must match its exact Unicode text.");
export const SourceEvidenceSchema = z.object({
  version:z.literal(1), evidenceId:Hash, documentId:z.string().min(1).max(200), contentHash:Hash,
  revisions:z.array(EvidenceRevisionSchema).min(1).max(32), excerpt:EvidenceSpanSchema,
}).strict();
export const EvidenceReferenceSchema = z.object({
  evidenceId:Hash, start:z.number().int().min(0), end:z.number().int().min(1), quote:z.string().min(1).max(1500),
}).strict().refine(value=>value.end-value.start===Array.from(value.quote).length);
export const EvidenceClaimSchema = z.object({
  kind:z.enum(["source_excerpt","inference"]), text:z.string().min(1).max(4000),
  references:z.array(EvidenceReferenceSchema).min(1).max(4),
}).strict().refine(value=>value.kind!=="source_excerpt" || (value.references.length===1 && value.text===value.references[0].quote),"Source excerpts must reproduce the exact passage; interpretations must be labeled inference.");
export const EvidenceClaimsSchema=z.array(EvidenceClaimSchema).max(12);
export type EvidenceRevision=z.infer<typeof EvidenceRevisionSchema>;
export type SourceEvidence=z.infer<typeof SourceEvidenceSchema>;
export type EvidenceClaim=z.infer<typeof EvidenceClaimSchema>;
const publishedContentEvidence=new WeakMap<object,EvidenceRevision>();
export function rememberContentEvidence(item:object, evidence:EvidenceRevision):void {
  publishedContentEvidence.set(item,EvidenceRevisionSchema.parse(evidence));
}
export function contentEvidence(item:object):EvidenceRevision|undefined { return publishedContentEvidence.get(item); }
/** References establish which passage was used, not whether an interpretation is true. */
export function evidenceReferencesMatch(claims:EvidenceClaim[], evidence:SourceEvidence[]):boolean {
  const available=new Map(evidence.map(source=>[source.evidenceId,source]));
  return claims.every(claim=>claim.references.every(reference=>{
    const source=available.get(reference.evidenceId);if(!source)return false;
    return reference.start>=source.excerpt.start && reference.end<=source.excerpt.end &&
      Array.from(source.excerpt.quote).slice(reference.start-source.excerpt.start,reference.end-source.excerpt.start).join("")===reference.quote;
  }));
}
