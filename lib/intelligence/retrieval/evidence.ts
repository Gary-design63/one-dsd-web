import "server-only";
import { createHash } from "node:crypto";
import { EvidenceClaimsSchema, SourceEvidenceSchema, evidenceReferencesMatch, type EvidenceClaim, type SourceEvidence } from "@/lib/content/ask-evidence";
import { citationAttachFromDocs, type SearchHit, type Doc, type Citation } from "./search";
const hash=(text:string)=>createHash("sha256").update(text).digest("hex");
export function indexedEvidenceText(doc:Doc):string { return [doc.title,doc.summary,doc.text].filter(Boolean).join(" ").replace(/\s+/g," ").trim(); }
export function evidenceForDoc(doc:Doc,requestedExcerpt?:string):SourceEvidence {
  const text=indexedEvidenceText(doc), chars=Array.from(text);
  const revisions=doc.evidenceRevisions ?? [{sourceId:doc.id,revisionId:null,payloadHash:hash(JSON.stringify({title:doc.title,href:doc.href,authority:doc.authority,scope:doc.scope,text})),scope:doc.scope}];
  const contentHash=hash(text);
  const evidenceId=hash(JSON.stringify({documentId:doc.id,kind:doc.kind,href:doc.href,scope:doc.scope,authority:doc.authority,contentHash,revisions}));
  const preferred=(requestedExcerpt??doc.summary).replace(/\s+/g," ").trim();
  const offset=preferred ? text.indexOf(preferred) : -1;
  const start=offset<0?0:Array.from(text.slice(0,offset)).length;
  let quote=offset>=0?preferred:chars.slice(start,start+900).join("");
  if(Array.from(quote).length>900){quote=Array.from(quote).slice(0,900).join("");const end=quote.lastIndexOf(" ");if(end>300)quote=quote.slice(0,end);}
  if(!quote)throw Error("Empty document cannot establish evidence.");
  return SourceEvidenceSchema.parse({version:1,evidenceId,documentId:doc.id,contentHash,revisions,excerpt:{start,end:start+Array.from(quote).length,quote}});
}
/** Validate exact identity and passage against the current scoped projection; no entailment claim. */
export function validateEvidenceClaims(value:unknown,supplied:Citation[],currentDocs:Doc[]):EvidenceClaim[] {
  const claims=EvidenceClaimsSchema.parse(value??[]);
  const snapshots=supplied.flatMap(source=>source.evidence?[source.evidence]:[]);
  if(!evidenceReferencesMatch(claims,snapshots))throw Error("generated_evidence_rejected");
  const current=new Map(currentDocs.map(doc=>[doc.id,doc]));
  const used=new Set(claims.flatMap(claim=>claim.references.map(reference=>reference.evidenceId)));
  for(const snapshot of snapshots.filter(source=>used.has(source.evidenceId))){
    const doc=current.get(snapshot.documentId);
    if(!doc || evidenceForDoc(doc,snapshot.excerpt.quote).evidenceId!==snapshot.evidenceId)throw Error("generated_evidence_rejected");
  }
  return claims;
}

/** Server-only evidence decoration; shared client search never imports cryptography. */
export function citationEvidenceFromDocs(hits:SearchHit[],docs:Doc[]):Citation[] {
  return citationAttachFromDocs(hits,docs).map(citation=>{
    const doc=docs.find(doc=>doc.id===citation.id && doc.href===citation.href)!;
    return {...citation,evidence:evidenceForDoc(doc,citation.excerpt.replace(/^\.\.\.|\.\.\.$/g,""))};
  });
}
