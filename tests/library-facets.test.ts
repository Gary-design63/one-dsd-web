import { it,expect,afterEach,vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { DOMAINS } from '@/lib/domains';
import { matchesLibraryFacets } from '@/lib/content/library-facets';
import { loadStaffContentSnapshot } from '@/lib/content/staff-publications';
import ResourcesPage from '@/app/resources/page';
vi.mock('@/lib/product/request-context',()=>({requestedContentScope:async()=>'one-dhs'}));
vi.mock('@/lib/auth/request',()=>({ownerFromCookies:async()=>false,editingModeFromCookies:async()=>false}));
vi.mock('@/components/program-context',()=>({ProgramContextNote:()=>null}));
afterEach(()=>vi.restoreAllMocks());
it('uses recorded task roles and exact tags rather than guessing audience',async()=>{
 const item=(await loadStaffContentSnapshot()).items.find(item=>item.id==='ja-inclusive-hiring-lifecycle')!;
 expect(matchesLibraryFacets(item,{role:'hiring_hr'},DOMAINS)).toBe(true);expect(matchesLibraryFacets(item,{role:'hiring_hr'},[])).toBe(false);
 expect(matchesLibraryFacets(item,{topic:item.tags[0]},DOMAINS)).toBe(true);expect(matchesLibraryFacets(item,{topic:'guessed-topic'},DOMAINS)).toBe(false);
});
it('removes only the chosen facet while keeping the query, task and originating area',async()=>{
 const input={q:'degree',area:'workforce',originArea:'workforce_equity',task:'design-role',type:'job_aid',authority:'guidance',role:'hiring_hr'};
 const html=renderToStaticMarkup(await ResourcesPage({searchParams:Promise.resolve(input)}));
 const match=html.match(/<a(?=[^>]*aria-label="Remove role filter")[^>]*href="([^"]+)"/);expect(match).toBeTruthy();
 const url=new URL(match![1].replaceAll('&amp;','&'),'https://program.test');expect(url.searchParams.has('role')).toBe(false);
 for(const [key,value] of Object.entries(input).filter(([key])=>key!=='role'))expect(url.searchParams.get(key)).toBe(value);
 expect(html).toContain('<summary>Narrow results</summary>');
 expect(html).not.toContain('name="freshness"');
 expect(html).not.toContain('Review date<select');
});
