"use client";

import { useState } from "react";
import { Field } from "@/components/ui";
import type { A11yReviewDraft } from "@/lib/intelligence/agents/a11y";
import type { ClassificationDraft } from "@/lib/intelligence/agents/librarian";

function readableLabel(value: string) {
  const preferred: Record<string, string> = {
    external_verify: "External source to verify",
    draft_only: "Keep as a draft",
    should_fix: "Should be corrected",
    not_applicable: "Not applicable",
  };
  if (preferred[value]) return preferred[value];
  const words = value.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function reviewNote(value: string) {
  return value
    .replace("publication impact", "anything is published")
    .replace("Downgraded to Under review until a human confirms authority.", "Shown as Under review until a person confirms its authority.")
    .replace("owner must choose", "you must choose")
    .replace("No authority declared. Draft label is Under review; you must choose Guidance, Practice note, or Learning.", "No authority was provided. Keep this resource Under review until you choose Guidance, Practice note, or Learning.")
    .replace("No review date; currency unknown.", "No review date was provided, so it is not clear whether this resource is current.");
}

export function ReviewClient() {
  const [a11yText, setA11yText] = useState("");
  const [a11yHtml, setA11yHtml] = useState("");
  const [a11y, setA11y] = useState<A11yReviewDraft | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [declared, setDeclared] = useState("");
  const [owner, setOwner] = useState("");
  const [url, setUrl] = useState("");
  const [cls, setCls] = useState<ClassificationDraft | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function post(body: unknown): Promise<unknown | null> {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/consultant/review", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const isJson = (res.headers.get("content-type") ?? "").includes("application/json");
      const data: unknown = isJson ? await res.json() : null;
      if (!res.ok || data === null) {
        const message = data && typeof data === "object" && typeof (data as { error?: unknown }).error === "string" ? (data as { error: string }).error : "";
        setError(message || (res.ok ? "The review did not return a usable result. Try again in a few minutes." : "This review could not be completed. Check the information you entered and try again."));
        return null;
      }
      return data;
    } catch {
      setError("The review could not be sent. Check your connection and try again.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        className="card"
        onSubmit={async (e) => {
          e.preventDefault();
          const d = await post({ kind: "a11y", text: a11yText, html: a11yHtml });
          if (d) setA11y(d as A11yReviewDraft);
        }}
      >
        <p className="kicker">Plain language and accessibility</p>
        <h2 className="text-xl font-extrabold">Review content before publishing</h2>
        <Field id="a11y-text" label="Text to review">
          <textarea id="a11y-text" value={a11yText} onChange={(e) => setA11yText(e.target.value)} rows={6} />
        </Field>
        <Field id="a11y-html" label="Web page code (HTML), if you have it" help="Add this when you want the review to look at page structure, images, media, or tables.">
          <textarea id="a11y-html" value={a11yHtml} onChange={(e) => setA11yHtml(e.target.value)} rows={4} />
        </Field>
        <button type="submit" className="btn btn--primary" disabled={busy} aria-disabled={busy}>
          {busy ? "Reviewing..." : "Review this content"}
        </button>
        {a11y ? (
          <section className="mt-4" aria-live="polite">
            <h3 className="text-lg font-bold">What to review ({a11y.findings.length})</h3>
            <ul className="list-disc pl-6 text-sm">
              {a11y.findings.map((f, i) => (
                <li key={i}>
                  <strong>{readableLabel(f.severity)}</strong> {f.message} <span className="block">Suggested change: {f.remediation}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm">
              Reading estimate: {a11y.readingLevel.words} words and an average of {a11y.readingLevel.avgWordsPerSentence} words per sentence.
            </p>
            <p className="notice notice--warn text-sm">This review checks the text and page structure you provided. It cannot measure color contrast or test with assistive technology or a keyboard. Complete those checks before publishing. This is not an accessibility certification.</p>
          </section>
        ) : null}
      </form>

      <form
        className="card"
        onSubmit={async (e) => {
          e.preventDefault();
          const d = await post({ kind: "classify", title, text, declaredAuthority: declared || undefined, owner: owner || undefined, sourceUrl: url || undefined });
          if (d) setCls(d as ClassificationDraft);
        }}
      >
        <p className="kicker">Resource details</p>
        <h2 className="text-xl font-extrabold">Suggest how to describe and organize a resource</h2>
        <Field id="c-title" label="Title">
          <input id="c-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field id="c-text" label="Text or summary">
          <textarea id="c-text" value={text} onChange={(e) => setText(e.target.value)} rows={5} />
        </Field>
        <Field id="c-declared" label="Authority already assigned, if any">
          <select id="c-declared" value={declared} onChange={(e) => setDeclared(e.target.value)}>
            <option value="">Not declared</option>
            <option value="official">Official</option>
            <option value="guidance">Guidance</option>
            <option value="practice_note">Practice note</option>
            <option value="learning">Learning</option>
            <option value="external_verify">External (verify)</option>
          </select>
        </Field>
        <Field id="c-owner" label="Named owner, if known">
          <input id="c-owner" type="text" value={owner} onChange={(e) => setOwner(e.target.value)} />
        </Field>
        <Field id="c-url" label="Source location, if available">
          <input id="c-url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        </Field>
        <button type="submit" className="btn btn--primary" disabled={busy} aria-disabled={busy}>
          {busy ? "Reviewing..." : "Review this resource"}
        </button>
        {cls ? (
          <section className="mt-4 text-sm" aria-live="polite">
            <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-[max-content_1fr]">
              <dt className="font-bold">Type</dt>
              <dd className="m-0">{readableLabel(cls.type)}</dd>
              <dt className="font-bold">Suggested authority</dt>
              <dd className="m-0">{readableLabel(cls.authority)}</dd>
              <dt className="font-bold">Audience</dt>
              <dd className="m-0">{cls.audience.map(readableLabel).join(", ")}</dd>
              <dt className="font-bold">Whether it is current</dt>
              <dd className="m-0">{readableLabel(cls.currency)}</dd>
              <dt className="font-bold">Review needed</dt>
              <dd className="m-0">{readableLabel(cls.reviewNeed)}</dd>
              <dt className="font-bold">Where it belongs in the program</dt>
              <dd className="m-0">{readableLabel(cls.layer)}</dd>
            </dl>
            {cls.uncertainty.length ? (
              <ul className="notice notice--warn mt-2 list-disc pl-6">
                {cls.uncertainty.map((u) => (
                  <li key={u}>{reviewNote(u)}</li>
                ))}
              </ul>
            ) : null}
            <p className="mt-2">Suggested next step: Keep this as a draft. Nothing changes until you confirm it.</p>
          </section>
        ) : null}
      </form>
      {error ? (
        <p className="error lg:col-span-2" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
