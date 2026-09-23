import Link from "next/link";
import { notFound } from "next/navigation";
import { communityDesignEntries } from "@/lib/content/community-design";
import { FEATURED_COMMUNITY_IDS, NATIVE_DEFERENCE_COMMUNITY_IDS } from "@/lib/content/community-presentation";
import { communityReadingSurfaceId } from "@/lib/content/community-reading-surface";
import { getBrief } from "@/lib/content/briefs";
import { communityBriefSurfaceId, stringValue } from "@/lib/content/staff-surface-registry";
import { communityReading } from "@/lib/content/community-design";
import { EditableSurfaceRegion, prepareEditableSurface } from "./editable-surface";
import "./community-editorial.css";

export async function CommunityDesignIndex({ query = "" }: { query?: string }) {
  const pageSurface = await prepareEditableSurface("communities.index");
  if (!pageSurface.available && !pageSurface.canEdit) notFound();
  const preparedEntries = await Promise.all(communityDesignEntries().map(async entry => {
    const raw = getBrief(entry.id);
    const [briefSurface, readingSurface] = await Promise.all([
      raw ? prepareEditableSurface(communityBriefSurfaceId(entry.id), { includeOwner: false }) : Promise.resolve(null),
      communityReading(entry.id) ? prepareEditableSurface(communityReadingSurfaceId(entry.id), { includeOwner: false }) : Promise.resolve(null),
    ]);
    // A withdrawal must remove both the link and its title from staff browse/search.
    if ((briefSurface && !briefSurface.available) || (readingSurface && !readingSurface.available)) return null;
    const editedTitle = briefSurface ? stringValue(briefSurface.values, "title") : undefined;
    return { ...entry, title: editedTitle && editedTitle !== raw?.title ? editedTitle : readingSurface ? stringValue(readingSurface.values, "title") : entry.title };
  }));
  const entries = preparedEntries.filter(entry => entry !== null);
  // Retain the approved new introduction until the owner actually changes the
  // existing wording area; its older seed copy is not the new design's default.
  const copy = (key: string, fallback: string) => {
    const value = stringValue(pageSurface.values, key);
    const original = stringValue(pageSurface.definition.approvedValues, key);
    return value !== original ? value : fallback;
  };
  const normalized = query.trim().toLocaleLowerCase();
  const matching = entries.filter(b => `${b.title} ${b.id}`.toLocaleLowerCase().includes(normalized));
  const featured = matching.filter(b => FEATURED_COMMUNITY_IDS.some(id => id === b.id));
  const more = matching.filter(b => !FEATURED_COMMUNITY_IDS.some(id => id === b.id));
  const list = (items: typeof entries) => <ul className="community-directory">{items.map(b => <li key={b.id}><Link prefetch={false} href={`/minnesota-communities/${b.id}`}>{b.title}</Link>{(NATIVE_DEFERENCE_COMMUNITY_IDS as readonly string[]).includes(b.id) ? <span className="community-in-development-tag"> (standing deference to the Office of Indian Affairs and DHS offices that handle Tribal relations and consultation)</span> : null}</li>)}</ul>;
  return <EditableSurfaceRegion surface={pageSurface}><div className="community-editorial">
    <div className="community-index-layout">
      <h1>{copy("introTitle", "Minnesota Communities")}</h1><p className="community-opening">{copy("introLede", "Every community has a story. Explore the histories, contributions, and everyday experiences that connect people across Minnesota.")}</p>
      <form method="get" role="search" className="community-search"><label htmlFor="community-query">{copy("searchLabel", "Find a community")}</label><div><input id="community-query" type="search" name="q" defaultValue={query} placeholder={copy("searchExample", "") || undefined} /><button type="submit">{copy("searchButton", "Search")}</button>{normalized ? <Link href="/minnesota-communities">Clear search</Link> : null}</div></form>
      <p>{normalized ? `${matching.length} matching ${matching.length === 1 ? "brief" : "briefs"}` : `${entries.length} community and place briefs`}</p>
      {normalized ? list(matching) : <><h2>Explore communities</h2>{list(featured)}<details className="community-more"><summary>All other communities and places ({more.length})</summary>{list(more)}</details></>}
      {normalized && !matching.length ? <p>No community matched that name. Try a different name, or browse the full collection.</p> : null}
    </div>
  </div></EditableSurfaceRegion>;
}
