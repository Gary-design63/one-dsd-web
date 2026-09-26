import styles from "../../../learn/learning-family.module.css";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { EquityToolkitExperience } from "@/components/equity-toolkit-experience";
import { linkListValue, stringValue } from "@/lib/content/staff-surface-registry";
import Link from "next/link";

export const metadata = { title: "Practice with the Equity Analysis Toolkit" };
export const dynamic = "force-dynamic";

export default async function SharedToolkitPracticePage() {
  const surface = await prepareEditableSurface("equity-toolkit.home", { scope: "one-dhs", includeOwner: false });
  const text = (key: string) => stringValue(surface.values, key);
  return <EditableSurfaceRegion surface={surface}>
    <div className={`${styles.page} ${styles.content} ${styles.readingPage} space-y-10`}>
      <header className="space-y-4">
        <Link href="/share/equity-toolkit">← Podcast and toolkit introduction</Link>
        <h1 className="text-4xl font-semibold">Practice with the Equity Analysis Toolkit</h1>
        <p className="max-w-3xl text-xl">Explore a decision and prepare notes for a conversation with the people responsible.</p>
      </header>
      <EquityToolkitExperience values={surface.values} />
      <section id="toolkit-resources" className="space-y-4 border-t border-line pt-8 print:hidden">
        <h2 className="text-2xl font-semibold">{text("resourcesTitle")}</h2>
        <p>{text("resourcesIntro")}</p>
        <p className="max-w-3xl">{text("resourceIntro")}</p>
        <ul className="list-disc space-y-3 pl-6">{linkListValue(surface.values, "supportingResources").map(link => (
          <li key={link.href}>{link.href.startsWith("http") ? <a href={link.href} rel="noreferrer">{link.label}</a> : link.label}</li>
        ))}</ul>
        <p className={styles.shareNote}>Links to other parts of the program aren&rsquo;t included in this shared view.</p>
      </section>
    </div>
  </EditableSurfaceRegion>;
}
