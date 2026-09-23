"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ADMINISTRATIONS,
  DISPOSITIONS,
  dispositionLabel,
  KIND_LABEL,
  WORK_TYPES,
  workTypeLabel,
  type FollowUpStatus,
} from "@/lib/equity-analysis/model";
import { analysesToCsv, downloadText, followUpToIcs } from "@/lib/equity-analysis/export";
import { surveyWaveBefore, type FollowUp, type HistoryEntry, type SurveyWave } from "@/lib/equity-analysis/rollups";
import type { EquityAnalysisRecord, FollowUpEventRecord, SurveyWaveEventRecord, SurveyWaveValues } from "@/lib/equity-analysis/schema";
import { fmt } from "@/lib/equity-analysis/format";

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const d10 = (iso: string) => shortDate.format(new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso));
const whenFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Chicago", timeZoneName: "short" });

type Filters = { q: string; administration: string; kind: string; disposition: string; workType: string; from: string; to: string };
const EMPTY: Filters = { q: "", administration: "", kind: "", disposition: "", workType: "", from: "", to: "" };
const STATUS_LABEL: Record<FollowUpStatus, string> = { overdue: "Overdue", soon: "Due within 30 days", later: "Later", done: "Done" };

async function post(path: string, body: unknown): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json().catch(() => ({}));
    return response.ok ? { ok: true } : { ok: false, error: result.error || "That change could not be saved." };
  } catch {
    return { ok: false, error: "That change could not be confirmed. Nothing was lost; you can try again." };
  }
}

export function AnalysisRegister({ analyses, followUps, followUpEvents, surveyEvents, waves, history, now }: {
  analyses: EquityAnalysisRecord[];
  followUps: FollowUp[];
  followUpEvents: FollowUpEventRecord[];
  surveyEvents: SurveyWaveEventRecord[];
  waves: SurveyWave[];
  history: HistoryEntry[];
  now: string;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [problem, setProblem] = useState("");
  const set = (k: keyof Filters) => (v: string) => setFilters((f) => ({ ...f, [k]: v }));

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return analyses.filter((r) => {
      if (filters.administration && r.administration !== filters.administration) return false;
      if (filters.kind && r.kind !== filters.kind) return false;
      if (filters.disposition && r.disposition !== filters.disposition) return false;
      if (filters.workType && r.workType !== filters.workType) return false;
      const day = r.createdAt.slice(0, 10);
      if (filters.from && day < filters.from) return false;
      if (filters.to && day > filters.to) return false;
      if (q && !r.workTitle.toLowerCase().includes(q) && !Object.values(r.answers).some((a) => (a ?? "").toLowerCase().includes(q))) return false;
      return true;
    });
  }, [analyses, filters]);

  const filteredIds = useMemo(() => new Set(filtered.map((r) => r.id)), [filtered]);
  const grouped = useMemo(() => {
    const g: Record<FollowUpStatus, FollowUp[]> = { overdue: [], soon: [], later: [], done: [] };
    for (const f of followUps) if (filteredIds.has(f.analysisId)) g[f.status].push(f);
    return g;
  }, [followUps, filteredIds]);

  async function apply(pending: Promise<{ ok: boolean; error?: string }> | { ok: boolean; error?: string }) {
    const result = await pending;
    setProblem(result.ok ? "" : (result.error ?? ""));
    if (result.ok) router.refresh();
  }

  const toggleDone = (f: FollowUp) =>
    apply(post("/api/equity-analysis/follow-ups", { eventId: crypto.randomUUID(), analysisId: f.analysisId, followUp: f.key, done: !f.done }));

  const revert = (entry: HistoryEntry) => {
    if (entry.kind === "follow_up") {
      const event = followUpEvents.find((e) => e.id === entry.id);
      if (!event) return;
      const earlier = followUpEvents
        .filter((e) => e.analysisId === event.analysisId && e.followUp === event.followUp && e.createdAt < event.createdAt)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      const before = earlier[earlier.length - 1]?.done ?? false;
      return apply(post("/api/equity-analysis/follow-ups", { eventId: crypto.randomUUID(), analysisId: event.analysisId, followUp: event.followUp, done: before, reverts: event.id }));
    }
    const event = surveyEvents.find((e) => e.id === entry.id);
    if (!event) return;
    const before = surveyWaveBefore(surveyEvents, event);
    return apply(post("/api/equity-analysis/survey-waves", before
      ? { eventId: crypto.randomUUID(), wave: event.wave, action: "set", values: before, reverts: event.id }
      : { eventId: crypto.randomUUID(), wave: event.wave, action: "remove", reverts: event.id }));
  };

  const active = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-10">
      {problem ? <p role="alert" className="notice notice--stop">{problem}</p> : null}

      <section aria-labelledby="filters-title" className="card">
        <h2 id="filters-title" className="sr-only">Filters</h2>
        <div className="flex flex-wrap items-end gap-3">
          <Text label="Search" value={filters.q} onChange={set("q")} placeholder="Work title or any answer" width="w-56" />
          <Select label="Administration" value={filters.administration} onChange={set("administration")} options={ADMINISTRATIONS.map((a) => [a, a])} />
          <Select label="Form" value={filters.kind} onChange={set("kind")} options={(Object.entries(KIND_LABEL) as [string, string][]).map(([id, label]) => [id, label])} />
          <Select label="Disposition" value={filters.disposition} onChange={set("disposition")} options={DISPOSITIONS.map((d) => [d.id, d.label])} />
          <Select label="Kind of work" value={filters.workType} onChange={set("workType")} options={WORK_TYPES.map((w) => [w.id, w.label])} />
          <Text label="Added from" type="date" value={filters.from} onChange={set("from")} />
          <Text label="Added to" type="date" value={filters.to} onChange={set("to")} />
          {active ? <button type="button" className="btn btn--ghost" onClick={() => setFilters(EMPTY)}>Clear</button> : null}
          <div className="ml-auto">
            <button type="button" className="btn btn--secondary" onClick={() => downloadText(`equity-analyses-${now.slice(0, 10)}.csv`, analysesToCsv(filtered), "text/csv")} disabled={filtered.length === 0}>
              Download as spreadsheet ({fmt(filtered.length)})
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="records-title">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="records-title" className="m-0 text-2xl font-bold">Analyses</h2>
          <p className="m-0 text-sm text-muted">{fmt(filtered.length)} of {fmt(analyses.length)} on the record</p>
        </div>
        {filtered.length ? (
          <div className="mt-4 overflow-x-auto rounded border border-line bg-white">
            <table className="data w-full min-w-[56rem]">
              <thead>
                <tr><th scope="col">Added</th><th scope="col">Work</th><th scope="col">Administration</th><th scope="col">Form</th><th scope="col">Disposition</th><th scope="col">Approval</th><th scope="col">Next follow-up</th></tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const next = followUps.find((f) => f.analysisId === r.id && !f.done);
                  return (
                    <tr key={r.id} className="align-top">
                      <td className="whitespace-nowrap tabular-nums">{d10(r.createdAt)}</td>
                      <td><Link href={`/equity-policy/analysis/${r.id}`}>{r.workTitle}</Link><span className="block text-xs text-muted">{workTypeLabel(r.workType)}</span></td>
                      <td>{r.administration}</td>
                      <td className="whitespace-nowrap">{KIND_LABEL[r.kind]}</td>
                      <td>{dispositionLabel(r.disposition)}</td>
                      <td className="whitespace-nowrap tabular-nums">{r.approvalDate ? d10(r.approvalDate) : "None given"}</td>
                      <td>{next ? <span className={next.status === "overdue" ? "font-semibold text-[color:var(--red-strong)]" : ""}>{next.label}, {d10(next.due)}</span> : <span className="text-muted">None open</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="card mt-4 text-sm text-muted">{analyses.length ? "No analyses match these filters." : "No analyses on the record yet."}</p>
        )}
      </section>

      <section aria-labelledby="followups-title">
        <h2 id="followups-title" className="m-0 text-2xl font-bold">Follow-ups</h2>
        <p className="mt-2 max-w-3xl">The dates each analysis promised: approval or launch, impact review, outcome review. Mark one done when the review happened. Add it to a calendar to get a reminder a week before.</p>
        <div className="mt-4 space-y-6">
          {(["overdue", "soon", "later", "done"] as const).map((status) => (
            <FollowUpGroup key={status} status={status} items={grouped[status]} onToggle={toggleDone} collapsed={status === "done" || status === "later"} />
          ))}
        </div>
      </section>

      <SurveySection waves={waves} onChanged={apply} />

      <section aria-labelledby="history-title">
        <h2 id="history-title" className="m-0 text-2xl font-bold">Change history</h2>
        <p className="mt-2 max-w-3xl">Every change to a follow-up or a survey wave, newest first. Reverting puts the earlier value back and is itself recorded. Times are Central.</p>
        {history.length ? (
          <ol className="m-0 mt-4 list-none divide-y divide-line rounded border border-line bg-white p-0">
            {history.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm">
                <span className="whitespace-nowrap tabular-nums text-muted">{whenFmt.format(new Date(e.at))}</span>
                <span className={e.revertedBy ? "line-through opacity-60" : ""}>{e.summary}</span>
                {e.reverts ? <span className="label-pill label-pill--draft">Revert</span> : null}
                <span className="ml-auto">
                  {e.revertedBy ? <span className="text-xs text-muted">Reverted</span> : <button type="button" className="btn btn--ghost !min-h-0 !px-2 !py-1 !text-xs" onClick={() => revert(e)}>Revert</button>}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="card mt-4 text-sm text-muted">No changes yet.</p>
        )}
      </section>
    </div>
  );
}

function FollowUpGroup({ status, items, onToggle, collapsed }: { status: FollowUpStatus; items: FollowUp[]; onToggle: (f: FollowUp) => void; collapsed: boolean }) {
  return (
    <details open={!collapsed && items.length > 0} className="rounded border border-line bg-white">
      <summary className="cursor-pointer px-5 py-3 font-semibold">{STATUS_LABEL[status]} <span className="ml-1 text-muted">({fmt(items.length)})</span></summary>
      {items.length ? (
        <ul className="m-0 list-none divide-y divide-line border-t border-line p-0">
          {items.map((f) => (
            <li key={`${f.analysisId}-${f.key}`} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={f.done} onChange={() => onToggle(f)} aria-label={`Mark ${f.label} for ${f.workTitle} ${f.done ? "not done" : "done"}`} />
                <span className="whitespace-nowrap font-semibold tabular-nums">{d10(f.due)}</span>
              </label>
              <span>{f.label}{f.role ? <span className="text-muted">, {f.role}</span> : null}</span>
              <Link href={`/equity-policy/analysis/${f.analysisId}`}>{f.workTitle}</Link>
              <span className="text-muted">{f.administration}</span>
              <span className="ml-auto flex items-center gap-3">
                {!f.done ? <span className={`text-xs ${status === "overdue" ? "font-semibold text-[color:var(--red-strong)]" : "text-muted"}`}>{f.daysOut < 0 ? `${Math.abs(f.daysOut)} day${Math.abs(f.daysOut) === 1 ? "" : "s"} overdue` : f.daysOut === 0 ? "today" : `in ${f.daysOut} day${f.daysOut === 1 ? "" : "s"}`}</span> : null}
                <button type="button" className="btn btn--ghost !min-h-0 !px-2 !py-1 !text-xs" onClick={() => downloadText(`equity-followup-${f.key}-${f.due}.ics`, followUpToIcs(f, `${window.location.origin}/equity-policy/analysis/${f.analysisId}`), "text/calendar")}>
                  Add to calendar
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 border-t border-line px-5 py-3 text-sm text-muted">None.</p>
      )}
    </details>
  );
}

const BLANK_WAVE = { wave: "", fielded: "", respondents: "", responseRate: "", belonging: "", inclusion: "", engagement: "" };

function SurveySection({ waves, onChanged }: { waves: SurveyWave[]; onChanged: (result: Promise<{ ok: boolean; error?: string }> | { ok: boolean; error?: string }) => Promise<void> }) {
  const [form, setForm] = useState(BLANK_WAVE);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const setF = (k: keyof typeof BLANK_WAVE) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const edit = (w: SurveyWave) => setForm({ wave: w.wave, fielded: w.fielded, respondents: String(w.respondents), responseRate: String(Math.round(w.responseRate * 100)), belonging: String(w.belonging), inclusion: String(w.inclusion), engagement: String(w.engagement) });

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    const values: SurveyWaveValues = { fielded: form.fielded.trim(), respondents: Number(form.respondents), responseRate: Number(form.responseRate) / 100, belonging: Number(form.belonging), inclusion: Number(form.inclusion), engagement: Number(form.engagement) };
    const result = await post("/api/equity-analysis/survey-waves", { eventId: crypto.randomUUID(), wave: form.wave.trim(), action: "set", values });
    await onChanged(result);
    if (result.ok) { setStatus(`Wave ${form.wave.trim()} saved. The Equity Policy page now uses it.`); setForm(BLANK_WAVE); }
    setBusy(false);
  }

  async function remove(wave: string) {
    if (!window.confirm(`Remove the ${wave} wave? It stays in the change history and can be restored.`)) return;
    await onChanged(await post("/api/equity-analysis/survey-waves", { eventId: crypto.randomUUID(), wave, action: "remove" }));
  }

  const editing = Boolean(form.wave) && waves.some((w) => w.wave === form.wave.trim());

  return (
    <section aria-labelledby="survey-title">
      <h2 id="survey-title" className="m-0 text-2xl font-bold">Culture survey results</h2>
      <p className="mt-2 max-w-3xl">One row per survey wave: percent favorable for the three items the Equity Policy page tracks, respondents, and response rate. {waves.length ? "The Equity Policy page shows these results." : "Until the first wave is entered, the Equity Policy page shows no survey figures."}</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-5">
        <div className="min-w-0 self-start overflow-x-auto rounded border border-line bg-white lg:col-span-3">
          <table className="data w-full min-w-[40rem]">
            <thead>
              <tr><th scope="col">Wave</th><th scope="col">Fielded</th><th scope="col" className="text-right">Belonging</th><th scope="col" className="text-right">Inclusion</th><th scope="col" className="text-right">Engagement</th><th scope="col" className="text-right">Respondents</th><th scope="col" className="text-right">Response</th><th scope="col" className="relative"><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {waves.length ? waves.map((w) => (
                <tr key={w.wave}>
                  <td className="font-semibold">{w.wave}</td><td>{w.fielded}</td>
                  <td className="text-right tabular-nums">{w.belonging}%</td><td className="text-right tabular-nums">{w.inclusion}%</td><td className="text-right tabular-nums">{w.engagement}%</td>
                  <td className="text-right tabular-nums">{fmt(w.respondents)}</td><td className="text-right tabular-nums">{Math.round(w.responseRate * 100)}%</td>
                  <td className="whitespace-nowrap"><button type="button" className="btn btn--ghost !min-h-0 !px-2 !py-1 !text-xs" onClick={() => edit(w)}>Edit</button> <button type="button" className="btn btn--ghost !min-h-0 !px-2 !py-1 !text-xs" onClick={() => remove(w.wave)}>Remove</button></td>
                </tr>
              )) : <tr><td colSpan={8} className="text-muted">No waves entered yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <form onSubmit={save} className="card min-w-0 lg:col-span-2">
          <h3 className="m-0 text-xl font-bold">{editing ? `Update ${form.wave.trim()}` : "Add a wave"}</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Text label="Wave" value={form.wave} onChange={setF("wave")} placeholder="2026" required />
            <Text label="Fielded (year-month)" value={form.fielded} onChange={setF("fielded")} placeholder="2026-10" required />
            <Text label="Belonging %" type="number" value={form.belonging} onChange={setF("belonging")} required />
            <Text label="Inclusion %" type="number" value={form.inclusion} onChange={setF("inclusion")} required />
            <Text label="Engagement %" type="number" value={form.engagement} onChange={setF("engagement")} required />
            <Text label="Respondents" type="number" value={form.respondents} onChange={setF("respondents")} required />
            <Text label="Response rate %" type="number" value={form.responseRate} onChange={setF("responseRate")} required />
          </div>
          {status ? <p role="status" className="mt-3 text-sm text-green-strong">{status}</p> : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" className="btn" disabled={busy}>{busy ? "Saving…" : "Save wave"}</button>
            {form !== BLANK_WAVE ? <button type="button" className="btn btn--light" onClick={() => setForm(BLANK_WAVE)}>Clear</button> : null}
          </div>
        </form>
      </div>
    </section>
  );
}

function Text({ label, value, onChange, type = "text", placeholder, width = "w-full", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; width?: string; required?: boolean }) {
  return (
    <label className="field block text-sm">
      <span className="font-semibold">{label}</span>
      <input type={type} value={value} placeholder={placeholder} required={required} onChange={(e) => onChange(e.target.value)} className={`${width} min-w-0 max-w-full`} />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly (readonly [string, string])[] }): ReactNode {
  return (
    <label className="field block text-sm">
      <span className="font-semibold">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="max-w-full">
        <option value="">All</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
