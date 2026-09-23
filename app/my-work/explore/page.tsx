import { LearningJourneyLink } from "@/components/learning-journey-link";
import styles from "@/components/workspace-presentation.module.css";
import Link from "next/link";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { WORK_PROFILES, WORK_TASKS, selectWorkLearning } from "@/lib/content/work-learning";
import { stringValue } from "@/lib/content/staff-surface-registry";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import { requestedContentScope } from "@/lib/product/request-context";
import { ResourceMediaPreview } from "@/components/multimedia/resource-media-preview";

export const metadata = { title: "Learning for your work" };
export default async function Page({ searchParams }: { searchParams: Promise<{ role?: string; task?: string }> }) {
  const query = await searchParams;
  const role = WORK_PROFILES.find(([id]) => id === query.role)?.[0] ?? "";
  const task = WORK_TASKS.find(([id]) => id === query.task)?.[0] ?? "";
  const scope = await requestedContentScope();
  const [surface, { items }] = await Promise.all([prepareEditableSurface("work-learning.home", { scope }), loadStaffContentSnapshot({ scope })]);
  const text = (key: string) => stringValue(surface.values, key);
  const matches = surface.available ? selectWorkLearning(items, surface.values, role, task) : [];
  const noticeCourse = role === "communication" && surface.available ? await prepareEditableSurface("course.plain-language-in-human-services", { scope, includeOwner: false }) : null;
  return <EditableSurfaceRegion surface={surface}>
    <div className="wrap max-w-6xl space-y-8 py-10">
      <Link href="/my-work">{text("back")}</Link>
      <header className="max-w-3xl"><h1 className="text-4xl font-semibold">{text("title")}</h1><p className="mt-5 text-xl">{text("intro")}</p></header>
      <form key={`${role}:${task}`} action="/my-work/explore" method="get" className={styles.workFilters}>
        <label className="flex flex-col gap-2">{text("roleLabel")}<select className="max-w-full border p-3" name="role" defaultValue={role}><option value="">{text("anyRole")}</option>{WORK_PROFILES.map(([id]) => <option key={id} value={id}>{text(`${id}Label`)}</option>)}</select></label>
        <label className="flex flex-col gap-2">{text("taskLabel")}<select className="max-w-full border p-3" name="task" defaultValue={task}><option value="">{text("anyTask")}</option>{WORK_TASKS.map(([id]) => <option key={id} value={id}>{text(`task${id}Label`)}</option>)}</select></label>
        <button type="submit" className="btn btn--primary">{text("submit")}</button>
      </form>
      <p>{text("choice")}</p>
      {role ? <section><h2 className="text-2xl font-semibold">{text("purposeTitle")}</h2><p className="mt-3">{text(`${role}Purpose`)}</p></section> : null}
      {role || task ? <section><h2 className="text-2xl font-semibold">{text("resultsTitle")}</h2><p>{text("taskNote")}</p>{matches.length ? <ul className={styles.workResults}>{matches.map(item => <li key={item.id}><h3 className="text-xl font-semibold"><Link href={`/library/${encodeURIComponent(item.id)}`}>{item.title}</Link></h3><p className="mt-3">{item.summary}</p></li>)}</ul> : <p>{text("empty")}</p>}</section> : null}
      {noticeCourse?.available ? <ResourceMediaPreview resourceId="course-plain-language-in-human-services" /> : null}
      <LearningJourneyLink scope={scope} compact />
      <Link href="/learn">{text("all")}</Link>
    </div>
  </EditableSurfaceRegion>;
}
