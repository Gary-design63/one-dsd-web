import styles from "../../../resources/resource-design.module.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceMediaGallery } from "@/components/resource-media-gallery";
import { ResourceDownloads } from "@/components/resource-downloads";
import { ActionList, AuthorityPill, Notice } from "@/components/ui";
import { getPublishedStaffContent } from "@/lib/content/staff-publications";
import { AUTHORITY, CONTENT_TYPE_LABEL, LAYER_LABEL, reviewDateText } from "@/lib/content/types";
import { PROGRAM } from "@/lib/constants";
import { prepareEditableSurface } from "@/components/editable-surface";
import { requestedContentScope } from "@/lib/product/request-context";
import { stringValue } from "@/lib/content/staff-surface-registry";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = await getPublishedStaffContent(id, { scope: await requestedContentScope() });
  return { title: c ? c.title : "Resource" };
}

/**
 * Opened by a shared link only. It shows one library resource on its own,
 * with no navigation into the rest of the program — see /resources/[id] for
 * the same resource inside the full staff experience. The program view
 * (One DHS or One DSD) follows the same request context as every other page,
 * so a link shared from the One DSD view opens the One DSD version here too.
 */
export default async function SharedResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scope = await requestedContentScope();
  const [c, shellSurface] = await Promise.all([
    getPublishedStaffContent(id, { scope }),
    prepareEditableSurface("library.resource-shell", { scope, includeOwner: false }),
  ]);
  if (!c || c.status !== "approved") notFound();
  const shell = shellSurface.values;
  const isList = c.type === "checklist" || c.type === "question_bank";

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>{CONTENT_TYPE_LABEL[c.type]} · {LAYER_LABEL[c.layer]}</p>
          <h1>{c.title}</h1>
          <p className={styles.lede}>{c.summary}</p>
          <ResourceMediaGallery contentItemId={c.id} owner={false} />
          <ResourceDownloads kind="library" id={c.id} scope={scope} />
          <p className={styles.meta}>
            {stringValue(shell, "preparedByLabel")} {c.owner}. {reviewDateText(c.reviewDate)}. {stringValue(shell, "forLabel")}: {c.scope === "dsd" ? PROGRAM.oneDsdProgramName : PROGRAM.fullName}.
          </p>
        </div>
      </header>
      <div className={styles.content}>
        <p className={styles.authority}>
          <AuthorityPill authority={c.authority} /> <span className="text-sm text-muted">{AUTHORITY[c.authority].staffNote}</span>
        </p>
        {c.authority === "external_verify" ? (
          <Notice tone="warn">
            {stringValue(shell, "outsideSourceNote")}
            {c.href ? (
              <>
                {" "}
                <a href={c.href} rel="noreferrer">
                  {stringValue(shell, "openSourceLabel")} ({c.sourceName ?? stringValue(shell, "sourceWebsiteLabel")})
                </a>
                .
              </>
            ) : (
              <> {stringValue(shell, "intranetSourceNote")}</>
            )}
          </Notice>
        ) : null}
        {c.whyItMatters ? (
          <div className={styles.why}>
            <p className="kicker">{stringValue(shell, "whyKicker")}</p>
            <p className="m-0">{c.whyItMatters}</p>
          </div>
        ) : null}
        <section className={styles.reading} aria-label="Content">
          {isList ? (
            <ol className="list-decimal space-y-2 pl-6">
              {c.body.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          ) : (
            <div className="space-y-3">
              {c.body.map((p) => (
                <p key={p} className="m-0">
                  {p}
                </p>
              ))}
            </div>
          )}
        </section>
        {(() => {
          const externalActions = c.nextActions.filter((action) => action.href.startsWith("http"));
          return externalActions.length ? <ActionList heading={stringValue(shell, "nextStepsTitle")} actions={externalActions} /> : null;
        })()}
        <p className="text-sm text-muted mt-6">You&rsquo;re viewing a shared link to this resource only. It doesn&rsquo;t include the rest of the program.</p>
      </div>
    </div>
  );
}
