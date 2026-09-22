// @vitest-environment jsdom
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page from "@/app/understanding-dhs/page";
import reference from "@/data/organization/minnesota-dhs.json";
import { DHS_REFERENCE_GROUPS, dhsTopicAnchor } from "@/lib/content/dhs-reference";
it("shows every approved topic once with working section anchors and original sources",()=>{
 const html=renderToStaticMarkup(<Page />);const dom=new DOMParser().parseFromString(html,"text/html");
 expect(dom.querySelectorAll("h1")).toHaveLength(1);
 expect(dom.querySelectorAll("article")).toHaveLength(reference.entries.length);
 const ids=Array.from(dom.querySelectorAll("[id]")).map(e=>e.id);expect(new Set(ids).size).toBe(ids.length);
 for(const e of reference.entries){const article=dom.getElementById(dhsTopicAnchor(e.id));expect(article?.textContent).toContain(e.facts);for(const id of e.sourceIds)expect(Array.from(article!.querySelectorAll('a')).map(a=>a.getAttribute('href')),e.id).toContain(reference.sources.find(s=>s.id===id)!.url);}
 for(const group of DHS_REFERENCE_GROUPS)expect(dom.getElementById(group.id)).not.toBeNull();
 expect(html).not.toContain("internal-relationships");expect(html).not.toContain("applicationBasis");
});
