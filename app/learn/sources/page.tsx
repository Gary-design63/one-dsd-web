import { courseLink } from "@/lib/content/courses/published";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "./sources.module.css";
import { PageIntro } from "@/components/ui";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { ResourceDownloads } from "@/components/resource-downloads";
import { stringValue } from "@/lib/content/staff-surface-registry";
import { requestedContentScope } from "@/lib/product/request-context";
import { ProgramContextNote } from "@/components/program-context";
import { AUTHORITY_GROUP_LABEL, SOURCE_REGISTER, annotationsFor, registerSourcesForStaff, registerSummary, sourceAnchor, verificationFor } from "@/lib/content/source-register";

export const metadata: Metadata = { title: "Research and sources" };
export const dynamic = "force-dynamic";

const RESOURCE_TYPE_LABEL: Record<string, string> = {
  authored_course: "course", recovered_course: "course", community_brief: "community brief", corpus_item: "library item", domain_corpus_item: "library item",
  equity_framework: "Equity Framework", dhs_reference: "Understanding DHS", practice_path: "practice path", editable_surface: "reading list",
};

export default async function SourcesPage() {
  const scope = await requestedContentScope();
  const surface = await prepareEditableSurface("sources.page", { scope });
  const copy = surface.values;
  const text = (key: string) => stringValue(copy, key);
  const groups = registerSourcesForStaff();
  const summary = registerSummary();
  const thinResources = SOURCE_REGISTER.resources.filter(resource => resource.resourceType !== "practice_path" && resource.externalCount === 0 && (resource.placeholderCount > 0 || resource.sourceIds.length === 0 || resource.programRouteCount > 0));
  const namedOnly = SOURCE_REGISTER.sources.filter(source => source.kind === "placeholder");
  return (
    <EditableSurfaceRegion surface={surface} className={styles.page}>
      <div className="wrap"><Link href="/learn" className={styles.back}>← Learning and resources</Link></div>
      <PageIntro kicker={text("introKicker")} title={text("introTitle")} lede={text("introLede")}>
        <div className={styles.summary}>
          <div><b>{summary.sources}</b><span>{text("countLabel")}</span></div>
          <div><b>{summary.outside}</b><span>outside sources</span></div>
          <div><b>{summary.resources}</b><span>resources correlated</span></div>
          <div><b>{summary.citations}</b><span>citations</span></div>
        </div>
      </PageIntro>
      <div className="wrap">
        {surface.available ? <ResourceDownloads kind="sources" id="register" noun="source register" scope={scope} /> : null}
        <div className={styles.read}>
          <section><h2>{text("readTitle")}</h2><p>{text("readBody")}</p></section>
          <section><h2>{text("statesTitle")}</h2><p>{text("statesBody")}</p></section>
        </div>
        <nav aria-label="Source groups"><ul className={styles.groupNav}>{groups.map(({ group, sources }) => <li key={group}><a href={`#group-${group}`}>{AUTHORITY_GROUP_LABEL[group]} ({sources.length})</a></li>)}</ul></nav>
        {groups.map(({ group, sources }) => (
          <section key={group} id={`group-${group}`} className={styles.group} aria-labelledby={`group-${group}-title`}>
            <h2 id={`group-${group}-title`}>{AUTHORITY_GROUP_LABEL[group]}</h2>
            <p className={styles.groupCount}>{sources.length} {sources.length === 1 ? "source" : "sources"}</p>
            <ul className={styles.list}>
              {sources.map(source => {
                const verification = verificationFor(source);
                const notes = annotationsFor(source);
                return (
                  <li key={source.sourceId} id={sourceAnchor(source)} className={styles.entry}>
                    <h3>{source.kind === "external" && source.href ? <a href={courseLink(source.href)} rel="noreferrer">{source.title}</a> : source.title}</h3>
                    <p className={styles.meta}>
                      {source.host ? <span className={styles.host}>{source.host}</span> : null}
                      <span className={styles.state} data-state={verification.state} title={verification.detail}>{verification.label}</span>
                      {verification.state === "reached_moved" && verification.finalUrl ? <a href={courseLink(verification.finalUrl)} rel="noreferrer">{text("movedLabel")}</a> : null}
                    </p>
                    {notes.length ? <><span className={styles.notesLabel}>{text("annotationLabel")}</span><ul className={styles.notes}>{notes.map((note, index) => <li key={index}>{note}</li>)}</ul></> : null}
                    <span className={styles.usedLabel}>{text("usedInLabel")}</span>
                    <ul className={styles.used}>{source.citations.map(citation => <li key={`${citation.resourceType}:${citation.resourceId}:${citation.role}`}><Link href={citation.route}>{citation.resourceTitle}</Link> <span>· {RESOURCE_TYPE_LABEL[citation.resourceType] ?? citation.resourceType}</span></li>)}</ul>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <section className={styles.thin} aria-labelledby="thin-title">
          <h2 id="thin-title">{text("thinTitle")}</h2>
          <p>{text("thinBody")}</p>
          {namedOnly.length ? <><h3>Named without an address</h3><ul>{namedOnly.map(source => <li key={source.sourceId}><a href={`#${sourceAnchor(source)}`}>{source.title}</a></li>)}</ul></> : null}
          {thinResources.length ? <><h3>Resources with no outside source on record</h3><ul>{thinResources.map(resource => <li key={`${resource.resourceType}:${resource.resourceId}`}><Link href={resource.route}>{resource.title}</Link> <span className="text-muted">· {RESOURCE_TYPE_LABEL[resource.resourceType]}</span></li>)}</ul></> : null}
        </section>
        <ProgramContextNote />
      </div>
    </EditableSurfaceRegion>
  );
}
