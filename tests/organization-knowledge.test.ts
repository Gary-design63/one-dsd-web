import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { DHS_REFERENCE, organizationalBrief, organizationalDocs, organizationalMaintenance } from "@/lib/intelligence/memory/organization";
import { runCycle } from "@/lib/intelligence/agents/cycle";
import * as O from "@/lib/intelligence/orchestrator";
import { getStore, resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache, setPolicy } from "@/lib/intelligence/policy";
import { expectStaffAskClosed } from "./helpers/staff-ask-closed";

beforeEach(() => { resetStoreForTests(); invalidatePolicyCache(); vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(new Date("2026-09-08T18:00:00Z")); });
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

it.each([
  ["Where does the Disability Services Division sit within DHS?", "dsd-placement"],
  ["How does MnCHOICES support assessment and planning?", "assessment"],
  ["What is the difference between DSD and DCT?", "dct"],
  ["Where did child care licensing move?", "dcyf"],
  ["Who coordinates government to government consultation with Tribal Nations?", "county-tribal"],
  ["What is Employment First and E1MN?", "employment"],
  ["Explain CFSS and PCA.", "cfss"],
  ["What does the new Disability Waiver Program say about launch timing?", "waiver-change"],
  ["Where is DWRS rate guidance?", "rates"],
  ["What are DSD grants and RFP opportunities?", "grants"],
  ["What is the 245D licensing moratorium?", "licensing"],
  ["Where do I find the CBSM policy manual?", "manuals"],
  ["How does DHS support language access and translated notices?", "language-access"],
  ["Who handles civil rights discrimination complaints?", "civil-rights"],
  ["Explain DHS mission and service relationships.", "purpose"],
  ["Show the DHS organizational chart.", "structure"],
  ["What are the DSD CHOICE priorities?", "dsd-choice"],
  ["Explain DHS informed choice and HCBS settings.", "person-centered"],
  ["Where can I contact DSD or Disability Hub?", "navigation"],
  ["Explain DHS appeals and data requests.", "operations"],
  ["What does DHS Employee Culture cover?", "workforce"],
  ["What does DHS CCBHC guidance cover?", "behavioral-health"],
  ["Explain MHCP and MinnesotaCare.", "mhcp"],
  ["What is the DHS housing and homelessness role?", "housing"],
  ["Where are Minnesota aging and caregiver resources?", "aging"],
  ["What does Tribal and Urban Indian Relations do?", "tribal-relations"],
  ["Explain DHS adult protection and MAARC.", "adult-protection"],
  ["Where are DHS legislative reports and budget proposals?", "legislative"],
  ["How do DHS complex transitions support hospital discharge?", "transitions"],
  ["Which DHS strategic plan addresses psychological safety?", "strategy"],
])("finds relevant organizational evidence: %s", (question, id) => {
  expect(organizationalBrief(question).entries.map(entry => entry.id)).toContain("ext-dhs-org-" + id);
});
it("does not inject DHS references into unrelated general knowledge", () => {
  for (const question of ["Explain prime numbers.", "Explain aging in stars.", "Write a marketing strategic plan.", "Explain the organization of a cell."]) expect(organizationalBrief(question).entries).toEqual([]);
});
it("retains source provenance and flags stale facts without inventing a refresh", () => {
  expect(new Set(DHS_REFERENCE.entries.map(e => e.id)).size).toBe(DHS_REFERENCE.entries.length);
  for (const entry of DHS_REFERENCE.entries) {
    expect(entry.sourceIds.length).toBeGreaterThan(0);
    for (const id of entry.sourceIds) expect(DHS_REFERENCE.sources.some(s => s.id === id && s.url.startsWith("https://"))).toBe(true);
  }
  expect(organizationalMaintenance(new Date("2026-09-08")).refreshDue).toHaveLength(0);
  expect(organizationalMaintenance(new Date("2027-09-08")).refreshDue).toHaveLength(DHS_REFERENCE.sources.length);
  expect(organizationalBrief("Explain MnCHOICES assessment", new Date("2027-09-08")).entries.every(e => e.facts.length > 0 && e.units.length > 0 && e.refreshDue)).toBe(true);
  expect(organizationalDocs(new Date("2027-09-08")).every(d => d.status === "refresh_due")).toBe(true);
});
it("does not pass organizational evidence through typed staff Ask", async () => {
  await expectStaffAskClosed();
  expect(organizationalBrief("How does MnCHOICES support assessment and planning?").entries.map(entry => entry.id)).toContain("ext-dhs-org-assessment");
});
it("uses organization knowledge in a real work cycle and persists its receipt", async () => {
  const created = await O.intakeSubmit({
    program_context:"one_dsd",dsd_eligibility_attestation:true,participation_notice_id:"dsd_consultation_request",participation_notice_version:"1.0.0",
    work_name:"MnCHOICES assessment communication",stage:"designing",goals:"Improve accessible support planning information for lead agencies.",
    desired_support_type:["access_language_check"],timing_urgency:"exploratory",situation:"Prepare clear assessment information for county and Tribal partners.",share_confirmation:true,
  });
  expect(created.kind).toBe("created");
  if(created.kind !== "created") throw Error("Request was not created");
  expect((await O.queueUpdate(created.request.request_id,{eligibility_decision:"confirmed_dsd"})).ok).toBe(true);
  const report = await runCycle("owner");
  const step = report.steps.find(s=>s.name === "prepare DHS organizational context");
  expect(step?.outcome).toBe("done");
  const context=JSON.parse(step!.detail);
  expect(context.work[0].brief.entries.some((e:{id:string})=>e.id === "ext-dhs-org-assessment")).toBe(true);
  expect(report.refreshed_packets).toContain(created.request.request_id);
  expect(report.triaged.some(r=>r.request_id === created.request.request_id)).toBe(true);
  expect(await getStore().get("decision","cycle:"+report.id)).toEqual(report);
});
it("respects the owner's stop control without organizational work", async () => {
  await setPolicy({killed:true});
  const report=await runCycle("owner");
  expect(report.steps.some(s=>s.name === "prepare DHS organizational context")).toBe(false);
});

