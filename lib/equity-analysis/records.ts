import "server-only";
import { ownerFromCookies } from "@/lib/auth/request";
import { getStore } from "@/lib/intelligence/memory/store";
import { piiDetect } from "@/lib/intelligence/safety";
import { ANSWER_FIELD_IDS, missingRequired, type Answers } from "./model";
import {
  EquityAnalysisInputSchema,
  EquityAnalysisRecordSchema,
  FollowUpEventInputSchema,
  FollowUpEventRecordSchema,
  SurveyWaveEventInputSchema,
  SurveyWaveEventRecordSchema,
  type EquityAnalysisInput,
  type EquityAnalysisRecord,
  type FollowUpEventInput,
  type FollowUpEventRecord,
  type SurveyWaveEventInput,
  type SurveyWaveEventRecord,
} from "./schema";
import { changeHistory, currentFollowUpEvents, currentSurveyWaves, followUpsFor, type FollowUp } from "./rollups";

// History and "latest wins" order by createdAt alone; two saves in one millisecond would tie.
let lastEventMs = 0;
function eventTimestamp(): string {
  const now = Date.now();
  lastEventMs = now > lastEventMs ? now : lastEventMs + 1;
  return new Date(lastEventMs).toISOString();
}

function durableStore() {
  const store = getStore();
  if ((process.env.NODE_ENV === "production" || process.env.VERCEL === "1") && store.backend !== "postgres") {
    throw new Error("Durable analysis records are unavailable.");
  }
  return store;
}

/** Free-text answers are checked the same way shared results are. */
export function analysisSharingProblem(input: EquityAnalysisInput): string | null {
  const text = [input.workTitle, ...Object.values(input.answers)].filter(Boolean).join("\n");
  if (
    !piiDetect(text).ok
    || /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
    || /\b(?:employee|staff|personnel|client|case)\s*(?:id|number|#)\s*[:#]?\s*[A-Z0-9-]{3,}/i.test(text)
  ) {
    return "Please remove names, case details, or identifying information before adding this to the record. Keep the focus on the work and the change.";
  }
  return null;
}

/** Required answers for the chosen form, checked on the same step definitions the walkthrough uses. */
export function analysisCompletenessProblem(input: EquityAnalysisInput): string | null {
  const answers: Answers = {
    ...input.answers,
    work_title: input.workTitle,
    work_type: input.workType,
    administration: input.administration,
    approval_date: input.approvalDate ?? "",
    disposition: input.disposition,
  };
  const missing = missingRequired(input.kind, answers);
  return missing.length ? "Some required answers are blank." : null;
}

function trimmedAnswers(answers: EquityAnalysisInput["answers"]): EquityAnalysisInput["answers"] {
  const out: Record<string, string> = {};
  for (const id of ANSWER_FIELD_IDS) {
    const value = answers[id as keyof typeof answers]?.trim();
    if (value) out[id] = value;
  }
  return out as EquityAnalysisInput["answers"];
}

export async function saveEquityAnalysis(raw: EquityAnalysisInput): Promise<EquityAnalysisRecord> {
  const input = EquityAnalysisInputSchema.parse({ ...raw, answers: trimmedAnswers(raw.answers), workTitle: raw.workTitle.trim() });
  const issue = analysisSharingProblem(input) ?? analysisCompletenessProblem(input);
  if (issue) throw new Error(issue);
  const { submissionId, ...details } = input;
  const record = EquityAnalysisRecordSchema.parse({
    ...details,
    schemaVersion: 1,
    recordType: "equity_analysis",
    id: `equity-analysis-${submissionId}`,
    createdAt: eventTimestamp(),
  });
  const result = await durableStore().put("decision", `equity_analysis:${record.id}`, record, `equity-analysis:${submissionId}`);
  return EquityAnalysisRecordSchema.parse(result.value);
}

export async function saveFollowUpEvent(raw: FollowUpEventInput): Promise<FollowUpEventRecord> {
  const input = FollowUpEventInputSchema.parse(raw);
  if (!(await getEquityAnalysis(input.analysisId))) throw new Error("That analysis is not on the record.");
  const { eventId, ...details } = input;
  const record = FollowUpEventRecordSchema.parse({
    ...details,
    schemaVersion: 1,
    recordType: "equity_analysis_followup",
    id: `equity-followup-${eventId}`,
    createdAt: eventTimestamp(),
  });
  const result = await durableStore().put("decision", `equity_followup:${record.id}`, record, `equity-followup:${eventId}`);
  return FollowUpEventRecordSchema.parse(result.value);
}

export async function saveSurveyWaveEvent(raw: SurveyWaveEventInput): Promise<SurveyWaveEventRecord> {
  const input = SurveyWaveEventInputSchema.parse(raw);
  const { eventId, ...details } = input;
  const record = SurveyWaveEventRecordSchema.parse({
    ...details,
    schemaVersion: 1,
    recordType: "equity_survey_wave",
    id: `equity-survey-${eventId}`,
    createdAt: eventTimestamp(),
  });
  const result = await durableStore().put("decision", `equity_survey:${record.id}`, record, `equity-survey:${eventId}`);
  return SurveyWaveEventRecordSchema.parse(result.value);
}

async function decisions(): Promise<unknown[]> {
  return getStore().list<unknown>("decision");
}

/** Stored analyses are owner-only. Staff SSR and APIs must not list them. */
export async function listEquityAnalyses(): Promise<EquityAnalysisRecord[]> {
  if (!(await ownerFromCookies())) return [];
  const rows = await decisions();
  return rows
    .flatMap((row) => {
      const parsed = EquityAnalysisRecordSchema.safeParse(row);
      return parsed.success ? [parsed.data] : [];
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getEquityAnalysis(id: string): Promise<EquityAnalysisRecord | null> {
  if (!EquityAnalysisRecordSchema.shape.id.safeParse(id).success) return null;
  const row = await getStore().get<unknown>("decision", `equity_analysis:${id}`);
  const parsed = EquityAnalysisRecordSchema.safeParse(row);
  return parsed.success ? parsed.data : null;
}

export async function listFollowUpEvents(): Promise<FollowUpEventRecord[]> {
  const rows = await decisions();
  return rows.flatMap((row) => {
    const parsed = FollowUpEventRecordSchema.safeParse(row);
    return parsed.success ? [parsed.data] : [];
  });
}

export async function listSurveyWaveEvents(): Promise<SurveyWaveEventRecord[]> {
  const rows = await decisions();
  return rows.flatMap((row) => {
    const parsed = SurveyWaveEventRecordSchema.safeParse(row);
    return parsed.success ? [parsed.data] : [];
  });
}

export async function getEvent(id: string): Promise<FollowUpEventRecord | SurveyWaveEventRecord | null> {
  const key = id.startsWith("equity-followup-") ? `equity_followup:${id}` : id.startsWith("equity-survey-") ? `equity_survey:${id}` : null;
  if (!key) return null;
  const row = await getStore().get<unknown>("decision", key);
  const followUp = FollowUpEventRecordSchema.safeParse(row);
  if (followUp.success) return followUp.data;
  const survey = SurveyWaveEventRecordSchema.safeParse(row);
  return survey.success ? survey.data : null;
}

function emptyEquityWorkspace(now: string) {
  return {
    now,
    analyses: [] as EquityAnalysisRecord[],
    followUpEvents: [] as FollowUpEventRecord[],
    surveyEvents: [] as SurveyWaveEventRecord[],
    followUps: [] as FollowUp[],
    waves: [] as ReturnType<typeof currentSurveyWaves>,
    history: [] as ReturnType<typeof changeHistory>,
  };
}

/** Everything the owner record page reads. Staff callers receive an empty workspace. */
export async function loadEquityWorkspace(now = new Date().toISOString()) {
  if (!(await ownerFromCookies())) return emptyEquityWorkspace(now);
  const rows = await decisions();
  const analyses: EquityAnalysisRecord[] = [];
  const followUpEvents: FollowUpEventRecord[] = [];
  const surveyEvents: SurveyWaveEventRecord[] = [];
  for (const row of rows) {
    const recordType = (row as { recordType?: unknown })?.recordType;
    if (recordType === "equity_analysis") {
      const parsed = EquityAnalysisRecordSchema.safeParse(row);
      if (parsed.success) analyses.push(parsed.data);
    } else if (recordType === "equity_analysis_followup") {
      const parsed = FollowUpEventRecordSchema.safeParse(row);
      if (parsed.success) followUpEvents.push(parsed.data);
    } else if (recordType === "equity_survey_wave") {
      const parsed = SurveyWaveEventRecordSchema.safeParse(row);
      if (parsed.success) surveyEvents.push(parsed.data);
    }
  }
  analyses.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const latestFollowUps = currentFollowUpEvents(followUpEvents);
  const followUps: FollowUp[] = analyses.flatMap((a) => followUpsFor(a, latestFollowUps, now));
  return {
    now,
    analyses,
    followUpEvents,
    surveyEvents,
    followUps,
    waves: currentSurveyWaves(surveyEvents),
    history: changeHistory(analyses, followUpEvents, surveyEvents),
  };
}

export type EquityWorkspace = Awaited<ReturnType<typeof loadEquityWorkspace>>;
