import type { Metadata } from "next";
import { CommunityDesignIndex } from "@/components/community-design-index";
import { communityDesignEnabled } from "@/lib/content/community-design";
import Link from "next/link";
import { ActionList, Notice, PageIntro } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { communities, communityQuery, paused, PAUSED_MESSAGE } from "@/lib/intelligence/orchestrator";
import { BRIEFS } from "@/lib/content/briefs";
import { briefVisible, type CiResult } from "@/lib/intelligence/agents/ci";
import { consultationIntakeEnabled } from "@/lib/intelligence/consult/availability";
import { ProgramContextNote } from "@/components/program-context";
import { contextualizeSupportAction } from "@/lib/product";
import { requestedProductContext } from "@/lib/product/request-context";
import { requestedContentScope } from "@/lib/product/request-context";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import {
  applyCommunityBriefValues,
  communityBriefSurfaceId,
  stringValue,
} from "@/lib/content/staff-surface-registry";

export const metadata: Metadata = { title: ROUTES.communities.label };

function shortDescription(text: string, max = 180): string {
  if (text.length <= max) return text;
  const shortened = text.slice(0, max + 1);
  const boundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, boundary > max * 0.7 ? boundary : max).trimEnd()}…`;
}

export default async function CommunitiesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  if (communityDesignEnabled()) return <CommunityDesignIndex query={q} />;
  const intakeEnabled = consultationIntakeEnabled();
  const context = await requestedProductContext();
  const scope = await requestedContentScope();
  const pageSurface = await prepareEditableSurface("communities.index", { scope });
  const isPaused = await paused();
  const sourceList: CiResult = isPaused
    ? { kind: "list", briefs: BRIEFS.filter(briefVisible).map((b) => ({ id: b.id, title: b.title, kicker: b.kicker, status: b.status, reviewDate: b.reviewDate, languages: b.languages, tribalGate: Boolean(b.tribalGate), whoAndWhere: b.level0.whoAndWhere })) }
    : await communities();
  const visibleBriefs = BRIEFS.filter(briefVisible);
  const briefSurfaces = await Promise.all(visibleBriefs.map((brief) => prepareEditableSurface(communityBriefSurfaceId(brief.id), { scope, includeOwner: false })));
  const editedBriefs = new Map(visibleBriefs.map((brief, index) => {
    const surface = briefSurfaces[index];
    return [brief.id, surface.available ? applyCommunityBriefValues(brief, surface.values) : null] as const;
  }));
  const list: CiResult = sourceList.kind === "list"
    ? { ...sourceList, briefs: sourceList.briefs.flatMap((item) => {
        const edited = editedBriefs.get(item.id);
        return edited ? [{ ...item, title: edited.title, kicker: edited.kicker, languages: edited.languages, whoAndWhere: edited.level0.whoAndWhere }] : [];
      }) }
    : sourceList;
  const rawQuery = q && !isPaused ? await communityQuery(q) : null;
  const queried = rawQuery?.kind === "brief"
    ? (() => {
        const edited = editedBriefs.get(rawQuery.brief.id);
        return edited ? { ...rawQuery, brief: { ...rawQuery.brief, title: edited.title, kicker: edited.kicker, languages: edited.languages, level0: edited.level0 } } : null;
      })()
    : rawQuery;
  const includesBriefsStillInReview = list.kind === "list" && list.briefs.some((brief) => brief.status === "under_review");

  return (
    <EditableSurfaceRegion surface={pageSurface}>
      <PageIntro kicker={stringValue(pageSurface.values, "introKicker")} title={stringValue(pageSurface.values, "introTitle")} lede={stringValue(pageSurface.values, "introLede")}>
        <p className="notice mt-4 max-w-3xl text-ink" role="note">
          <strong>Privacy: </strong>
          {stringValue(pageSurface.values, "privacyNotice")}
        </p>
      </PageIntro>
      <div className="wrap py-8">
        <div className="mb-6"><ProgramContextNote /></div>
        {isPaused ? <Notice tone="warn">{PAUSED_MESSAGE} You can still browse the available briefs below.</Notice> : null}
        <form method="get" className="border-b border-line pb-6" role="search">
          <label htmlFor="q" className="block text-lg font-bold">
            {stringValue(pageSurface.values, "searchLabel")}
          </label>
          <p className="text-sm text-muted">{stringValue(pageSurface.values, "searchExample")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <input id="q" name="q" type="text" defaultValue={q ?? ""} className="min-h-11 flex-1 rounded border border-gray-400 p-2" />
            <button type="submit" className="btn btn--primary">
              {stringValue(pageSurface.values, "searchButton")}
            </button>
          </div>
        </form>

        {queried ? (
          <section className="mt-6" aria-live="polite">
            {queried.kind === "refusal" ? (
              <>
                <Notice tone="stop">
                  <strong>{stringValue(pageSurface.values, "refusalLead")} </strong>
                  {queried.safety.message}
                </Notice>
                <ActionList
                  heading={stringValue(pageSurface.values, "alternativesHeading")}
                  actions={(queried.safety.alternatives ?? []).map((action) =>
                    contextualizeSupportAction(action, context, intakeEnabled),
                  )}
                />
              </>
            ) : queried.kind === "gap" ? (
              <div className="border-t border-line pt-4">
                <p className="kicker">{stringValue(pageSurface.values, "gapKicker")}</p>
                <p>{queried.gap.message}</p>
                {queried.gap.nearest.length ? (
                  <p className="text-sm">
                    {stringValue(pageSurface.values, "relatedLabel")}:{" "}
                    {queried.gap.nearest.map((n, i) => (
                      <span key={n.id}>
                        {i ? ", " : ""}
                        <Link href={n.href}>{n.title}</Link>
                      </span>
                    ))}
                  </p>
                ) : null}
                <ActionList
                  actions={queried.gap.nextActions.map((action) =>
                    contextualizeSupportAction(action, context, intakeEnabled),
                  )}
                />
              </div>
            ) : queried.kind === "brief" ? (
              <div className="border-t border-line pt-4">
                <p className="kicker">{stringValue(pageSurface.values, "bestMatchKicker")}</p>
                <h2 className="text-xl font-extrabold">
                  <Link href={`/minnesota-communities/${queried.brief.id}`}>{queried.brief.title}</Link>
                </h2>
                <p>{queried.brief.level0.whoAndWhere}</p>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="mt-8" aria-labelledby="all-title">
          <h2 id="all-title" className="text-2xl font-extrabold">
            {stringValue(pageSurface.values, "availableTitle")}
          </h2>
          <p className="text-muted">
            {includesBriefsStillInReview
              ? stringValue(pageSurface.values, "reviewWarning")
              : stringValue(pageSurface.values, "releasedExplanation")}
          </p>
          {list.kind === "list" ? (
            <ul className="mt-4 grid list-none gap-x-10 gap-y-6 p-0 md:grid-cols-2">
              {list.briefs.map((b) => (
                <li key={b.id} className="border-t border-line pt-4">
                  <span className="kicker" style={{ margin: 0 }}>
                    {b.kicker}
                  </span>
                  <Link href={`/minnesota-communities/${b.id}`} className="text-lg font-extrabold no-underline hover:underline">
                    {b.title}
                  </Link>
                  <span className="text-sm">{shortDescription(b.whoAndWhere)}</span>
                  <span className="text-sm text-muted">
                    {stringValue(pageSurface.values, "languagesLabel")}: {b.languages.join(", ")}. {b.status === "under_review" ? stringValue(pageSurface.values, "underReviewLabel") : b.status === "gated" ? stringValue(pageSurface.values, "gatedLabel") : stringValue(pageSurface.values, "reviewCompleteLabel")}.
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </EditableSurfaceRegion>
  );
}
