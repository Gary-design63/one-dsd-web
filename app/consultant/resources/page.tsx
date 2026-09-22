import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Notice } from "@/components/ui";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import {
  listResourceReleaseQueue,
  resourceReleaseAvailable,
} from "@/lib/content/resource-release";

export const metadata: Metadata = { title: "Resource review" };
export const dynamic = "force-dynamic";

export default async function ResourceReviewPage() {
  if (!(await ownerPageGuard())) return null;
  const connected = resourceReleaseAvailable();
  const resources = connected ? await listResourceReleaseQueue() : [];
  const drafts = resources.filter((resource) => resource.hasDraft);

  return (
    <>
      <PageIntro
      kicker="Consultant Workspace"
        title="Resource review"
        lede="Review draft changes, record each required decision, and choose what staff can use."
      />
      <div className="wrap py-8">
        <p><Link href="/consultant/resources/new" className="btn btn--primary">+ Add a resource</Link></p>
        {!connected ? (
          <Notice tone="warn">Resource review is not connected in this copy of the program.</Notice>
        ) : null}
        <section className="card" aria-labelledby="draft-resource-heading">
          <p className="kicker">Waiting for review</p>
          <h2 className="text-xl font-extrabold" id="draft-resource-heading">
            Draft resources
          </h2>
          {drafts.length ? (
            <ul className="mt-4 space-y-3">
              {drafts.map((resource) => (
                <li className="panel" key={resource.contentItemId}>
                  <Link className="font-bold" href={`/consultant/resources/${encodeURIComponent(resource.contentItemId)}`}>
                    {resource.title}
                  </Link>
                  <p className="mt-1 mb-0 text-sm">
                    {resource.readyToPublish
                      ? "Every required review is complete. You may publish after a final check."
                      : "One or more required reviews still need a decision."}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0">No resource drafts are waiting for review.</p>
          )}
        </section>

        <section className="card mt-6" aria-labelledby="all-resource-heading">
          <p className="kicker">Resource history</p>
          <h2 className="text-xl font-extrabold" id="all-resource-heading">
            Published and withdrawn resources
          </h2>
          {resources.length ? (
            <ul className="mt-4 list-disc pl-6">
              {resources.map((resource) => (
                <li key={resource.contentItemId}>
                  <Link href={`/consultant/resources/${encodeURIComponent(resource.contentItemId)}`}>
                    {resource.title}
                  </Link>
                  {resource.isPublished ? " — available to staff" : " — withdrawn"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0">No resource history is available in this program view.</p>
          )}
        </section>
      </div>
    </>
  );
}
