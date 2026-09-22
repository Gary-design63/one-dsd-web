import styles from "@/components/dsd-experience.module.css";
import { LearningJourneyLink } from "./learning-journey-link";
import { ProgramConnections } from "./program-connections";
import Image from "next/image";
import { EngagementWorkedExample } from "./multimedia/engagement-worked-examples";
import Link from "next/link";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { ResourceDownloads } from "@/components/resource-downloads";
import { AMPLIFY_PAGES } from "@/lib/content/amplify";
import { linkListValue, stringListValue, stringValue } from "@/lib/content/staff-surface-registry";
import { AmplifyActivityStudio, AmplifyConversationTool } from "./amplify-tools";

const entrances = [
  { title: "Connect and discover", text: "Good company, shared interests, and something new to enjoy. Make room for a little curiosity.", href: "/one-dsd/amplify/gatherings", link: "Find an idea for gathering", tone: "bg-[#f7eee2]" },
  { title: "Learn with colleagues", text: "Trade a useful idea, find another perspective, or explore what you want to do next.", href: "/one-dsd/amplify/mentoring", link: "Explore mentoring and peers", tone: "bg-[#eaf1f8]" },
  { title: "Ideas into practice", text: "Bring a question or possibility for better work. You do not need a finished solution.", href: "/one-dsd/amplify/ideas", link: "Give an idea some shape", tone: "bg-[#f2edf7]" },
];

export async function AmplifyPage({ id }: { id: typeof AMPLIFY_PAGES[number]["id"] }) {
  const page = AMPLIFY_PAGES.find(item => item.id === id)!;
  const surface = await prepareEditableSurface(`amplify.${id}`);
  const copy = surface.values;
  const home = id === "home";
  const resources = linkListValue(copy, "resources");
  const community = resources.find(link => link.label === "Open the Amplify space");
  const sections = <div className={`${styles.readingSections} space-y-9`}>{page.sections.map(([, body], index) => <section key={index} aria-labelledby={`amplify-section-${index}`}>
    <h2 id={`amplify-section-${index}`} className="text-2xl font-semibold">{stringValue(copy, `section${index}Title`)}</h2>
    {typeof body === "string" ? <p className="mt-3 leading-8">{stringValue(copy, `section${index}Body`)}</p> : <ul className="mt-3 list-disc space-y-3 pl-5 leading-7">{stringListValue(copy, `section${index}Body`).map(item => <li key={item}>{item}</li>)}</ul>}
    {((id === "well-being" && index === 2) || (id === "co-leads" && index === 3) || (id === "materials" && index === 4)) && <EngagementWorkedExample kind={id} />}
  </section>)}</div>;
  return <EditableSurfaceRegion surface={surface} className={styles.page}>
    <div className="wrap max-w-6xl py-10">
      <Link href="/one-dsd">{stringValue(copy, "backLabel")}</Link>
      <header className={home ? `${styles.hero} my-7 grid overflow-hidden rounded-2xl border border-[#e0d7c9] bg-[#faf7f1] lg:grid-cols-2` : `${styles.hero} my-7 p-7 sm:p-9`}>
        <div className={home ? "p-6 sm:p-9 lg:p-10" : ""}>
          {home && <p className={`${styles.eyebrow} mb-4`}>Good company. Shared possibilities.</p>}
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{stringValue(copy,"title")}</h1>
          <p className="mt-5 text-xl leading-relaxed">{stringValue(copy,"intro")}</p>
          {home && community && <Link href={community.href} className="mt-7 inline-block rounded-full bg-[#123f60] px-6 py-3 font-semibold text-white no-underline hover:bg-[#092b44]">{community.label} →</Link>}
        </div>
        {home && <div className="relative min-h-64 lg:min-h-96"><Image src="/images/program-workplace-conversation.webp" alt="Three people sharing a conversation around a table in a bright sitting area." fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></div>}
      </header>
      <nav aria-label="Amplify Equity" className={styles.sectionNav}>{linkListValue(copy,"navigation").map(link=><Link key={link.href} href={link.href} aria-current={link.href===surface.definition.route ? "page" : undefined} className={link.href===surface.definition.route ? "font-semibold" : ""}>{link.label}</Link>)}</nav>
      {surface.available ? <ResourceDownloads kind="amplify" id={id} noun="page" scope="dsd" /> : null}
      {home ? <>
        <section className="py-10" aria-labelledby="amplify-possibilities"><h2 id="amplify-possibilities" className="text-3xl font-semibold">What brings you here today?</h2><p className="mt-3">Follow an interest, share a perspective, or simply spend time with colleagues.</p>
          <div className={`${styles.entryCards} mt-6 grid gap-5 md:grid-cols-3`}>{entrances.map(item=><article key={item.href} className={`flex flex-col rounded-xl p-6 ${item.tone}`}><h3 className="text-2xl font-semibold">{item.title}</h3><p className="my-4 grow leading-7">{item.text}</p><Link href={item.href} className="font-semibold underline">{item.link} →</Link></article>)}</div>
        </section>
        <section className={`${styles.conversationBand} grid gap-8 border-y border-line py-9 md:grid-cols-2`} aria-labelledby="amplify-spark"><div><p className="text-sm font-semibold uppercase tracking-widest text-[#71502f]">A conversation starter</p><h2 id="amplify-spark" className="mt-3 text-3xl font-semibold">What is one small thing that makes your working day better?</h2><p className="mt-4 leading-7">A useful handoff, a moment of quiet, a colleague who makes room. Begin with something familiar and see where the conversation goes.</p></div><div className="flex flex-col justify-center gap-5"><Link className="font-semibold underline" href="/one-dsd/amplify/well-being">Make room for well-being →</Link><Link className="font-semibold underline" href="/one-dsd/amplify/gatherings">Browse twelve ideas for gathering →</Link><Link className="font-semibold underline" href="/operationalizing-equity">Connect everyday experiences with equity in practice →</Link></div></section>
        <section className="py-9" aria-labelledby="amplify-cross-team"><h2 id="amplify-cross-team" className="text-3xl font-semibold">A good idea can travel</h2><p className="mt-4 max-w-3xl leading-8">What helps one team may offer a useful starting point for another. Share a practice, explore the work behind another team&apos;s name, or bring colleagues together around a question you have in common.</p><div className="mt-5 flex flex-wrap gap-6"><Link href="/understanding-dhs" className="font-semibold underline">See how the work connects →</Link><Link href="/one-dsd/amplify/ideas" className="font-semibold underline">Explore an idea together →</Link></div></section>
        <ProgramConnections /><LearningJourneyLink scope={surface.scope} compact /><details className="rounded-xl border border-line p-6"><summary className="cursor-pointer text-xl font-semibold">About Amplify and taking part</summary><div className="mt-7 max-w-3xl">{sections}</div></details>
      </> : <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem]"><div className="min-w-0">{id === "gatherings" ? <><AmplifyActivityStudio /><details className="mt-8 rounded-xl border border-line p-6"><summary className="cursor-pointer text-xl font-semibold">More ideas for hosting a conversation</summary><div className="mt-6">{sections}</div></details></> : sections}
        {id === "mentoring" && <><EngagementWorkedExample kind="mentoring" /><AmplifyConversationTool mode="mentoring" /></>}
        {id === "ideas" && <><EngagementWorkedExample kind="idea" /><AmplifyConversationTool mode="idea" /></>}
        {id === "materials" && <div className="mt-8 rounded-xl bg-[#eef3f8] p-6"><h2 className="text-2xl font-semibold">Make a useful draft</h2><ul className="mt-4 space-y-4"><li><Link href="/one-dsd/amplify/gatherings#gathering-plan">Create a gathering invitation and plan</Link></li><li><Link href="/one-dsd/amplify/mentoring#mentoring-tool">Prepare a mentoring conversation</Link></li><li><Link href="/one-dsd/amplify/ideas#idea-tool">Shape an idea to discuss</Link></li></ul></div>}
        {(id === "well-being" || id === "mentoring") && <section className="mt-9 border-t border-line pt-6"><h2 className="text-2xl font-semibold">Explore further</h2><ul className="mt-4 space-y-4">{id === "mentoring" ? <><li><Link href="/resources/pn-mentoring-sponsorship">Mentoring, sponsorship, and reverse mentoring</Link></li><li><Link href="/resources/pn-accessible-leadership-pathways">Accessible leadership pathways</Link></li><li><a href="https://nap.nationalacademies.org/resource/25568/interactive/tools-and-resources.html">National Academies: practical mentoring tools</a><p className="mt-1 text-sm">Research from science and education offers ideas to adapt to different workplaces.</p></li></> : <><li><Link href="/learn?theme=culture">Workplace culture and well-being resources</Link></li><li><Link href="/one-dsd/amplify/ideas">Explore a change that could help</Link></li><li><a href="https://www.hhs.gov/surgeongeneral/reports-and-publications/workplace-well-being/index.html">The Surgeon General&apos;s workplace well-being framework</a></li><li><a href="https://www.cdc.gov/niosh/twh/php/hierarchy/">NIOSH: working conditions and well-being</a></li></>}</ul></section>}
      </div><aside className={styles.sidebar}><h2 className="text-xl font-semibold">{stringValue(copy,"resourcesTitle")}</h2><ul className="mt-4 list-none space-y-5 p-0">{resources.map(link=><li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}<li><Link href="/ask">Browse common questions</Link></li><li><Link href="/support">Find support</Link></li></ul></aside></div>}
    </div>
  </EditableSurfaceRegion>;
}
