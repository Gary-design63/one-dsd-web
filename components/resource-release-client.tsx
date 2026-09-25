"use client";

import Link from "next/link";
import { useState } from "react";
import { Notice } from "@/components/ui";
import {
  RESOURCE_REVIEW_DECISION_LABELS,
  RESOURCE_REVIEW_DECISIONS,
  RESOURCE_REVIEW_LABELS,
  RESOURCE_STAFF_SENSITIVITY_CLASSES,
  RESOURCE_STAFF_SENSITIVITY_LABELS,
  type ResourceReleaseAction,
  type ResourceReleaseState,
} from "@/lib/content/resource-release-contract";

type ReleaseResponse = {
  ok?: boolean;
  release?: ResourceReleaseState;
  message?: string;
  error?: string;
};

function dateText(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "America/Chicago",
  }).format(new Date(value));
}

export function ResourceReleaseClient({
  initial, endpoint, canReview = true, canPublish = true, canWithdraw = true, editHref,
}: {
  initial: ResourceReleaseState; endpoint?: string;
  canReview?: boolean; canPublish?: boolean; canWithdraw?: boolean; editHref?: string;
}) {
  const [release, setRelease] = useState(initial);
  const [reason, setReason] = useState("");
  const [sensitivityClass, setSensitivityClass] = useState<"" | "S0" | "S1">("");
  const [exposureApproved, setExposureApproved] = useState(false);
  const [exposureReason, setExposureReason] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function act(action: ResourceReleaseAction, busyKey: string) {
    if ((action.action === "review" && !canReview) || (action.action === "withdraw" && !canWithdraw) || (["publish", "republish"].includes(action.action) && !canPublish)) return;
    setBusy(busyKey);
    setMessage("");
    setError("");
    try {
      const response = await fetch(
        endpoint ?? `/api/consultant/resources/${encodeURIComponent(release.contentItemId)}/release`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(action),
        },
      );
      const result = (await response.json().catch(() => ({}))) as ReleaseResponse;
      if (!response.ok || !result.release) {
        setError(result.error ?? "That change could not be completed.");
        return;
      }
      setRelease(result.release);
      setReason("");
      setSensitivityClass("");
      setExposureApproved(false);
      setExposureReason("");
      setMessage(result.message ?? "The resource review has been updated.");
    } catch {
      setError("That change could not be completed right now.");
    } finally {
      setBusy("");
    }
  }

  function saveReview(event: React.FormEvent<HTMLFormElement>, dimension: string) {
    event.preventDefault();
    if (!release.draft) return;
    const currentReview = release.draft.reviews.find((review) => review.dimension === dimension);
    if (!currentReview) {
      setError("Reload this page before saving the review.");
      return;
    }
    const values = new FormData(event.currentTarget);
    const decision = String(values.get("decision"));
    const note = String(values.get("note") ?? "").trim();
    if (!RESOURCE_REVIEW_DECISIONS.includes(decision as (typeof RESOURCE_REVIEW_DECISIONS)[number])) {
      setError("Choose a review decision.");
      return;
    }
    void act(
      {
        action: "review",
        revisionId: release.draft.revisionId,
        dimension: dimension as keyof typeof RESOURCE_REVIEW_LABELS,
        decision: decision as keyof typeof RESOURCE_REVIEW_DECISION_LABELS,
        expectedPriorReviewId: currentReview.reviewId,
        note: note || null,
      },
      `review-${dimension}`,
    );
  }

  const published = release.published?.payload;
  const draft = release.draft;
  const staffExposureDecisionReady = Boolean(
    sensitivityClass && exposureApproved && exposureReason.trim(),
  );

  function staffExposureDecisionFields(legend: string) {
    return (
      <fieldset className="panel mt-4">
        <legend className="font-bold">{legend}</legend>
        <p className="mt-2 text-sm">
          Choose the reviewed classification and record why this resource may be shown at the
          program&apos;s staff-facing web address without sign-in.
        </p>
        <label className="field">
          <span>Content classification</span>
          <select
            value={sensitivityClass}
            onChange={(event) => setSensitivityClass(event.target.value as "" | "S0" | "S1")}
            required
          >
            <option value="">Choose a classification</option>
            {RESOURCE_STAFF_SENSITIVITY_CLASSES.map((value) => (
              <option key={value} value={value}>
                {value}: {RESOURCE_STAFF_SENSITIVITY_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Why access without sign-in is appropriate</span>
          <textarea
            value={exposureReason}
            onChange={(event) => setExposureReason(event.target.value)}
            rows={2}
            maxLength={500}
            required
          />
        </label>
        <label className="mt-3 flex items-start gap-3">
          <input
            type="checkbox"
            checked={exposureApproved}
            onChange={(event) => setExposureApproved(event.target.checked)}
          />
          <span>
            I approve showing this reviewed resource without sign-in at the program&apos;s
            staff-facing web address.
          </span>
        </label>
      </fieldset>
    );
  }

  return (
    <div className="wrap py-8">
      <p>
        <Link href={`/resources/${encodeURIComponent(release.contentItemId)}`}>
          Open the staff resource
        </Link>
      </p>

      {editHref ? <p><Link href={editHref}>Prepare a resource draft</Link></p> : null}
      {message ? <p className="notice" role="status">{message}</p> : null}
      {error ? <p className="error" role="alert">{error}</p> : null}

      {release.withdrawn ? (
        <Notice tone="warn">
          {release.published?.isInherited
            ? "The Disability Services Division version has been withdrawn. Staff still see the agencywide version."
            : "This resource has been withdrawn from this program view. Its approved history is still available below."}
        </Notice>
      ) : null}
      {release.published?.isInherited ? (
        <Notice>
          The agencywide version is shown here. A Disability Services Division draft can build on it without changing the agencywide resource.
        </Notice>
      ) : null}

      {draft ? (
        <>
          <section className="card mt-6" aria-labelledby="compare-resource-heading">
            <p className="kicker">Review changes</p>
            <h2 className="text-xl font-extrabold" id="compare-resource-heading">
              Compare the staff version and the draft
            </h2>
            <p className="mt-2">The staff version will not change until every required review is complete and you choose to publish.</p>
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div className="panel">
                <h3 className="text-lg font-bold">Current staff version</h3>
                {published ? (
                  <>
                    <p className="font-bold">{published.title}</p>
                    <p>{published.summary}</p>
                    <div className="space-y-2">
                      {published.body.map((part, index) => <p className="m-0" key={`published-${index}`}>{part}</p>)}
                    </div>
                  </>
                ) : (
                  <p className="m-0">There is no current staff version in this program view.</p>
                )}
              </div>
              <div className="panel">
                <h3 className="text-lg font-bold">Draft version</h3>
                <p className="font-bold">{draft.payload.title}</p>
                <p>{draft.payload.summary}</p>
                <div className="space-y-2">
                  {draft.payload.body.map((part, index) => <p className="m-0" key={`draft-${index}`}>{part}</p>)}
                </div>
                <p className="mt-4 mb-0 text-sm">
                  Applies to: {draft.payload.scope === "dsd" ? "Disability Services Division" : "One DHS agencywide"}. Maintained by {draft.payload.owner}.
                </p>
              </div>
            </div>
          </section>

          <section className="card mt-6" aria-labelledby="required-reviews-heading">
            <p className="kicker">Required reviews</p>
            <h2 className="text-xl font-extrabold" id="required-reviews-heading">
              Record each decision
            </h2>
            <p className="mt-2">A resource can be published only when every review is complete or does not apply.</p>
            <div className="mt-5 space-y-5">
              {draft.requiredReviewDimensions.map((dimension) => {
                const current = draft.reviews.find((review) => review.dimension === dimension);
                return (
                  <form
                    className="panel"
                    key={`${dimension}-${current?.reviewId ?? "missing"}`}
                    onSubmit={(event) => saveReview(event, dimension)}
                  >
                    <h3 className="text-lg font-bold">{RESOURCE_REVIEW_LABELS[dimension]}</h3>
                    <p className="text-sm">
                      Current decision: {current ? (current.status === "pending" ? "Not reviewed" : RESOURCE_REVIEW_DECISION_LABELS[current.status]) : "Not reviewed"}
                      {current?.recordedAt ? `. Saved ${dateText(current.recordedAt)}.` : "."}
                    </p>
                    {current?.note ? <p className="text-sm">Latest note: {current.note}</p> : null}
                    <fieldset disabled={!canReview || Boolean(busy)}><legend className="sr-only">Record this review</legend><div className="grid gap-4 md:grid-cols-2">
                      <label className="field">
                        <span>Decision</span>
                        <select name="decision" defaultValue={current?.status === "pending" ? "pass" : current?.status ?? "pass"}>
                          {RESOURCE_REVIEW_DECISIONS.map((decision) => (
                            <option key={decision} value={decision}>{RESOURCE_REVIEW_DECISION_LABELS[decision]}</option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>Review note</span>
                        <textarea name="note" rows={2} maxLength={2_000} defaultValue={current?.note ?? ""} />
                      </label>
                    </div>
                    <button className="btn btn--light" type="submit" disabled={Boolean(busy)}>
                      {busy === `review-${dimension}` ? "Saving decision" : "Save this review"}
                    </button></fieldset>
                  </form>
                );
              })}
            </div>
          </section>

          {canPublish ? <section className="card mt-6" aria-labelledby="publish-resource-heading">
            <p className="kicker">Staff release</p>
            <h2 className="text-xl font-extrabold" id="publish-resource-heading">
              Publish the reviewed resource
            </h2>
            {draft.readyToPublish ? (
              <Notice>Every required review is complete. The wording and presentation will be checked once more before staff see it.</Notice>
            ) : (
              <Notice tone="warn">Finish every required review before publishing.</Notice>
            )}
            <label className="field mt-4">
              <span>Reason for publishing</span>
              <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={2} maxLength={500} required />
            </label>
            {staffExposureDecisionFields("Staff access decision")}
            <button
              className="btn btn--primary"
              type="button"
              disabled={Boolean(busy) || !draft.readyToPublish || !reason.trim() || !staffExposureDecisionReady}
              onClick={() => {
                if (!sensitivityClass || !exposureApproved || !exposureReason.trim()) return;
                void act({
                  action: "publish",
                  revisionId: draft.revisionId,
                  expectedScopeDecisionId: release.scopeDecisionId,
                  reason: reason.trim(),
                  sensitivityClass,
                  unauthenticatedExposurePermitted: true,
                  exposureReason: exposureReason.trim(),
                }, "publish");
              }}
            >
              {busy === "publish" ? "Publishing resource" : "Publish this reviewed resource"}
            </button>
          </section> : null}
        </>
      ) : (
        <div className="card mt-6">
          <p className="kicker">Review changes</p>
          <h2 className="text-xl font-extrabold">No draft is waiting for review</h2>
          <p className="m-0">{editHref ? <Link href={editHref}>Prepare a new draft</Link> : endpoint ? "Published versions remain available below." : "Open the staff resource to prepare a new draft."}</p>
        </div>
      )}

      {canWithdraw && release.published && !release.published.isInherited ? (
        <section className="card mt-6" aria-labelledby="withdraw-resource-heading">
          <p className="kicker">Availability</p>
          <h2 className="text-xl font-extrabold" id="withdraw-resource-heading">Withdraw the current staff version</h2>
          <p>Withdrawal removes this resource from the current program view without deleting its history. A previously approved version can be restored later.</p>
          <label className="field">
            <span>Reason for withdrawal</span>
            <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={2} maxLength={500} required />
          </label>
          <button
            className="btn btn--light"
            type="button"
            disabled={Boolean(busy) || !reason.trim()}
            onClick={() => void act({
              action: "withdraw",
              revisionId: release.published!.revisionId,
              expectedScopeDecisionId: release.scopeDecisionId,
              reason: reason.trim(),
            }, "withdraw")}
          >
            {busy === "withdraw" ? "Withdrawing resource" : "Withdraw this resource"}
          </button>
        </section>
      ) : null}

      <section className="card mt-6" aria-labelledby="resource-history-heading">
        <p className="kicker">Approved history</p>
        <h2 className="text-xl font-extrabold" id="resource-history-heading">Previously published versions</h2>
        {release.history.length ? (
          <div className="mt-4 space-y-4">
            {release.history.map((version) => (
              <div className="panel" key={version.revisionId}>
                <h3 className="text-lg font-bold">{version.title}</h3>
                <p className="text-sm">
                  Version {version.revisionNumber}. Published {dateText(version.decidedAt)}. {version.isInherited ? "Agencywide version." : "This program's version."} {version.isCurrent ? "This is the current staff version." : version.isInherited ? "It remains read-only here." : "This version can be restored."}
                </p>
                {canPublish && !version.isCurrent && !version.isInherited ? (
                  <button
                    className="btn btn--light"
                    type="button"
                    disabled={Boolean(busy) || !reason.trim() || !staffExposureDecisionReady}
                    onClick={() => {
                      if (!sensitivityClass || !exposureApproved || !exposureReason.trim()) return;
                      void act({
                        action: "republish",
                        revisionId: version.revisionId,
                        expectedScopeDecisionId: release.scopeDecisionId,
                        reason: reason.trim(),
                        sensitivityClass,
                        unauthenticatedExposurePermitted: true,
                        exposureReason: exposureReason.trim(),
                      }, `restore-${version.revisionId}`);
                    }}
                  >
                    {busy === `restore-${version.revisionId}` ? "Restoring version" : "Restore this approved version"}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : <p className="m-0">No published history is available.</p>}
        {canPublish && release.history.some((version) => !version.isCurrent && !version.isInherited) ? (
          <>
            <label className="field mt-4">
              <span>Reason for restoring a previous version</span>
              <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={2} maxLength={500} required />
            </label>
            {staffExposureDecisionFields("Restored staff access decision")}
          </>
        ) : null}
      </section>
    </div>
  );
}
