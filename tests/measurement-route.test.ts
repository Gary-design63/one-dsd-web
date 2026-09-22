import {afterEach,expect,it,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import * as publications from '@/lib/content/editable-surfaces';
import * as sources from '@/lib/content/staff-publications';
import {TRAINING_CREDIT_NOTICE} from '@/lib/program/learning-credit';
import {MEASUREMENT_RESOURCE_ID} from '@/lib/content/measurement-practice';
const state=vi.hoisted(()=>({scope:'one-dhs' as 'one-dhs'|'dsd'}));
vi.mock('@/lib/product/request-context',()=>({requestedContentScope:async()=>state.scope}));
vi.mock('@/lib/auth/request',()=>({ownerFromCookies:async()=>false,editingModeFromCookies:async()=>false}));
vi.mock('@/components/program-context',()=>({ProgramContextNote:()=>null}));
vi.mock('@/components/equity-practice',()=>({EquityPractice:()=>null}));
vi.mock('@/components/learning-journey-link',()=>({LearningJourneyLink:()=>null}));
import { indexedProgramResources } from '@/lib/intelligence/retrieval/program-resources';
import MeasurementPage from '@/app/practice/measurement/page';
import AreasPage from '@/app/areas/page';
import DomainPage from '@/app/areas/[id]/page';
import PracticePage from '@/app/practice/page';
afterEach(()=>{vi.restoreAllMocks();state.scope='one-dhs'});
it.each(['one-dhs','dsd'] as const)('opens an editable scoped worksheet and retains the measurement origin in %s',async scope=>{
 state.scope=scope;const html=renderToStaticMarkup(await MeasurementPage({searchParams:Promise.resolve({originArea:'data_research_quality_measurement',area:'measurement',task:'evaluation-plan'})}));
 expect(html).toContain('data-editable-surface="practice.measurement"');expect(html).toContain('Responsible roles and next decisions');expect(html).toContain('task=evaluation-plan');expect(html).toContain(TRAINING_CREDIT_NOTICE.replaceAll('&','&amp;'));expect(html).not.toContain('Mark complete');
});
it('connects Areas, the evaluation task and Practice directly to this worksheet',async()=>{
 for(const html of [renderToStaticMarkup(await AreasPage()),renderToStaticMarkup(await DomainPage({params:Promise.resolve({id:'measurement'})})),renderToStaticMarkup(await PracticePage({}))]) expect(html).toContain('href="/practice/measurement?');
});
it('withdrawal of the source removes the worksheet route and every supplement link',async()=>{
 const original=sources.loadStaffContentSnapshot;vi.spyOn(sources,'loadStaffContentSnapshot').mockImplementation(async options=>{const s=await original(options);return {...s,items:s.items.filter(item=>item.id!==MEASUREMENT_RESOURCE_ID)}});
 await expect(MeasurementPage({})).rejects.toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
 for(const html of [renderToStaticMarkup(await AreasPage()),renderToStaticMarkup(await DomainPage({params:Promise.resolve({id:'measurement'})})),renderToStaticMarkup(await PracticePage({}))])expect(html).not.toContain('href="/practice/measurement');
});
it('uses owner-edited worksheet labels and hides a withheld worksheet',async()=>{
 const original=publications.loadPublishedEditableSurface;let withheld=false;
 vi.spyOn(publications,'loadPublishedEditableSurface').mockImplementation(async(id,options)=>{if(id==='practice.measurement' && withheld)return undefined;const s=await original(id,options);return id==='practice.measurement' && s?{...s,values:{...s.values,title:'Our evaluation working space'}}:s});
 expect(renderToStaticMarkup(await MeasurementPage({}))).toContain('Our evaluation working space');
 const old=process.env.PAC_DATABASE_EDITABLE_SURFACES;process.env.PAC_DATABASE_EDITABLE_SURFACES='practice.measurement';
 try{withheld=true;await expect(MeasurementPage({})).rejects.toThrow()}finally{if(old===undefined)delete process.env.PAC_DATABASE_EDITABLE_SURFACES;else process.env.PAC_DATABASE_EDITABLE_SURFACES=old}
});

it('invalidates a cached ASK destination when the supporting source is withdrawn',async()=>{
 const before=await indexedProgramResources('one-dhs');expect(before.destinations.some(doc=>doc.href==='/practice/measurement')).toBe(true);
 const original=sources.loadStaffContentSnapshot;const spy=vi.spyOn(sources,'loadStaffContentSnapshot').mockImplementation(async options=>{const s=await original(options);return {...s,items:s.items.filter(item=>item.id!==MEASUREMENT_RESOURCE_ID)}});
 expect((await indexedProgramResources('one-dhs')).destinations.some(doc=>doc.href==='/practice/measurement')).toBe(false);
 spy.mockRestore();expect((await indexedProgramResources('one-dhs')).destinations.some(doc=>doc.href==='/practice/measurement')).toBe(true);
});
it('omits the ASK destination when the worksheet or parent publication is withdrawn',async()=>{
 const original=publications.loadPublishedEditableSurfaces;
 for(const hidden of ['practice.measurement','practice.page']){
 const spy=vi.spyOn(publications,'loadPublishedEditableSurfaces').mockImplementation(async(ids,scope)=>(await original(ids,scope)).filter(row=>row.surfaceId!==hidden));
 expect((await indexedProgramResources('one-dhs')).destinations.some(doc=>doc.href==='/practice/measurement')).toBe(false);spy.mockRestore();}
});
