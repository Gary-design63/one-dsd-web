"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type ChangeEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProgramContext } from "@/components/program-context";
import { BROWSER_STORAGE_KEYS } from "@/lib/client/storage-keys";
import { formatDate } from "@/lib/equity-analysis/format";
import {
  ANALYSIS_KINDS,
  ANSWER_FIELD_IDS,
  choiceLabel,
  KIND_LABEL,
  missingRequired,
  stepsFor,
  type AnalysisKind,
  type Answers,
  type Field,
  type Step,
} from "@/lib/equity-analysis/model";

const DRAFT_KEY = BROWSER_STORAGE_KEYS.equityAnalysisDraft;

type Draft = { kind: AnalysisKind; answers: Answers; step: number };
type Screen = { view: "intro" } | { view: "step"; index: number } | { view: "review" };

function readStoredDraft(): string | null {
  try {
    return window.localStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
}

const noSubscription = () => () => {};

function parseDraft(raw: string | null): Draft | null {
  try {
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<Draft>;
    if (!d.kind || !ANALYSIS_KINDS.includes(d.kind)) return null;
    return { kind: d.kind, answers: d.answers ?? {}, step: typeof d.step === "number" ? d.step : 0 };
  } catch {
    return null;
  }
}

function writeDraft(draft: Draft | null) {
  try {
    if (draft) window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    else window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* the walkthrough still works for this visit */
  }
}

export function EquityAnalysisWalkthrough() {
  const router = useRouter();
  const { context } = useProgramContext();
  const [kind, setKind] = useState<AnalysisKind>("full");
  const [answers, setAnswers] = useState<Answers>({});
  const [screen, setScreen] = useState<Screen>({ view: "intro" });
  const [showErrors, setShowErrors] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // The saved draft lives on the device, so it is read as an external value (empty during the first paint).
  const storedDraft = useSyncExternalStore(noSubscription, readStoredDraft, () => null);
  const savedDraft = useMemo(() => parseDraft(storedDraft), [storedDraft]);

  const steps = useMemo(() => stepsFor(kind), [kind]);
  const started = screen.view !== "intro";

  useEffect(() => {
    if (!started) return;
    writeDraft({ kind, answers, step: screen.view === "step" ? screen.index : steps.length });
  }, [started, kind, answers, screen, steps.length]);

  const set = (id: string, value: string) => setAnswers((a) => ({ ...a, [id]: value }));

  const goTo = (next: Screen) => {
    setShowErrors(false);
    setMessage("");
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const start = (k: AnalysisKind) => {
    setKind(k);
    setAnswers({});
    setConsent(false);
    goTo({ view: "step", index: 0 });
  };

  // A link can open the walkthrough on a chosen form, for example the Equity Pause path's "record this pause" link.
  useEffect(() => {
    if (started) return;
    const requested = new URLSearchParams(window.location.search).get("kind");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (requested && (ANALYSIS_KINDS as readonly string[]).includes(requested)) start(requested as AnalysisKind);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resume = () => {
    if (!savedDraft) return;
    setKind(savedDraft.kind);
    setAnswers(savedDraft.answers);
    const count = stepsFor(savedDraft.kind).length;
    goTo(savedDraft.step >= count ? { view: "review" } : { view: "step", index: savedDraft.step });
  };

  const continueFrom = (index: number) => {
    if (missingRequired(kind, answers, steps[index]).length) {
      setShowErrors(true);
      return;
    }
    goTo(index + 1 < steps.length ? { view: "step", index: index + 1 } : { view: "review" });
  };

  async function submit() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    const id = submissionId ?? crypto.randomUUID();
    setSubmissionId(id);
    const detail: Record<string, string> = {};
    for (const key of ANSWER_FIELD_IDS) if (answers[key]?.trim()) detail[key] = answers[key].trim();
    try {
      const response = await fetch("/api/equity-analysis", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          submissionId: id,
          programScope: context === "one_dsd" ? "dsd" : "one-dhs",
          kind,
          workTitle: answers.work_title?.trim(),
          workType: answers.work_type,
          administration: answers.administration,
          approvalDate: answers.approval_date || undefined,
          disposition: answers.disposition,
          answers: detail,
          consent: true,
          sourceRoute: "/equity-policy/analysis",
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || "Your analysis could not be added. Your draft is still here.");
        return;
      }
      writeDraft(null);
      router.push(`/equity-policy/analysis/${result.id}`);
    } catch {
      setMessage("Your analysis could not be confirmed. Your draft is still here; you can try again.");
    } finally {
      setBusy(false);
    }
  }

  if (screen.view === "intro") return <Intro savedDraft={savedDraft} onStart={start} onResume={resume} />;

  const stepHeading = screen.view === "step" ? steps[screen.index].title : "Review and add to the record";

  return (
    <div className="space-y-6">
      <div className="card">
        <p className="kicker m-0">{KIND_LABEL[kind]}</p>
        <h2 className="m-0 mt-1 text-2xl font-bold">{stepHeading}</h2>
        <Progress steps={steps} screen={screen} onJump={(i) => goTo({ view: "step", index: i })} />
      </div>
      {screen.view === "step" ? (
        <StepScreen
          step={steps[screen.index]}
          index={screen.index}
          count={steps.length}
          kind={kind}
          answers={answers}
          showErrors={showErrors}
          onChange={set}
          onBack={() => goTo(screen.index === 0 ? { view: "intro" } : { view: "step", index: screen.index - 1 })}
          onContinue={() => continueFrom(screen.index)}
        />
      ) : (
        <Review
          kind={kind}
          steps={steps}
          answers={answers}
          consent={consent}
          onConsent={setConsent}
          busy={busy}
          message={message}
          onEdit={(i) => goTo({ view: "step", index: i })}
          onSubmit={submit}
        />
      )}
    </div>
  );
}

function Progress({ steps, screen, onJump }: { steps: Step[]; screen: Screen; onJump: (index: number) => void }) {
  const current = screen.view === "step" ? screen.index : steps.length;
  return (
    <ol className="m-0 mt-4 flex list-none flex-wrap gap-1.5 p-0" aria-label="Progress">
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        const label = s.number === 0 ? "Start" : s.number === 9 ? "Decide" : `Step ${s.number}`;
        return (
          <li key={s.id}>
            {state === "done" ? (
              <button type="button" onClick={() => onJump(i)} className="btn btn--light !min-h-0 !px-2.5 !py-1 !text-xs">
                {label}
              </button>
            ) : (
              <span aria-current={state === "current" ? "step" : undefined} className={`inline-block rounded px-2.5 py-1 text-xs font-semibold ${state === "current" ? "bg-navy text-white" : "bg-panel text-muted"}`}>
                {label}
              </span>
            )}
          </li>
        );
      })}
      <li>
        <span aria-current={screen.view === "review" ? "step" : undefined} className={`inline-block rounded px-2.5 py-1 text-xs font-semibold ${screen.view === "review" ? "bg-navy text-white" : "bg-panel text-muted"}`}>
          Review
        </span>
      </li>
    </ol>
  );
}

function Intro({ savedDraft, onStart, onResume }: { savedDraft: Draft | null; onStart: (kind: AnalysisKind) => void; onResume: () => void }) {
  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-8 lg:col-span-3">
        <p className="text-xl leading-relaxed">
          This walkthrough teaches each step of the DHS Equity Analysis Toolkit and asks you to write that step for a real piece of work: a policy, a budget line, a hire, a technology change, a service path. When you add it to the record, the Equity Policy page counts it and the register lists it.
        </p>
        {savedDraft ? (
          <div className="notice">
            <p className="m-0 font-semibold">You have a draft on this device.</p>
            <p className="m-0 mt-1 text-sm">
              {KIND_LABEL[savedDraft.kind]}
              {savedDraft.answers.work_title ? `: “${savedDraft.answers.work_title}”` : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" className="btn" onClick={onResume}>Resume draft</button>
              <button type="button" className="btn btn--light" onClick={() => onStart("full")}>Start over</button>
            </div>
          </div>
        ) : null}
        <section aria-labelledby="choose-form">
          <h2 id="choose-form" className="mt-0 text-2xl font-bold">Choose the form</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <KindCard title="Full analysis" meta="All eight toolkit steps. About 45 minutes with your data at hand." body="Expected when the effect lasts or needs leadership approval: policy, budget, hiring, technology, contracting, service delivery, community engagement." onClick={() => onStart("full")} />
            <KindCard title="Equity scan" meta="Five short sections. About 15 minutes." body="When time is short, or you already did a full analysis and need a check. Still names outcome, groups, data, benefits and burdens, and who is accountable." onClick={() => onStart("scan")} />
            <KindCard title="Equity Pause" meta="Four short sections. About five minutes." body="For a routine decision with limited reach that you could still adjust: a meeting invitation, an announcement, a small process change. Names who is affected differently, benefits and burdens, one design change, and your disposition." onClick={() => onStart("pause")} />
          </div>
        </section>
        <section aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="mt-0 text-2xl font-bold">How it works</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li><strong>Learn.</strong> Each step opens with what the toolkit means by it and the mistake teams usually make.</li>
            <li><strong>Write.</strong> You answer for your own work. Roles and dates, never names. Your draft stays on this device until you add it.</li>
            <li><strong>See.</strong> When you add it, you get a page to bring to your equity director, and the Equity Policy page counts it.</li>
          </ol>
        </section>
      </div>
      <aside className="space-y-4 lg:col-span-2">
        <div className="card">
          <p className="kicker m-0">Learn first</p>
          <h2 className="m-0 mt-1 text-xl font-bold">The toolkit companion</h2>
          <p className="mt-2 text-sm">If the toolkit is new to you, start with the companion’s five learning stages and a fictional example. Every step here points back to what it teaches.</p>
          <Link href="/learn/equity-toolkit">Open the Equity Analysis Toolkit companion</Link>
        </div>
        <div className="card text-sm">
          <p className="m-0 font-semibold">What this is not</p>
          <p className="mt-2">Not the official form you file, and not a substitute for civil rights, Tribal consultation, or labor relations. Bring the page to your administration’s equity director; file the official toolkit as required. Participation is voluntary.</p>
        </div>
      </aside>
    </div>
  );
}

function KindCard({ title, meta, body, onClick }: { title: string; meta: string; body: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="card block w-full cursor-pointer text-left transition-colors hover:border-navy">
      <h3 className="m-0 text-xl font-bold">{title}</h3>
      <p className="m-0 mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{meta}</p>
      <p className="mt-3 text-sm">{body}</p>
      <span className="font-semibold text-navy-mid">Start</span>
    </button>
  );
}

function StepScreen({ step, index, count, kind, answers, showErrors, onChange, onBack, onContinue }: {
  step: Step; index: number; count: number; kind: AnalysisKind; answers: Answers; showErrors: boolean;
  onChange: (id: string, value: string) => void; onBack: () => void; onContinue: () => void;
}) {
  const missing = new Set(showErrors ? missingRequired(kind, answers, step) : []);
  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <aside className="lg:order-1 lg:col-span-2">
        <div className="card">
          <p className="kicker m-0">{step.number === 0 ? "Before you write" : step.number === 9 ? "The decision" : `Toolkit step ${step.number}`}</p>
          <p className="mt-3 text-lg leading-relaxed">{step.teach.lead}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
            {step.teach.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <div className="notice notice--warn mt-5 text-sm">
            <p className="m-0 font-semibold">Watch for</p>
            <p className="m-0 mt-1">{step.teach.watchFor}</p>
          </div>
        </div>
      </aside>
      <form className="lg:col-span-3" onSubmit={(e) => { e.preventDefault(); onContinue(); }} noValidate>
        <p className="m-0 text-sm text-muted">{index + 1} of {count}</p>
        <h3 className="m-0 mt-1 text-2xl font-bold">{step.title}</h3>
        {showErrors && missing.size ? <p role="alert" className="notice notice--stop mt-4 text-sm">Fill in the required answers marked below before continuing.</p> : null}
        <div className="mt-6 space-y-6">
          {step.fields.map((f) => <FieldInput key={f.id} field={f} value={answers[f.id] ?? ""} invalid={missing.has(f.id)} onChange={(v) => onChange(f.id, v)} />)}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="submit" className="btn">{index + 1 < count ? "Save and continue" : "Review"}</button>
          <button type="button" className="btn btn--light" onClick={onBack}>Back</button>
          <span className="text-xs text-muted">Draft kept on this device.</span>
        </div>
      </form>
    </div>
  );
}

function FieldInput({ field, value, invalid, onChange }: { field: Field; value: string; invalid: boolean; onChange: (value: string) => void }) {
  const id = `f-${field.id}`;
  const helpId = field.hint ? `${id}-help` : undefined;
  const required = field.required ? <span aria-hidden="true"> *</span> : null;
  if (field.type === "choice") {
    return (
      <fieldset className="field" aria-invalid={invalid || undefined}>
        <legend className="font-semibold">{field.label}{required}</legend>
        {field.hint ? <p className="help m-0" id={helpId}>{field.hint}</p> : null}
        <div className="mt-2 space-y-2">
          {field.options.map((o) => (
            <label key={o.value} className={`flex cursor-pointer items-start gap-3 rounded border px-3 py-2 text-sm ${value === o.value ? "border-navy bg-panel" : invalid ? "border-[color:var(--red-strong)]" : "border-line bg-white"}`}>
              <input type="radio" name={field.id} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="mt-1" aria-describedby={helpId} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }
  const shared = {
    id,
    value,
    "aria-describedby": helpId,
    "aria-invalid": invalid || undefined,
    required: field.required,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };
  return (
    <div className="field">
      <label htmlFor={id}>{field.label}{required}</label>
      {field.hint ? <p className="help m-0" id={helpId}>{field.hint}</p> : null}
      {field.type === "textarea" ? (
        <textarea {...shared} rows={field.rows ?? 4} placeholder={field.placeholder} maxLength={4000} />
      ) : (
        <input {...shared} type={field.type === "date" ? "date" : "text"} placeholder={field.type === "text" ? field.placeholder : undefined} maxLength={field.type === "text" ? 4000 : undefined} className={field.type === "date" ? "max-w-xs" : undefined} />
      )}
      {field.id === "impact_statement" ? <SentenceCount text={value} /> : null}
    </div>
  );
}

function SentenceCount({ text }: { text: string }) {
  const n = text.split(/[.!?]+\s|[.!?]+$/).filter((s) => s.trim()).length;
  return <p className="help m-0 mt-1" aria-live="polite">{n} sentence{n === 1 ? "" : "s"}. Aim for six to ten.</p>;
}

function Review({ kind, steps, answers, consent, onConsent, busy, message, onEdit, onSubmit }: {
  kind: AnalysisKind; steps: Step[]; answers: Answers; consent: boolean; onConsent: (v: boolean) => void;
  busy: boolean; message: string; onEdit: (index: number) => void; onSubmit: () => void;
}) {
  const missing = missingRequired(kind, answers);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p className="text-lg">Read it once as the person who will carry the burden. If a line could fit any other project, go back and rewrite it.</p>
      {steps.map((s, i) => (
        <section key={s.id} className="card">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="m-0 text-xl font-bold">{s.title}</h3>
            <button type="button" onClick={() => onEdit(i)} className="btn btn--light !min-h-0 !px-3 !py-1 !text-sm">Edit</button>
          </div>
          <dl className="mt-3 space-y-3">
            {s.fields.map((f) => <Answer key={f.id} field={f} value={answers[f.id] ?? ""} />)}
          </dl>
        </section>
      ))}
      {missing.length ? <p role="alert" className="notice notice--stop text-sm">{missing.length} required answer{missing.length === 1 ? " is" : "s are"} still blank. Use Edit above to fill {missing.length === 1 ? "it" : "them"} in.</p> : null}
      <label className="flex items-start gap-3">
        <input type="checkbox" checked={consent} onChange={(e) => onConsent(e.target.checked)} className="mt-1" />
        <span>I choose to add this {KIND_LABEL[kind].toLowerCase()} to the program’s open record. It names work, groups, roles, and dates, and it does not include names, case details, or confidential information. DHS staff can read it on the Equity Policy page and the register.</span>
      </label>
      {message ? <p role="alert" className="notice notice--stop text-sm">{message}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn" onClick={onSubmit} disabled={busy || !consent || missing.length > 0}>
          {busy ? "Adding…" : `Add ${KIND_LABEL[kind].toLowerCase()} to the record`}
        </button>
      </div>
    </div>
  );
}

export function Answer({ field, value }: { field: Field; value: string }): ReactNode {
  const shown = !value ? "Not answered" : field.type === "date" ? formatDate(value) : choiceLabel(field, value);
  return (
    <div>
      <dt className="text-sm font-semibold text-muted">{field.label}</dt>
      <dd className={`ml-0 mt-0.5 whitespace-pre-wrap ${value ? "" : "text-muted"}`}>{shown}</dd>
    </div>
  );
}

