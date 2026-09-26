import styles from "../../learning-family.module.css";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { EquityToolkitExperience } from "@/components/equity-toolkit-experience";
import { requestedContentScope } from "@/lib/product/request-context";
import { linkListValue, stringValue } from "@/lib/content/staff-surface-registry";
import Link from "next/link";

export const metadata = { title: "Practice with the Equity Analysis Toolkit" };

export default async function ToolkitPracticePage() {
  const scope = await requestedContentScope();
  const [surface, connections] = await Promise.all([
    prepareEditableSurface("equity-toolkit.home", { scope }),
    prepareEditableSurface("community-connections.home", { scope, includeOwner: false }),
  ]);
  const text = (key: string) => stringValue(surface.values, key);
  return <EditableSurfaceRegion surface={surface}>
    <div className={`${styles.page} ${styles.content} ${styles.readingPage} space-y-10`}>
      <header className="space-y-4">
        <Link href="/learn/equity-toolkit/goals">← Six goals and work plan</Link>
        <h1 className="text-4xl font-semibold">Practice with the Equity Analysis Toolkit</h1>
        <p className="max-w-3xl text-xl">Work through a decision, compare possible approaches, and prepare notes for a conversation with the people responsible.</p>
      </header>
      <EquityToolkitExperience values={surface.values} />
      {connections.available ? <aside className="space-y-3 border-t border-line pt-6"><h2 className="text-2xl font-semibold"><Link href="/learn/community-connections">{stringValue(connections.values, "title")}</Link></h2><p>{stringValue(connections.values, "intro")}</p></aside> : null}
      <section id="toolkit-resources" className="space-y-4 border-t border-line pt-8 print:hidden">
        <h2 className="text-2xl font-semibold">{text("resourcesTitle")}</h2>
        <p>{text("resourcesIntro")}</p>
        <p className="max-w-3xl">{text("resourceIntro")}</p>
        <ul className="list-disc space-y-3 pl-6">{linkListValue(surface.values, "supportingResources").map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
      </section>
    </div>
  </EditableSurfaceRegion>;
}
