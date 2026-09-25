import styles from "@/components/dsd-experience.module.css";
import Image from "next/image";
import { EngagementContributionMap } from "@/components/multimedia/engagement-contribution-map";
import { ProgramConnections } from "@/components/program-connections";
import { LearningJourneyLink } from "@/components/learning-journey-link";
import Link from "next/link";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { ResourceDownloads } from "@/components/resource-downloads";
import { TEAM_SECTIONS } from "@/lib/content/dsd-team";
import { stringValue, linkListValue } from "@/lib/content/staff-surface-registry";

export const metadata = { title: "One DSD Team" };
export default async function Page() {
  const surface = await prepareEditableSurface("dsd-team.home");
  const copy = surface.values;
  const teamSection = (index: number) => <section key={index}><h2 className="text-2xl font-semibold">{stringValue(copy, `heading${index}`)}</h2><p className="mt-3 leading-relaxed">{stringValue(copy, `body${index}`)}</p>{index === 1 && <EngagementContributionMap />}</section>;
  return <EditableSurfaceRegion surface={surface} className={styles.page}>
    <div className="wrap max-w-6xl py-10">
      <Link href="/one-dsd">{stringValue(copy, "backLabel")}</Link>
      <header className={`${styles.hero} my-7 overflow-hidden rounded-2xl border border-[#dfd8cb] bg-[#faf7f1]`}><div className="grid lg:grid-cols-2"><div className="p-7 sm:p-10"><p className={styles.eyebrow}>Shared knowledge. Practical change.</p><h1 className="mt-4 text-4xl font-semibold md:text-5xl">{stringValue(copy, "title")}</h1><p className="mt-5 text-xl leading-relaxed">{stringValue(copy, "intro")}</p><p className="mt-5 leading-7">A voluntary, staff-driven team led by the Equity and Inclusion Operations Consultant. Bring your experience, grow alongside colleagues, and help make equity part of how our division works.</p><div className="mt-6 flex flex-wrap items-center gap-5"><Link className="inline-block rounded-full bg-[#123f60] px-6 py-3 font-semibold text-white" href="/orientation">New here? Find your starting point →</Link><Link className="font-semibold" href="/one-dsd/team/workspace">Team members: open the team space →</Link></div></div><Image src="/images/one-dsd-planning-together.webp" alt="Four colleagues planning together around a table and arranging ideas on a board." width={1536} height={1024} className="h-auto w-full self-center" sizes="(min-width: 1024px) 50vw, 100vw" /></div></header>
      {surface.available ? <details className="my-6 border-y border-line py-4"><summary className="cursor-pointer font-semibold">Download this team page</summary><div className="mt-4"><ResourceDownloads kind="team" id="one-dsd" noun="page" scope="dsd" compact /></div></details> : null}
      <section className="my-10"><h2 className="text-3xl font-semibold">A doing space. A growing space.</h2><div className={`${styles.entryCards} mt-6 grid gap-5 md:grid-cols-3`}>{[
        ["Explore the work", "Look across workforce practices, policy, programs, services, access, partnerships, resources, and the evidence that helps us understand results.", "/one-dsd", "Explore DSD program areas"],
        ["Learn together", "Bring a question, explore a topic with the consultant, or listen to another perspective. Learning Labs and open hours leave room for curiosity.", "/one-dsd/team/learning-lab", "Visit the Learning Lab"],
        ["Move an idea forward", "Start with a real experience. Examine evidence, develop options with the right people, and return to what changed.", "/one-dsd/amplify/ideas", "Shape an idea"]
      ].map(([title,body,href,label],i)=><article key={title} className={`rounded-xl p-6 ${["bg-[#eaf1f8]","bg-[#f7eee2]","bg-[#f2edf7]"][i]}`}><h3 className="text-2xl font-semibold">{title}</h3><p className="my-4 leading-7">{body}</p><Link className="font-semibold" href={href}>{label} →</Link></article>)}</div></section>
      <section className={`${styles.rhythm} my-10 border-y border-line py-8`}><h2 className="text-3xl font-semibold">Our rhythm together</h2><p className="mt-4 max-w-3xl leading-8">The planned monthly rhythm begins in January 2027, once the program is ready. Practical team work alternates with Learning Labs or open hours. Begin with orientation to One DHS and One DSD, then find a contribution that fits your interests and capacity. Confirmed meeting arrangements will be shared in the team space.</p><div className="mt-5 flex flex-wrap gap-6"><Link href="/orientation">Explore orientation →</Link><Link href="/one-dsd/team/learning-lab">See how a Learning Lab can work →</Link></div></section>
      <section className={`${styles.leadershipInvitation} my-9 rounded-xl bg-[#f2edf7] p-7`}><h2 className="text-2xl font-semibold">Grow the practice of leadership</h2><p className="my-4 leading-7">Explore how DEIA shapes hiring, everyday support, development, and succession. Bring a reflection or a practice question back to the team.</p><Link href="/one-dsd/leadership">Explore DEIA leadership and growth →</Link></section>
      <ProgramConnections /><LearningJourneyLink scope="dsd" compact />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className={`${styles.readingSections} space-y-6`}>
          {teamSection(0)}
          <details className="border-t border-line pt-5">
            <summary className="cursor-pointer text-xl font-semibold">How the team works in practice</summary>
            <div className="mt-6 space-y-8">{TEAM_SECTIONS.slice(1).map((_, index) => teamSection(index + 1))}</div>
          </details>
        </div>
        <aside className={styles.sidebar}><h2 className="text-xl font-semibold">{stringValue(copy, "linksTitle")}</h2><ul className="mt-5 space-y-5">{linkListValue(copy, "links").map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></aside>
      </div>
    </div>
  </EditableSurfaceRegion>;
}
