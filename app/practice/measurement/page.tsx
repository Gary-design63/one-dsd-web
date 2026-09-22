import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageIntro } from '@/components/ui';
import { WorkOriginLinks } from '@/components/work-origin-links';
import { MeasurementWorksheet } from '@/components/measurement-worksheet';
import { ResourceDownloads } from '@/components/resource-downloads';
import { EditableSurfaceRegion, prepareEditableSurface } from '@/components/editable-surface';
import { loadStaffContentSnapshot } from '@/lib/content/staff-publications';
import { MEASUREMENT_RESOURCE_ID, measurementText } from '@/lib/content/measurement-practice';
import { requestedContentScope } from '@/lib/product/request-context';
import { normalizeWorkOrigin, withWorkOrigin, type WorkOriginInput } from '@/lib/product/work-origin';
import { TRAINING_CREDIT_NOTICE } from '@/lib/program/learning-credit';
export const metadata:Metadata={title:'Evaluation plan'};
export default async function MeasurementPage({searchParams}:{searchParams?:Promise<WorkOriginInput>}){
 const scope=await requestedContentScope();const origin=normalizeWorkOrigin(await searchParams??{},'measurement');
 const [surface,parent,snapshot]=await Promise.all([prepareEditableSurface('practice.measurement',{scope}),prepareEditableSurface('practice.page',{scope,includeOwner:false}),loadStaffContentSnapshot({scope})]);
 const source=snapshot.items.find(item=>item.id===MEASUREMENT_RESOURCE_ID);if(!source || !surface.available || !parent.available)notFound();
 const href=withWorkOrigin('/library/'+source.id,origin);
 return <EditableSurfaceRegion surface={surface}><PageIntro title={measurementText(surface.values,'title')} lede={measurementText(surface.values,'intro')}/><div className="wrap max-w-4xl space-y-8 py-8"><WorkOriginLinks origin={origin}/><ResourceDownloads kind="measurement" id="worksheet" noun="evaluation plan" scope={scope}/><p><Link href={href}>{measurementText(surface.values,'sourceLabel')}: {source.title}</Link></p><MeasurementWorksheet copy={surface.values} source={{title:source.title,href}}/><p className="text-sm text-muted">{TRAINING_CREDIT_NOTICE}</p></div></EditableSurfaceRegion>;
}
