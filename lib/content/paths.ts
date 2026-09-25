/**
 * Self-directed graduation paths GP-1 to GP-11 (including the restored domain paths).
 * Scaffold -> practice -> fade. Each path: Ask -> CI (if relevant) -> Resources/tools ->
 * practice artifact -> self-check -> optional consult.
 */
import type { LaunchType } from "./question-banks";
import type { ParticipationClass } from "@/lib/participation/contracts";
import { DOMAIN_PATHS } from "./paths-domain";
import { PRACTICE_INFRASTRUCTURE_PATHS } from "./paths-practice-infrastructure";

export type PathStepKey = "ask" | "ci" | "resources" | "artifact" | "selfcheck" | "consult";

export type PathStep = {
  key: PathStepKey;
  title: string;
  guidance: string;
  links: Array<{ label: string; href: string }>;
  /** CI step required before self-check can pass (GP-3). */
  required?: boolean;
  /** CI step can be skipped when not relevant. */
  optional?: boolean;
};

export type ArtifactFieldType = "text" | "textarea" | "list" | "date";

export type ArtifactField = {
  id: string;
  label: string;
  help: string;
  type: ArtifactFieldType;
  required: boolean;
  /** Which self-check rule this field feeds. */
  rubric?: RubricKey;
};

export type RubricKey = "owners" | "review_date" | "access" | "involved" | "not_assumed" | "application_task" | "sources_labeled" | "specific_work" | "ci_reviewed" | "no_named_parties";

export type RubricRule = {
  key: RubricKey;
  label: string;
  failMessage: string;
};

export type GraduationPath = {
  id: "gp-1" | "gp-2" | "gp-3" | "gp-4" | "gp-5" | "gp-6" | "gp-7" | "gp-8" | "gp-9" | "gp-10" | "gp-11" | "gp-12" | "gp-13";
  title: string;
  staffLabel: string;
  signals: string[];
  startingCompetence: string;
  graduatedLooksLike: string;
  launchType: LaunchType;
  askStarters: string[];
  steps: PathStep[];
  artifactTitle: string;
  artifactFields: ArtifactField[];
  rubric: RubricRule[];
  antiPerformative: { fake: string[]; real: string[] };
  privacy: string;
  consultSupportType: "scoping_goals" | "equity_embed_review" | "access_language_check" | "stakeholder_partner_map" | "facilitation_prep";
  /** GP-4 hard wall for complaint/investigation payloads. */
  hrWall?: boolean;
  ciRequired?: boolean;
  /** Optional practice may support a separately required work process. */
  participation?: ParticipationClass;
};

const COMMON_RUBRIC: RubricRule[] = [
  { key: "owners", label: "Every follow-up has a named owner", failMessage: "Please name the person responsible for each follow-up." },
  { key: "review_date", label: "A next review date is set", failMessage: "Please choose a specific date to review this work again." },
  { key: "specific_work", label: "This is connected to your specific work", failMessage: "Please name the program, notice, session, or team this is for." },
];

const ACCESS_RULE: RubricRule = { key: "access", label: "Language, disability, and communication access were considered for this work", failMessage: "Please note the access checks you completed, including language, disability and communication access, and the effort the process asks of people." };
const INVOLVED_RULE: RubricRule = { key: "involved", label: "You named who was involved and the role they had", failMessage: "Please list who was involved before the design was settled and what role or decision-making authority they had." };
const NOT_ASSUMED_RULE: RubricRule = { key: "not_assumed", label: "You noted what you chose not to assume", failMessage: "Please note what you chose not to assume about the people affected." };

const CORE_PATHS: GraduationPath[] = [
  {
    id: "gp-1",
    title: "New program or service concept",
    staffLabel: "I'm planning something new",
    signals: ["An early program or service idea", "A new digital application or online service", "A service redesign before the design is settled"],
    startingCompetence: "You have a program idea and want a clear way to consider equity and access before the design is settled.",
    graduatedLooksLike:
      "By the end, you will have a completed equity and access checklist for your program, with clear responsibilities and a review date. You can usually complete routine planning without a consultation, use the same approach for future work, and seek another perspective when added judgment would help.",
    launchType: "program_service",
    askStarters: [
      "We're planning a new digital application for benefits renewals. What equity questions should we ask before the design is settled?",
      "What access assumptions should I consider while the idea is still taking shape?",
      "Who should be involved before the design is fixed?",
    ],
    steps: [
      { key: "ask", title: "Explore the first questions", guidance: "Use Ask to consider the equity and access questions that matter before the design is settled. The response will include its sources and any limits.", links: [{ label: "Browse common questions", href: "/ask?path=gp-1" }] },
      { key: "ci", title: "Consider community context", guidance: "If the work names Minnesota communities or partners, read the relevant brief. Focus on what to ask, access needs, who to involve, and what not to assume.", links: [{ label: "Explore Minnesota Communities", href: "/minnesota-communities" }], optional: true },
      { key: "resources", title: "Choose practical resources", guidance: "Use the launch checklist, the journey and burden questions, and the partner map to work through your idea.", links: [{ label: "Launch equity and access checklist", href: "/library/ja-launch-embed-checklist" }, { label: "Journey and burden questions", href: "/library/ja-process-burden" }, { label: "Partner map", href: "/library/ja-stakeholder-map" }] },
      { key: "artifact", title: "Draft your equity and access checklist", guidance: "Complete the checklist for your program. It is saved in the web browser you are using, so please leave out client names and case details.", links: [] },
      { key: "selfcheck", title: "Review your work", guidance: "Confirm who is responsible, the access needs you considered, who was involved, what you chose not to assume, the review date, and any questions that remain.", links: [] },
      { key: "consult", title: "Find the right person when needed", guidance: "If the idea is high stakes or questions remain, use your checklist to explain the work to the responsible person or office. Staff consultation request forms are closed.", links: [{ label: "Find the right person", href: "/support/right-person?area=policy_program_service_design" }] },
    ],
    artifactTitle: "Equity and access planning checklist",
    artifactFields: [
      { id: "work_name", label: "Program or service name", help: "Use the program or service name, not a client's name.", type: "text", required: true, rubric: "specific_work" },
      { id: "people", label: "Who this is for, and who carries the burden if it does not work", help: "Use general terms and consider which communities may be missing from the design process.", type: "textarea", required: true },
      { id: "access_checks", label: "Access needs and assumptions", help: "Consider broadband, a printer, English, transportation, daytime availability, an available human alternative, and accessible documents.", type: "textarea", required: true, rubric: "access" },
      { id: "language", label: "Languages and vital documents", help: "Note the languages people may need, which documents need translation and human review, and how an interpreter will be available at first contact.", type: "textarea", required: true },
      { id: "burden", label: "Steps or barriers you can remove", help: "Consider the number of steps, documents, and trips, along with requirements that may be easy to miss.", type: "textarea", required: false },
      { id: "involved", label: "Who is involved before the design is settled, and what role they have", help: "Consider the Equity Director, accessibility and language access leads, community partners, and Tribal consultation when applicable.", type: "textarea", required: true, rubric: "involved" },
      { id: "not_assumed", label: "What you chose not to assume", help: "Note the assumptions you avoided about the people affected.", type: "textarea", required: true, rubric: "not_assumed" },
      { id: "owners", label: "Who is responsible for each follow-up", help: "Add one line for each follow-up, including the action and the person responsible.", type: "list", required: true, rubric: "owners" },
      { id: "review_date", label: "Next review date", help: "Choose a date when you will return to this work.", type: "date", required: true, rubric: "review_date" },
      { id: "gaps", label: "Questions that remain", help: "Note what you still need to learn and who can help.", type: "textarea", required: false },
    ],
    rubric: [...COMMON_RUBRIC, ACCESS_RULE, INVOLVED_RULE, NOT_ASSUMED_RULE],
    antiPerformative: {
      fake: ["A quick answer with no next step", "A completed checklist without clear responsibilities or a review date", "An equity section added without considering access or burden"],
      real: ["The checklist is connected to your program", "Access, involvement, and assumptions are addressed", "Questions that remain are clearly noted and taken to the right people"],
    },
    privacy: "Do not include client names or case IDs, and describe populations only in general terms. Progress is saved in the web browser you are using and is not used to rank anyone.",
    consultSupportType: "scoping_goals",
  },
  {
    id: "gp-2",
    title: "Policy, form, or notice change",
    staffLabel: "I'm changing a form, notice, or policy",
    signals: ["A staff- or public-facing form, letter, or notice", "A policy or procedure text change", "A process change people must follow"],
    startingCompetence: "You are preparing a policy, form, notice, or letter and want to make sure it is clear, accessible, and workable for the people who will use it.",
    graduatedLooksLike:
      "By the end, you will have a clear record of the change, its effect on people, access needs, sources, follow-up responsibilities, and a review date. You can usually complete routine changes with these resources and seek human guidance for high-stakes questions or conflicting Official sources.",
    launchType: "form_notice",
    askStarters: [
      "We are changing a renewal notice. What access and burden questions should we work through?",
      "Where is the plain language checklist?",
      "Two guidance documents disagree about a notice requirement. What should I do?",
    ],
    steps: [
      { key: "ask", title: "Consider access and impact", guidance: "Use Ask to work through plain-language, access, and process questions. If you need a statute or rule, the answer will be clear about whether an official source is available.", links: [{ label: "Browse common questions", href: "/ask?path=gp-2" }] },
      { key: "ci", title: "Consider community context", guidance: "If the change may affect particular Minnesota communities more heavily, read the relevant brief for language, naming, and access considerations.", links: [{ label: "Explore Minnesota Communities", href: "/minnesota-communities" }], optional: true },
      { key: "resources", title: "Choose practical resources", guidance: "Use the change-planning guide, plain-language checklist, language access checklist, and equity impact questions as needed.", links: [{ label: "Form, notice, or letter change guide", href: "/library/ja-form-notice-change" }, { label: "Plain language and accessible documents", href: "/library/ja-plain-language" }, { label: "Language access checklist", href: "/library/ja-language-access-checklist" }] },
      { key: "artifact", title: "Draft your change and access notes", guidance: "Record who will be affected, access needs, the effort the process asks of people, source labels, follow-up responsibilities, and a review date.", links: [] },
      { key: "selfcheck", title: "Review your work", guidance: "Confirm that every source is clearly labeled, access needs and process barriers are specific, and the next steps have responsible people and dates.", links: [] },
      { key: "consult", title: "Find the right person when needed", guidance: "If the stakes are high or official sources conflict, find the person or office responsible for the decision. Most day-to-day access questions can be worked through with these resources.", links: [{ label: "Find the right person", href: "/support/right-person?area=policy_program_service_design" }] },
    ],
    artifactTitle: "Change impact notes and access checklist",
    artifactFields: [
      { id: "work_name", label: "Form, notice, or policy name", help: "What is changing.", type: "text", required: true, rubric: "specific_work" },
      { id: "impact", label: "Who receives this and what they will need to do", help: "Consider who may not be able to complete the steps and what happens then.", type: "textarea", required: true },
      { id: "access_checks", label: "Language and access notes", help: "Is this a vital document? Which languages are needed? Has it had a plain-language review? Are accessible formats and phone or in-person options available?", type: "textarea", required: true, rubric: "access" },
      { id: "burden", label: "Time, steps, and other barriers", help: "Consider deadlines, required documents, and return methods. Note anything that can be removed or simplified.", type: "textarea", required: true },
      { id: "sources", label: "Sources and their authority labels", help: "Label each source Official, Guidance, or Outside source; check before use. If you cannot find a source, note that you asked the policy owner.", type: "list", required: true, rubric: "sources_labeled" },
      { id: "involved", label: "Who reviewed this before release", help: "Consider communications, language access, accessibility, and the policy owner.", type: "textarea", required: true, rubric: "involved" },
      { id: "not_assumed", label: "What you chose not to assume", help: "Note the assumptions you avoided about the people receiving this.", type: "textarea", required: true, rubric: "not_assumed" },
      { id: "owners", label: "Who will address each barrier", help: "Add one line for each barrier, including the action and the person responsible.", type: "list", required: true, rubric: "owners" },
      { id: "review_date", label: "Next review date", help: "", type: "date", required: true, rubric: "review_date" },
    ],
    rubric: [
      ...COMMON_RUBRIC,
      ACCESS_RULE,
      INVOLVED_RULE,
      NOT_ASSUMED_RULE,
      { key: "sources_labeled", label: "Every source has an authority label and can be verified", failMessage: "Please label each source Official, Guidance, or Outside source; check before use. If a citation came from memory, leave it out and ask the policy owner." },
    ],
    antiPerformative: {
      fake: ["A general statement that equity was considered without any language, access, or process details", "A statute cited from memory"],
      real: ["Specific notes about barriers and access", "Sources are clearly labeled", "Unanswered policy questions are taken to the policy owner"],
    },
    privacy: "No individual accommodation case details; general access needs only.",
    consultSupportType: "equity_embed_review",
  },
  {
    id: "gp-3",
    title: "Community engagement or co-design effort",
    staffLabel: "I'm planning work with a community",
    signals: ["Outreach, listening sessions, advisory groups, co-design", "Work that names Minnesota communities or partners"],
    startingCompetence: "You are planning community engagement and want the work to be respectful, useful, and grounded in what people actually need.",
    graduatedLooksLike:
      "By the end, you will have an engagement plan grounded in the relevant Minnesota Communities briefs, with access needs, partners, and assumptions clearly addressed. Review each relevant brief before completing the plan.",
    launchType: "engagement_effort",
    askStarters: [
      "How should we plan a listening session with Somali families in Greater Minnesota without stereotyping?",
      "What does the partnership spine mean for a co-design effort?",
      "Who should be involved in a community engagement plan?",
    ],
    steps: [
      { key: "ask", title: "Plan a respectful approach", guidance: "Use Ask to consider how the partnership commitments and anti-profiling practices apply to your work.", links: [{ label: "Browse common questions", href: "/ask?path=gp-3" }] },
      { key: "ci", title: "Read the relevant community briefs", guidance: "Open the brief for each community named in the work. Read the overview and the guidance on what to ask, access needs, who to involve, and what not to assume. Note in your plan which briefs you reviewed.", links: [{ label: "Explore Minnesota Communities", href: "/minnesota-communities" }], required: true },
      { key: "resources", title: "Choose practical resources", guidance: "Use the meeting and outreach access checklist, partner map, and language access checklist as needed.", links: [{ label: "Access checks before a meeting or outreach", href: "/library/ja-access-checks" }, { label: "Partner map", href: "/library/ja-stakeholder-map" }] },
      { key: "artifact", title: "Draft your engagement plan", guidance: "Include the questions you will ask, access needs, who to involve, what not to assume, compensation, and how you will report back.", links: [] },
      { key: "selfcheck", title: "Review your work", guidance: "Confirm that you reviewed the relevant briefs, recognized differences within each community, noted what remains unknown, and did not apply group information to any one person.", links: [] },
      { key: "consult", title: "Find the right person when needed", guidance: "If a brief does not address your question, the work may involve trauma, or Tribal consultation may be required, find the responsible person or office before proceeding.", links: [{ label: "Find the right person", href: "/support/right-person?area=community_engagement_co_design" }] },
    ],
    artifactTitle: "Engagement plan",
    artifactFields: [
      { id: "work_name", label: "Effort name and purpose", help: "What decision this engagement will influence.", type: "text", required: true, rubric: "specific_work" },
      { id: "ci_reviewed", label: "Community briefs you reviewed", help: "List each brief and note that you read its overview and practice guidance.", type: "list", required: true, rubric: "ci_reviewed" },
      { id: "questions", label: "What you will ask", help: "Use open questions without asking people to relive trauma unnecessarily.", type: "list", required: true },
      { id: "access_checks", label: "Access needs", help: "Consider language and dialect, interpreters, captioning, timing, location, transportation, child care, and trust.", type: "textarea", required: true, rubric: "access" },
      { id: "involved", label: "Who to involve, why, and in what role", help: "Note their purpose, authority, compensation, and how you will report back. For Tribal Nations, consultation comes first.", type: "textarea", required: true, rubric: "involved" },
      { id: "not_assumed", label: "What not to assume", help: "Recognize differences within every community; immigration, faith, and language are not interchangeable.", type: "textarea", required: true, rubric: "not_assumed" },
      { id: "owners", label: "Who is responsible for each follow-up", help: "Include the person who will report back to participants.", type: "list", required: true, rubric: "owners" },
      { id: "review_date", label: "Report-back and review date", help: "", type: "date", required: true, rubric: "review_date" },
      { id: "gaps", label: "Questions that remain", help: "Note what is still unknown and seek the appropriate guidance rather than guessing.", type: "textarea", required: false },
    ],
    rubric: [
      ...COMMON_RUBRIC,
      ACCESS_RULE,
      INVOLVED_RULE,
      NOT_ASSUMED_RULE,
      { key: "ci_reviewed", label: "The relevant Minnesota Communities briefs were reviewed", failMessage: "Please open the brief for each community named in the work and note that you read its overview and practice guidance." },
    ],
    antiPerformative: {
      fake: ["General cultural facts with no connection to the work", "Applying information about a group to a named person"],
      real: ["The plan addresses questions, access, involvement, and assumptions", "Differences within the community are recognized", "Questions that remain are clearly noted"],
    },
    privacy: "Briefs do not describe any one person. Please leave case details out of your notes and seek the appropriate authority before using Nation-specific guidance.",
    consultSupportType: "stakeholder_partner_map",
    ciRequired: true,
  },
  {
    id: "gp-4",
    title: "Workplace culture and team climate",
    staffLabel: "I'm strengthening team climate",
    signals: ["Participation, candor, or equitable people practices on a team", "A supervisor preparing a climate conversation"],
    startingCompetence: "You have noticed a concern with participation or team climate and want practical ways to improve everyday team practices.",
    graduatedLooksLike:
      "By the end, you will have a team climate plan with observable practices, clear responsibilities, and a follow-up date. Complaints, investigations, and discipline continue through the appropriate formal channels.",
    launchType: "climate_effort",
    askStarters: [
      "People on my team do not speak up in meetings. What practices could change that?",
      "How do I write team norms that people will actually use?",
      "Where is the line between a climate plan and an HR matter?",
    ],
    steps: [
      { key: "ask", title: "Consider everyday team practices", guidance: "Use Ask to explore practical ways to support participation and team climate. If the situation involves a complaint or a named person's conduct, you will be directed to the appropriate formal channel.", links: [{ label: "Browse common questions", href: "/ask?path=gp-4" }] },
      { key: "ci", title: "Consider community context when helpful", guidance: "Use a community brief only when intercultural context is directly relevant to the team's work.", links: [{ label: "Explore Minnesota Communities", href: "/minnesota-communities" }], optional: true },
      { key: "resources", title: "Choose practical resources", guidance: "Review the team climate basics and use the action plan template.", links: [{ label: "Team climate basics", href: "/library/lm-workplace-climate" }, { label: "Team climate action plan template", href: "/library/ja-climate-action-plan" }] },
      { key: "artifact", title: "Draft your team climate action plan", guidance: "Describe the practices, participation agreements, responsible people, and a follow-up date. Please leave out names and complaint details.", links: [] },
      { key: "selfcheck", title: "Review your work", guidance: "Confirm that the practices are observable, each one has a responsible person and date, and the plan contains no complaint details.", links: [] },
      { key: "consult", title: "Find the right person when needed", guidance: "For help preparing a team conversation, find the responsible supervisor or equity lead. Complaints and investigations belong with Employee Culture, Human Resources, or the civil-rights channel.", links: [{ label: "Find the right person", href: "/support/right-person?area=culture_trust_repair" }] },
    ],
    artifactTitle: "Team climate action plan",
    artifactFields: [
      { id: "work_name", label: "Team", help: "Use the team or unit name, not the names of individual people.", type: "text", required: true, rubric: "specific_work" },
      { id: "practices", label: "Three to five observable practices", help: "Describe something a team member could see happening in everyday work.", type: "list", required: true },
      { id: "access_checks", label: "Access at work", help: "Captions by default, materials in advance, flexible participation formats.", type: "textarea", required: true, rubric: "access" },
      { id: "involved", label: "Who helped shape this plan", help: "Include team input and the Equity Director when relevant, without naming anyone as the problem.", type: "textarea", required: true, rubric: "involved" },
      { id: "not_assumed", label: "What you chose not to assume", help: "Consider what you may not know about why people are quiet, absent, or disengaged.", type: "textarea", required: true, rubric: "not_assumed" },
      { id: "owners", label: "Who is responsible for each practice", help: "Name a responsible person for each practice.", type: "list", required: true, rubric: "owners" },
      { id: "review_date", label: "Follow-up conversation date", help: "Within a quarter.", type: "date", required: true, rubric: "review_date" },
      { id: "evidence", label: "How the team will know the practice is helping", help: "Look for changes in the team's experience without ranking or scoring people.", type: "textarea", required: false },
    ],
    rubric: [
      ...COMMON_RUBRIC,
      ACCESS_RULE,
      INVOLVED_RULE,
      NOT_ASSUMED_RULE,
      { key: "no_named_parties", label: "No names or complaint details are included", failMessage: "Please leave out names and complaint details. Complaints, investigations, and discipline matters belong with Employee Culture, Human Resources, or the civil-rights channel." },
    ],
    antiPerformative: {
      fake: ["A one-time conversation with no follow-up", "Using the plan to investigate a named person"],
      real: ["Observable practices, responsible people, and a follow-up date", "Complaint concerns are directed to the appropriate formal channel"],
    },
    privacy: "Please do not include names, complaint details, or discipline information. Teams are not ranked. Progress is saved in the web browser you are using.",
    consultSupportType: "facilitation_prep",
    hrWall: true,
  },
  {
    id: "gp-5",
    title: "Planning a learning or facilitation session",
    staffLabel: "I'm planning a session",
    signals: ["A training, huddle, or equity-at-work session you are running", "A session that must produce application, not attendance"],
    startingCompetence: "You have a session to lead and want participants to leave with something they can use in their work.",
    graduatedLooksLike:
      "By the end, you will have a reusable session plan with a clear objective, an activity based on real work, something useful participants can take with them, and access arrangements made in advance.",
    launchType: "facilitation_session",
    askStarters: [
      "How do I plan a 60-minute session that produces something participants use?",
      "What access arrangements should be in place before a session?",
      "What should participants leave with that they can use in their work?",
    ],
    steps: [
      { key: "ask", title: "Begin with what participants will use", guidance: "Use Ask to consider what participants should leave with and how to shape the session around that result.", links: [{ label: "Browse common questions", href: "/ask?path=gp-5" }] },
      { key: "ci", title: "Consider community context", guidance: "If the session centers Minnesota communities, use the relevant brief with care and stay within its stated limits.", links: [{ label: "Explore Minnesota Communities", href: "/minnesota-communities" }], optional: true },
      { key: "resources", title: "Choose practical resources", guidance: "Use the session plan template, facilitation learning guide, and access checklist as needed.", links: [{ label: "Session plan template", href: "/library/ja-facilitation-session-plan" }, { label: "Facilitation that leads to practical use", href: "/library/lm-facilitation-application" }, { label: "Access checks before a session", href: "/library/ja-access-checks" }] },
      { key: "artifact", title: "Draft your session plan", guidance: "Include the objective, activity, work participants will complete, accessibility arrangements, and follow-up.", links: [] },
      { key: "selfcheck", title: "Review your work", guidance: "Confirm that participants will leave with something useful, the access arrangements are specific, and the follow-up has a date.", links: [] },
      { key: "consult", title: "Find the right person when needed", guidance: "If another person should help you plan the session, use Find the right person to identify the responsible role or office.", links: [{ label: "Find the right person", href: "/support/right-person?area=community_engagement_co_design" }] },
    ],
    artifactTitle: "Session plan",
    artifactFields: [
      { id: "work_name", label: "Session title and audience", help: "", type: "text", required: true, rubric: "specific_work" },
      { id: "objective", label: "Learning objective (one sentence, observable)", help: "", type: "text", required: true },
      { id: "activity", label: "Activity with participants' real work", help: "", type: "textarea", required: true },
      { id: "application_task", label: "Useful work participants will leave with", help: "Describe what they will complete and how they will use it next.", type: "textarea", required: true, rubric: "application_task" },
      { id: "access_checks", label: "Accessibility arrangements", help: "Consider captions or CART, materials shared in advance, alternatives to dragging or timed activities, plain-language slides, and text labels for every control.", type: "textarea", required: true, rubric: "access" },
      { id: "involved", label: "Who helped shape or will co-facilitate", help: "", type: "textarea", required: true, rubric: "involved" },
      { id: "not_assumed", label: "What you chose not to assume about participants", help: "Note what you still need to learn about participants' needs and experience.", type: "textarea", required: true, rubric: "not_assumed" },
      { id: "owners", label: "Who is responsible for follow-up", help: "Name who will learn whether participants were able to use what they completed.", type: "list", required: true, rubric: "owners" },
      { id: "review_date", label: "Follow-up date", help: "", type: "date", required: true, rubric: "review_date" },
    ],
    rubric: [
      ...COMMON_RUBRIC,
      ACCESS_RULE,
      INVOLVED_RULE,
      NOT_ASSUMED_RULE,
      { key: "application_task", label: "Participants leave with something they can use", failMessage: "Please add the work participants will complete and explain how they can use it afterward." },
    ],
    antiPerformative: {
      fake: ["Slides without time to practice", "No useful work for participants to take with them", "Controls or directions shown only with icons"],
      real: ["A clear objective, practice with real work, and notes on assistive technology and plain language"],
    },
    privacy: "Do not record or score individual participants' beliefs. If you gather feedback, report only combined results that cannot identify anyone.",
    consultSupportType: "facilitation_prep",
  },
];

export const GRADUATION_PATHS: GraduationPath[] = [...CORE_PATHS, ...DOMAIN_PATHS, ...PRACTICE_INFRASTRUCTURE_PATHS];

export function getPath(id: string): GraduationPath | undefined {
  return GRADUATION_PATHS.find((p) => p.id === id);
}

/** Cross-path routing signals (Graduation Paths §4). Guided Start uses these. */
export type RoutingSignal = {
  id: string;
  label: string;
  note: string;
  route: { kind: "path"; id: GraduationPath["id"] } | { kind: "route"; href: string; label: string } | { kind: "escalate"; label: string; href: string };
};

export const ROUTING_SIGNALS: RoutingSignal[] = [
  { id: "launch", label: "I'm planning a program, service, or digital application", note: "Considering equity and access early gives you more room to shape the design. After using the planning resources, you can decide whether another perspective would help.", route: { kind: "path", id: "gp-1" } },
  { id: "change", label: "I'm changing a policy, form, notice, or letter", note: "Consider access, plain language, and the effort required of people before release. Ask the policy owner or your Equity Director when official sources conflict or the legal stakes are high.", route: { kind: "path", id: "gp-2" } },
  { id: "engage", label: "I'm planning engagement, outreach, co-design, or listening", note: "Review the relevant Minnesota Communities briefs before completing your engagement plan.", route: { kind: "path", id: "gp-3" } },
  { id: "climate", label: "I'm working on team climate or participation", note: "Plan practical changes, name who is responsible, and set a follow-up date. Complaints belong in the appropriate formal channel.", route: { kind: "path", id: "gp-4" } },
  { id: "facilitate", label: "I'm planning a session, training, or huddle", note: "Begin with what participants should be able to use in their work afterward.", route: { kind: "path", id: "gp-5" } },
  { id: "hiring", label: "I'm hiring or designing a role", note: "Test what the work requires, plan accessible outreach and structured interviews, and review outcomes with your HR partner.", route: { kind: "path", id: "gp-6" } },
  { id: "decision", label: "I'm making a decision that needs an equity look", note: "Build equity into a policy, budget, rule, or service decision while it can still change, and find out whether an equity scan or full analysis applies.", route: { kind: "path", id: "gp-7" } },
  { id: "pause", label: "I'm making a routine decision and want a quick equity check", note: "Take a few minutes before a small decision goes out: who it affects differently, who can change it, what access needs apply, and one alternative. You will know whether a fuller analysis applies.", route: { kind: "path", id: "gp-12" } },
  { id: "meeting", label: "I'm planning a meeting everyone can take part in", note: "Send materials ahead, offer accommodation to everyone, and give people several ways to contribute.", route: { kind: "path", id: "gp-8" } },
  { id: "review", label: "I'm reviewing a draft before it goes out", note: "Check a draft for equity, access, plain language, sources, and burden, and give the owner specific findings.", route: { kind: "path", id: "gp-9" } },
  { id: "material", label: "I'm checking something I wrote before I share it", note: "Check your own notice, message, page, or slides in three passes: access and plain language, what you assumed people know, and tone. Ask a colleague to review it when a second reader would help.", route: { kind: "path", id: "gp-13" } },
  { id: "pathway", label: "I'm building a leadership pathway or sponsorship plan", note: "Make lead and leadership pathways work for staff with disabilities: transparent maps, job-related criteria, owned accommodations across transitions, and sponsors with decision power.", route: { kind: "path", id: "gp-11" } },
  { id: "procurement", label: "I'm shaping a contract, grant, or solicitation", note: "Put equity, accessibility, and language access into the solicitation, criteria, terms, and monitoring.", route: { kind: "path", id: "gp-10" } },
  { id: "question", label: "I have a question", note: "Browse published answers and download a receipt, PDF, or checklist. You do not type a question here.", route: { kind: "route", href: "/ask", label: "Browse common questions" } },
  { id: "context", label: "I need community context for Minnesota work", note: "Use a brief to ask better questions and prepare your work. A brief never describes any one person.", route: { kind: "route", href: "/minnesota-communities", label: "Explore Minnesota Communities" } },
  { id: "jobaid", label: "I need a checklist or job aid", note: "Start with a practical resource you can use right away, without completing a full learning path or scheduling a meeting.", route: { kind: "route", href: "/library", label: "Explore Resources" } },
  { id: "human", label: "I'd like to talk it through with the consultant", note: "Staff consultation forms are closed. Find the responsible person or office for this work.", route: { kind: "route", href: "/support/right-person", label: "Find the right person" } },
  { id: "formal", label: "This involves a complaint, investigation, accommodation decision, or discipline", note: "This program is not the right place for these matters. Please use Employee Culture, Human Resources, or the civil-rights channel.", route: { kind: "escalate", label: "Find the right contact", href: "/library/pn-when-to-escalate" } },
];
