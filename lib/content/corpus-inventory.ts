import "server-only";
import { cache } from "react";
import { z } from "zod";
import { loadStaffContentSnapshot, type StaffProgramScope } from "./staff-publications";
import { runtimeDatabaseConfiguration, runtimeSql } from "@/lib/db/runtime-client";

const InventorySchema = z.object({
  total: z.number().int().nonnegative(),
  counts: z.record(z.string(), z.number().int().nonnegative()),
  items: z.array(z.object({ id: z.string(), title: z.string(), kind: z.string(), scope: z.string(), revisionId: z.string().nullable(), revisionNumber: z.number().nullable(), published: z.boolean() })),
});
export type CorpusInventory = z.infer<typeof InventorySchema>;
function database() {
  const configuration = runtimeDatabaseConfiguration();
  return configuration ? runtimeSql(configuration) : undefined;
}
const readInventory = cache(async (scope: StaffProgramScope, search: string, offset: number): Promise<CorpusInventory | undefined> => {
  const db = database();
  if (!db) return undefined;
  const [row] = await db`select pac.read_owner_corpus_inventory(${scope},${search.slice(0,200)},40,${offset}) as inventory`;
  return InventorySchema.parse(row.inventory);
});
/** Memoized within one request: the same page of the inventory is read once per render. */
export async function loadCorpusInventory(scope: StaffProgramScope, search = "", offset = 0): Promise<CorpusInventory | undefined> {
  return readInventory(scope, search, offset);
}
/** Related reading always resolves current scoped publications again before creating links. */
export async function relatedPublishedResources(scope: StaffProgramScope, id: string): Promise<Array<{ id: string; title: string }>> {
  const snapshot = await loadStaffContentSnapshot({scope});
  const visible = new Map(snapshot.items.filter(item=>item.status==="approved").map(item=>[item.id,item]));
  const starting = visible.get(id);
  if (!starting) return [];
  const db = database();
  if (process.env.PAC_CONTENT_SOURCE === "postgres") {
    if (!db) throw new Error("Related reading is unavailable.");
    const rows = await db`select * from pac.read_staff_graph_neighbors(${scope},${id},4)`;
    const refreshed = await loadStaffContentSnapshot({scope});
    const currentItems = new Map(refreshed.items.filter(item=>item.status==="approved").map(item=>[item.id,item]));
    if (!currentItems.has(id)) return [];
    const seen = new Set<string>();
    return rows.flatMap(row=>{const current=currentItems.get(String(row.content_item_id));if(!current||current.id===id||seen.has(current.id)) return [];seen.add(current.id);return [{id:current.id,title:current.title}];});
  }
  const topics = new Set(starting.tags);
  return [...visible.values()].filter(item=>item.id!==id)
    .map(item=>({item,shared:item.tags.filter(tag=>topics.has(tag)).length}))
    .filter(row=>row.shared>0).sort((a,b)=>b.shared-a.shared||a.item.id.localeCompare(b.item.id)).slice(0,4)
    .map(({item})=>({id:item.id,title:item.title}));
}