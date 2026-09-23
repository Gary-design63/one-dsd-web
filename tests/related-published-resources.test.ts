import { afterEach, expect, it, vi } from "vitest";
import type { ContentItem } from "@/lib/content/types";
const mocks=vi.hoisted(()=>({load:vi.fn(),sql:vi.fn()}));
vi.mock("postgres",()=>({default:()=>mocks.sql}));
vi.mock("@/lib/content/staff-publications",()=>({loadStaffContentSnapshot:mocks.load}));
import { relatedPublishedResources } from "@/lib/content/corpus-inventory";
const item=(id:string,title=id,tags=["access"])=>({id,title,tags,status:"approved",scope:"agencywide"}) as ContentItem;
const snapshot=(items:ContentItem[])=>({source:"static",requestedScope:"one-dhs",items});
afterEach(()=>{vi.resetAllMocks();vi.unstubAllEnvs()});
it("uses current titles and rejects withdrawn, out-of-scope, duplicate and self neighbors",async()=>{
 vi.stubEnv("PAC_CONTENT_SOURCE","postgres");vi.stubEnv("PAC_RUNTIME_DATABASE_URL","postgres://synthetic@127.0.0.1/local");
 mocks.load.mockResolvedValueOnce(snapshot([item("start"),item("next","Old title"),item("withdrawn")])).mockResolvedValueOnce(snapshot([item("start"),item("next","Current title")]));
 mocks.sql.mockResolvedValue([{content_item_id:"next",title:"Forged old title"},{content_item_id:"withdrawn"},{content_item_id:"dsd-only"},{content_item_id:"next"},{content_item_id:"start"}]);
 expect(await relatedPublishedResources("one-dhs","start")).toEqual([{id:"next",title:"Current title"}]);
 expect(mocks.load).toHaveBeenNthCalledWith(2,{scope:"one-dhs"});
});
it("does not expose relations after the starting resource is withdrawn",async()=>{
 vi.stubEnv("PAC_CONTENT_SOURCE","postgres");vi.stubEnv("PAC_RUNTIME_DATABASE_URL","postgres://synthetic@127.0.0.1/local");
 mocks.load.mockResolvedValueOnce(snapshot([item("start"),item("next")])).mockResolvedValueOnce(snapshot([item("next")]));mocks.sql.mockResolvedValue([{content_item_id:"next"}]);
 expect(await relatedPublishedResources("one-dhs","start")).toEqual([]);
});
it("avoids the graph query for a source absent from the current scoped collection",async()=>{
 vi.stubEnv("PAC_CONTENT_SOURCE","postgres");mocks.load.mockResolvedValue(snapshot([item("other")]));
 expect(await relatedPublishedResources("one-dhs","missing")).toEqual([]);expect(mocks.sql).not.toHaveBeenCalled();
});
it("offers at most four shared-topic resources from the actual local collection",async()=>{
 vi.stubEnv("PAC_CONTENT_SOURCE","static");mocks.load.mockResolvedValue(snapshot([item("start"),..."abcde".split("").map(id=>item(id)),item("unrelated","Unrelated",["different"])]));
 expect((await relatedPublishedResources("one-dhs","start")).map(row=>row.id)).toEqual(["a","b","c","d"]);expect(mocks.sql).not.toHaveBeenCalled();
});
it("surfaces a read failure rather than presenting stale related reading",async()=>{
 vi.stubEnv("PAC_CONTENT_SOURCE","postgres");vi.stubEnv("PAC_RUNTIME_DATABASE_URL","postgres://synthetic@127.0.0.1/local");mocks.load.mockResolvedValue(snapshot([item("start")]));mocks.sql.mockRejectedValue(new Error("unavailable"));
 await expect(relatedPublishedResources("one-dhs","start")).rejects.toThrow("unavailable");
});
