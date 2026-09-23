import { CommunityInfluenceMap } from "@/components/multimedia/engagement-learning-scenes";
import styles from "../learning-family.module.css";
import Link from 'next/link';
import { EditableSurfaceRegion, prepareEditableSurface } from '@/components/editable-surface';
import { ResourceDownloads } from '@/components/resource-downloads';
import { CONNECTION_TOPICS } from '@/lib/content/community-connections';
import { editableSurfaceEditingAvailable } from '@/lib/content/editable-surfaces';
import { stringValue, stringListValue, linkListValue } from '@/lib/content/staff-surface-registry';
export const metadata = {title:'Community engagement: from input to action'};
export default async function Page() {
  const surface = await prepareEditableSurface('community-connections.home');
  const text = (key:string) => stringValue(surface.values,key);
  return <EditableSurfaceRegion surface={{...surface, canEdit: surface.canEdit && editableSurfaceEditingAvailable(process.env, surface.definition.surfaceId)}}><div className={`${styles.page} ${styles.content} ${styles.readingPage} space-y-10`}>
    <header className="max-w-3xl space-y-4"><Link href="/learn/equity-toolkit">{text('back')}</Link><h1 className="text-4xl font-semibold">{text('title')}</h1><p className="text-xl">{text('intro')}</p><p>{text('sourceNote')}</p>{surface.available ? <ResourceDownloads kind="community-connections" id="home" noun="page" /> : null}</header>
    <aside className={styles.topicStart}><h2>Start here</h2><p>{text("planningIntro")}</p><a className={styles.primaryAction} href="#planning-questions">Explore the planning questions</a></aside>
    <section id="planning-questions" className="space-y-4"><h2 className="text-2xl font-semibold">{text('planningTitle')}</h2><p>{text('planningIntro')}</p><ol className="list-decimal space-y-4 pl-6">{stringListValue(surface.values,'questions').map(q=><li key={q}>{q}</li>)}</ol></section>
    <section className="space-y-5 border-t border-line pt-8"><h2 className="text-2xl font-semibold">{text('exampleTitle')}</h2><p>{text('exampleIntro')}</p><h3 className="text-xl font-semibold">{text('objectivesTitle')}</h3><ul className="list-disc space-y-2 pl-6">{stringListValue(surface.values,'objectives').map(q=><li key={q}>{q}</li>)}</ul><div className="grid gap-6 md:grid-cols-2">{['activity','influence','result','return'].map(id=><article key={id} className="border border-line p-6"><h3 className="text-xl font-semibold">{text(`${id}Title`)}</h3><p className="mt-3">{text(id)}</p></article>)}</div></section>
    <CommunityInfluenceMap /><p>{text('relationshipNote')}</p><div className="grid gap-8 md:grid-cols-2">{CONNECTION_TOPICS.map(topic=><section key={topic} className="space-y-4 border-t border-line pt-5"><h2 className="text-2xl font-semibold">{text(`${topic}Title`)}</h2><ul className="list-disc space-y-4 pl-6">{linkListValue(surface.values,`${topic}Links`).map(link=><li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></section>)}</div><p>{text('evidenceNote')}</p><p>{text('tribalNote')}</p>
  </div></EditableSurfaceRegion>;
}

