import { z } from "zod";
import {
  ADMINISTRATIONS,
  ANALYSIS_KINDS,
  ANSWER_DATE_FIELD_IDS,
  ANSWER_FIELD_IDS,
  DISPOSITION_IDS,
  FOLLOW_UP_KEYS,
  isCalendarDate,
  MAX_ANSWER_LENGTH,
  WORK_TYPE_IDS,
} from "./model";

export const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const uuid = z.string().regex(UUID_V4);
const instant = z.string().datetime();
const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(isCalendarDate, "Choose a valid date.");
const scope = z.enum(["one-dhs", "dsd"]);

const answerShape = Object.fromEntries(
  ANSWER_FIELD_IDS.map((id) => [
    id,
    (ANSWER_DATE_FIELD_IDS as readonly string[]).includes(id)
      ? calendarDate.optional()
      : z.string().trim().max(MAX_ANSWER_LENGTH).optional(),
  ]),
) as Record<(typeof ANSWER_FIELD_IDS)[number], z.ZodOptional<z.ZodString>>;

/** Answers keyed by field id. Only registered ids; blank strings are dropped before saving. */
export const AnswersSchema = z.object(answerShape).strict();

export const EquityAnalysisInputSchema = z
  .object({
    submissionId: uuid,
    programScope: scope,
    kind: z.enum(ANALYSIS_KINDS),
    workTitle: z.string().trim().min(1).max(200),
    workType: z.enum(WORK_TYPE_IDS),
    administration: z.enum(ADMINISTRATIONS),
    approvalDate: calendarDate.optional(),
    disposition: z.enum(DISPOSITION_IDS),
    answers: AnswersSchema,
    consent: z.literal(true),
    sourceRoute: z.literal("/equity-policy/analysis"),
  })
  .strict();

export const EquityAnalysisRecordSchema = EquityAnalysisInputSchema.omit({ submissionId: true })
  .extend({
    schemaVersion: z.literal(1),
    recordType: z.literal("equity_analysis"),
    id: z.string().regex(/^equity-analysis-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
    createdAt: instant,
  })
  .strict();

export const FollowUpEventInputSchema = z
  .object({
    eventId: uuid,
    analysisId: EquityAnalysisRecordSchema.shape.id,
    followUp: z.enum(FOLLOW_UP_KEYS),
    done: z.boolean(),
    reverts: z.string().regex(/^equity-followup-[0-9a-f-]{36}$/).optional(),
  })
  .strict();

export const FollowUpEventRecordSchema = FollowUpEventInputSchema.omit({ eventId: true })
  .extend({
    schemaVersion: z.literal(1),
    recordType: z.literal("equity_analysis_followup"),
    id: z.string().regex(/^equity-followup-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
    createdAt: instant,
  })
  .strict();

export const SurveyWaveValuesSchema = z
  .object({
    fielded: z.string().regex(/^\d{4}-\d{2}$/),
    respondents: z.number().int().min(0).max(1_000_000),
    responseRate: z.number().min(0).max(1),
    belonging: z.number().int().min(0).max(100),
    inclusion: z.number().int().min(0).max(100),
    engagement: z.number().int().min(0).max(100),
  })
  .strict();

const waveLabel = z.string().trim().regex(/^[0-9]{4}(?:[- ][A-Za-z0-9]{1,12})?$/, "Use a year, such as 2026, or a year and a short label.");

export const SurveyWaveEventInputSchema = z
  .object({
    eventId: uuid,
    wave: waveLabel,
    action: z.enum(["set", "remove"]),
    values: SurveyWaveValuesSchema.optional(),
    reverts: z.string().regex(/^equity-survey-[0-9a-f-]{36}$/).optional(),
  })
  .strict()
  .refine((v) => (v.action === "set") === (v.values !== undefined), "A saved wave needs its values; a removal has none.");

export const SurveyWaveEventRecordSchema = z
  .object({
    schemaVersion: z.literal(1),
    recordType: z.literal("equity_survey_wave"),
    id: z.string().regex(/^equity-survey-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
    createdAt: instant,
    wave: waveLabel,
    action: z.enum(["set", "remove"]),
    values: SurveyWaveValuesSchema.optional(),
    reverts: z.string().regex(/^equity-survey-[0-9a-f-]{36}$/).optional(),
  })
  .strict()
  .refine((v) => (v.action === "set") === (v.values !== undefined), "A saved wave needs its values; a removal has none.");

export type EquityAnalysisInput = z.infer<typeof EquityAnalysisInputSchema>;
export type EquityAnalysisRecord = z.infer<typeof EquityAnalysisRecordSchema>;
export type FollowUpEventInput = z.infer<typeof FollowUpEventInputSchema>;
export type FollowUpEventRecord = z.infer<typeof FollowUpEventRecordSchema>;
export type SurveyWaveValues = z.infer<typeof SurveyWaveValuesSchema>;
export type SurveyWaveEventInput = z.infer<typeof SurveyWaveEventInputSchema>;
export type SurveyWaveEventRecord = z.infer<typeof SurveyWaveEventRecordSchema>;
