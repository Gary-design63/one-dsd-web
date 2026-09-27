import { courseLink } from "@/lib/content/courses/published";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "./sources.module.css";
import { PageIntro } from "@/components/ui";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";
import { requestedContentScope } from "@/lib/product/request-context";
import { ProgramContextNote } from "@/components/program-context";
import { AUTHORITY_GROUP_LABEL, registerSourcesForStaff, sourceAnchor } from "@/lib/content/source-register";
import { SourceFragmentReveal } from "@/components/source-fragment-reveal";
import { ResourceDownloads } from "@/components/resource-downloads";

export const metadata: Metadata = { title: "Research and sources" };
export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const scope = await requestedContentScope();
  const surface = await prepareEditableSurface("sources.page", { scope });
  const copy = surface.values;
  const text = (key: string) => stringValue(copy, key);
  const groups = registerSourcesForStaff().map(({ group, sources }) => ({ group, sources: sources.filter(source => source.kind === "external" && source.href) })).filter(({ sources }) => sources.length);
  return (
    <EditableSurfaceRegion surface={surface} className={styles.page}>
      <div className="wrap"><Link href="/learn" className={styles.back}>← Learning and resources</Link></div>
      <PageIntro kicker={text("introKicker")} title={text("introTitle")} lede="Explore outside sources used across the learning and resources in this program." />
      <div className="wrap">
        <SourceFragmentReveal />
        {surface.available ? <details className="max-w-4xl border-b border-line pb-3 print:hidden"><summary className="min-h-11 cursor-pointer py-2 font-semibold text-[#183247]">Download the source register</summary><ResourceDownloads kind="sources" id="register" noun="source register" scope={scope} /></details> : null}
        <nav aria-label="Source groups"><ul className={styles.groupNav}>{groups.map(({ group, sources }) => <li key={group}><a href={`#group-${group}`}>{AUTHORITY_GROUP_LABEL[group]} ({sources.length})</a></li>)}</ul></nav>
        {groups.map(({ group, sources }) => (
          <details key={group} id={`group-${group}`} className={styles.group}>
            <summary id={`group-${group}-title`}>{AUTHORITY_GROUP_LABEL[group]} ({sources.length})</summary>
            <ul className={styles.list}>
              {sources.map(source => {
                return (
                  <li key={source.sourceId} id={sourceAnchor(source)} className={styles.entry}>
                    <h3><a href={courseLink(source.href!)} rel="noreferrer">{source.title}</a></h3>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
        <ProgramContextNote />
      </div>
    </EditableSurfaceRegion>
  );
}
