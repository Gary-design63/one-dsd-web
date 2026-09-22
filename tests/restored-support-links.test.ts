import { renderToStaticMarkup } from "react-dom/server";
import { describe,it,expect,vi } from "vitest";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { DSD_SCENARIOS } from "@/lib/dsd";
import { supportAreaFromQuery } from "@/lib/product/support-links";
vi.mock("@/components/program-context",()=>({ProgramContextNote:()=>null,useProgramContext:()=>({context:"one_dhs"})}));
vi.mock("@/components/participation-notice",()=>({ParticipationNotice:()=>null}));
vi.mock("@/components/editable-surface",()=>({prepareEditableSurface:async(id:string)=>({values:getEditableSurfaceDefinition(id)!.approvedValues,available:true}),EditableSurfaceRegion:({children}:{children:unknown})=>children}));
import RightPersonPage from "@/app/support/right-person/page";
const cases=[
 ["hiring_or_workforce","workforce_equity"],
 ["policy_or_program_decision","policy_program_service_design"],
 ["accessibility_barrier","accessibility_language_access"],
 ["procurement_or_contract","fiscal_grants_procurement_contracts"],
 ["advancement_or_leadership_pathway","leadership_systems_change"],
] as const;
describe("restored handoffs keep the work subject",()=>{
 it.each(cases)("preselects the correct staff support area for %s",async(matter,area)=>{
  const html=renderToStaticMarkup(await RightPersonPage({searchParams:Promise.resolve({matter})}));
  expect(html).toMatch(new RegExp(`<option[^>]*(?:value="${area}"[^>]*selected=""|selected=""[^>]*value="${area}")`));
 });
 it("covers every original scenario and practice handoff, preserving a valid explicit choice",()=>{
  const hrefs=[...GRADUATION_PATHS.flatMap(path=>path.steps.flatMap(step=>step.links.map(link=>link.href))),...DSD_SCENARIOS.flatMap(scenario=>scenario.moves.map(move=>move.href))].filter(href=>href.startsWith('/support/right-person?matter='));
  expect(hrefs.length).toBeGreaterThanOrEqual(6);
  for(const href of hrefs)expect(supportAreaFromQuery(undefined,new URL(href,'http://local').searchParams.get('matter')??undefined)).toBeDefined();
  expect(supportAreaFromQuery('community_engagement_co_design','hiring_or_workforce')).toBe('community_engagement_co_design');
  expect(supportAreaFromQuery(undefined,'constructor')).toBeUndefined();
 });
});
