import Link from "next/link";
import styles from "../../learning-family.module.css";
import { requestedContentScope } from "@/lib/product/request-context";
import { redirect } from "next/navigation";

export const metadata = { title: "Apply the toolkit to your DSD work" };

const areas = [
  ["Home and Community-Based Services Policy and Waivers", "Equity-Analysis-Toolkit-HCBS-Node.html"],
  ["MnCHOICES Assessment and Access", "Equity-Analysis-Toolkit-MnCHOICES-Node.html"],
  ["Support Planning and Case Management", "Equity-Analysis-Toolkit-SupportPlanning-Node.html"],
  ["Positive Supports and Person-Centered Practice", "Equity-Analysis-Toolkit-PositiveSupports-Node.html"],
  ["Olmstead and Community Integration", "Equity-Analysis-Toolkit-Olmstead-Node.html"],
  ["Employment and Day Services", "Equity-Analysis-Toolkit-Employment-Node.html"],
  ["EIDBI and Children's Services", "Equity-Analysis-Toolkit-EIDBI-Node.html"],
  ["Brain Injury, Guardianship, and Related Programs", "Equity-Analysis-Toolkit-TBIGuardianship-Node.html"],
  ["Contracts, Grants, Fiscal, and Capacity Work", "Equity-Analysis-Toolkit-ContractsFiscal-Node.html"],
  ["Data, Quality, and Evaluation", "Equity-Analysis-Toolkit-DataQuality-Node.html"],
  ["Training, Communication, and Strategic Communications", "Equity-Analysis-Toolkit-Communications-Node.html"],
  ["Division Leadership, Legislative Work, and Strategy", "Equity-Analysis-Toolkit-Leadership-Node.html"],
] as const;

const roles = [
  ["Executive and Division Leadership", "Equity-Analysis-Toolkit-JF-Leadership-Node.html"],
  ["Policy and Program Analysis", "Equity-Analysis-Toolkit-JF-Policy-Node.html"],
  ["Eligibility and Service Delivery", "Equity-Analysis-Toolkit-JF-Service-Node.html"],
  ["Supervision and Management", "Equity-Analysis-Toolkit-JF-Management-Node.html"],
  ["Hiring and Workforce Development", "Equity-Analysis-Toolkit-JF-Workforce-Node.html"],
  ["Budgets, Grants, and Contracts", "Equity-Analysis-Toolkit-JF-Fiscal-Node.html"],
  ["Data, Research, and Quality", "Equity-Analysis-Toolkit-JF-Data-Node.html"],
  ["Community Engagement and Partnership", "Equity-Analysis-Toolkit-JF-Engagement-Node.html"],
  ["Communication and Accessibility", "Equity-Analysis-Toolkit-JF-Communication-Node.html"],
  ["Equity Practice and Organizational Change", "Equity-Analysis-Toolkit-JF-Equity-Node.html"],
] as const;

function ChoiceGroup({ title, description, items }: {
  title: string;
  description: string;
  items: readonly (readonly [string, string])[];
}) {
  return <details className="rounded-xl border border-line bg-white p-5 open:pb-6">
    <summary className="cursor-pointer text-xl font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">{title}</summary>
    <p className="mt-3 text-[#405766]">{description}</p>
    <ul className="mt-4 grid gap-x-8 gap-y-0 md:grid-cols-2">
      {items.map(([label, file]) => <li key={file} className="border-t border-line py-3">
        <Link className="font-medium underline underline-offset-4" href={`/toolkit-work/${file}`}>{label}</Link>
      </li>)}
    </ul>
  </details>;
}

export default async function ApplyToolkitPage() {
  const scope = await requestedContentScope();
  if (scope === "one-dhs") redirect("/learn/equity-toolkit/practice");
  return <div className={`${styles.page} ${styles.content} ${styles.readingPage} space-y-8`}>
    <header className="space-y-4">
      <Link href="/learn/equity-toolkit/goals">← Six goals and work plan</Link>
      <h1>Apply the toolkit to your work</h1>
      <p>Choose a DSD program area or the kind of work you do. Each example helps you use the DHS Equity Analysis Toolkit in a real decision.</p>
    </header>
    <section className="space-y-5" aria-label="Choose your work context">
      <h2>Find your starting point</h2>
      <ChoiceGroup title="By program area" description="Choose the part of DSD's work closest to your decision." items={areas} />
      <ChoiceGroup title="By job family" description="Choose the kind of work you do. These are examples, not official job classifications." items={roles} />
      <p>You can also <Link href="/toolkit-work/Equity-Analysis-Toolkit-Guide.html">open the general guide</Link> if neither group fits.</p>
    </section>
    <nav aria-label="Continue the toolkit" className="border-t border-line pt-6 print:hidden">
      <Link className={styles.primaryAction} href="/learn/equity-toolkit/practice">Continue to practice →</Link>
    </nav>
  </div>;
}
