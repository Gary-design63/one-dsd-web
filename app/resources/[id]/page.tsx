import { ResourceEvidence } from "@/components/source-evidence";
import styles from "../resource-design.module.css";
import { relatedPublishedResources } from "@/lib/content/corpus-inventory";
import { normalizeWorkOrigin, withWorkOrigin } from "@/lib/product/work-origin";
import { WorkOriginLinks } from "@/components/work-origin-links";
import { LearningJourneyLink } from "@/components/learning-journey-link";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceInlineEditor } from "@/components/resource-inline-editor";
import { ResourceRemove, ResourceShare } from "@/components/resource-tools";
import { ResourceMediaGallery } from "@/components/resource-media-gallery";
import { ResourceDownloads } from "@/components/resource-downloads";
import { ActionList, AuthorityPill, Notice } from "@/components/ui";
import { editingModeFromCookies } from "@/lib/auth/request";
import { loadEditableResourceState } from "@/lib/content/resource-drafts";
import { getPublishedStaffContent } from "@/lib/content/staff-publications";
import { getPath, GRADUATION_PATHS } from "@/lib/content/paths";
import { AUTHORITY, CONTENT_TYPE_LABEL, LAYER_LABEL, reviewDateText } from "@/lib/content/types";
import { PROGRAM } from "@/lib/constants";
import { consultationIntakeEnabled } from "@/lib/intelligence/consult/availability";
import { requestedContentScope } from "@/lib/product/request-context";
import { requestedProductContext } from "@/lib/product/request-context";
import { contextualizeSupportAction } from "@/lib/product";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = await getPublishedStaffContent(id, { scope: await requestedContentScope() });
  return { title: c ? c.title : "Resource" };
}

export default async function ResourcePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<Record<string,string|string[]|undefined>> }) {
  const { id } = await params;
  const origin=normalizeWorkOrigin(await searchParams??{});
  const [scope, context] = await Promise.all([requestedContentScope(), requestedProductContext()]);
  const [c, owner, shellSurface] = await Promise.all([
    getPublishedStaffContent(id, { scope }),
    editingModeFromCookies(),
    prepareEditableSurface("library.resource-shell", { scope }),
  ]);
  if (!c || c.status !== "approved") notFound();
  const shell = shellSurface.values;
  let related: Awaited<ReturnType<typeof relatedPublishedResources>>=[]; let relatedUnavailable=false;
  try { related=await relatedPublishedResources(scope,id); } catch { relatedUnavailable=true; }
  // Some library items (learning modules, question banks) are not draft-editable in the
  // database. That must never take the page down: fall back to the read-only view.
  let editable: Awaited<ReturnType<typeof loadEditableResourceState>> | undefined;
  let editorUnavailable = false;
  if (owner) {
    try { editable = await loadEditableResourceState(id, { scope }); } catch (error) {
      editable = undefined;
      // Learning modules and question banks are expected to fail here; anything
      // else is a real failure the owner must be able to see.
      if (c.type !== "learning_module" && c.type !== "question_bank") {
        editorUnavailable = true;
        console.error("Resource editor could not be loaded.", error instanceof Error ? `${error.name}: ${error.message}` : error);
      }
    }
  }
  const paths = (c.pathIds ?? []).map((p) => getPath(p)).filter(Boolean);
  const isList = c.type === "checklist" || c.type === "question_bank";
  const intakeEnabled = consultationIntakeEnabled();
  const nextActions = c.nextActions.map((action) =>
    (()=>{const result=contextualizeSupportAction(action, context, intakeEnabled);return {...result,href:withWorkOrigin(result.href,origin)};})(),
  );
  const correctionAction = contextualizeSupportAction(
    { label: stringValue(shell, "consultationActionLabel"), href: "/support/request" },
    context,
    intakeEnabled,
  );

  return (
    <EditableSurfaceRegion surface={shellSurface} className={styles.page}>
      <header className={styles.hero}><div className={styles.heroInner}><Link href="/learn" className={styles.back}>← Learning and resources</Link><p className={styles.eyebrow}>{CONTENT_TYPE_LABEL[c.type]} · {LAYER_LABEL[c.layer]}</p><h1>{c.title}</h1><p className={styles.lede}>{c.summary}</p><ResourceShare title={c.title} href={`/share/library/${encodeURIComponent(c.id)}`} /><ResourceDownloads kind="library" id={c.id} scope={scope} />{owner ? <ResourceRemove contentItemId={c.id} title={c.title} /> : null}<ResourceMediaGallery contentItemId={c.id} owner={owner} />
        <p className={styles.meta}>
          {stringValue(shell, "preparedByLabel")} {c.owner}. {reviewDateText(c.reviewDate)}. {stringValue(shell, "forLabel")}: {c.scope === "dsd" ? PROGRAM.oneDsdProgramName : PROGRAM.fullName}.
        </p>
      </div></header>
      <div className={styles.content}>
        <WorkOriginLinks origin={origin} />
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
        <div className={styles.next}>
          <div>
            <ActionList heading={stringValue(shell, "nextStepsTitle")} actions={nextActions} />
            {paths.length ? (
              <>
                <h3 className="mt-3 text-lg font-bold">{stringValue(shell, "pathsTitle")}</h3>
                <ul className="list-disc pl-6">
                  {paths.map((p) => (
                    <li key={p!.id}>
                      <Link href={withWorkOrigin(`/practice/${p!.id}`,origin)}>{p!.title}</Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <div className="text-sm">
            <p className="kicker">{stringValue(shell, "questionsKicker")}</p>
            <p className="m-0">
              {stringValue(shell, "correctionsLead")} <Link href={withWorkOrigin(correctionAction.href,origin)}>{correctionAction.label.toLowerCase()}</Link>.
            </p>
          </div>
        </div>
        {related.length ? <section className="my-6 border-t border-line pt-5" aria-labelledby="related-reading"><h2 id="related-reading" className="text-xl font-bold">Related reading</h2><ul className="mt-3 space-y-2">{related.map(item=><li key={item.id}><Link href={withWorkOrigin("/library/"+encodeURIComponent(item.id),origin)}>{item.title}</Link></li>)}</ul></section> : null}
        {relatedUnavailable ? <p role="status">Related reading is temporarily unavailable. You can continue exploring the Library.</p> : null}
        <ResourceEvidence resourceType={["corpus_item","domain_corpus_item"]} resourceId={c.id} />
        <LearningJourneyLink scope={scope} resourceId={c.id} />
        {editorUnavailable ? <p className="notice notice--warn mt-6" role="status" data-resource-editor-unavailable="true">Editing controls for this resource could not be loaded right now. The published resource is unaffected. Reload the page to try again.</p> : null}
        {editable ? (
          <ResourceInlineEditor
            initial={editable}
            pathOptions={GRADUATION_PATHS.map((path) => ({ id: path.id, label: path.staffLabel }))}
          />
        ) : null}
      </div>
    </EditableSurfaceRegion>
  );
}
