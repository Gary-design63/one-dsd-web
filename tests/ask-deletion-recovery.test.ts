import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAskResponseRecord, FileAskRecordsStore, MemoryAskRecordsStore, prepareFileAskRecordRestore } from "@/lib/intelligence/observability/ask-records";
import { isOwnerSession, issueSessionCookieValue } from "@/lib/auth/owner";
const temporary: string[] = [];
const now = () => new Date().toISOString();
function record(question = "Synthetic question about preparing an accessible meeting.") {
  return createAskResponseRecord({traceId:randomUUID(),programScope:"one-dhs",researchMode:"program_only",status:"answered",httpStatus:200,question,researchStatus:"not_requested",response:{kind:"answer",answer:{shortAnswer:"Synthetic practical answer.",whyItMatters:"",sources:[],limits:[],nextActions:[]}}});
}
async function folder() { const root = await mkdtemp(path.join(tmpdir(),"pac-ask-recovery-")); temporary.push(root); return root; }
afterEach(async () => { vi.unstubAllEnvs(); for (const root of temporary.splice(0)) { if(path.dirname(root)!==path.resolve(tmpdir())||!path.basename(root).startsWith("pac-ask-recovery-"))throw Error("Unexpected test cleanup path"); await rm(root,{recursive:true,force:true}); } });
describe("ASK deletion and isolated restore protection", () => {
  it("keeps deletion receipts content-free and prevents stale-body replay", async () => {
    const root = await folder(), store = new FileAskRecordsStore(root), value = record();
    await store.append(value); const stale = await readFile(path.join(root,value.id+".json"));
    expect(await store.delete([value.id])).toBe(1);
    const receipt = JSON.parse(await readFile(path.join(root,".deletions",value.id+".json"),"utf8"));
    expect(Object.keys(receipt).sort()).toEqual(["deletedAt","id","reason"]);
    expect(receipt).toEqual({id:value.id,deletedAt:expect.any(String),reason:"owner_delete"});
    expect(JSON.stringify(receipt)).not.toContain(value.question);
    await expect(store.append(value)).rejects.toThrow(/deleted/);
    await expect(store.append({...value,id:value.id.toUpperCase()})).rejects.toThrow(/deleted/);
    await writeFile(path.join(root,value.id+".json"),stale);
    expect(await new FileAskRecordsStore(root).list(10,null,now())).toEqual([]);
    expect(await store.delete([value.id])).toBe(1);
  });
  it("excludes every restored answer when the current deletion journal was lost", async () => {
    const root=await folder(), live=path.join(root,"live"), backup=path.join(root,"backup"), restored=path.join(root,"restored");
    const store=new FileAskRecordsStore(live), deleted=record(), other=record("Another synthetic learning question.");
    await store.append(deleted);await store.append(other);await cp(live,backup,{recursive:true});
    await store.delete([deleted.id]);
    await cp(backup,restored,{recursive:true});
    expect(await prepareFileAskRecordRestore(restored)).toEqual({excludedRecords:2});
    expect(await new FileAskRecordsStore(restored).list(10,null,now())).toEqual([]);
    await expect(new FileAskRecordsStore(restored).append(deleted)).rejects.toThrow(/deleted/);
    expect(await prepareFileAskRecordRestore(restored)).toEqual({excludedRecords:0});
  });
  it("fails closed on a malformed receipt and reports an incomplete physical deletion", async () => {
    const root=await folder(), store=new FileAskRecordsStore(root), value=record();
    await store.append(value);await mkdir(path.join(root,".deletions"));
    await writeFile(path.join(root,".deletions",value.id+".json"),"{}");
    await expect(store.list(10,null,now())).rejects.toThrow();
    const blocked=record();await mkdir(path.join(root,blocked.id+".json"));
    await expect(store.delete([blocked.id])).rejects.toThrow();
    expect(JSON.parse(await readFile(path.join(root,".deletions",blocked.id+".json"),"utf8")).reason).toBe("owner_delete");
  });
  it("protects unknown deleted identifiers and memory-store replay", async () => {
    const store=new MemoryAskRecordsStore(), value=record();
    expect(await store.delete([value.id.toUpperCase()])).toBe(0);
    await expect(store.append(value)).rejects.toThrow(/deleted/);
  });
  it("proves legacy owner-key rotation separately from database restoration", () => {
    vi.stubEnv("PAC_DATA_ENV","local");vi.stubEnv("PAC_OWNER_KEY","synthetic-before-restore-key-".repeat(2));
    const oldCookie=issueSessionCookieValue()!;expect(isOwnerSession(oldCookie)).toBe(true);
    vi.stubEnv("PAC_OWNER_KEY","synthetic-after-restore-key-".repeat(2));
    expect(isOwnerSession(oldCookie)).toBe(false);
    expect(isOwnerSession(issueSessionCookieValue()!)).toBe(true);
  });
});
