import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { ReviewClient } from "@/components/review-client";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { stale } from "@/lib/intelligence/orchestrator";

export const metadata: Metadata = { title: "Content review" };
export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  if (!(await ownerPageGuard())) return null;
  const flags = await stale();
  return (
    <>
      <PageIntro kicker="Before you publish" title="Content review" lede="Use one review to suggest how a resource should be described and organized. Use the other to examine plain language and accessibility. You make every final decision. These checks can point out concerns, but they do not certify that a draft meets every accessibility standard." />
      <div className="wrap py-8">
        <ReviewClient />
        <section className="mt-10" aria-labelledby="stale">
          <h2 id="stale" className="text-xl font-extrabold">
            Content that may need review ({flags.length})
          </h2>
          <p className="text-sm text-muted">The currency check only points out content that may need attention. It never removes an item, and you decide what happens next.</p>
          {flags.length ? (
            <table className="data mt-2">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Problem</th>
                  <th scope="col">Owner</th>
                </tr>
              </thead>
              <tbody>
                {flags.map((f) => (
                  <tr key={f.id + f.problem}>
                    <td>{f.title}</td>
                    <td>{f.problem.replace(/_/g, " ")}</td>
                    <td className="text-xs">{f.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted">No content needs a currency review right now.</p>
          )}
        </section>
      </div>
    </>
  );
}
