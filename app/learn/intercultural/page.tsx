import { EngagementLearningScene } from "@/components/multimedia/engagement-learning-scenes";
import styles from "../learning-family.module.css";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { LearningPracticeNotebook } from "@/components/learning-practice-notebook";
import { ResourceDownloads } from "@/components/resource-downloads";

import { getLearningJourney, journeyResourceHref, journeyText, LEARNING_JOURNEY_HREF, selectJourneyResources } from "@/lib/content/learning-journey";
import { courseContentItem, publishedCourses } from "@/lib/content/courses/published";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import { linkListValue, EDITABLE_SURFACE_REGISTRY } from "@/lib/content/staff-surface-registry";
import { loadPublishedEditableSurfaces } from "@/lib/content/editable-surfaces";
import { requestedContentScope } from "@/lib/product/request-context";
import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";

export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Intercultural learning in everyday work"};
export default async function InterculturalLearningPage({searchParams}:{searchParams:Promise<{focus?:string}>}) {
  const [scope]=await Promise.all([requestedContentScope(),searchParams]);
  const [surface,snapshot,courses]=await Promise.all([
    prepareEditableSurface("learn.intercultural",{scope}),
    loadStaffContentSnapshot({scope}),publishedCourses(scope)
  ]);
  if(!surface.available)notFound();
  const text=(key:string)=>journeyText(surface.values,key);
  const stops=getLearningJourney(surface.values);
  const items=[...snapshot.items,...courses.map(({pack})=>courseContentItem(pack))];
  const connections=linkListValue(surface.values,"relatedLinks");
  const definitions=EDITABLE_SURFACE_REGISTRY.filter(def=>connections.some(link=>link.href===def.route));
  const published=(await Promise.all((["one-dhs","dsd"] as const).map(targetScope=>
    loadPublishedEditableSurfaces(definitions.filter(def=>
      (def.scopePolicy === "dsd" ? "dsd" : def.scopePolicy === "one-dhs" ? "one-dhs" : scope) === targetScope
    ).map(def=>def.surfaceId),targetScope)
  ))).flat();
  const available=new Set(published.map(row=>definitions.find(def=>def.surfaceId===row.surfaceId)!.route));
  // These three local program pages are public static routes with no separate publication area.
  for(const href of ["/orientation","/one-dsd/team/learning-lab","/one-dsd/leadership"]) available.add(href);
  const links=connections.filter(link=>available.has(link.href));
  return <EditableSurfaceRegion surface={surface} className={styles.page}>
    <header className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>Learning for everyday work</p><h1>{text("title")}</h1><p className={styles.intro}>{text("intro")}</p></div></header>
    <div className={`${styles.content} ${styles.journeyBody} space-y-10`}>
      <Link href="/learn">All learning and resources</Link>
      <ResourceDownloads kind="learning-journey" id="intercultural" noun="learning journey" scope={scope} />
      <div className="max-w-4xl"><p className="text-lg leading-8">{text("choice")}</p><p className="mt-3 text-sm leading-6">{TRAINING_CREDIT_NOTICE}</p></div>
      <nav aria-label="Choose a learning focus" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stops.map(stop=><Link key={stop.id} href={"#"+stop.id} className="rounded-xl border border-[#d5c8b4] bg-[#faf7f0] p-4 font-semibold leading-6 hover:bg-[#f0e8db]">{stop.title}</Link>)}
      </nav>
      <aside className="rounded-xl border border-line bg-white p-6" aria-labelledby="idi-context">
        <h2 id="idi-context" className="text-xl font-semibold">{text("idiTitle")}</h2><p className="my-3 max-w-4xl leading-7">{text("idiBody")}</p>
        <a className="underline" href={text("idiLink")}>About the IDI and individual development plans</a>
      </aside>
      {stops.map((stop,index)=>{
        const resources=selectJourneyResources(stop,items);
        const next=stops[(index+1)%stops.length];
        return <section key={stop.id} id={stop.id} className={`${styles.journeyFocus} border-t border-line`} aria-labelledby={stop.id+"-title"}>
          <p className="kicker">A focus for your learning</p>
          <h2 id={stop.id+"-title"} className="mt-2 text-3xl font-semibold">{stop.title}</h2>
          <p className="mt-4 max-w-4xl text-lg leading-8">{stop.purpose}</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <details className="rounded-xl border border-slate-300 p-5"><summary className="cursor-pointer font-semibold">What you can practice</summary><ul className="mt-4 list-disc space-y-3 pl-5">{stop.objectives.map(objective=><li key={objective}>{objective}</li>)}</ul></details>
              <div className="rounded-xl bg-[#f4f6f8] p-6"><h3 className="text-xl font-semibold">An everyday example</h3><p className="mt-3 leading-7">{stop.example}</p></div>
              <EngagementLearningScene focus={stop.id} /><div><h3 className="text-xl font-semibold">Try it in your work</h3><p className="mt-3 leading-7">{stop.practice}</p><p className="mt-4 font-medium">{stop.reflection}</p><p className="mt-3 text-sm leading-6"><strong>Something to carry forward:</strong> {stop.evidence}</p></div>
              <div className="flex flex-wrap gap-4"><Link className="font-semibold underline" href={LEARNING_JOURNEY_HREF+"#practice-notebook"}>See the published practice prompts</Link><Link className="underline" href="/ask">Browse published ASK topics</Link></div>
            </div>
            <div className="rounded-xl border border-line p-6">
              <h3 className="text-xl font-semibold">Learning and tools to explore</h3>
              {resources.length ? <ul className="mt-4 space-y-5">{resources.map(item=><li key={item.id} className="border-t border-line pt-4">
                <Link className="font-semibold underline" href={journeyResourceHref(item)}>{item.title}</Link><p className="mt-2 text-sm leading-6">{item.summary}</p>
              </li>)}</ul>:<p className="mt-4">Explore the <Link href="/learn" className="underline">full learning collection</Link> or use the practice example here.</p>}
            </div>
          </div>
          <div className="mt-7 flex flex-wrap items-baseline justify-between gap-4"><p className="max-w-3xl text-sm leading-6">{stop.nextStep}</p><Link className="font-semibold underline" href={"#"+next.id}>{index===stops.length-1?"Return to the foundations":next.title} →</Link></div>
        </section>;
      })}
      <LearningPracticeNotebook stops={stops.map(({id,title,practice,reflection})=>({id,title,practice,reflection}))}/>
      <section aria-labelledby="connected-learning-title" className="border-t border-line pt-8">
        <h2 id="connected-learning-title" className="text-3xl font-semibold">{text("connectionsTitle")}</h2>
        <p className="mt-4 max-w-3xl leading-7">{text("connectionsIntro")}</p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{links.map(link=><li key={link.href}><Link className="underline" href={link.href}>{link.label}</Link></li>)}</ul>
      </section>
    </div>
  </EditableSurfaceRegion>;
}


