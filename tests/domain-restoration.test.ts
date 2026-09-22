import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DOMAINS } from "@/lib/domains";
import { DOMAIN_SURFACES, applyDomainValues, domainSurfaceId, WORK_AREA_DOMAINS } from "@/lib/domains/surfaces";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { parseEditableSurfaceDocument } from "@/lib/content/editable-surface-contract";
import { OPERATIONALIZING_EQUITY, PRACTICE_PILLARS } from "@/lib/product/equity-practice-source";
import { EQUITY_PRACTICE_SURFACE } from "@/lib/product/equity-practice";
import { canonicalStaffHref } from "@/lib/product/routes";
import { staffCorpus } from "@/lib/content/staff-corpus";
import { DSD_PROGRAMS, DSD_SCENARIOS } from "@/lib/dsd";
const state=vi.hoisted(()=>({scope:"one-dhs",unavailable:new Set<string>(),revisedTitle:""}));
vi.mock("@/lib/product/request-context",()=>({requestedContentScope:async()=>state.scope}));
vi.mock("@/components/editable-surface",()=>({
 prepareEditableSurface:async(id:string)=>({definition:getEditableSurfaceDefinition(id),scope:state.scope,values:getEditableSurfaceDefinition(id)!.approvedValues,available:!state.unavailable.has(id),canEdit:false}),
 EditableSurfaceRegion:({surface,children}:{surface:{available:boolean};children:unknown})=>surface.available?children:null,
}));
vi.mock("@/lib/content/staff-publications",()=>({loadStaffContentSnapshot:async()=>({items:staffCorpus().filter(item=>!state.unavailable.has(item.id))})}));
vi.mock("@/lib/content/editable-surfaces",()=>({loadPublishedEditableSurfaces:async(ids:string[])=>ids.filter(id=>!state.unavailable.has(id)).flatMap(id=>{
 const definition=getEditableSurfaceDefinition(id); if(!definition || (definition.scopePolicy==="dsd" && state.scope!=="dsd"))return [];
 return [{surfaceId:id,values:{...definition.approvedValues,...(state.revisedTitle&&id==="graduation-path.gp-6"?{title:state.revisedTitle}:{})}}];
})}));
import DomainPage from "@/app/areas/[id]/page";
import { EquityPractice } from "@/components/equity-practice";
const normalize=(text:string)=>text.replace(/\r\n/g,"\n");
const escape=(text:string)=>text.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#x27;");
beforeEach(()=>{state.scope="one-dhs";state.unavailable.clear();state.revisedTitle="";});
describe("restored complete work areas",()=>{
 it("preserves the original seven domains and every one of their 23 tasks byte for byte",()=>{
  // Full Git blob captured from 5680911:lib/domains/index.ts; no checkout history is required.
  const original = normalize(readFileSync("tests/fixtures/domains-index-5680911.ts.txt","utf8"));
  expect(createHash("sha256").update(original).digest("hex")).toBe("b8b1bfc8c5eb071aa0f9f3e777920e81a56a5c66b1cefea08ca607d7e0e734bd");
  expect(normalize(readFileSync("lib/domains/index.ts","utf8"))).toBe(original);
  expect(DOMAINS).toHaveLength(7);expect(DOMAINS.flatMap(domain=>domain.tasks)).toHaveLength(23);
  for(const domain of DOMAINS){const definition=DOMAIN_SURFACES.find(surface=>surface.surfaceId===domainSurfaceId(domain.id))!;const parsed=parseEditableSurfaceDocument(definition,{schemaVersion:1,surfaceId:definition.surfaceId,scope:"one-dhs",values:definition.approvedValues});expect(applyDomainValues(domain,parsed.values)).toEqual(domain);}
  for(const ids of Object.values(WORK_AREA_DOMAINS))expect(ids.every(id=>DOMAINS.some(domain=>domain.id===id))).toBe(true);
 });
 it.each(DOMAINS)("renders the full $id subject matter and all task outcomes",async domain=>{
  const html=renderToStaticMarkup(await DomainPage({params:Promise.resolve({id:domain.id})}));
  for(const text of [domain.title,domain.summary,domain.whyItMatters,...domain.firstQuestions,...domain.tasks.flatMap(task=>[task.label,task.outcome])])expect(html,`${domain.id}: ${text}`).toContain(escape(text));
  const askQuestions=[...html.matchAll(/href="([^"]+)"/g)].map(match=>new URL(match[1].replaceAll("&amp;","&"),"http://local")).filter(url=>url.pathname==="/ask").map(url=>url.searchParams.get("q"));
  for(const task of domain.tasks) { expect(askQuestions).toContain(task.askStarter); expect(html).toContain(`id="task-${task.id}"`); expect(html).toContain(`id="${task.id}"`); }
  expect(html).not.toContain('/one-dsd/scenarios/');
 });
 it.each([
  ["fiscal_grants_procurement_contracts","leadership-systems","procurement"],
  ["communications_public_information","access-language","language"],
 ])("retains the originating %s area through the shared domain",async(originArea,domainId)=>{
  const domain=DOMAINS.find(item=>item.id===domainId)!;const task=domain.tasks[0];
  const html=renderToStaticMarkup(await DomainPage({params:Promise.resolve({id:domainId}),searchParams:Promise.resolve({originArea,task:task.id})}));
  const links=[...html.matchAll(/href="([^"]+)"/g)].map(match=>new URL(match[1].replaceAll("&amp;","&"),"http://local"));
  const support=links.find(link=>link.pathname==="/support/right-person")!;
  expect(support.searchParams.get("area")).toBe(originArea);expect(support.searchParams.get("task")).toBe(task.id);
  for(const link of links.filter(link=>link.pathname.startsWith("/library/")||link.pathname.startsWith("/practice/"))){expect(link.searchParams.get("originArea")).toBe(originArea);expect(link.searchParams.get("area")).toBe(domainId);}
  expect(links.some(link=>link.pathname==="/areas"&&link.hash==="#"+originArea)).toBe(true);
 });
 it("renders published DSD programs and scenarios with their full connections",async()=>{
  state.scope="dsd";
  for(const domain of DOMAINS){const html=renderToStaticMarkup(await DomainPage({params:Promise.resolve({id:domain.id})}));
   expect(html).toContain(escape(domain.dsd.note));
   for(const id of domain.dsd.scenarioIds)expect(html).toContain(`/one-dsd/scenarios/${id}`);
   for(const program of DSD_PROGRAMS.filter(program=>program.domains.includes(domain.id)))expect(html).toContain(`/one-dsd/programs/${program.id}`);
  }
 });
 it("honors withdrawals and current path titles instead of falling back to static text",async()=>{
  state.scope="dsd";state.revisedTitle="A revised hiring path";
  let html=renderToStaticMarkup(await DomainPage({params:Promise.resolve({id:"workforce"})}));expect(html).toContain(state.revisedTitle);
  state.unavailable.add("graduation-path.gp-6");state.unavailable.add("ja-job-relatedness-check");state.unavailable.add("dsd-scenario.dsd-hiring-panel");
  html=renderToStaticMarkup(await DomainPage({params:Promise.resolve({id:"workforce"})}));
  expect(html).not.toContain('href="/practice/gp-6');expect(html).not.toContain('href="/library/ja-job-relatedness-check');expect(html).not.toContain('href="/one-dsd/scenarios/dsd-hiring-panel"');
  state.unavailable.add("domain.workforce");expect(renderToStaticMarkup(await DomainPage({params:Promise.resolve({id:"workforce"})}))).toBe("");
 });
 it("renders the complete owner definition, ten characteristics and three pillars without build commentary",async()=>{
  const definition=EQUITY_PRACTICE_SURFACE;expect(parseEditableSurfaceDocument(definition,{schemaVersion:1,surfaceId:definition.surfaceId,scope:"one-dhs",values:definition.approvedValues}).values).toEqual(definition.approvedValues);
  const html=renderToStaticMarkup(await EquityPractice({scope:"one-dhs"}));
  for(const text of [OPERATIONALIZING_EQUITY.definition,...OPERATIONALIZING_EQUITY.characteristics.flatMap(item=>[item.title,item.detail]),PRACTICE_PILLARS.throughLine,...PRACTICE_PILLARS.pillars.flatMap(item=>[item.title,...item.points])])expect(html).toContain(escape(text));
  for(const pillar of PRACTICE_PILLARS.pillars) {
   expect(html).not.toContain(escape(pillar.inTheBuild));
   for(const link of pillar.hrefs) { expect(html).toContain(escape(link.label)); expect(html).toContain(`href="${link.href === "/paths" ? "/practice" : canonicalStaffHref(link.href)}"`); }
  }
 });
 it("removes pillar links to withdrawn destinations while keeping the complete pillar text",async()=>{
  state.unavailable.add("domain.measurement");state.unavailable.add("ja-job-relatedness-check");
  const html=renderToStaticMarkup(await EquityPractice({scope:"one-dhs"}));
  expect(html).not.toContain('href="/areas/measurement"');expect(html).not.toContain('href="/library/ja-job-relatedness-check"');
  expect(html).toContain('href="/practice/gp-7"');expect(html).toContain(escape(PRACTICE_PILLARS.throughLine));
 });
 it("preserves original domain links, query strings and anchors",()=>{
  expect(canonicalStaffHref("/domains/leadership-systems#procurement")).toBe("/areas/leadership-systems#procurement");
  expect(canonicalStaffHref("/domains?from=practice")).toBe("/areas?from=practice");
  for(const scenario of DSD_SCENARIOS)expect(DOMAINS.some(domain=>domain.id===scenario.domain)).toBe(true);
 });
});
