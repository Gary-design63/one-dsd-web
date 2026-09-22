import { expect, it, vi } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/ask/route";
import { STAFF_WRITE_CLOSED_CODE } from "@/lib/product/staff-lock";
import { resetStoreForTests, getStore, createFileStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache } from "@/lib/intelligence/policy";
import { listAskResponseRecords } from "@/lib/intelligence/observability/ask-records";
import { runCycle } from "@/lib/intelligence/agents/cycle";
import * as O from "@/lib/intelligence/orchestrator";

it.skipIf(process.env.PAC_ORG_LIVE_TEST !== "1")("real provider answers, API records, and Chief of Staff coordination", async () => {
  expect(Boolean(process.env.ANTHROPIC_API_KEY)).toBe(true);
  vi.stubEnv("PAC_GENERATIVE_PILOT", "true");
  vi.stubEnv("PAC_STORE", "memory");
  resetStoreForTests(); invalidatePolicyCache();
  const root="evidence/organization-2026-09-08";
  mkdirSync(root,{recursive:true});
  const runRoot=root+"/runs/"+randomUUID();
  mkdirSync(runRoot,{recursive:true});
  const cases=[
    {question:"Where does the Disability Services Division sit within DHS? Explain its role and cite the supplied organizational source."},
    {question:"Explain the distinction between DSD, DCT, and DCYF, including the agency separation. Use the supplied organizational reference, without a web search."},
    {question:"We are improving MnCHOICES assessment communications with county and Tribal partners. Explain who needs to be involved and give three practical coordination steps, using the supplied organizational reference."},
  ];
  const receipts=[];
  try {
    for(const scenario of cases){
      const res=await POST(new NextRequest("http://localhost:3115/api/ask",{method:"POST",headers:{"content-type":"application/json",origin:"http://localhost:3115"},body:JSON.stringify({question:scenario.question,researchMode:"program_only"})}));
      const body=await res.json();
      receipts.push({question:scenario.question,httpStatus:res.status,response:body});
      writeFileSync(root+"/live-answers.json",JSON.stringify({environment:"staff Ask is browse-and-download only; typed posts are closed",receipts},null,2));
      expect(res.status).toBe(403);
      expect(body.code).toBe(STAFF_WRITE_CLOSED_CODE);
      expect(body.kind).toBeUndefined();
    }
    const journal=await listAskResponseRecords();
    expect(journal.records).toEqual([]);

    const created=await O.intakeSubmit({program_context:"one_dsd",dsd_eligibility_attestation:true,participation_notice_id:"dsd_consultation_request",participation_notice_version:"1.0.0",work_name:"MnCHOICES assessment communication",stage:"designing",goals:"Improve accessible support planning information.",desired_support_type:["access_language_check"],timing_urgency:"exploratory",situation:"Prepare assessment information with county and Tribal partners.",share_confirmation:true});
    expect(created.kind).toBe("created");
    if(created.kind!=="created")throw Error("Intake failed");
    expect((await O.queueUpdate(created.request.request_id,{eligibility_decision:"confirmed_dsd"})).ok).toBe(true);
    const cycle=await runCycle("owner");
    writeFileSync(root+"/live-cycle.json",JSON.stringify({environment:"local cycle, real provider, synthetic work request",cycle},null,2));
    expect(cycle.generative).toBe(true);
    expect(cycle.exceptions).toEqual([]);
    expect(cycle.steps.find(s=>s.name==="prepare DHS organizational context")?.outcome).toBe("done");
    expect(cycle.triaged.length).toBe(1);
    expect(cycle.refreshed_packets.length).toBe(1);
    const disk=createFileStoreForTests(runRoot+"/cycle-store");
    await disk.put("decision","cycle:"+cycle.id,cycle);
    expect(await createFileStoreForTests(runRoot+"/cycle-store").get("decision","cycle:"+cycle.id)).toEqual(cycle);
    expect((await getStore().listAudit(100)).length).toBeGreaterThan(0);
    writeFileSync(root+"/live-verification.json",JSON.stringify({passed:true,at:new Date().toISOString(),runId:randomUUID(),receiptDirectory:runRoot,staffAskClosed:true,durableAskRecords:0,cycleGenerative:true,cycleTriaged:1,cycleRefreshed:1,production:false},null,2));
  } finally { vi.unstubAllEnvs(); }
},240000);
