/** Canonical operating definitions. Internal metadata, not staff copy or activity evidence. */
export const PROGRAM_MODEL_VERSION = "2026-09-08.1";
export type ProgramOutcomeId = "staff_capability" | "capability_transfer" | "access" | "workplace_culture" | "institutional_application" | "organizational_memory" | "agency_coherence";
export type ProgramFunctionId = "ask" | "learning" | "resources" | "community_context" | "guided_practice" | "equity_analysis" | "consultation" | "staff_engagement" | "workforce_context" | "organizational_knowledge" | "content_stewardship" | "program_coordination" | "evaluation";
export type OperatingCadenceId = "monthly_team_meeting" | "open_hours" | "quarterly_review" | "annual_refresh";
export type ProgramEvidenceLevel = "delivery" | "application" | "benefit";
export interface ProgramOutcome { id: ProgramOutcomeId; title: string; intendedChange: string; evidenceExamples: readonly string[]; }
export interface ProgramFunction { id: ProgramFunctionId; title: string; purpose: string; primaryRoute: string; audience: "staff" | "owner" | "staff_and_owner"; outcomeIds: readonly ProgramOutcomeId[]; expectedOutputs: readonly string[]; }
export interface OperatingCadence { id: OperatingCadenceId; title: string; pattern: "monthly" | "recurring_unscheduled" | "quarterly" | "annual"; purpose: string; expectedOutputs: readonly string[]; occurrenceRequiresEvidence: true; scheduleStatus: "planning_pattern"; }

export const programOutcomes: readonly ProgramOutcome[] = [
  { id: "staff_capability", title: "Staff capability", intendedChange: "Staff find, understand and apply useful knowledge in their work.", evidenceExamples: ["A representative task completed with an explanation of the reasoning", "A voluntarily shared example of later application"] },
  { id: "capability_transfer", title: "Capability transfer", intendedChange: "Staff carry out comparable work with greater independence and choose support when it is useful.", evidenceExamples: ["A comparable task completed with less assistance", "A follow-up account explaining what the person could apply independently"] },
  { id: "access", title: "Access", intendedChange: "Language, disability, communication and process barriers are identified and addressed earlier.", evidenceExamples: ["A documented barrier and completed correction", "User feedback on whether the correction improved access"] },
  { id: "workplace_culture", title: "Workplace culture", intendedChange: "Teams improve participation, candor and equitable people practices.", evidenceExamples: ["A changed meeting or supervisory practice and its review", "Voluntarily shared experience of participation after a change"] },
  { id: "institutional_application", title: "Institutional application", intendedChange: "Equity analysis informs policy, program, budget, technology, procurement and implementation decisions.", evidenceExamples: ["A documented design or decision change linked to program support", "A decision owner records the disposition and follow-up"] },
  { id: "organizational_memory", title: "Organizational memory", intendedChange: "Useful knowledge, decisions and work products remain available and maintainable beyond an individual task or person's tenure.", evidenceExamples: ["A maintained resource or decision is reused in later work", "A source correction reaches the affected guidance and records"] },
  { id: "agency_coherence", title: "Agency coherence", intendedChange: "Shared practice supports different organizational settings while preserving their responsibilities and useful local context.", evidenceExamples: ["A documented adaptation or reuse across work areas", "Pilot findings inform a recorded expansion or revision decision"] },
];

export const programFunctions: readonly ProgramFunction[] = [
  { id: "ask", title: "Ask and research", purpose: "Answer staff questions using reasoning, relevant resources and external research when needed.", primaryRoute: "/ask", audience: "staff_and_owner", outcomeIds: ["staff_capability", "capability_transfer"], expectedOutputs: ["A useful answer with applicable sources and next actions", "A durable answer receipt that records failures or degraded results accurately"] },
  { id: "learning", title: "Learning and media", purpose: "Connect substantive courses, lessons, podcasts and learning activities to work people need to do.", primaryRoute: "/learn", audience: "staff", outcomeIds: ["staff_capability", "capability_transfer"], expectedOutputs: ["Accessible learning with meaningful objectives and application", "Playable program-authored media with equivalent accessible content"] },
  { id: "resources", title: "Resources and tools", purpose: "Keep relevant source material and practical tools easy to find and use.", primaryRoute: "/library", audience: "staff", outcomeIds: ["staff_capability", "organizational_memory"], expectedOutputs: ["An accessible resource linked to its source and related work", "Correct resource discovery and navigation"] },
  { id: "community_context", title: "Minnesota community context", purpose: "Connect community histories, experiences and practical considerations to respectful work and engagement.", primaryRoute: "/minnesota-communities", audience: "staff", outcomeIds: ["staff_capability", "access", "institutional_application"], expectedOutputs: ["Substantive sourced community guidance", "Practical questions about participation and access without profiling individuals"] },
  { id: "guided_practice", title: "Guided practice", purpose: "Help people move from learning to something they can use in their work and an independent next action.", primaryRoute: "/practice", audience: "staff", outcomeIds: ["capability_transfer", "institutional_application"], expectedOutputs: ["A work-specific artifact with a self-check", "An optional consultation handoff when useful"] },
  { id: "equity_analysis", title: "Equity analysis and program work", purpose: "Support analysis of workforce, policy, program and service decisions in their actual context.", primaryRoute: "/areas", audience: "staff_and_owner", outcomeIds: ["institutional_application", "access", "workplace_culture"], expectedOutputs: ["Evidence-informed analysis or improvement options", "A clear decision owner and next review for accepted work"] },  { id: "consultation", title: "Consultation and follow-through", purpose: "Prepare and coordinate voluntary consultation with enough context to make support useful.", primaryRoute: "/support", audience: "staff_and_owner", outcomeIds: ["institutional_application", "capability_transfer"], expectedOutputs: ["A scoped request, heads-up packet and accurately recorded status", "A recorded disposition or next action when supplied by the responsible person"] },
  { id: "staff_engagement", title: "Staff engagement and One DSD Team", purpose: "Connect Team work, Open Hours, Amplify Equity and voluntary staff contributions to practical improvement.", primaryRoute: "/one-dsd/team", audience: "staff_and_owner", outcomeIds: ["workplace_culture", "access", "agency_coherence"], expectedOutputs: ["An agenda, support material or bounded contribution", "Agreed questions, follow-up and report-back without invented participation"] },
  { id: "workforce_context", title: "Learning for work and workforce context", purpose: "Relate voluntarily supplied tasks and roles to useful learning while keeping responsibilities and authority distinct.", primaryRoute: "/my-work/explore", audience: "staff_and_owner", outcomeIds: ["staff_capability", "institutional_application", "agency_coherence"], expectedOutputs: ["Relevant task-to-resource connections", "Dated organizational context with unconfirmed relationships identified"] },
  { id: "organizational_knowledge", title: "Understanding DHS", purpose: "Maintain usable organizational knowledge for staff questions and program coordination.", primaryRoute: "/understanding-dhs", audience: "staff_and_owner", outcomeIds: ["organizational_memory", "agency_coherence"], expectedOutputs: ["Source-linked organizational reference with checked dates", "Relevant context for an answer or open work item"] },
  { id: "content_stewardship", title: "Content and accessibility stewardship", purpose: "Keep approved resources accurate, accessible and available, with their source history intact.", primaryRoute: "/consultant/resources", audience: "owner", outcomeIds: ["access", "organizational_memory"], expectedOutputs: ["A completed correction or source-linked review finding", "Versioned publication and repair receipts without repeat content approval"] },
  { id: "program_coordination", title: "Program coordination", purpose: "Carry authorized work through to completion, connect the parts of the program, and make exceptions and follow-up visible.", primaryRoute: "/consultant/orchestrator", audience: "owner", outcomeIds: ["organizational_memory", "institutional_application", "agency_coherence"], expectedOutputs: ["Completed work with actual results and durable receipts", "A useful program review identifying open work, failures and next actions"] },
  { id: "evaluation", title: "Evaluation and improvement", purpose: "Examine delivery, application and benefits separately and use evidence to improve the program.", primaryRoute: "/consultant/evals", audience: "owner", outcomeIds: ["staff_capability", "capability_transfer", "access", "workplace_culture", "institutional_application", "organizational_memory", "agency_coherence"], expectedOutputs: ["A dated evidence review with limitations and improvement decisions", "Separate technical checks, actual work receipts and participant application evidence"] },
];

export const operatingCadences: readonly OperatingCadence[] = [
  { id: "monthly_team_meeting", title: "One DSD Team general meeting", pattern: "monthly", purpose: "Connect shared priorities, substantive learning, accepted work and next steps.", expectedOutputs: ["Prepared agenda and relevant materials", "Confirmed decisions and follow-up when a meeting occurs"], occurrenceRequiresEvidence: true, scheduleStatus: "planning_pattern" },
  { id: "open_hours", title: "Open Hours", pattern: "recurring_unscheduled", purpose: "Offer voluntary support for DSD staff questions and work in progress.", expectedOutputs: ["Support materials appropriate to the agreed topic", "Voluntarily shared themes and follow-up when a session occurs"], occurrenceRequiresEvidence: true, scheduleStatus: "planning_pattern" },
  { id: "quarterly_review", title: "Quarterly program review", pattern: "quarterly", purpose: "Review staff themes, access needs, resource gaps, active work and initiative progress.", expectedOutputs: ["Evidence summary distinguishing delivery, application and benefit", "Recorded decisions to retain, revise, connect, support or stop work"], occurrenceRequiresEvidence: true, scheduleStatus: "planning_pattern" },
  { id: "annual_refresh", title: "Annual program refresh", pattern: "annual", purpose: "Review program scope, responsibilities, resources, measures, continuity and next priorities.", expectedOutputs: ["Updated priorities and operating definitions", "Recorded capacity and continuity needs without invented commitments"], occurrenceRequiresEvidence: true, scheduleStatus: "planning_pattern" },
];

export const programAuthorityRules = {
  operatingConcept: "DIGITAL MING",
  ownerRole: "Program owner and Equity and Inclusion Operations Consultant",
  coordinatingRole: "Chief of Staff",
  curatedContentAlreadyApproved: true,
  routineAuthorizedWorkRequiresRepeatApproval: false,
  ownerCanStopInspectOrReduceActivity: true,
  learningAndOrdinaryPracticeAreVoluntary: true,
  voluntaryParticipationScopes: ["DHS", "ADSA", "DSD"],
  colleagueInputInformsProgramOperatingDecisions: true,
  launchTiming: "Early 2027 is tentative, not a committed launch date.",
  cadencesArePlanningPatternsNotConfirmedSchedules: true,
  staffRecordRetentionDecision: "undecided",
  realStaffIntakeActivation: "pending agreed retention and operating decisions",
  officialDecisionAuthorityIsNotConferred: true,
  externalCommunicationRequiresActualTaskAuthority: true,
  sourceHistoryMustBePreserved: true,
  recordedWorkIsNotSharedStaffConversationMemory: true,
  programDefinitionsAreNotExecutionReceipts: true,
} as const;

export const programMeasurementRules = {
  evidenceLevels: ["delivery", "application", "benefit"] as const,
  deliveryMeaning: "A verified task result or usable output exists; this does not establish use or benefit.",
  applicationMeaning: "Evidence shows how the output was used in real work; distinguish participant report from independent observation.",
  benefitMeaning: "Evidence describes an observed change and its limitations; contribution is not automatically causation.",
  technicalChecksAreProgramOutcomes: false,
  completionOrUsageAloneEstablishesCapability: false,
  fewerConsultationsAloneEstablishesIndependence: false,
  employeeRankingPermitted: false,
  participantEvidenceIsVoluntary: true,
  emptyEvidenceMeaning: "Not yet evidenced in this record, not proof that no work occurred.",
  autonomyTargetPercent: { minimum: 90, maximum: 95 },
  autonomyReportingRequires: ["Reporting period", "Declared eligible task set", "Completed agent work", "Human interventions", "Failures", "Excluded tasks and reasons"] as const,
  autonomyCalculation: "Completed eligible tasks carried through by agents without human intervention divided by all declared eligible tasks in the reporting period; report assisted completions separately.",
  excludedFromCompletedAgentWork: ["Suggestions", "Queued work", "Repeated retries counted as new completions", "Synthetic demonstrations presented as staff work"] as const,
  minimumWorkRecord: ["Question or need", "Scope", "Program function", "Intended outcome", "Task", "Relevant resources", "Evidence limits", "Responsible role or confirmed owner", "Next review", "Actual result and receipt"] as const,
} as const;