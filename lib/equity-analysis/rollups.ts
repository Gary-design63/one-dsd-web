/**
 * Pure derivations over the append-only equity analysis records: current
 * follow-up state, current survey waves, change history, and the counts the
 * Equity Policy page shows. Nothing here reads storage.
 */
import {
  daysBetween,
  DISPOSITIONS,
  FOLLOW_UP_KINDS,
  followUpStatus,
  ISO_DATE,
  type FollowUpKey,
  type FollowUpStatus,
} from "./model";
import type {
  EquityAnalysisRecord,
  FollowUpEventRecord,
  SurveyWaveEventRecord,
  SurveyWaveValues,
} from "./schema";

export type FollowUp = {
  analysisId: string;
  workTitle: string;
  administration: string;
  key: FollowUpKey;
  label: string;
  role: string | null;
  due: string;
  done: boolean;
  /** The event that set the current state, when one exists. */
  eventId: string | null;
  daysOut: number;
  status: FollowUpStatus;
};

export type SurveyWave = SurveyWaveValues & { wave: string };

export type HistoryEntry = {
  id: string;
  at: string;
  kind: "follow_up" | "survey_wave";
  summary: string;
  /** Set when a later event reverted this one. */
  revertedBy: string | null;
  /** Set when this event was itself a revert. */
  reverts: string | null;
};

/** Latest follow-up event per (analysis, follow-up). */
export function currentFollowUpEvents(events: FollowUpEventRecord[]): Map<string, FollowUpEventRecord> {
  const latest = new Map<string, FollowUpEventRecord>();
  for (const e of [...events].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    latest.set(`${e.analysisId}:${e.followUp}`, e);
  }
  return latest;
}

export function followUpsFor(
  a: EquityAnalysisRecord,
  latest: Map<string, FollowUpEventRecord>,
  now: string,
  soonDays = 30,
): FollowUp[] {
  const out: FollowUp[] = [];
  for (const k of FOLLOW_UP_KINDS) {
    const due = k.dateField === "approval_date" ? a.approvalDate : a.answers[k.dateField];
    if (!due || !ISO_DATE.test(due)) continue;
    const event = latest.get(`${a.id}:${k.key}`) ?? null;
    const done = event?.done ?? false;
    const daysOut = daysBetween(now, due);
    out.push({
      analysisId: a.id,
      workTitle: a.workTitle,
      administration: a.administration,
      key: k.key,
      label: k.label,
      role: k.roleField ? a.answers[k.roleField] || null : null,
      due,
      done,
      eventId: event?.id ?? null,
      daysOut,
      status: followUpStatus(daysOut, done, soonDays),
    });
  }
  return out.sort((x, y) => x.due.localeCompare(y.due));
}

/** Latest survey event per wave; removed waves drop out. */
export function currentSurveyWaves(events: SurveyWaveEventRecord[]): SurveyWave[] {
  const latest = new Map<string, SurveyWaveEventRecord>();
  for (const e of [...events].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) latest.set(e.wave, e);
  return [...latest.values()]
    .filter((e) => e.action === "set" && e.values)
    .map((e) => ({ wave: e.wave, ...e.values! }))
    .sort((a, b) => a.wave.localeCompare(b.wave));
}

/** The state a survey wave had just before the given event. */
export function surveyWaveBefore(events: SurveyWaveEventRecord[], event: SurveyWaveEventRecord): SurveyWaveValues | null {
  const prior = events
    .filter((e) => e.wave === event.wave && e.createdAt < event.createdAt)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const last = prior[prior.length - 1];
  return last && last.action === "set" && last.values ? last.values : null;
}

const WAVE_FIELDS: [keyof SurveyWaveValues, string][] = [
  ["fielded", "fielded"],
  ["belonging", "belonging"],
  ["inclusion", "inclusion"],
  ["engagement", "engagement"],
  ["respondents", "respondents"],
  ["responseRate", "response rate"],
];

function waveValue(key: keyof SurveyWaveValues, v: SurveyWaveValues): string {
  return key === "responseRate" ? `${Math.round(v.responseRate * 100)}%` : String(v[key]);
}

export function changeHistory(
  analyses: EquityAnalysisRecord[],
  followUps: FollowUpEventRecord[],
  surveys: SurveyWaveEventRecord[],
): HistoryEntry[] {
  const titles = new Map(analyses.map((a) => [a.id, a.workTitle]));
  const revertedBy = new Map<string, string>();
  for (const e of [...followUps, ...surveys]) if (e.reverts) revertedBy.set(e.reverts, e.id);
  const labels = new Map(FOLLOW_UP_KINDS.map((k) => [k.key, k.label]));

  const entries: HistoryEntry[] = followUps.map((e) => ({
    id: e.id,
    at: e.createdAt,
    kind: "follow_up",
    summary: `${labels.get(e.followUp)} for “${titles.get(e.analysisId) ?? "an analysis"}” marked ${e.done ? "done" : "not done"}`,
    revertedBy: revertedBy.get(e.id) ?? null,
    reverts: e.reverts ?? null,
  }));

  for (const e of surveys) {
    const before = surveyWaveBefore(surveys, e);
    let summary: string;
    if (e.action === "remove") summary = `Survey wave ${e.wave} removed`;
    else if (!before) summary = `Survey wave ${e.wave} ${e.reverts ? "restored" : "added"}`;
    else {
      const diffs = WAVE_FIELDS.filter(([k]) => before[k] !== e.values![k]).map(
        ([k, label]) => `${label} ${waveValue(k, before)} to ${waveValue(k, e.values!)}`,
      );
      summary = `Survey wave ${e.wave} ${e.reverts ? "restored" : "updated"}${diffs.length ? `: ${diffs.join(", ")}` : " (no values changed)"}`;
    }
    entries.push({ id: e.id, at: e.createdAt, kind: "survey_wave", summary, revertedBy: revertedBy.get(e.id) ?? null, reverts: e.reverts ?? null });
  }
  return entries.sort((a, b) => b.at.localeCompare(a.at));
}

// ---- Counts for the Equity Policy page --------------------------------------

export type QuarterTotals = { period: string; full: number; scan: number; pause: number; total: number };
export type AdministrationTotals = { administration: string; full: number; scan: number; pause: number; total: number };
export type Delta = { value: number; pct: number | null };

function delta(current: number, prior: number | undefined): Delta | null {
  if (prior === undefined) return null;
  return { value: current - prior, pct: prior === 0 ? null : (current - prior) / prior };
}

/** "2026-Q3" for an ISO timestamp. */
export function periodOf(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-Q${Math.floor(d.getUTCMonth() / 3) + 1}`;
}

function shiftPeriod(period: string, by: number): string {
  const [y, q] = period.split("-Q").map(Number);
  const idx = y * 4 + (q - 1) + by;
  return `${Math.floor(idx / 4)}-Q${(idx % 4) + 1}`;
}

export function quarterLabel(period: string): string {
  const [year, q] = period.split("-");
  return `${q} ${year}`;
}

export const SURVEY_MEASURES = [
  { key: "belonging", label: "Belonging", item: "I feel I belong at DHS." },
  { key: "inclusion", label: "Inclusion", item: "My work unit values different perspectives." },
  { key: "engagement", label: "Engagement", item: "I would recommend DHS as a place to work." },
] as const;

export function buildDashboard(
  analyses: EquityAnalysisRecord[],
  followUpEvents: FollowUpEventRecord[],
  waves: SurveyWave[],
  now: string,
  { chartQuarters = 8, windowQuarters = 4, soonDays = 30 } = {},
) {
  const records = [...analyses].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const current = periodOf(now);
  const periods = Array.from({ length: chartQuarters }, (_, i) => shiftPeriod(current, i - (chartQuarters - 1)));
  const byPeriod = new Map(periods.map((p) => [p, { period: p, full: 0, scan: 0, pause: 0, total: 0 } as QuarterTotals]));
  const windowPeriods = new Set(periods.slice(-windowQuarters));
  const byAdmin = new Map<string, AdministrationTotals>();
  const allTime = { full: 0, scan: 0, pause: 0, total: 0 };
  const dispositionCounts = new Map<string, number>();

  for (const r of records) {
    const p = periodOf(r.createdAt);
    const row = byPeriod.get(p);
    if (row) {
      row[r.kind] += 1;
      row.total += 1;
    }
    if (windowPeriods.has(p)) {
      const a = byAdmin.get(r.administration) ?? { administration: r.administration, full: 0, scan: 0, pause: 0, total: 0 };
      a[r.kind] += 1;
      a.total += 1;
      byAdmin.set(r.administration, a);
    }
    allTime[r.kind] += 1;
    allTime.total += 1;
    dispositionCounts.set(r.disposition, (dispositionCounts.get(r.disposition) ?? 0) + 1);
  }

  const quarterly = [...byPeriod.values()];
  const latest = quarterly[quarterly.length - 1];
  const prior = quarterly[quarterly.length - 2];

  const latestEvents = currentFollowUpEvents(followUpEvents);
  const pending = records
    .flatMap((r) => followUpsFor(r, latestEvents, now, soonDays))
    .filter((f) => !f.done)
    .sort((a, b) => a.due.localeCompare(b.due));

  const sortedWaves = [...waves].sort((a, b) => a.wave.localeCompare(b.wave));
  const latestWave = sortedWaves[sortedWaves.length - 1] ?? null;
  const priorWave = sortedWaves[sortedWaves.length - 2];
  const survey = SURVEY_MEASURES.map((m) => ({
    ...m,
    latest: latestWave ? latestWave[m.key] : null,
    delta: latestWave ? delta(latestWave[m.key], priorWave?.[m.key]) : null,
    values: sortedWaves.map((w) => w[m.key]),
  }));

  return {
    empty: records.length === 0,
    asOf: now,
    quarterly,
    latest,
    latestDelta: { full: delta(latest.full, prior?.full), scan: delta(latest.scan, prior?.scan), pause: delta(latest.pause, prior?.pause) },
    allTime,
    fullShare: allTime.total === 0 ? 0 : allTime.full / allTime.total,
    windowPeriods: [...windowPeriods],
    byAdministration: [...byAdmin.values()].sort((a, b) => b.total - a.total),
    dispositions: DISPOSITIONS.map((d) => ({ id: d.id, label: d.label, count: dispositionCounts.get(d.id) ?? 0 })),
    recent: records.slice(0, 8),
    followUps: {
      overdue: pending.filter((f) => f.status === "overdue").length,
      soon: pending.filter((f) => f.status === "soon").length,
      pending: pending.length,
    },
    waves: sortedWaves,
    latestWave,
    survey,
  };
}

export type Dashboard = ReturnType<typeof buildDashboard>;
