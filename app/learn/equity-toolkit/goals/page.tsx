import styles from "../../learning-family.module.css";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { EquityGoalExperience } from "@/components/equity-goal-experience";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import goalModel from "@/lib/program/equity-goals.json";
import { requestedContentScope } from "@/lib/product/request-context";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = { title: "Six equity goals and work plan" };
const goalResourceIds = new Set(goalModel.goals.flatMap(goal => goal.resources.map(resource => resource.id)));

export default async function ToolkitGoalsPage() {
  const scope = await requestedContentScope();
  if (scope === "one-dhs") redirect("/learn/equity-toolkit/practice");
  const [surface, snapshot] = await Promise.all([
    prepareEditableSurface("equity-toolkit.home", { scope }),
    loadStaffContentSnapshot({ scope }),
  ]);
  return <EditableSurfaceRegion surface={surface}>
    <div className={`${styles.page} ${styles.content} ${styles.readingPage} space-y-10`}>
      <header className="space-y-4">
        <Link href="/learn/equity-toolkit">← Toolkit introduction and podcast</Link>
        <h1 className="text-4xl font-semibold">Six goals for your work</h1>
        <p className="max-w-3xl text-xl">Explore each goal, find related resources, and prepare a three-goal work plan.</p>
      </header>
      <EquityGoalExperience scope={scope} resourceLinks={snapshot.items.filter(item => item.status === "approved" && goalResourceIds.has(item.id)).map(item => ({ id: item.id, title: item.title, href: `/library/${encodeURIComponent(item.id)}` }))} />
      <nav aria-label="Continue the toolkit" className="flex flex-wrap items-center gap-5 border-t border-line pt-8 print:hidden">
        <Link className={styles.primaryAction} href="/learn/equity-toolkit/apply">Apply this to your work →</Link>
        <Link href="/learn/equity-toolkit/practice">Continue to practice with the toolkit →</Link>
      </nav>
    </div>
  </EditableSurfaceRegion>;
}
