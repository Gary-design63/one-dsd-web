import { expect,it } from "vitest";
import { DOMAIN_CORPUS } from "@/lib/content/corpus-domains";
import { assertAuditEventPersistence } from "@/lib/trust/work-object-contract";
import { getStore,resetStoreForTests } from "@/lib/intelligence/memory/store";
import { testTraceId,testSpanId } from "./helpers/opaque-identifiers";
const event={ trace_id:testTraceId('domain-resource-receipt'),span_id:testSpanId('domain-resource-receipt'),at:'2026-09-07T23:00:00.000Z',agent_id:'system',agent_version:'0.1.0',tool_name:'citation.attach',autonomy_level_used:'A0',permission_mode:'always',dry_run:false,content_ids_touched:DOMAIN_CORPUS.filter(item=>item.id.startsWith('tool-')).map(item=>item.id),allowlist_hit:true,ok:true } as const;
it('stores a citation receipt for every actual restored tool resource',async()=>{
 expect(event.content_ids_touched).toHaveLength(8);expect(()=>assertAuditEventPersistence(event)).not.toThrow();resetStoreForTests();
 const store=getStore();await store.appendAudit({...event,content_ids_touched:[...event.content_ids_touched]});
 expect((await store.listAudit()).some(row=>row.trace_id===event.trace_id&&row.content_ids_touched.length===8)).toBe(true);
});
it.each(['tool-employee-123-equity-readiness','tool-','tool-test/../../record','unknown-tool-id','tool-test private person'])('continues rejecting noncanonical or profile-like identifier %s',id=>{
 expect(()=>assertAuditEventPersistence({...event,content_ids_touched:[id]})).toThrow();
});
