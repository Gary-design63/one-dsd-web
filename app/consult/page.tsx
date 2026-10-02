import type { Metadata } from "next";
import Link from "next/link";
import consult from "@/components/consult/consult.module.css";
import workspace from "@/components/workspace-presentation.module.css";
import { PageIntro } from "@/components/ui";
import { RequestForm } from "@/components/consult/request-form";
import { OTHER_OFFICES_NOTE } from "@/lib/consult/types";

export const metadata: Metadata = { title: "One DSD Consult" };
export const dynamic = "force-dynamic";

export default function ConsultPage() {
  return (
    <>
      <PageIntro
        kicker="Ask the consultant"
        title="One DSD Consult"
        lede="Bring a piece of work you are shaping, and the consultant will think it through with you. You will hear back within two business days, and you can return to your request at any time to see where it stands."
      />
      <div className="wrap">
        <div className={consult.pageBody}>
          <div className={workspace.workGrid}>
            <RequestForm />
            <aside className={workspace.recommendation} aria-label="What to expect">
              <div className={consult.asideBlock}>
                <p className="kicker">What happens next</p>
                <h2 className="text-2xl font-extrabold">A reply within two business days</h2>
                <p>The consultant will let you know who is taking your request on. After that, your private link shows where things stand, and when the work is finished it carries a short note about how it turned out.</p>
                <p>If you decide you no longer need help, you can withdraw the request from the same page.</p>
              </div>
              <div className={consult.asideBlock}>
                <h3>When another team is the better place</h3>
                <p>{OTHER_OFFICES_NOTE}</p>
                <p><Link href="/support/right-person">Find the right person for this work</Link></p>
              </div>
              <div className={consult.asideBlock}>
                <h3>Already sent a request?</h3>
                <p>Open the private link in your confirmation email. If you cannot find it, the consultant can send it to you again.</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
