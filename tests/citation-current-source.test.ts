import { describe, expect, it } from "vitest";
import { citationAttachFromDocs, type Doc, type SearchHit } from "@/lib/intelligence/retrieval/search";

const doc: Doc = {kind:"content", id:"R-current", title:"Current practice guidance", href:"/library/R-current", authority:"practice_note", type:"guide", status:"approved", reviewDate:"2026-09-08", scope:"agencywide", summary:"Invite contributions before and after the meeting.", text:"Invite contributions before and after the meeting.", tags:[], intents:[]};
const hit: SearchHit = {...doc, authorityLabel:"Made-up official authority", excerpt:doc.summary, score:10};

describe("current-source citation integrity", () => {
  it("binds title, authority, link and date to the current source rather than untrusted hit fields", () => {
    const [citation] = citationAttachFromDocs([{...hit, title:"Forged policy", href:"https://untrusted.example/", authority:"official", reviewDate:"2099-01-01", excerpt:"Unsupported claim."}], [doc]);
    expect(citation).toMatchObject({title:doc.title, href:doc.href, authority:doc.authority, reviewDate:doc.reviewDate, excerpt:doc.summary});
    expect(citation.authorityLabel).not.toBe(hit.authorityLabel);
  });
  it("does not revive withdrawn or out-of-scope sources absent from the current projection", () => {
    expect(citationAttachFromDocs([hit], [])).toEqual([]);
  });
  it("does not resolve an ID against a different source kind", () => {
    expect(citationAttachFromDocs([{...hit,kind:"brief"}], [doc])).toEqual([]);
  });
  it("uses revised source text and deduplicates repeated hits", () => {
    const current = {...doc, summary:"A revised participation approach.", text:"A revised participation approach."};
    expect(citationAttachFromDocs([hit,hit], [current])).toEqual([expect.objectContaining({excerpt:current.summary})]);
  });
});
