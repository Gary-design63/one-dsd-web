import type { Metadata } from "next";
import { CommunityDesignPage } from "@/components/community-design-page";
import { communityDesignEnabled } from "@/lib/content/community-design";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Notice, PageIntro } from "@/components/ui";
import { getBrief } from "@/lib/content/briefs";
import { getPath } from "@/lib/content/paths";
import { communityBrief, paused } from "@/lib/intelligence/orchestrator";
import { briefVisible, toView } from "@/lib/intelligence/agents/ci";
import { consultationIntakeEnabled } from "@/lib/intelligence/consult/availability";
import { PROGRAM } from "@/lib/constants";
import { contextualizeSupportAction } from "@/lib/product";
import { requestedContentScope, requestedProductContext } from "@/lib/product/request-context";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import {
  applyCommunityBriefValues,
  communityBriefSurfaceId,
  stringValue,
} from "@/lib/content/staff-surface-registry";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (communityDesignEnabled()) {
    // The page applies the live publication gate. Do not expose a withdrawn
    // source title separately through metadata derived from the source archive.
    return { title: "Minnesota Communities" };
  }
  const b = getBrief(id);
  return { title: b && briefVisible(b) ? `${b.title} (Minnesota Communities)` : "Brief" };
}

export default async function BriefPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ level?: string }> }) {
  const { id } = await params;
  const { level } = await searchParams;
  if (communityDesignEnabled()) return <CommunityDesignPage id={id} />;
  const wantLevel2 = level === "2";
  const compact = true;
  const raw = getBrief(id);
  if (!raw) notFound();
  const scope = await requestedContentScope();
  const [briefSurface, shellSurface] = await Promise.all([
    prepareEditableSurface(communityBriefSurfaceId(id), { scope }),
    prepareEditableSurface("communities.brief-shell", { scope }),
  ]);
  if (!briefVisible(raw) && !briefSurface.canEdit) notFound();
  const editableBrief = applyCommunityBriefValues(raw, briefSurface.values);
  let b = toView(editableBrief, wantLevel2 ? 2 : 1);
  if (!(await paused()) && briefVisible(raw)) {
    await communityBrief(id, wantLevel2 ? 2 : 1);
    b = toView(editableBrief, wantLevel2 ? 2 : 1);
  }
  const paths = b.relatedPathIds.map((p) => getPath(p)).filter(Boolean);
  const intakeEnabled = consultationIntakeEnabled();
  const context = await requestedProductContext();
  const supportAction = contextualizeSupportAction(
    { label: stringValue(shellSurface.values, "consultLinkLabel"), href: "/support/request?gap=community" },
    context,
    intakeEnabled,
  );

  return (
    <EditableSurfaceRegion surface={shellSurface}>
      <EditableSurfaceRegion surface={briefSurface}>
      <div className={compact ? "community-brief-preview" : undefined}>
      {compact ? <header className="wrap brief-intro">
        <p className="kicker">{b.kicker}</p>
        <h1>{b.title}</h1>
        {stringValue(briefSurface.values, "spotlightTitle") ? <section className="brief-spotlight" aria-labelledby="spotlight-title">
          <div>
            <h2 id="spotlight-title">{stringValue(briefSurface.values, "spotlightTitle")}</h2>
            <p>{stringValue(briefSurface.values, "spotlightBody")}</p>
            <a href={stringValue(briefSurface.values, "spotlightHref")}>{stringValue(briefSurface.values, "spotlightLinkLabel")}</a>
          </div>
          <aside>
            <h3>{stringValue(briefSurface.values, "reflectionTitle")}</h3>
            <p>{stringValue(briefSurface.values, "reflectionBody")}</p>
          </aside>
        </section> : null}
        <p className="brief-lede">{b.level0.whoAndWhere}</p>
        <nav aria-label={b.title} className="brief-quick-links">
          <a href="#brief-resources">{stringValue(shellSurface.values, "sourcesKicker")}</a>
          <Link href="/ask">{stringValue(shellSurface.values, "askLinkLabel")}</Link>
          <Link href="/library/ja-access-checks">{stringValue(shellSurface.values, "accessLinkLabel")}</Link>
          <Link href={supportAction.href}>{supportAction.label}</Link>
        </nav>
      </header> : <PageIntro kicker={b.kicker} title={b.title} lede={b.level0.whoAndWhere}>
        <p className="mt-3 text-sm text-muted">
          {stringValue(shellSurface.values, "maintainedByLabel")} {b.owner}. {stringValue(shellSurface.values, "appliesToLabel")}: {PROGRAM.fullName}. {b.representationReview}. {stringValue(shellSurface.values, "languagesLabel")}: {b.languages.join(", ")}.
        </p>
      </PageIntro>}
      <div className="wrap py-8">
        {!compact && b.draftBanner ? <Notice tone="warn">{b.draftBanner}</Notice> : null}

        {b.tribalGate ? (
          <section className="mt-4 max-w-4xl border-t border-line pt-5" aria-labelledby="gate-title">
            <p className="kicker">{stringValue(shellSurface.values, "tribalKicker")}</p>
            <h2 id="gate-title" className="text-2xl font-extrabold">
              {stringValue(shellSurface.values, "tribalTitle")}
            </h2>
            <p>{b.level0.whyItMattersForDhsWork}</p>
            <p className="mt-2">{b.level0.withinGroupDiversity}</p>
            <h3 className="mt-4 text-lg font-bold">{stringValue(shellSurface.values, "tribalActionHeading")}</h3>
            <ul className="list-disc pl-6">
              {b.level1.whoToInvolve.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h3 className="mt-4 text-lg font-bold">{stringValue(shellSurface.values, "notAssumeHeading")}</h3>
            <ul className="list-disc pl-6">
              {b.level1.whatNotToAssume.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">{b.sources[0]?.note}</p>
            <p className="mt-3">
              <Link href="/library/pn-when-to-escalate" className="btn btn--primary">
                {stringValue(shellSurface.values, "tribalLinkLabel")}
              </Link>
            </p>
          </section>
        ) : (
          <>
            <BriefDisclosure enabled={compact} title={stringValue(shellSurface.values, "whyKicker")} open>
            <section className="mt-4 grid gap-x-12 gap-y-7 md:grid-cols-2" aria-label="Community overview">
              <div className="border-t border-line pt-4">
                <p className="kicker">{stringValue(shellSurface.values, "whyKicker")}</p>
                <p>{b.level0.whyItMattersForDhsWork}</p>
              </div>
              <div className="border-t border-line pt-4">
                <p className="kicker">{stringValue(shellSurface.values, "variationKicker")}</p>
                <p>{b.level0.withinGroupDiversity}</p>
                <p className="kicker mt-3">{stringValue(shellSurface.values, "namesKicker")}</p>
                <p className="m-0">
                  <strong>{stringValue(shellSurface.values, "preferredLabel")}:</strong> {b.names.preferred.join("; ")}
                  {b.names.alsoUsed.length ? (
                    <>
                      <br />
                      <strong>{stringValue(shellSurface.values, "alsoUsedLabel")}:</strong> {b.names.alsoUsed.join("; ")}
                    </>
                  ) : null}
                </p>
                <p className="text-sm">{b.names.note}</p>
                {b.names.uncertainty ? <p className="text-sm text-muted">{stringValue(shellSurface.values, "uncertaintyLabel")}: {b.names.uncertainty}</p> : null}
              </div>
            </section>
            </BriefDisclosure>

            <BriefDisclosure enabled={compact} title={stringValue(shellSurface.values, "workTitle")}>
            <section className="mt-8 border-t border-line pt-5" aria-labelledby="work-title">
              <p className="kicker">{stringValue(shellSurface.values, "workKicker")}</p>
              <h2 id="work-title" className="text-2xl font-extrabold">
                {stringValue(shellSurface.values, "workTitle")}
              </h2>
              <div className="mt-3 grid gap-5 md:grid-cols-2">
                <WorkList title={stringValue(shellSurface.values, "whatToAskTitle")} items={b.level1.whatToAsk} />
                <WorkList title={stringValue(shellSurface.values, "accessChecksTitle")} items={b.level1.accessChecks} />
                <WorkList title={stringValue(shellSurface.values, "involveTitle")} items={b.level1.whoToInvolve} />
                <WorkList title={stringValue(shellSurface.values, "notAssumeTitle")} items={b.level1.whatNotToAssume} />
              </div>
              <p className="mt-4 text-sm text-muted">{stringValue(shellSurface.values, "antiProfileNote")}</p>
            </section>
            </BriefDisclosure>

            <BriefDisclosure enabled={compact} title={stringValue(shellSurface.values, "deeperTitle")}>
            <section className="mt-6" aria-labelledby="deeper-title">
              <h2 id="deeper-title" className="text-xl font-extrabold">
                {stringValue(shellSurface.values, "deeperTitle")}
              </h2>
              {wantLevel2 ? (
                b.level2 && b.level2.length ? (
                  <div className="mt-2 space-y-4">
                    {b.level2.map((s) => (
                      <div key={s.heading} className="border-t border-line pt-4">
                        <h3 className="text-lg font-bold">{s.heading}</h3>
                        <p>{s.body}</p>
                      </div>
                    ))}
                    <p className="text-sm">
                      <Link href={`/minnesota-communities/${b.id}`}>{stringValue(shellSurface.values, "hideDeeperLabel")}</Link>
                    </p>
                  </div>
                ) : (
                  <p className="text-muted">{stringValue(shellSurface.values, "noDeeperBody")}</p>
                )
              ) : (
                <p>
                  <Link href={`/minnesota-communities/${b.id}?level=2`} className="btn btn--light">
                    {stringValue(shellSurface.values, "showDeeperLabel")}
                  </Link>{" "}
                  <span className="text-sm text-muted">{stringValue(shellSurface.values, "showDeeperNote")}</span>
                </p>
              )}
            </section>
            </BriefDisclosure>

            {b.observances?.length ? (
              <BriefDisclosure enabled={compact} title={stringValue(shellSurface.values, "observancesTitle")}>
              <section className="mt-6" aria-labelledby="obs-title">
                <h2 id="obs-title" className="text-xl font-extrabold">
                  {stringValue(shellSurface.values, "observancesTitle")}
                </h2>
                <table className="data mt-2">
                  <thead>
                    <tr>
                      <th scope="col">{stringValue(shellSurface.values, "observanceColumn")}</th>
                      <th scope="col">{stringValue(shellSurface.values, "whenColumn")}</th>
                      <th scope="col">{stringValue(shellSurface.values, "atWorkColumn")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {b.observances.map((o) => (
                      <tr key={o.title}>
                        <th scope="row">{o.title}</th>
                        <td>{o.when}</td>
                        <td>{o.atWork}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              </BriefDisclosure>
            ) : null}
          </>
        )}

        <div id="brief-resources">
        <BriefDisclosure enabled={compact} title={stringValue(shellSurface.values, "sourcesKicker")}>
        <section className="mt-8 grid gap-x-12 gap-y-7 border-t border-line pt-5 md:grid-cols-2">
          <div>
            <p className="kicker">{stringValue(shellSurface.values, "sourcesKicker")}</p>
            <ul className="list-disc pl-5 text-sm">
              {b.sources.map((s) => (
                <li key={s.label}>
                  {s.href ? <a href={s.href} rel="noreferrer">{s.label}</a> : s.label}: {s.note}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kicker">{stringValue(shellSurface.values, "nextKicker")}</p>
            <ul className="list-disc pl-5">
              {paths.map((p) => (
                <li key={p!.id}>
                  <Link href={`/practice/${p!.id}`}>{p!.title} path</Link>
                </li>
              ))}
              <li>
                <Link href="/ask">{stringValue(shellSurface.values, "askLinkLabel")}</Link>
              </li>
              <li>
                <Link href="/library/ja-access-checks">{stringValue(shellSurface.values, "accessLinkLabel")}</Link>
              </li>
              <li>
                <Link href={supportAction.href}>{supportAction.label}</Link>
              </li>
            </ul>
          </div>
        </section>
        </BriefDisclosure>
        </div>
      </div>
      </div>
      </EditableSurfaceRegion>
    </EditableSurfaceRegion>
  );
}

function BriefDisclosure({ enabled, title, open = false, children }: { enabled: boolean; title: string; open?: boolean; children: ReactNode }) {
  if (!enabled) return children;
  return <details className="brief-disclosure" open={open}>
    <summary>{title}</summary>
    <div className="brief-disclosure-content">{children}</div>
  </details>;
}

function WorkList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-lg font-bold">{title}</h3>
      <ul className="list-disc pl-6">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
