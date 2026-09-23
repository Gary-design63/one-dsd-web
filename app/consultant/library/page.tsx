import type { Metadata } from "next";
import Link from "next/link";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { requestedContentScope } from "@/lib/product/request-context";
import { loadCorpusInventory } from "@/lib/content/corpus-inventory";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Program collection" };
const LABELS: Record<string,string> = { sources: "Source records", unavailableSources: "Originals still needed", receipts: "Source decisions retained", content: "Program items", revisions: "Saved versions", storedFiles: "Files kept privately", nodes: "Knowledge entries", relationships: "Recorded connections" };

export default async function CollectionPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  if (!(await ownerPageGuard())) return null;
  const params = await searchParams;
  const page = /^\d{1,5}$/.test(params.page ?? "") ? Math.min(25000, Math.max(1, Number(params.page))) : 1;
  const scope = await requestedContentScope();
  const inventory = await loadCorpusInventory(scope, params.q ?? "", (page - 1) * 40);
  const address = (n: number) => `/consultant/library?${new URLSearchParams({ q: params.q ?? "", page: String(n) })}`;
  return <div className="wrap py-8">
    <h1 className="text-3xl font-bold">Program collection</h1>
    <p>See what has been received, where it belongs, and what is available to staff.</p>
    {!inventory ? <p>The saved collection is not available in this copy of the program.</p> : <>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(inventory.counts).map(([key,value]) => <div className="panel" key={key}><dt>{LABELS[key] ?? key}</dt><dd className="text-2xl font-bold">{value.toLocaleString("en-US")}</dd></div>)}</dl>
      <form className="my-6 flex flex-wrap items-end gap-3"><label htmlFor="collection-search">Find an item<input id="collection-search" name="q" maxLength={200} defaultValue={params.q} className="block" /></label><button className="btn" type="submit">Search</button></form>
      <p>{inventory.total.toLocaleString("en-US")} items in this view. Source counts include the full received collection.</p>
      <div className="overflow-x-auto"><table className="data"><caption className="text-left">{scope === "dsd" ? "One DSD and shared program material" : "One DHS material"}</caption><thead><tr><th scope="col">Item</th><th scope="col">Available to staff</th><th scope="col">Saved version</th></tr></thead><tbody>{inventory.items.map(item => <tr key={item.id}><td><Link href={item.kind === "resource" && item.published ? `/library/${encodeURIComponent(item.id)}` : `/consultant/library/${encodeURIComponent(item.id)}`}>{item.title}</Link>{item.kind !== "resource" ? <span className="block text-sm text-muted">{item.kind === "learning_module" ? "Learning module (edited in its course)" : item.kind === "question_bank" ? "Question bank (read-only here)" : item.kind}</span> : null}</td><td>{item.published ? "Yes" : "Awaiting release"}</td><td>{item.revisionNumber ?? "No version yet"}</td></tr>)}</tbody></table></div>
      {!inventory.items.length ? <p>No items match those words.</p> : null}
      <nav className="mt-6 flex gap-6" aria-label="Collection pages">{page > 1 ? <Link href={address(page-1)}>Previous page</Link> : null}{page*40 < inventory.total ? <Link href={address(page+1)}>Next page</Link> : null}</nav>
    </>}
  </div>;
}
