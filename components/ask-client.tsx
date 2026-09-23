"use client";

/** F-04: do not mount this on staff routes. Staff Ask is StaffAskBrowse only. */
import Link from "next/link";
import { ResourceMediaPreview, mediaResourceIdFromHref } from "@/components/multimedia/resource-media-preview";
import styles from "@/components/workspace-presentation.module.css";
import { useId, useRef, useState } from "react";
import { ActionList, Notice } from "@/components/ui";
import type { AskResearchMode, StaffAskAnswer, StaffAskResult } from "@/lib/intelligence/agents/ask";
import type { GraduationPath } from "@/lib/content/paths";
import type { EditableSurfaceValues } from "@/lib/content/editable-surface-contract";
import { newId, useStored, writeStored } from "@/lib/client/storage";
import { BROWSER_STORAGE_KEYS } from "@/lib/client/storage-keys";
import { useProgramContext } from "@/components/program-context";
import type { ProductContextId } from "@/lib/product/federation";
import { activePracticeArtifact, PracticeArtifactSchema, type PracticeArtifact } from "@/lib/content/practice-artifact";

type Turn = { at: string; question: string; result: StaffAskResult; context?: ProductContextId };
type Session = { id: string; turns: Turn[] };

const EMPTY_SESSION: Session = { id: "", turns: [] };

function copyText(copy: EditableSurfaceValues, key: string): string {
  const value = copy[key];
  return typeof value === "string" ? value : "";
}

function copyList(copy: EditableSurfaceValues, key: string): string[] {
  const value = copy[key];
  return Array.isArray(value) && (value.length === 0 || typeof value[0] === "string") ? value as string[] : [];
}

export function AskClient({
  publishedPath,
  initialMode,
  initialQuestion,
  researchAvailable,
  intakeEnabled,
  copy,
}: {
  publishedPath?: GraduationPath;
  initialMode?: "question" | "review";
  initialQuestion?: string;
  researchAvailable: boolean;
  intakeEnabled: boolean;
  copy: EditableSurfaceValues;
}) {
  const { context } = useProgramContext();
  const [question, setQuestion] = useState(initialQuestion ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [researchMode, setResearchMode] = useState<AskResearchMode>(initialMode === "review" ? "program_only" : "auto");
  const [session, setSession] = useStored<Session>("session", BROWSER_STORAGE_KEYS.askSession, EMPTY_SESSION);
  const path = publishedPath;
  const reviewDraft = initialMode === "review";
  const textId = useId();
  const liveRef = useRef<HTMLDivElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q) {
      setError(copyText(copy, "questionTooShort"));
      return;
    }
    setError("");
    setBusy(true);
    const sessionId = session.id || newId("s");
    const history = session.turns
      .filter(turn => (turn.context ?? context) === context && turn.result.kind === "answer")
      .slice(0, 4).reverse().map(turn => ({
        question: turn.question.slice(0, 1000),
        answer: turn.result.kind === "answer" ? turn.result.answer.shortAnswer.slice(0, 2500) : "",
      }));
    const priorArtifact = activePracticeArtifact(session.turns, context, q, path?.id);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q, pathId: path?.id, mode: initialMode, researchMode, contextPreference: context, history, priorArtifact }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(typeof payload?.error === "string" ? payload.error : copyText(copy, "answerError"));
        return;
      }
      const result = payload as StaffAskResult;
      setSession({ id: sessionId, turns: [{ at: new Date().toISOString(), question: q, result, context }, ...session.turns].slice(0, 30) });
      setQuestion("");
      setTimeout(() => liveRef.current?.focus(), 50);
    } catch {
      setError(copyText(copy, "answerError"));
    } finally {
      setBusy(false);
    }
  }

  function prepareConsult(answer: StaffAskAnswer) {
    if (!answer.consultation) return;
    writeStored("session", BROWSER_STORAGE_KEYS.consultationPrefill, {
      equity_questions_considered: answer.consultation.questionSummary,
    });
  }

  return (
    <div className={styles.askLayout}>
      <div>
        <form onSubmit={submit} className={styles.askComposer}>
          <label htmlFor={textId} className="block text-lg font-bold">
            {copyText(copy, reviewDraft ? "reviewDraftLabel" : "questionLabel")}
          </label>
          <p id={`${textId}-help`} className="text-sm text-muted">
            {copyText(copy, reviewDraft ? "reviewDraftHelp" : "questionHelp")} {path ? `${copyText(copy, "connectedPathLead")} "${path.staffLabel}" path.` : ""}
          </p>
          <textarea
            id={textId}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            maxLength={4000}
            className="mt-2 w-full rounded border border-gray-400 p-3"
            placeholder={reviewDraft ? copyText(copy, "reviewDraftPlaceholder") : path ? path.askStarters[0] : copyText(copy, "questionExample")}
            aria-describedby={`${textId}-help ${textId}-research-privacy${error ? ` ${textId}-error` : ""}`}
            aria-invalid={Boolean(error)}
          />
          <div className="field mt-3 max-w-xl">
            <label htmlFor={`${textId}-scope`}>{copyText(copy, "scopeLabel")}</label>
            <select
              id={`${textId}-scope`}
              value={researchMode}
              onChange={(event) => setResearchMode(event.target.value as AskResearchMode)}
              aria-describedby={`${textId}-scope-help ${textId}-research-privacy`}
            >
              <option value="auto">{copyText(copy, "modeAuto")}</option>
              <option value="program_only">{copyText(copy, "modeProgram")}</option>
              <option value="web_results">{copyText(copy, "modeResults")}</option>
              <option value="current_web">{copyText(copy, "modeCurrent")}</option>
              <option value="deep_research">{copyText(copy, "modeDeep")}</option>
            </select>
            <p className="help m-0" id={`${textId}-scope-help`}>
              {researchAvailable
                ? copyText(copy, "researchAvailableHelp")
                : copyText(copy, "researchUnavailableHelp")}
            </p>
            <p className="help m-0" id={`${textId}-research-privacy`}>
              {copyText(copy, "privacyNotice")}
            </p>
          </div>
          {error ? (
            <p className="error mt-2 font-bold" id={`${textId}-error`} role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn btn--primary" disabled={busy}>
              {busy ? busyLabel(researchMode, copy) : researchMode === "web_results" ? copyText(copy, "findSourcesButton") : copyText(copy, reviewDraft ? "reviewDraftLabel" : "answerButton")}
            </button>
            <Link href="/library" className="btn btn--light">
              {copyText(copy, "libraryButton")}
            </Link>
          </div>
          {path ? (
            <details className="mt-3">
              <summary>{copyText(copy, "starterQuestionsLabel")}</summary>
              <ul className="list-disc pl-6">
                {path.askStarters.map((s) => (
                  <li key={s}>
                    <button type="button" className="text-left underline" onClick={() => setQuestion(s)}>
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </form>

        <div ref={liveRef} tabIndex={-1} aria-live="polite" className="mt-6 space-y-6">
          {session.turns.map((t, i) => (
            <article key={t.at + i} className={styles.answer}>
              <p className="kicker">{copyText(copy, "askedKicker")}{t.context ? ` in ${t.context === "one_dsd" ? copyText(copy, "oneDsdName") : copyText(copy, "oneDhsName")}` : ""}</p>
              <p className="font-bold">{t.question}</p>
              {t.result.kind === "refusal" ? (
                <div className="mt-3">
                  <Notice tone="stop">
                    <strong>{copyText(copy, "differentSupportLead")} </strong>
                    {t.result.safety.message}
                  </Notice>
                  {t.result.safety.redirect ? (
                    <p className="mt-2">
                      <Link href={context !== "one_dsd" && t.result.safety.redirect.href.startsWith("/support/request") ? "/support/right-person" : t.result.safety.redirect.href} className="btn btn--primary">
                        {context !== "one_dsd" && t.result.safety.redirect.href.startsWith("/support/request")
                          ? copyText(copy, "rightPersonLabel")
                          : !intakeEnabled && t.result.safety.redirect.href.startsWith("/support/request")
                            ? copyText(copy, "previewConsultLabel")
                            : t.result.safety.redirect.label}
                      </Link>
                    </p>
                  ) : null}
                  <ActionList
                    heading={copyText(copy, "alternativesHeading")}
                    actions={(t.result.safety.alternatives ?? []).map((action) =>
                      context !== "one_dsd" && action.href.startsWith("/support/request")
                        ? { label: copyText(copy, "rightPersonLabel"), href: "/support/right-person" }
                        : !intakeEnabled && action.href.startsWith("/support/request")
                          ? { ...action, label: copyText(copy, "previewConsultLabel") }
                          : action,
                    )}
                  />
                </div>
              ) : (
                <AnswerView context={context} answer={t.result.answer} onPrepareConsult={prepareConsult} intakeEnabled={intakeEnabled} dsdContext={context === "one_dsd" && (t.context ?? context) === "one_dsd"} copy={copy} />
              )}
            </article>
          ))}
        </div>
      </div>
      <aside className={styles.askRail}>
        <div className={styles.railNote}>
          <p className="kicker">{copyText(copy, "howKicker")}</p>
          <ul className="list-disc pl-5 text-sm">
            {copyList(copy, "howItems").slice(0, 4).map((item) => <li key={item}>{item}</li>)}
            <li>{context === "one_dsd" ? (intakeEnabled ? copyText(copy, "howDsdOpenSupport") : copyText(copy, "howDsdPreviewSupport")) : copyText(copy, "howOneDhsSupport")}</li>
            {copyList(copy, "howItems").slice(4).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className={styles.railNote}>
          <p className="kicker">{copyText(copy, "moreKicker")}</p>
          <p className="text-sm">
            {context !== "one_dsd"
              ? copyText(copy, "moreOneDhsBody")
              : intakeEnabled
                ? copyText(copy, "moreDsdOpenBody")
                : copyText(copy, "moreDsdPreviewBody")}
          </p>
          {context !== "one_dsd" ? <Link href="/support/right-person">{copyText(copy, "rightPersonLabel")}</Link> : null}
        </div>
      </aside>
    </div>
  );
}

/** Render provider citation markers as ordinary safe links, never injected markup. */
function citedAnswer(text: string, sources: Array<{ title: string; url: string }>) {
  return text.split(/(\x60{3}[\s\S]*?\x60{3}|\x60[^\x60\n]+\x60|\[\d+\]|\*\*[^*\n]+\*\*)/g).map((part, index) => {
    if (part.startsWith(String.fromCharCode(96).repeat(3))) {
      const code = part.replace(/^\x60{3}[^\n]*\n/, "").replace(/\x60{3}$/, "");
      return <code key={index} className="my-2 block overflow-x-auto rounded bg-gray-100 p-3 font-mono text-sm whitespace-pre">{code}</code>;
    }
    if (part.startsWith(String.fromCharCode(96))) return <code key={index} className="font-mono">{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{citedAnswer(part.slice(2, -2), sources)}</strong>;
    const marker = /^\[(\d+)\]$/.exec(part);
    const source = marker ? sources[Number(marker[1]) - 1] : undefined;
    return source && /^https:\/\//i.test(source.url)
      ? <a key={index} href={source.url} target="_blank" rel="noreferrer" aria-label={"Source " + marker![1] + ": " + source.title}>{part}</a>
      : part;
  });
}

function AnswerView({ answer, onPrepareConsult, intakeEnabled, dsdContext, copy, context }: { context: ProductContextId; answer: StaffAskAnswer; onPrepareConsult: (a: StaffAskAnswer) => void; intakeEnabled: boolean; dsdContext: boolean; copy: EditableSurfaceValues }) {
  const grouped = (answer.questions ?? []).reduce<Record<string, string[]>>((acc, q) => {
    (acc[q.categoryLabel] ||= []).push(q.text);
    return acc;
  }, {});
  const consult = dsdContext ? answer.nextActions.find((n) => n.href.startsWith("/support/request")) : undefined;
  const independent = answer.nextActions.filter((n) => !n.href.startsWith("/support/request"));
  return (
    <div className="mt-3">
      <h2 className="text-xl font-extrabold">{copyText(copy, "shortAnswerTitle")}</h2>
      <p className="whitespace-pre-wrap break-words">{citedAnswer(answer.shortAnswer, answer.publicResearch?.sources ?? [])}</p>
      {answer.notice ? <Notice tone="warn">{answer.notice}</Notice> : null}

      {Object.keys(grouped).length ? (
        <div>
          <h3 className="text-lg font-bold">{copyText(copy, "earlyQuestionsTitle")}</h3>
          {Object.entries(grouped).map(([categoryLabel, qs]) => (
            <div key={categoryLabel} className="mt-2">
              <p className="font-bold">{categoryLabel}</p>
              <ul className="list-disc pl-6">
                {qs.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {answer.conflict ? (
        <Notice tone="warn">
          <strong>{copyText(copy, "sourceConflictLead")} </strong>
          {answer.conflict.message}
        </Notice>
      ) : null}

      {answer.publicResearch ? (
        <section className={styles.researchPanel}>
          <p className="kicker">{copyText(copy, "publicInformationKicker")}</p>
          <h3 className="text-lg font-bold">{answer.publicResearch.heading}</h3>
          {answer.publicResearch.answer && answer.publicResearch.answer !== answer.shortAnswer ? <p className="whitespace-pre-wrap break-words">{citedAnswer(answer.publicResearch.answer, answer.publicResearch.sources)}</p> : null}
          <p className="text-sm text-muted">{answer.publicResearch.note}</p>
          {answer.publicResearch.sources.length ? (
            <details className="mt-2" open>
              <summary>{copyText(copy, "sourcesUsedLabel")} ({answer.publicResearch.sources.length})</summary>
              <ol className="list-decimal pl-6">
                {answer.publicResearch.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
                    {source.date ? <span className="text-sm text-muted"> {copyText(copy, "datedPrefix")} {source.date}</span> : null}
                  </li>
                ))}
              </ol>
            </details>
          ) : null}
        </section>
      ) : null}

      {answer.whyItMatters ? <details className="mt-3" open>
        <summary>{copyText(copy, "whyItMattersLabel")}</summary>
        <p className="whitespace-pre-wrap">{answer.whyItMatters}</p>
      </details> : null}

      {answer.evidenceClaims?.length ? <details className="mt-3" open>
        <summary>{copyText(copy, "evidencePassagesLabel") || "Passages and interpretation"}</summary>
        {answer.evidenceClaims.map((claim,index) => <div key={index} className="mt-3">
          {claim.kind === "source_excerpt" ? <blockquote className="border-l-2 pl-4 whitespace-pre-wrap">{claim.text}</blockquote> : <p className="whitespace-pre-wrap"><strong>{copyText(copy, "inferenceLabel") || "Suggested interpretation"}: </strong>{claim.text}</p>}
          {claim.references.map((reference,refIndex) => { const source=answer.sources.find(item=>item.evidence?.evidenceId===reference.evidenceId); return source ? <p key={refIndex} className="text-sm"><Link href={source.href}>{source.title}</Link>{claim.kind === "inference" ? <q className="block mt-1">{reference.quote}</q> : null}</p> : null; })}
        </div>)}
      </details> : null}

      {answer.sources.length ? <details className="mt-2" open>
        <summary>{copyText(copy, answer.evidenceClaims?.length ? "programSourcesLabel" : "relatedReadingLabel") || "Related program reading"} ({answer.sources.length})</summary>
        <ul className="list-disc pl-6">
            {answer.sources.map((s) => (
              <li key={s.href}>
                <Link href={s.href}>{s.title}</Link>{" "}
                <span className="label-pill label-pill--authority" aria-label={`${s.authorityLabel}. ${s.authorityDescription}`}>
                  {s.authorityLabel}
                </span>{" "}
                {mediaResourceIdFromHref(s.href) ? <ResourceMediaPreview resourceId={mediaResourceIdFromHref(s.href)!} /> : null}
              </li>
            ))}
        </ul>
      </details> : null}

      {answer.limits.length ? <details className="mt-2" open>
        <summary>{copyText(copy, "limitsLabel")}</summary>
        <ul className="list-disc pl-6">
          {answer.limits.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </details> : null}

      <ActionList heading={copyText(copy, "actionsHeading")} actions={independent} />

      {answer.practiceArtifact ? <PracticeDraftLink artifact={answer.practiceArtifact} context={context} copy={copy} /> : null}

      {answer.pathSuggestion ? (
        <p className="mt-3 text-sm">
          <Link href={answer.pathSuggestion.href}>{copyText(copy, "openPathLead")} {answer.pathSuggestion.title} path</Link>. {answer.pathSuggestion.why}
        </p>
      ) : null}

      {answer.consultation && dsdContext ? (
        <div className="notice mt-4">
          <p className="m-0">
            <strong>{intakeEnabled ? copyText(copy, "consultOpenLead") : copyText(copy, "consultPreviewLead")} </strong>
            {answer.consultation.reason}{" "}
            {intakeEnabled
              ? copyText(copy, "consultOpenBody")
              : copyText(copy, "consultPreviewBody")}
          </p>
          <p className="mt-2">
            <Link href={consult?.href ?? "/support/request"} className="btn btn--primary" onClick={() => onPrepareConsult(answer)}>
              {intakeEnabled ? copyText(copy, "consultOpenButton") : copyText(copy, "consultPreviewButton")}
            </Link>
          </p>
        </div>
      ) : answer.consultation ? (
        <div className="notice mt-4">
          <p className="m-0">
            <strong>{copyText(copy, "humanJudgmentLead")} </strong>
            {answer.consultation.reason} {copyText(copy, "humanJudgmentBody")}
          </p>
          <p className="mt-2"><Link href="/support/right-person" className="btn btn--primary">{copyText(copy, "rightPersonLabel")}</Link></p>
        </div>
      ) : consult ? (
        <p className="mt-3 text-sm">
          <Link href={consult.href} onClick={() => onPrepareConsult(answer)}>
            {intakeEnabled ? consult.label : copyText(copy, "consultPreviewButton")}
          </Link>
        </p>
      ) : null}
    </div>
  );
}

function busyLabel(mode: AskResearchMode, copy: EditableSurfaceValues): string {
  if (mode === "web_results") return copyText(copy, "busyResults");
  if (mode === "current_web") return copyText(copy, "busyCurrent");
  if (mode === "deep_research") return copyText(copy, "busyDeep");
  return copyText(copy, "busyProgram");
}

function PracticeDraftLink({ artifact, context, copy }: { artifact: PracticeArtifact; context: ProductContextId; copy: EditableSurfaceValues }) {
  const [message, setMessage] = useState("");
  const parsed = PracticeArtifactSchema.safeParse(artifact);
  if (!parsed.success || parsed.data.context !== context) return null;
  return <div className="notice mt-4">
    <p><strong>{parsed.data.title}</strong></p>
    <p>{copyText(copy, "draftReadyBody") || "Your draft is ready to review and adapt in Practice."}</p>
    <Link className="btn btn--light" href={"/practice/" + parsed.data.pathId} onClick={event => {
      if (!writeStored("session", BROWSER_STORAGE_KEYS.askPracticeHandoff, parsed.data)) {
        event.preventDefault();
        setMessage(copyText(copy, "draftTransferError") || "Your draft could not be carried over on this computer. Your answer is still here.");
      }
    }}>{copyText(copy, "draftContinueLabel") || "Continue this draft in Practice"}</Link>
    {message ? <p role="alert">{message}</p> : null}
  </div>;
}
