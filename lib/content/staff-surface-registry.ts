import { clarifyPracticePath } from "./practice-path-clarifications";
import { ALL_COURSE_SURFACES } from "./courses/definitions";
import { BRIEFS, type CommunityBrief } from "./briefs";
import { getCommunityReadingSurface } from "./community-reading-surface";
import { COMMUNITY_SPOTLIGHTS } from "./community-spotlights";
import { LEARNING_STAGES } from "@/lib/product/learning";
import { WORK_AREAS } from "@/lib/product/work-areas";
import { START_ROLES, START_URGENCIES } from "@/lib/product/start";
import { DSD_ELIGIBILITY_OPTIONS, SUPPORT_DESTINATIONS } from "@/lib/product/support-routing";
import { GRADUATION_PATHS, type GraduationPath } from "./paths";
import { LEARNING_TILE_DEFAULTS } from "./learning-catalog";
import { MEASUREMENT_SURFACE } from "./measurement-practice";
import { LEARNING_JOURNEY_SURFACE } from "./learning-journey";
import { LEARNING_HUB_SURFACE } from "./learning-hub";
import { AMPLIFY_SURFACES } from "./amplify";
import { DSD_TEAM_SURFACE } from "./dsd-team";
import { WORK_LEARNING_SURFACE } from "./work-learning";
import { EQUITY_TOOLKIT_SURFACE } from "./equity-toolkit";
import { COMMUNITY_CONNECTIONS_SURFACE } from "./community-connections";
import { WORKFORCE_SURFACES } from "./workforce-editor";
import { PODCAST_SURFACES } from "./podcasts";
import { DSD_SURFACES } from "@/lib/dsd/surfaces";
import { DOMAIN_SURFACES } from "@/lib/domains/surfaces";
import { EQUITY_PRACTICE_SURFACE } from "@/lib/product/equity-practice";
import {
  DEFAULT_EDITABLE_SURFACE_REVIEWS,
  defineEditableSurface,
  type EditableSurfaceDefinition,
  type EditableSurfaceFieldDefinition,
  type EditableSurfaceLink,
  type EditableSurfaceValue,
  type EditableSurfaceValues,
} from "./editable-surface-contract";

export type EditableLinkValue = EditableSurfaceLink;
export type StaffSurfaceValue = EditableSurfaceValue;
export type StaffSurfaceValues = EditableSurfaceValues;
export type StaffSurfaceFieldDefinition = EditableSurfaceFieldDefinition;
export type StaffSurfaceDefinition = EditableSurfaceDefinition;

const short = (key: string, label: string, maxLength = 300): StaffSurfaceFieldDefinition => ({
  key,
  label,
  kind: "short",
  required: true,
  maxLength,
});

const long = (key: string, label: string, maxLength = 4_000): StaffSurfaceFieldDefinition => ({
  key,
  label,
  kind: "long",
  required: true,
  maxLength,
});

const optionalLong = (key: string, label: string, maxLength = 4_000): StaffSurfaceFieldDefinition => ({
  key,
  label,
  kind: "long",
  required: false,
  maxLength,
});

const optionalUrl = (key: string, label: string): StaffSurfaceFieldDefinition => ({
  key,
  label,
  kind: "url",
  required: false,
  maxLength: 2_000,
});

const stringList = (key: string, label: string, maxLength = 2_000): StaffSurfaceFieldDefinition => ({
  key,
  label,
  kind: "string-list",
  required: true,
  maxLength,
});

const optionalStringList = (key: string, label: string, maxLength = 2_000): StaffSurfaceFieldDefinition => ({
  key,
  label,
  kind: "string-list",
  required: false,
  maxLength,
});

const linkList = (key: string, label: string): StaffSurfaceFieldDefinition => ({
  key,
  label,
  kind: "link-list",
  required: true,
  maxLength: 500,
});

const optionalLinkList = (key: string, label: string): StaffSurfaceFieldDefinition => ({
  key,
  label,
  kind: "link-list",
  required: false,
  maxLength: 500,
});

type SurfaceInput = Omit<EditableSurfaceDefinition, "label"> & { label?: string };

function surfaceLabel(surfaceId: string): string {
  return surfaceId
    .replace(/^community-brief\./, "")
    .replace(/[.-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function defineSurface(definition: SurfaceInput): StaffSurfaceDefinition {
  return defineEditableSurface({
    ...definition,
    label: definition.label ?? surfaceLabel(definition.surfaceId),
  });
}

function pascalToken(value: string): string {
  return value
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

export function areaFieldKey(areaId: string, suffix: "label" | "summary" | "tasks"): string {
  return `area${pascalToken(areaId)}${pascalToken(suffix)}`;
}

export function learningStageFieldKey(stageId: string, suffix: "label" | "purpose" | "outcomes"): string {
  return `stage${pascalToken(stageId)}${pascalToken(suffix)}`;
}

export function startRoleFieldKey(roleId: string, suffix: "label" | "guidance"): string {
  return `role${pascalToken(roleId)}${pascalToken(suffix)}`;
}

export function startUrgencyFieldKey(urgencyId: string, suffix: "label" | "guidance"): string {
  return `urgency${pascalToken(urgencyId)}${pascalToken(suffix)}`;
}

function indexedFieldKey(prefix: string, index: number, suffix: string): string {
  return `${prefix}${index}${pascalToken(suffix)}`;
}

const NON_BRIEF_SURFACES: readonly StaffSurfaceDefinition[] = [
  defineSurface({
    surfaceId: "sources.page",
    route: "/learn/sources",
    scopePolicy: "inheritable",
    fields: [
      short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"),
      short("readTitle", "How to read this page heading"), long("readBody", "How to read this page"),
      short("statesTitle", "Verification states heading"), long("statesBody", "What the verification labels mean"),
      short("usedInLabel", "Used in label"), short("annotationLabel", "Program note label"), short("openLabel", "Open the source label"), short("movedLabel", "New address label"),
      short("thinTitle", "Where the evidence is thin heading"), long("thinBody", "Where the evidence is thin"),
      short("countLabel", "Count line"),
    ],
    approvedValues: {
      introKicker: "Learning and resources",
      introTitle: "Research and sources",
      introLede: "Every outside source, standard, statute and program document the courses, community briefs, library items and reference pages rely on, in one place. Each entry shows what the program says about the source, where it is used, and whether the program has checked the address.",
      readTitle: "How to read this page",
      readBody: "Sources are grouped by the kind of authority they carry. A government or official source can set a requirement. A standard describes how to meet one. Research, data and organizations inform judgment; they do not decide policy. The note under each source is the program's own description of what the source establishes and its limits. Follow the links under Used in to see the resource that relies on it.",
      statesTitle: "How source links are handled",
      statesBody: "A source link may be available, updated to a newer address, awaiting review, or named without an address. These labels help maintain the source list; they are about public source links, not staff activity or course participation.",
      usedInLabel: "Used in",
      annotationLabel: "What the program says about this source",
      openLabel: "Open the source",
      movedLabel: "Newer address",
      thinTitle: "Where the evidence is thin",
      thinBody: "Some resources cite only program pages or name a source without an address. The community briefs say plainly where a community-informed description still awaits source and representation review. Those gaps are listed here so they can be closed, not hidden.",
      countLabel: "sources across the program",
    },
  }),
  defineSurface({
    surfaceId: "site.header",
    route: "/",
    scopePolicy: "inheritable",
    protectedFields: ["dhsLogoAsset", "dhsLogoAltText", "dhsLogoDimensions"],
    fields: [
      short("programName", "Program name"),
      short("programSubtitle", "Program description below the name"),
      long("programDescriptor", "Program description beside the view choices"),
      linkList("primaryNavigation", "Primary navigation"),
      linkList("personalNavigation", "Personal workspace navigation"),
    ],
    approvedValues: {
      programName: "One DHS People, Access and Culture Program",
      programSubtitle: "Staff learning and practical support",
      programDescriptor: "an independently managed resource for DHS staff",
      primaryNavigation: [{"label":"Home","href":"/"},{"label":"Start","href":"/start"},{"label":"Ask","href":"/ask"},{"label":"Areas of work","href":"/areas"},{"label":"Learning and resources","href":"/learn"},{"label":"Practice","href":"/practice"},{"label":"One DSD","href":"/one-dsd"},{"label":"Amplify Equity","href":"/one-dsd/amplify"},{"label":"Support","href":"/support"}],
      personalNavigation: [{ label: "My Work", href: "/my-work" }],
    },
  }),
  defineSurface({
    surfaceId: "site.context",
    route: "/",
    scopePolicy: "inheritable",
    fields: [
      short("switcherLabel", "View choice label"),
      short("switcherAriaLabel", "View choice description for screen readers"),
      short("oneDhsLabel", "One DHS choice"),
      long("oneDhsDescription", "One DHS explanation"),
      short("oneDsdLabel", "One DSD choice"),
      long("oneDsdDescription", "One DSD explanation"),
      long("choiceAccessNote", "Access reminder after a view choice"),
      long("oneDhsViewNote", "One DHS view note"),
      long("oneDsdViewNote", "One DSD view note"),
      short("oneDhsLinkLabel", "One DHS view link"),
      short("oneDsdLinkLabel", "One DSD view link"),
      long("oneDsdActiveNote", "One DSD active-view note"),
      short("optionalViewKicker", "Optional-view section label"),
      short("optionalViewTitle", "Optional-view heading"),
      long("optionalViewBody", "Optional-view explanation"),
      short("optionalViewButton", "Optional-view button"),
    ],
    approvedValues: {
      switcherLabel: "View",
      switcherAriaLabel: "Choose the program view",
      oneDhsLabel: "One DHS",
      oneDhsDescription: "Start with shared knowledge, tools, and ways to reach the right person for work across DHS.",
      oneDsdLabel: "One DSD",
      oneDsdDescription: "Use the shared One DHS foundation with added DSD examples, scenarios, services, and ways to get help.",
      choiceAccessNote: "",
      oneDhsViewNote: "You can explore the One DSD reference program at any time.",
      oneDsdViewNote: "This view does not sign you in, and it does not decide whether you can request a consultation.",
      oneDhsLinkLabel: "Explore One DSD",
      oneDsdLinkLabel: "Open the One DSD program map",
      oneDsdActiveNote: "Shared One DHS material stays available, with DSD examples, scenarios, and support added.",
      optionalViewKicker: "Optional view",
      optionalViewTitle: "Add the One DSD layer",
      optionalViewBody: "Switch to the One DSD view to keep the shared One DHS foundation and add Disability Services Division examples and ways to get help. This choice does not decide whether you can request a consultation, and it does not open anything private.",
      optionalViewButton: "Use the One DSD view",
    },
  }),
  defineSurface({
    surfaceId: "about.page",
    route: "/about",
    scopePolicy: "inheritable",
    fields: [
      short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"),
      short("purposeKicker", "Purpose section label"), short("purposeTitle", "Purpose heading"), long("purposeBody", "Purpose explanation"), long("purposeBoundary", "Purpose boundary"),
      short("federationKicker", "Program relationship section label"), short("federationTitle", "Program relationship heading"), long("federationBody", "Program relationship explanation"), long("federationBoundary", "Program relationship boundary"),
      short("participationKicker", "Participation section label"), short("participationTitle", "Participation heading"),
      short("voluntaryTitle", "Voluntary participation heading"), long("voluntaryBody", "Voluntary participation explanation"),
      short("requiredTitle", "Required work heading"), long("requiredBody", "Required work explanation"),
      short("sourcesKicker", "Sources section label"), short("sourcesTitle", "Sources heading"), long("sourcesBody", "Sources explanation"), long("sourcesBoundary", "Sources boundary"),
      short("boundariesKicker", "Boundaries section label"), short("boundariesTitle", "Boundaries heading"), stringList("boundaries", "Items the program does not hold"),
      short("supportKicker", "Support section label"), short("supportTitle", "Support heading"), long("supportBody", "Support explanation"), linkList("supportLinks", "Support links"),
    ],
    approvedValues: {
      introKicker: "Purpose, trust, and limits",
      introTitle: "About this program",
      introLede: "The People, Access and Culture Program is an independently managed resource for Minnesota Department of Human Services staff. It brings learning, evidence, practical tools, and ways to reach the right person into one place.",
      purposeKicker: "From understanding to action",
      purposeTitle: "Built for the whole person, not only the job",
      purposeBody: "This program has two equally real purposes, not one dressed up as the other. It helps you examine a decision, learn a concept, prepare for a conversation, or serve someone well — and it helps you grow, personally, in how you understand culture, including your own. Examining your own cultural default is real work here, not a detour from it, whatever background you bring to that work. A colleague studying their own German, Norwegian, Irish, or Iron Range background is doing exactly as legitimate a thing here as a colleague building the specific knowledge needed to serve a particular client community well.",
      purposeBoundary: "The goal is genuine growth and better service, together. The program does not ask staff to perform agreement, does not rank people, teams, or beliefs, and never turns anyone's personal growth or their place in it into a score, a record, or a label attached to them.",
      federationKicker: "One shared spine, one deep example",
      federationTitle: "One DHS and One DSD",
      federationBody: "One DHS provides the shared structure for agencywide knowledge and practice. One DSD adds Disability Services Division examples, scenarios, services, and direct consultation. It inherits the shared foundation instead of becoming a separate, disconnected program.",
      federationBoundary: "Choosing the One DSD view changes the material and suggestions you see. It does not give you access to anything private.",
      participationKicker: "Participation and privacy",
      participationTitle: "You should know what happens before you take part",
      voluntaryTitle: "Voluntary learning and practice",
      voluntaryBody: "Ordinary reading, learning, reflection, Ask, and working notes are voluntary. Notes you choose to keep stay in this browser on this computer unless you share them. They are not turned into a staff score or a supervisor report.",
      requiredTitle: "Required work stays distinct",
      requiredBody: "When something here is part of a required department process, we say so plainly and point to the official record. Voluntary learning is never quietly turned into compliance evidence.",
      sourcesKicker: "Sources and judgment",
      sourcesTitle: "Guidance shows where it came from",
      sourcesBody: "Each item shows its source, who maintains it, what it covers, and its limits. Official sources, program guidance, outside evidence, and material still under review are kept visibly distinct. A proprietary assessment or toolkit may inform professional practice without being copied, scored, or presented as department-owned.",
      sourcesBoundary: "You can get help here to research, compare, explain, draft, and critique. Nothing here speaks for a person or makes decisions reserved for supervisors, Equity Directors and Specialists, Human Resources, legal counsel, Tribal relations, policy owners, or other responsible offices.",
      boundariesKicker: "Important boundaries",
      boundariesTitle: "What this program does not hold",
      boundaries: ["Client, medical, case, complaint, investigation, or personnel details", "Hidden staff profiles, belief ratings, or supervisor surveillance", "Legal conclusions or decisions owned by another office", "Protected assessment content or scoring methods"],
      supportKicker: "Need a person?",
      supportTitle: "Reach the right person",
      supportBody: "Agencywide questions should go to the person or office responsible for that work. Direct consultation with the Equity and Inclusion Operations Consultant is a One DSD service and remains limited to eligible DSD work.",
      supportLinks: [{ label: "Find the right person", href: "/support/right-person" }, { label: "Review the library", href: "/library" }],
    },
  }),
  defineSurface({
    surfaceId: "start.page",
    route: "/start",
    scopePolicy: "inheritable",
    fields: [
      short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"),
      short("formKicker", "Choice form section label"), short("formTitle", "Choice form heading"), long("formIntro", "Choice form explanation"),
      short("roleLabel", "Role question"), short("rolePlaceholder", "Role prompt"),
      short("taskLabel", "Work question"), short("taskPlaceholder", "Work prompt"),
      short("urgencyLabel", "Timing question"), short("submitLabel", "Recommendation button"),
      short("resultKicker", "Recommendation section label"), short("emptyResultTitle", "Empty recommendation heading"), long("emptyResultBody", "Empty recommendation explanation"),
      short("recommendationPrefix", "Recommendation heading opening"), short("workHeading", "Recommended work heading"), short("areaLinkLabel", "Area link"), short("practiceLinkLabel", "Practice link"), short("supportLinkLabel", "Support link"),
      ...START_ROLES.flatMap((role) => [short(`role${pascalToken(role.id)}Label`, `${role.label}: role name`), long(`role${pascalToken(role.id)}Guidance`, `${role.label}: guidance`)]),
      ...START_URGENCIES.flatMap((urgency) => [short(`urgency${pascalToken(urgency.id)}Label`, `${urgency.label}: timing choice`), long(`urgency${pascalToken(urgency.id)}Guidance`, `${urgency.label}: guidance`)]),
      ...WORK_AREAS.flatMap((area) => [short(areaFieldKey(area.id, "label"), `${area.label}: name`), long(areaFieldKey(area.id, "summary"), `${area.label}: description`), stringList(areaFieldKey(area.id, "tasks"), `${area.label}: supported work`)]),
    ],
    approvedValues: {
      introKicker: "Begin with the work in front of you", introTitle: "Where would you like to start?", introLede: "Choose your role, the kind of work you are doing, and when you need to act. You will get a good place to begin, and the reason it fits.",
      formKicker: "Three short choices", formTitle: "Tell us where the work sits", formIntro: "Choose the closest answer. You can change your answers at any time.",
      roleLabel: "What role are you bringing to this work?", rolePlaceholder: "Choose a role", taskLabel: "What kind of work are you doing?", taskPlaceholder: "Choose an area of work", urgencyLabel: "When do you need to act?", submitLabel: "Show a place to start",
      resultKicker: "A good place to begin", emptyResultTitle: "A practical next step will appear here", emptyResultBody: "Your answers here are not saved. They are not scored or sent to a supervisor.", recommendationPrefix: "Start with", workHeading: "Work you can begin", areaLinkLabel: "Explore this area", practiceLinkLabel: "Start a practice path", supportLinkLabel: "Find the right person",
      ...Object.fromEntries(START_ROLES.flatMap((role) => [[`role${pascalToken(role.id)}Label`, role.label], [`role${pascalToken(role.id)}Guidance`, role.id === "another_role" ? "Choose the area closest to your next decision. You can adjust your starting point as you learn more." : role.guidance]])),
      ...Object.fromEntries(START_URGENCIES.flatMap((urgency) => [[`urgency${pascalToken(urgency.id)}Label`, urgency.label], [`urgency${pascalToken(urgency.id)}Guidance`, urgency.guidance]])),
      ...Object.fromEntries(WORK_AREAS.flatMap((area) => [[areaFieldKey(area.id, "label"), area.label], [areaFieldKey(area.id, "summary"), area.summary], [areaFieldKey(area.id, "tasks"), [...area.tasks]]])),
    },
  }),
  defineSurface({
    surfaceId: "areas.page",
    route: "/areas",
    scopePolicy: "inheritable",
    fields: [
      short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"),
      short("indexKicker", "Area index label"), short("indexTitle", "Area index heading"), short("areaCountLabel", "Area number label"), short("tasksHeading", "Supported work heading"),
      short("askLabel", "Ask link"), short("libraryLabel", "Library link"), short("practiceLabel", "Practice link"), short("supportLabel", "Support link"),
      short("boundaryLead", "Cross-area note opening"), long("boundaryBeforeStart", "Cross-area note before the Start link"), short("startLinkLabel", "Start link in cross-area note"), long("boundaryAfterStart", "Cross-area note after the Start link"),
      ...WORK_AREAS.flatMap((area) => [short(areaFieldKey(area.id, "label"), `${area.label}: name`), long(areaFieldKey(area.id, "summary"), `${area.label}: description`), stringList(areaFieldKey(area.id, "tasks"), `${area.label}: supported work`)]),
    ],
    approvedValues: {
      introKicker: "Equity in everyday decisions", introTitle: "Areas of work", introLede: "Enter through the decision or practice you are responsible for. Each area connects knowledge, questions, tools, a practice path, and the people who hold the relevant authority.",
      indexKicker: "Jump to an area", indexTitle: "Choose the work closest to yours", areaCountLabel: "Area", tasksHeading: "Work this area can support", askLabel: "Browse common questions", libraryLabel: "Find reviewed material", practiceLabel: "Start a practice path", supportLabel: "Find the right person", boundaryLead: "Most important work crosses boundaries.", boundaryBeforeStart: "You can use more than one area. If you are not sure where to begin,", startLinkLabel: "Start", boundaryAfterStart: "will suggest a place to begin based on your role, task, and timing.",
      ...Object.fromEntries(WORK_AREAS.flatMap((area) => [[areaFieldKey(area.id, "label"), area.label], [areaFieldKey(area.id, "summary"), area.summary], [areaFieldKey(area.id, "tasks"), [...area.tasks]]])),
    },
  }),
  defineSurface({
    surfaceId: "learn.page",
    route: "/learn",
    scopePolicy: "inheritable",
    fields: [
      short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"),
      short("stagesKicker", "Learning stages section label"), short("stagesTitle", "Learning stages heading"), long("stagesIntro", "Learning stages explanation"), short("stageLabel", "Stage number label"), short("stageLinkLabel", "Stage resource link"),
      short("pathsTitle", "Learning paths heading"), long("pathsIntro", "Learning paths explanation"), short("modulesTitle", "Modules heading"), short("notesTitle", "Practice notes heading"),
      ...LEARNING_STAGES.flatMap((stage) => [short(learningStageFieldKey(stage.id, "label"), `Stage ${stage.stage}: name`), long(learningStageFieldKey(stage.id, "purpose"), `Stage ${stage.stage}: purpose`), stringList(learningStageFieldKey(stage.id, "outcomes"), `Stage ${stage.stage}: outcomes`)]),
    ],
    approvedValues: {
      introKicker: "Knowledge for everyday practice", introTitle: "Learning", introLede: "Build knowledge that supports fair, accessible services and inclusive workplaces.",
      stagesKicker: "Build on what you know", stagesTitle: "Learning stages", stagesIntro: "Explore foundations, intercultural practice, applied equity, and leadership at a pace that fits your work.", stageLabel: "Stage", stageLinkLabel: "Explore related resources", pathsTitle: "Guided practice", pathsIntro: "Consider equity and access in a program, policy, conversation, or session you are planning.", modulesTitle: "Learning modules", notesTitle: "Practice notes",
      ...Object.fromEntries(LEARNING_STAGES.flatMap((stage) => [[learningStageFieldKey(stage.id, "label"), stage.label], [learningStageFieldKey(stage.id, "purpose"), stage.id === "orientation" ? "See what the program offers and find an easy place to begin, without needing to be an expert." : stage.purpose], [learningStageFieldKey(stage.id, "outcomes"), [...stage.outcomes]]])),
    },
  }),
  LEARNING_HUB_SURFACE,
  LEARNING_JOURNEY_SURFACE,
  MEASUREMENT_SURFACE,
  ...AMPLIFY_SURFACES,
  DSD_TEAM_SURFACE,
  WORK_LEARNING_SURFACE,
  EQUITY_TOOLKIT_SURFACE,
  COMMUNITY_CONNECTIONS_SURFACE,
  ...WORKFORCE_SURFACES,
  defineSurface({
    surfaceId: "learn.catalog",
    label: "Learning images and descriptions",
    route: "/learn",
    scopePolicy: "inheritable",
    reviewDimensions: [...DEFAULT_EDITABLE_SURFACE_REVIEWS, "rights_and_consent", "community_representation"],
    fields: [
      optionalUrl("climateImage", "Team climate image"),
      optionalLong("climateImageAlt", "Team climate image description", 500),
      long("climateSummary", "Team climate short description", 600),
      optionalUrl("facilitationImage", "Facilitation image"),
      optionalLong("facilitationImageAlt", "Facilitation image description", 500),
      long("facilitationSummary", "Facilitation short description", 600),
      optionalUrl("interpreterImage", "Interpreter image"),
      optionalLong("interpreterImageAlt", "Interpreter image description", 500),
      long("interpreterSummary", "Interpreter short description", 600),
      short("staffGuideTitle", "Staff guide heading"),
      long("staffGuideIntro", "Staff guide introduction", 600),
      short("participationDetailsLabel", "Participation details label"),
    ],
    approvedValues: {
      climateImage: LEARNING_TILE_DEFAULTS["lm-workplace-climate"].imageSrc,
      climateImageAlt: LEARNING_TILE_DEFAULTS["lm-workplace-climate"].imageAlt,
      climateSummary: LEARNING_TILE_DEFAULTS["lm-workplace-climate"].summary,
      facilitationImage: LEARNING_TILE_DEFAULTS["lm-facilitation-application"].imageSrc,
      facilitationImageAlt: LEARNING_TILE_DEFAULTS["lm-facilitation-application"].imageAlt,
      facilitationSummary: LEARNING_TILE_DEFAULTS["lm-facilitation-application"].summary,
      interpreterImage: LEARNING_TILE_DEFAULTS["lm-interpreter"].imageSrc,
      interpreterImageAlt: LEARNING_TILE_DEFAULTS["lm-interpreter"].imageAlt,
      interpreterSummary: LEARNING_TILE_DEFAULTS["lm-interpreter"].summary,
      staffGuideTitle: "Staff guide",
      staffGuideIntro: "Information about using the program and saving your notes.",
      participationDetailsLabel: "Participation and privacy",
    },
  }),
  defineSurface({
    surfaceId: "practice.page",
    route: "/practice",
    scopePolicy: "inheritable",
    fields: [short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"), short("choicesKicker", "Practice choices label"), short("choicesTitle", "Practice choices heading"), long("choicesIntro", "Practice choices explanation"), short("createsLabel", "Work product label"), short("moreKicker", "Additional work product label"), short("moreTitle", "Additional work product heading"), long("moreBody", "Additional work product explanation"), linkList("moreLinks", "Additional work product links")],
    approvedValues: { introKicker: "Turn understanding into useful work", introTitle: "Practice", introLede: "Read and download published checklists for work you are doing now. Staff pages do not save filled-in notes.", choicesKicker: "Choose a starting point", choicesTitle: "Guided practice paths", choicesIntro: "Each guided practice connects published questions, reviewed material, and a downloadable checklist. Nothing here scores or ranks you, and nothing you type is stored.", createsLabel: "Creates", moreKicker: "Need something different?", moreTitle: "Begin with the area, not a perfect template", moreBody: "These guided practices are a starting set, not the limit. Use Areas of work or browse common questions on Ask.", moreLinks: [{ label: "Explore areas of work", href: "/areas" }, { label: "Browse common questions", href: "/ask" }] },
  }),
  defineSurface({
    surfaceId: "practice.path-shell",
    route: "/practice/[id]",
    scopePolicy: "inheritable",
    fields: [
      short("handoffTitle", "ASK draft invitation heading"), long("handoffBody", "ASK draft invitation"), short("handoffUseLabel", "Use ASK draft button"), short("draftSourceSummary", "Draft reference heading"), short("draftPreparedPrefix", "Draft date introduction"), long("draftOwnershipBody", "Working draft explanation"),
      short("introKicker", "Opening path label"), short("outcomeLead", "Outcome introduction"), short("pathKicker", "Steps section label"), short("stepsTitle", "Steps section heading"), short("requiredLabel", "Required-step label"), short("optionalLabel", "Optional-step label"), short("meaningKicker", "Useful-result section label"), short("meaningTitle", "Useful-result heading"), short("needsWorkLabel", "Needs-work heading"), short("readyLabel", "Ready-to-use heading"), short("privacyLabel", "Privacy label"), long("confidentialRouteNote", "Confidential-route reminder"), short("notesKicker", "Working-notes section label"), long("artifactPrivacy", "Working-notes privacy reminder"),
      short("requiredFieldSuffix", "Required-field wording"), short("listPlaceholder", "List-entry example"), short("openingNotes", "Saved-notes loading message"), short("saveNotesLabel", "Save-notes button"), short("reviewWorkLabel", "Review-work button"), short("deleteNotesLabel", "Delete-notes button"), short("savedPrefix", "Saved-time wording"), short("unsavedLabel", "Unsaved-changes message"),
      short("reviewCompleteTitle", "Completed-review heading"), short("detailsNeededTitle", "Incomplete-review heading"), short("donePrefix", "Completed-item wording"), short("notYetPrefix", "Incomplete-item wording"), short("readyLead", "Ready-notes message opening"), long("readyOpenBody", "Ready-notes message when consultation is available"), long("readyPreviewBody", "Ready-notes message when consultation is in preview"), long("missingDetailsBody", "Incomplete-review explanation"),
      short("progressKicker", "Saved-progress section label"), short("reviewStatusPrefix", "Progress-status opening"), short("completeStatus", "Complete-progress wording"), short("incompleteStatus", "Incomplete-progress wording"), long("browserStorageBody", "Progress storage reminder"), short("dsdConsultKicker", "DSD support section label"), short("humanSupportKicker", "One DHS support section label"), long("supportOneDhsBody", "One DHS support explanation"), long("supportDsdOpenBody", "DSD support explanation when consultation is available"), long("supportDsdPreviewBody", "DSD support explanation when consultation is in preview"), short("supportOneDhsLabel", "One DHS support link"), short("supportDsdOpenLabel", "Open DSD consultation link"), short("supportDsdPreviewLabel", "DSD consultation preview link"),
    ],
    approvedValues: {
      handoffTitle: "Bring your ASK draft into this practice", handoffBody: "You can review and edit it here. Notes you have already changed stay yours.", handoffUseLabel: "Use this draft", draftSourceSummary: "About this draft", draftPreparedPrefix: "Prepared with ASK on", draftOwnershipBody: "Your changes here are part of your own working notes.",
      introKicker: "Learning path", outcomeLead: "By the end, you will be able to", pathKicker: "Your path", stepsTitle: "Six steps to work through in order", requiredLabel: "Needed for this optional worksheet", optionalLabel: "If relevant", meaningKicker: "Make the work meaningful", meaningTitle: "What a useful result looks like", needsWorkLabel: "Still needs work", readyLabel: "Ready to use", privacyLabel: "Privacy", confidentialRouteNote: "Complaints, investigations, and discipline about a named person belong with Employee Culture, Human Resources, or the civil-rights office, not this path.", notesKicker: "Your working notes", artifactPrivacy: "Your practice notes are saved in this browser on this computer. Someone else using this computer may be able to see them. Please leave out client names, case numbers, and medical details.",
      requiredFieldSuffix: "required", listPlaceholder: "One per line", openingNotes: "Opening your saved notes.", saveNotesLabel: "Save these notes", reviewWorkLabel: "Review my work", deleteNotesLabel: "Delete these notes", savedPrefix: "Saved at", unsavedLabel: "Unsaved changes.",
      reviewCompleteTitle: "Your review is complete", detailsNeededTitle: "A few details are still needed", donePrefix: "Done", notYetPrefix: "Not yet", readyLead: "Your notes are ready to use for this work.", readyOpenBody: "You can return to this approach next time and request a consultation only if the stakes are high or another perspective would help.", readyPreviewBody: "You can return to this approach next time. If another perspective would help, Support shows other ways to get help, including what a consultation request would look like.", missingDetailsBody: "Add the missing owners and review date, then review your work again. The review uses the information in your notes as well as the steps you marked complete.",
      progressKicker: "Your saved progress", reviewStatusPrefix: "Your review is", completeStatus: "complete", incompleteStatus: "not yet complete", browserStorageBody: "Progress is saved in this browser on this computer, where someone else using this computer may be able to see it.", dsdConsultKicker: "Optional DSD consultation", humanSupportKicker: "When you want another perspective", supportOneDhsBody: "If another perspective would help, find the responsible person or office for this work. Your working notes are not sent with you.", supportDsdOpenBody: "If you would like another perspective after these steps, you can request a DSD consultation. Your notes will carry over so you do not have to enter the same information again.", supportDsdPreviewBody: "You can see what a DSD consultation request and its summary would include. Nothing is submitted or saved for the Equity and Inclusion Operations Consultant yet.", supportOneDhsLabel: "Find the right person", supportDsdOpenLabel: "Request a DSD consultation", supportDsdPreviewLabel: "Preview a DSD consultation request",
    },
  }),
  defineSurface({
    surfaceId: "paths.index",
    route: "/paths",
    scopePolicy: "inheritable",
    fields: [short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"), short("fitLabel", "Path fit label"), short("outcomeLabel", "Path outcome label"), short("completionKicker", "Completion section label"), long("completionOpenBody", "Completion explanation when consultation is available"), long("completionPreviewBody", "Completion explanation when consultation is in preview")],
    approvedValues: { introKicker: "Learn with guidance, then work independently", introTitle: "Learning paths", introLede: "Choose from thirteen paths for common work. Each one brings together questions, relevant community context, practical tools, notes you can keep, and a final review of your own work. You do not need a consultation to complete a path.", fitLabel: "This may fit if", outcomeLabel: "By the end", completionKicker: "What completing a path means", completionOpenBody: "You can use Ask, Minnesota Communities, Resources, and other tools to do similar work on your own. You will finish with useful notes that identify owners and a review date. You can choose a consultation when the stakes are high or another perspective would help. Nothing in a path scores or ranks you. Your progress is saved in this browser on this computer.", completionPreviewBody: "You can use Ask, Minnesota Communities, Resources, and other tools to do similar work on your own. You will finish with useful notes that identify owners and a review date. You can also see what a consultation request would include before requests open. Nothing in a path scores or ranks you. Your progress is saved in this browser on this computer." },
  }),
  defineSurface({
    surfaceId: "ask.page",
    route: "/ask",
    scopePolicy: "inheritable",
    fields: [
      long("draftReadyBody", "Practice draft invitation"), short("draftContinueLabel", "Practice draft link"), long("draftTransferError", "Practice draft transfer problem"),
      short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"), long("privacyNotice", "Privacy reminder"),
      short("reviewDraftLabel", "Draft-review label"), long("reviewDraftHelp", "Draft-review guidance"), long("reviewDraftPlaceholder", "Draft field prompt"),
      short("questionLabel", "Question field label"), long("questionHelp", "Question field guidance"), short("connectedPathLead", "Connected-path wording"), long("questionExample", "Question example"), short("scopeLabel", "Research choice label"), short("modeAuto", "Automatic research choice"), short("modeProgram", "Program-only research choice"), short("modeResults", "Public-source list choice"), short("modeCurrent", "Current public answer choice"), short("modeDeep", "Deeper research choice"), long("researchAvailableHelp", "Available research explanation"), long("researchUnavailableHelp", "Unavailable research explanation"),
      long("questionTooShort", "Short-question message"), long("answerError", "Answer problem message"), short("findSourcesButton", "Find-sources button"), short("answerButton", "Answer button"), short("libraryButton", "Library alternative button"), short("starterQuestionsLabel", "Starter-question section label"), short("askedKicker", "Asked-question label"), short("oneDhsName", "One DHS name in an answer"), short("oneDsdName", "One DSD name in an answer"),
      short("differentSupportLead", "Different-support notice opening"), short("rightPersonLabel", "Right-person link"), short("previewConsultLabel", "Consultation-preview link"), short("alternativesHeading", "Alternative-actions heading"), short("howKicker", "Answer-explanation section label"), stringList("howItems", "Answer-explanation list"), long("howOneDhsSupport", "One DHS support explanation"), long("howDsdOpenSupport", "One DSD support explanation when consultation is available"), long("howDsdPreviewSupport", "One DSD support explanation when consultation is in preview"), short("moreKicker", "Additional-support section label"), long("moreOneDhsBody", "One DHS additional-support explanation"), long("moreDsdOpenBody", "One DSD additional-support explanation when consultation is available"), long("moreDsdPreviewBody", "One DSD additional-support explanation when consultation is in preview"),
      short("shortAnswerTitle", "Short-answer heading"), short("earlyQuestionsTitle", "Early-questions heading"), short("sourceConflictLead", "Source-conflict notice opening"), short("publicInformationKicker", "Public-information section label"), short("sourcesUsedLabel", "Sources-used label"), short("datedPrefix", "Source-date wording"), short("whyItMattersLabel", "Why-it-matters section label"), short("programSourcesLabel", "Program-sources section label"), short("evidencePassagesLabel", "Evidence passages heading"), short("inferenceLabel", "Interpretation label"), short("relatedReadingLabel", "Related reading heading"), long("noProgramSources", "No-program-source message"), short("limitsLabel", "Answer-limits section label"), short("actionsHeading", "Next-actions heading"), short("openPathLead", "Path link opening"), short("consultOpenLead", "Consultation notice opening"), short("consultPreviewLead", "Consultation-preview notice opening"), long("consultOpenBody", "Consultation notice explanation"), long("consultPreviewBody", "Consultation-preview explanation"), short("consultOpenButton", "Consultation button"), short("consultPreviewButton", "Consultation-preview button"), short("humanJudgmentLead", "Human-support notice opening"), long("humanJudgmentBody", "Human-support notice explanation"),
      short("busyResults", "Public-source search progress message"), short("busyCurrent", "Current-research progress message"), short("busyDeep", "Deeper-research progress message"), short("busyProgram", "Program-resource search progress message"),
    ],
    approvedValues: {
      draftReadyBody: "Your draft is ready to review and adapt in Practice.", draftContinueLabel: "Continue this draft in Practice", draftTransferError: "This browser could not carry the draft over. Your answer is still available here.",
      reviewDraftLabel: "Review my draft", reviewDraftHelp: "Paste a draft for feedback on equity, access, plain language, sources, and burden. Leave out confidential or personal material.", reviewDraftPlaceholder: "Paste your draft here.",
      introKicker: "Browse published answers", introTitle: "Ask", introLede: "Choose a common question. The published answer and a downloadable receipt, PDF, or checklist come from the knowledge base. Staff pages do not accept typed questions and do not store what you write.", privacyNotice: "Ask is browse and download only. Clicking a topic shows a published answer. Nothing you click is stored as a staff question. Do not send names, case details, medical or personnel information, or confidential material to this program.",
      questionLabel: "What would you like help thinking through?", questionHelp: "Ask about any subject, request help with writing or a calculation, or find a program resource. Up to four recent questions and answers are sent with your question to help answer follow-ups. Your most recent ASK draft is also included for context until you start a new topic or clear the conversation. Leave out private or confidential information about people.", connectedPathLead: "This question is connected to the", questionExample: "For example: We're planning a new digital application for benefits renewals. What equity questions should we consider before making design decisions?", scopeLabel: "Where should Ask look?", modeAuto: "Answer the question; check current public sources when helpful", modeProgram: "Answer without a web search", modeResults: "Find public sources to read", modeCurrent: "Answer using current public sources", modeDeep: "Take a deeper look at public sources", researchAvailableHelp: "You can ask for a list of public sources to read or an answer based on current public information.", researchUnavailableHelp: "Current public sources are not available right now. Ask can still help with general knowledge and available program resources, and will identify facts it cannot verify.",
      questionTooShort: "Please enter a question.", answerError: "We couldn't finish that answer just now. Please try again or search the Library.", findSourcesButton: "Find sources", answerButton: "Browse common questions", libraryButton: "Browse the Library", starterQuestionsLabel: "Starter questions for this path", askedKicker: "You asked", oneDhsName: "One DHS", oneDsdName: "One DSD",
      differentSupportLead: "This question needs a different kind of support.", rightPersonLabel: "Find the right person", previewConsultLabel: "Preview a consultation request", alternativesHeading: "What you can do instead", howKicker: "How answers work", howItems: ["Ask can explain any subject, help with writing and calculations, and connect you with program resources.", "You can ask follow-up questions. Up to four recent answers from this conversation help Ask understand what you mean.", "Public information appears separately from program resources. Check important details at the original source before you act.", "Ask can help you think through your work. It does not create official policy or make decisions for you.", "You can review or clear your question history from My Work."], howOneDhsSupport: "When a person needs to decide, Ask points you to the responsible person or office.", howDsdOpenSupport: "You will see steps you can take before the option to prepare a DSD consultation request.", howDsdPreviewSupport: "You will see steps you can take before the option to preview a DSD consultation request.", moreKicker: "If an answer is not enough", moreOneDhsBody: "Use Find the right person to match the work with its responsible supervisor, Equity Director or Specialist, policy owner, or office.", moreDsdOpenBody: "Choose Prepare a consultation request to review what would be shared before you decide whether to submit. No meeting is scheduled on its own.", moreDsdPreviewBody: "Choose Preview a consultation request to review what would be shared if submissions open. No consultation request is created or scheduled, and the form content is not stored.",
      shortAnswerTitle: "Answer", earlyQuestionsTitle: "Questions to consider early", sourceConflictLead: "Comparing guidance.", publicInformationKicker: "Public information", sourcesUsedLabel: "Sources used", datedPrefix: "Dated", whyItMattersLabel: "Why this matters", programSourcesLabel: "Program sources", evidencePassagesLabel: "Passages and interpretation", inferenceLabel: "Suggested interpretation", relatedReadingLabel: "Related program reading", noProgramSources: "No program source closely matched this question.", limitsLabel: "What this answer cannot settle", actionsHeading: "Steps you can take now", openPathLead: "Open the", consultOpenLead: "A consultation may help here.", consultPreviewLead: "Another perspective may help here.", consultOpenBody: "You can prepare a request, review the information carried over from this question, and decide what to share.", consultPreviewBody: "You can preview the request and review what would carry over from this question. No consultation request is created, and the form content is not stored.", consultOpenButton: "Prepare a consultation request", consultPreviewButton: "Preview a consultation request", humanJudgmentLead: "A person may need to decide here.", humanJudgmentBody: "Use Find the right person to reach the person or office responsible for this work.",
      busyResults: "Looking for public sources...", busyCurrent: "Checking current public sources...", busyDeep: "Taking a deeper look...", busyProgram: "Preparing an answer...",
    },
  }),
  defineSurface({
    surfaceId: "library.page",
    route: "/library",
    scopePolicy: "inheritable",
    fields: [short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"), short("searchLabel", "Search field label"), short("searchPlaceholder", "Search example"), short("searchButton", "Search button"), short("typeFilterLabel", "Type filter label"), short("authorityFilterLabel", "Source filter label"), short("clearFiltersLabel", "Clear filters link"), short("resultSingular", "One-result label"), short("resultPlural", "Multiple-results label"), short("noResultsTitle", "No results heading"), long("noResultsBody", "No results guidance"), short("briefTypeLabel", "Community brief result label"), short("appliesToLabel", "Scope label"), short("allResourcesTitle", "All resources heading")],
    approvedValues: { introKicker: "Reviewed knowledge for your work", introTitle: "Library", introLede: "Find checklists, job aids, question banks, practice notes, and learning materials. Each item explains what it is, where its guidance comes from, and who maintains it.", searchLabel: "Search resources, briefs, and learning", searchPlaceholder: "For example: language access checklist", searchButton: "Search", typeFilterLabel: "Filter by type", authorityFilterLabel: "Filter by where the guidance comes from", clearFiltersLabel: "Clear filters", resultSingular: "result", resultPlural: "results", noResultsTitle: "No closely related resource found", noResultsBody: "Try different words, browse the list below, or open a published topic on Ask. Search stays on this page and is not stored on the server.", briefTypeLabel: "Community brief", appliesToLabel: "Applies to", allResourcesTitle: "All resources" },
  }),
  defineSurface({
    surfaceId: "library.resource-shell",
    route: "/library/[id]",
    scopePolicy: "inheritable",
    fields: [
      short("preparedByLabel", "Resource maintainer label"), short("forLabel", "Resource scope label"), long("outsideSourceNote", "Outside-source reminder"), short("openSourceLabel", "Outside-source link wording"), short("sourceWebsiteLabel", "Unnamed source website wording"), long("intranetSourceNote", "Intranet-source reminder"), short("whyKicker", "Why-it-matters label"), short("nextStepsTitle", "Next-steps heading"), short("pathsTitle", "Learning-path links heading"), short("questionsKicker", "Questions-and-corrections label"), long("correctionsLead", "Questions-and-corrections guidance"), short("consultationActionLabel", "Consultation support link wording"),
    ],
    approvedValues: {
      preparedByLabel: "Prepared by", forLabel: "For", outsideSourceNote: "This reference comes from outside the program. Check the original source for the current version before relying on it.", openSourceLabel: "Open the source", sourceWebsiteLabel: "source website", intranetSourceNote: "Find the current version on the DHS intranet.", whyKicker: "Why this matters", nextStepsTitle: "Continue from here", pathsTitle: "Use this resource in a learning path", questionsKicker: "Questions or corrections", correctionsLead: "If something is missing or does not seem right, tell your Equity Director or", consultationActionLabel: "ask for support",
    },
  }),
  defineSurface({
    surfaceId: "communities.index",
    route: "/minnesota-communities",
    scopePolicy: "inheritable",
    fields: [short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"), long("privacyNotice", "Privacy reminder"), short("searchLabel", "Search field label"), long("searchExample", "Search example"), short("searchButton", "Search button"), short("refusalLead", "Out-of-scope result heading"), short("alternativesHeading", "Alternative actions heading"), short("gapKicker", "No-match section label"), short("relatedLabel", "Related briefs label"), short("bestMatchKicker", "Best-match label"), short("availableTitle", "Available briefs heading"), long("reviewWarning", "Review-in-progress explanation"), long("releasedExplanation", "Released-material explanation"), short("languagesLabel", "Languages label"), long("underReviewLabel", "Review-in-progress status"), long("gatedLabel", "Tribal referral status"), long("reviewCompleteLabel", "Review complete status")],
    approvedValues: { introKicker: "Practice support for Minnesota work", introTitle: "Minnesota Communities", introLede: "Short briefs to help you ask better questions, check access, involve the right partners, and avoid harmful assumptions. Each brief includes practical guidance, and none describes any one person.", privacyNotice: "These briefs can help you prepare for work with Minnesota communities, but they do not describe any one person. Please leave case details and personal identifiers out of your notes.", searchLabel: "Find a brief by community, language, or topic", searchExample: "For example: Somali, Maay interpreter, Greater Minnesota, Deaf.", searchButton: "Search briefs", refusalLead: "This request is outside the program’s role.", alternativesHeading: "What you can do instead", gapKicker: "A matching brief is not available yet", relatedLabel: "Related briefs", bestMatchKicker: "Best match", availableTitle: "Available briefs", reviewWarning: "Briefs still being reviewed are clearly marked. Confirm important details before using one in a decision.", releasedExplanation: "Only material ready for staff use appears here. A referral page may direct you to the appropriate office when specialized guidance is needed.", languagesLabel: "Languages named in this brief", underReviewLabel: "Community review is still in progress.", gatedLabel: "Contact the designated Tribal relations office or liaison before planning consultation or engagement.", reviewCompleteLabel: "Community review is complete." },
  }),
  defineSurface({
    surfaceId: "communities.brief-shell",
    route: "/minnesota-communities/[id]",
    scopePolicy: "inheritable",
    fields: [short("maintainedByLabel", "Maintainer label"), short("appliesToLabel", "Scope label"), short("languagesLabel", "Languages label"), short("tribalKicker", "Tribal referral label"), short("tribalTitle", "Tribal referral heading"), short("tribalActionHeading", "Tribal action heading"), short("notAssumeHeading", "Assumptions heading"), short("tribalLinkLabel", "Tribal contact link"), short("whyKicker", "Why it matters label"), short("variationKicker", "Variation label"), short("namesKicker", "Names section label"), short("preferredLabel", "Preferred terms label"), short("alsoUsedLabel", "Other terms label"), short("uncertaintyLabel", "Uncertainty label"), short("workKicker", "Work section label"), short("workTitle", "Work section heading"), short("whatToAskTitle", "Questions heading"), short("accessChecksTitle", "Access checks heading"), short("involveTitle", "People to involve heading"), short("notAssumeTitle", "Assumptions heading"), long("antiProfileNote", "Anti-profiling reminder"), short("deeperTitle", "Deeper context heading"), short("hideDeeperLabel", "Hide deeper context link"), long("noDeeperBody", "No deeper context explanation"), short("showDeeperLabel", "Show deeper context button"), long("showDeeperNote", "Deeper context explanation"), short("observancesTitle", "Observances heading"), short("observanceColumn", "Observance column"), short("whenColumn", "When column"), short("atWorkColumn", "At work column"), short("sourcesKicker", "Sources label"), short("nextKicker", "Next steps label"), short("askLinkLabel", "Ask link"), short("accessLinkLabel", "Access checks link"), short("consultLinkLabel", "Consultation link")],
    approvedValues: { maintainedByLabel: "Maintained by", appliesToLabel: "Applies to", languagesLabel: "Languages named in this brief", tribalKicker: "Tribal sovereignty", tribalTitle: "Begin with the designated Tribal relations contact", tribalActionHeading: "If your work may affect a Tribal Nation", notAssumeHeading: "What not to assume", tribalLinkLabel: "See who to contact", whyKicker: "Why it matters for Department of Human Services work", variationKicker: "People and experiences vary", namesKicker: "Names and terms", preferredLabel: "Preferred", alsoUsedLabel: "Also used", uncertaintyLabel: "What is still unclear", workKicker: "Use this in your work", workTitle: "What to ask, access checks, who to involve, what not to assume", whatToAskTitle: "What to ask", accessChecksTitle: "Access checks", involveTitle: "Who to involve", notAssumeTitle: "What not to assume", antiProfileNote: "Use this guidance to prepare, never to label a person. Ask what each person needs, check access, and be clear with partners about why and how they are being involved.", deeperTitle: "Deeper context (optional)", hideDeeperLabel: "Hide deeper context", noDeeperBody: "More context is not available yet. Confirm important details with the appropriate people before using this brief in a decision.", showDeeperLabel: "Show deeper context", showDeeperNote: "Open this when history or important qualifications would help you prepare.", observancesTitle: "Observances at work", observanceColumn: "Observance", whenColumn: "When", atWorkColumn: "At work", sourcesKicker: "Sources and review", nextKicker: "Where to go next", askLinkLabel: "Ask a question about your work", accessLinkLabel: "Access checks before a meeting or outreach", consultLinkLabel: "Request a DSD consultation if the brief is not enough" },
  }),
  defineSurface({
    surfaceId: "one-dsd.page",
    route: "/one-dsd",
    scopePolicy: "dsd",
    fields: [
      short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"),
      short("sharedKicker", "Shared foundation label"), short("sharedTitle", "Shared foundation heading"), stringList("sharedItems", "Shared foundation items"),
      short("dsdKicker", "DSD layer label"), short("dsdTitle", "DSD layer heading"), stringList("dsdItems", "DSD layer items"),
      short("useKicker", "Use section label"), short("useTitle", "Use section heading"),
      ...[0, 1, 2, 3].flatMap((index) => [short(indexedFieldKey("door", index, "title"), `Choice ${index + 1}: heading`), long(indexedFieldKey("door", index, "description"), `Choice ${index + 1}: explanation`), short(indexedFieldKey("door", index, "label"), `Choice ${index + 1}: link wording`)]),
      short("areasKicker", "Scope section label"), short("areasTitle", "Scope section heading"), long("areasBody", "Scope explanation"),
      short("consultKicker", "Consultation section label"), short("consultTitle", "Consultation section heading"), long("consultBody", "Consultation explanation"), long("consultBoundary", "Consultation boundary"),
      short("routeTitle", "Route card heading"), linkList("routeLinks", "Route links"),
    ],
    approvedValues: {
      introKicker: "The Disability Services Division reference program", introTitle: "One DSD", introLede: "One DSD shows how the shared People, Access and Culture foundation can become a complete, practical program within a division. It adds DSD situations, services, relationships, and learning while remaining connected to One DHS.",
      sharedKicker: "The shared foundation", sharedTitle: "What One DSD inherits", sharedItems: ["Reviewed One DHS knowledge, sources, and practical tools","Shared standards for privacy, participation, and accessibility","Shared learning stages and ways to enter through real work","Clear ways to reach the people and offices that hold the authority to decide"],
      dsdKicker: "The DSD layer", dsdTitle: "What One DSD adds", dsdItems: ["DSD examples, scenarios, programs, and service-delivery applications","Division-specific learning, facilitation, and practice support","A One DSD collaboration space for authorized participants","Direct consultation for eligible DSD work"],
      useKicker: "Choose what would help", useTitle: "Use One DSD in the flow of work",
      door0Title: "Understand and learn", door0Description: "Build from a welcoming introduction through intercultural practice, structural analysis, and systems change without being scored.", door0Label: "Explore learning",
      door1Title: "Apply the work", door1Description: "Use questions, checklists, reviews, and working tools to shape a program, policy, service, meeting, or workforce decision.", door1Label: "Open Practice",
      door2Title: "Prepare with community context", door2Description: "Use reviewed, question-led material to plan access and engagement without treating group information as a label for a person.", door2Label: "Explore Minnesota Communities",
      door3Title: "Find support", door3Description: "Work independently when that is enough, identify the responsible person, or request a DSD consultation when the work is eligible.", door3Label: "Review support choices",
      areasKicker: "The whole picture", areasTitle: "Nine connected areas of work", areasBody: "The DSD reference program applies the shared framework across the full organization, not only training or workplace culture. Each area can receive DSD examples and practice material after review.",
      consultKicker: "A defined service boundary", consultTitle: "Consultation belongs to One DSD", consultBody: "Staff throughout DHS can use the shared learning, tools, and library. Direct consultation with the Equity and Inclusion Operations Consultant is limited to work within the Disability Services Division. Each request is first checked to confirm it is DSD work. Choosing the One DSD view alone does not send a request.", consultBoundary: "Work outside DSD goes to the responsible supervisor, Equity Director or Specialist, policy or program owner, or other department office.", routeTitle: "Choose where to go next", routeLinks: [{"label":"Find the right person","href":"/support/right-person"},{"label":"See how a DSD consultation works","href":"/support/request"}],
    },
  }),
  defineSurface({
    surfaceId: "support.page",
    route: "/support",
    scopePolicy: "inheritable",
    fields: [
      short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"),
      ...[0, 1, 2, 3].flatMap((index) => [short(indexedFieldKey("door", index, "title"), `Choice ${index + 1}: heading`), long(indexedFieldKey("door", index, "description"), `Choice ${index + 1}: explanation`)]),
      short("oneDhsKicker", "One DHS support label"), short("oneDhsTitle", "One DHS support heading"), long("oneDhsBody", "One DHS support explanation"), short("oneDhsLink", "One DHS support link"),
      short("oneDsdKicker", "One DSD support label"), short("oneDsdOpenTitle", "Open consultation heading"), short("oneDsdPreviewTitle", "Consultation preview heading"), long("oneDsdOpenBody", "Open consultation explanation"), long("oneDsdPreviewBody", "Consultation preview explanation"), short("oneDsdOpenLink", "Open consultation link"), short("oneDsdPreviewLink", "Consultation preview link"), short("trackLink", "Request tracking link"),
      short("boundaryKicker", "Other support section label"), long("boundaryBody", "Other support explanation"), short("boundaryLink", "Other support link"),
      short("accessKicker", "Accessibility section label"), long("accessBody", "Accessibility explanation"),
    ],
    approvedValues: {
      introKicker: "Find the right support", introTitle: "Support", introLede: "Work independently when that is enough, or connect with the person who holds the needed responsibility. One DSD also offers direct consultation for eligible DSD work.",
      door0Title: "Ask", door0Description: "Ask a general work question and receive an answer with clear sources and limits. No meeting is needed.", door1Title: "Library", door1Description: "Find reviewed checklists, job aids, learning material, and practice guidance.", door2Title: "Find the right person", door2Description: "Match the work to the responsible supervisor, Equity Director or Specialist, policy owner, or other office.", door3Title: "Explore an area of work", door3Description: "Begin with the decision, task, or professional practice in front of you.",
      oneDhsKicker: "One DHS support", oneDhsTitle: "Connect with the person who owns the work", oneDhsBody: "Direct consultation with the Equity and Inclusion Operations Consultant is a One DSD service. For agencywide work, start with Find the right person to identify the responsible supervisor, Equity Director or Specialist, policy owner, or other office.", oneDhsLink: "Find the right person",
      oneDsdKicker: "One DSD support", oneDsdOpenTitle: "Request a consultation", oneDsdPreviewTitle: "Preview a consultation request", oneDsdOpenBody: "Share general information about your DSD work. Submitting a request does not schedule a meeting, and a request moves ahead only after it is confirmed as DSD work.", oneDsdPreviewBody: "See the questions and summary a request would include. Requests are not open yet, so nothing is saved or sent.", oneDsdOpenLink: "Review and begin a request", oneDsdPreviewLink: "See what a request includes", trackLink: "Check an existing request",
      boundaryKicker: "When another team can help", boundaryBody: "Complaints, investigations, grievances, accommodation decisions, and discipline about a named person go to Employee Culture, Human Resources, or the civil-rights channel. Legal interpretation goes to the policy or legal owner. Anything touching a Tribal Nation goes to the Office of Indian Policy or your Tribal liaison first.", boundaryLink: "Find the right person for this work",
      accessKicker: "Found an access barrier?", accessBody: "This program aims to meet the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA. If something does not work with your assistive technology, tell your Equity Director or the person who maintains this program so the barrier can be reviewed promptly.",
    },
  }),
  defineSurface({
    surfaceId: "support.request.one-dhs",
    route: "/support/request",
    scopePolicy: "one-dhs",
    fields: [short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"), short("supportKicker", "Agencywide support label"), short("supportTitle", "Agencywide support heading"), long("supportBody", "Agencywide support explanation"), short("supportLink", "Agencywide support link")],
    approvedValues: { introKicker: "One DSD service", introTitle: "Direct consultation is for DSD work", introLede: "The consultation form is available in the One DSD view for work within the Disability Services Division. Choosing that view lets you see how a consultation works. It does not confirm eligibility or submit anything.", supportKicker: "Agencywide support", supportTitle: "Find the responsible person or office", supportBody: "If the work is outside DSD, use Find the right person to identify the supervisor, Equity Director or Specialist, policy owner, or office responsible for it.", supportLink: "Find the right person or office" },
  }),
  defineSurface({
    surfaceId: "support.request.dsd",
    route: "/support/request",
    scopePolicy: "dsd",
    fields: [short("openKicker", "Open request section label"), short("previewKicker", "Preview section label"), short("openTitle", "Open request page title"), short("previewTitle", "Preview page title"), long("openLede", "Open request explanation"), long("previewLede", "Preview explanation"), short("privacyKicker", "Privacy notice heading"), long("openPrivacyNote", "Privacy guidance for an open request"), long("previewPrivacyNote", "Privacy guidance for the request preview"), short("retentionLead", "Retention statement before the number of days"), short("retentionTail", "Retention statement after the number of days")],
    approvedValues: { openKicker: "When guidance is not enough", previewKicker: "A look before requests open", openTitle: "Request a consultation", previewTitle: "Preview a consultation request", openLede: "Share a few details so the Equity and Inclusion Operations Consultant can understand what you need and prepare. You can receive support without a live meeting. This form does not schedule a meeting or send a calendar invitation.", previewLede: "See what information a consultation request would include and review the summary it would create. Requests are not open yet, so nothing is created, stored, or sent to the Equity and Inclusion Operations Consultant.", privacyKicker: "Please keep this general.", openPrivacyNote: "Leave out names, case details, medical or personnel information, complaints, and anything else that should remain private. After you submit, only the consultant and people authorized to support this service can see the request.", previewPrivacyNote: "Leave out names and private details. What you enter stays on this page and is not saved or sent to the consultant.", retentionLead: "Submitted details are kept for", retentionTail: "calendar days so the request can be reviewed and answered." },
  }),
  defineSurface({
    surfaceId: "support.right-person",
    route: "/support/right-person",
    scopePolicy: "inheritable",
    fields: [
      short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"),
      short("formKicker", "Routing form section label"), short("formTitle", "Routing form heading"), long("formIntro", "Routing form privacy reminder"),
      short("roleLabel", "Role field label"), short("rolePlaceholder", "Role field prompt"), short("taskLabel", "Area field label"), short("taskPlaceholder", "Area field prompt"), short("timingLabel", "Timing field label"), short("timingPlaceholder", "Timing field prompt"), short("dsdQuestion", "DSD eligibility question"), long("oneDhsRouteNote", "One DHS routing reminder"), short("submitLabel", "Routing button"),
      short("resultKicker", "Recommendation section label"), short("emptyResultTitle", "Empty recommendation heading"), long("emptyResultBody", "Empty recommendation explanation"), short("beginLead", "Recommendation guidance opening"), short("areaLinkLabel", "Area link"), short("libraryLinkLabel", "Library link"), short("destinationsTitle", "People and offices heading"), long("directoryNote", "Contact confirmation reminder"), short("dsdOptionKicker", "DSD option label"), short("dsdOptionTitle", "DSD option heading"), long("dsdOptionBody", "DSD option explanation"), short("dsdOptionLink", "DSD option link"), short("selectedAreaLabel", "Selected area label"),
      short("oneDhsDecisionLabel", "One DHS recommendation heading"), long("oneDhsDecisionBody", "One DHS recommendation explanation"), short("oneDsdDecisionLabel", "One DSD recommendation heading"), long("oneDsdDecisionBody", "One DSD recommendation explanation"),
      short("roleError", "Missing-role message"), short("taskError", "Missing-area message"), short("timingError", "Missing-timing message"),
      ...START_ROLES.map((role) => short(`role${pascalToken(role.id)}Label`, `${role.label}: role choice`)),
      ...WORK_AREAS.map((area) => short(areaFieldKey(area.id, "label"), `${area.label}: area choice`)),
      ...START_URGENCIES.flatMap((urgency) => [short(`urgency${pascalToken(urgency.id)}Label`, `${urgency.label}: timing choice`), long(`urgency${pascalToken(urgency.id)}Guidance`, `${urgency.label}: timing guidance`)]),
      ...DSD_ELIGIBILITY_OPTIONS.flatMap((option) => [short(`eligibility${pascalToken(option.id)}Label`, `${option.label}: choice`), long(`eligibility${pascalToken(option.id)}Description`, `${option.label}: explanation`)]),
      ...SUPPORT_DESTINATIONS.flatMap((destination) => [short(`destination${pascalToken(destination.id)}Label`, `${destination.label}: name`), long(`destination${pascalToken(destination.id)}Description`, `${destination.label}: explanation`)]),
    ],
    approvedValues: {
      introKicker: "When a person needs to decide", introTitle: "Find the right person", introLede: "Start with the kind of work you are doing. You will get useful material to begin with and the roles or offices most likely to own the decision.",
      formKicker: "Tell us about the work", formTitle: "What kind of help do you need?", formIntro: "Use general work information only. Do not enter a person’s name, a complaint, or private case details.", roleLabel: "Your role in this work", rolePlaceholder: "Choose a role", taskLabel: "Area of work", taskPlaceholder: "Choose an area", timingLabel: "Timing", timingPlaceholder: "Choose when you need to act", dsdQuestion: "Is the work within DSD?", oneDhsRouteNote: "In the One DHS view, you will be pointed to the responsible person or office. Direct consultation is a One DSD service for eligible DSD work.", submitLabel: "Show who can help",
      resultKicker: "Who can help", emptyResultTitle: "Your choices will shape this list", emptyResultBody: "You will see a place to start on your own and the roles or offices most likely to hold the needed authority.", beginLead: "Begin with the work.", areaLinkLabel: "Review this area", libraryLinkLabel: "Find reviewed material", destinationsTitle: "People and offices to consider", directoryNote: "Use the current DHS staff directory, intranet, or your supervisor to confirm the named contact. Contact details appear here once the responsible office has confirmed them.", dsdOptionKicker: "One DSD option", dsdOptionTitle: "Direct consultation may fit", dsdOptionBody: "Each request is checked to confirm it is DSD work before it moves ahead. The view you chose does not confirm that by itself.", dsdOptionLink: "Review the consultation request", selectedAreaLabel: "Selected area",
      oneDhsDecisionLabel: "Connect with the right person", oneDhsDecisionBody: "Start with reviewed guidance, then contact the responsible person or office when a person needs to decide.", oneDsdDecisionLabel: "Request a One DSD consultation", oneDsdDecisionBody: "After using the support that fits your work, share a general request so it can be confirmed as DSD work.", roleError: "Choose the role closest to your work.", taskError: "Choose the area closest to your task.", timingError: "Choose when you need to act.",
      ...Object.fromEntries(START_ROLES.map((role) => [`role${pascalToken(role.id)}Label`, role.label])),
      ...Object.fromEntries(WORK_AREAS.map((area) => [areaFieldKey(area.id, "label"), area.label])),
      ...Object.fromEntries(START_URGENCIES.flatMap((urgency) => [[`urgency${pascalToken(urgency.id)}Label`, urgency.label], [`urgency${pascalToken(urgency.id)}Guidance`, urgency.guidance]])),
      ...Object.fromEntries(DSD_ELIGIBILITY_OPTIONS.flatMap((option) => [[`eligibility${pascalToken(option.id)}Label`, option.label], [`eligibility${pascalToken(option.id)}Description`, option.description]])),
      ...Object.fromEntries(SUPPORT_DESTINATIONS.flatMap((destination) => [[`destination${pascalToken(destination.id)}Label`, destination.label], [`destination${pascalToken(destination.id)}Description`, destination.description]])),
    },
  }),
  defineSurface({
    surfaceId: "support.track.available",
    route: "/support/track",
    scopePolicy: "dsd",
    fields: [short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"), short("privacyKicker", "Privacy notice heading"), long("privacyNote", "Request access privacy guidance")],
    approvedValues: { introKicker: "Your requests", introTitle: "Check a request", introLede: "Enter the reference number and access key from your confirmation to see the latest update. You can withdraw a request while it is Received or Under review.", privacyKicker: "Keep your access key private.", privacyNote: "Your reference number and access key work together to protect the request. Only you and the people authorized to support the consultation service can see it." },
  }),
  defineSurface({
    surfaceId: "support.track.unavailable",
    route: "/support/track",
    scopePolicy: "dsd",
    fields: [short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"), long("availabilityNote", "Availability explanation")],
    approvedValues: { introKicker: "Temporarily unavailable", introTitle: "Check a request", introLede: "Checking a request is not available right now.", availabilityNote: "When it is available again, you can use the reference number and access key from your confirmation." },
  }),
  defineSurface({
    surfaceId: "my-work.page",
    route: "/my-work",
    scopePolicy: "inheritable",
    fields: [short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description")],
    approvedValues: { introKicker: "Your work, saved on this computer", introTitle: "My Work", introLede: "Return to working notes, learning progress, recent Ask history, and consultation references you chose to save. You can remove them at any time." },
  }),
  defineSurface({
    surfaceId: "my-view.page",
    route: "/my-view",
    scopePolicy: "inheritable",
    fields: [short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description")],
    approvedValues: { introKicker: "Saved on this computer", introTitle: "My View", introLede: "Return to your practice notes, learning progress, recent Ask history, and saved consultation references. Someone else using this computer may be able to see them. You can remove them at any time." },
  }),
  defineSurface({
    surfaceId: "my-work.client",
    route: "*",
    scopePolicy: "inheritable",
    fields: [
      short("openingLabel", "Saved-work loading message"), long("deleteAllConfirmation", "Delete-all confirmation"), short("notesTitle", "Working-notes heading"), long("notesEmpty", "No-working-notes message"), short("progressTitle", "Path-progress heading"), long("progressEmpty", "No-path-progress message"), short("requestsTitle", "Saved-request heading"), long("requestsEmpty", "No-saved-request message"), short("askTitle", "Recent-questions heading"), short("askCountSingular", "One-question wording"), short("askCountPlural", "Multiple-questions wording"), short("askEmpty", "No-recent-questions message"), short("clearAskLabel", "Clear-questions button"),
      short("forPrefix", "Working-note subject wording"), short("startedLabel", "Started-work wording"), short("completeLabel", "Completed-path wording"), short("inProgressLabel", "Path-in-progress wording"), short("updatedPrefix", "Updated-date wording"), short("savedDeviceLabel", "Saved-on-device wording"), short("availableTabLabel", "Available-in-tab wording"), short("submittedPrefix", "Submitted-date wording"), short("deleteItemLabel", "Delete-item button"),
      short("deletingKicker", "Deleting-and-sharing section label"), long("intakeOpenBeforeRole", "Open-intake explanation before role name"), long("intakeOpenAfterRole", "Open-intake explanation after role name"), long("intakePreviewBeforeRole", "Preview-intake explanation before role name"), long("intakePreviewAfterRole", "Preview-intake explanation after role name"), long("deleteReferenceBody", "Delete-reference explanation"), short("deleteAllLabel", "Delete-all button"),
    ],
    approvedValues: {
      openingLabel: "Opening your saved work.", deleteAllConfirmation: "Delete all practice notes, path progress, saved consultation references, and recent Ask questions from this computer? This does not delete submitted requests, or the copy of Ask questions and answers the program owner keeps.", notesTitle: "Working notes", notesEmpty: "No working notes yet. Start a learning path when you are ready.", progressTitle: "Path progress", progressEmpty: "No path progress yet.", requestsTitle: "Saved consultation references", requestsEmpty: "No consultation references are saved on this computer.", askTitle: "Recent Ask questions", askCountSingular: "recent question", askCountPlural: "recent questions", askEmpty: "No recent Ask questions.", clearAskLabel: "Clear recent Ask questions",
      forPrefix: "For", startedLabel: "Started", completeLabel: "Path review complete", inProgressLabel: "In progress", updatedPrefix: "updated", savedDeviceLabel: "Saved on this device", availableTabLabel: "Available in this tab", submittedPrefix: "submitted", deleteItemLabel: "Delete",
      deletingKicker: "Your privacy and choices", intakeOpenBeforeRole: "A submitted consultation request is separate from the reference saved here. The", intakeOpenAfterRole: "can see the submitted request so they can prepare and respond.", intakePreviewBeforeRole: "Consultation requests are not open yet. Nothing you enter is sent or saved for the", intakePreviewAfterRole: ".", deleteReferenceBody: "Removing a saved reference clears its reference number and access key from this computer. It does not withdraw a request that was already submitted.", deleteAllLabel: "Delete everything saved here",
    },
  }),
  defineSurface({
    surfaceId: "contribute.page",
    route: "/contribute",
    scopePolicy: "inheritable",
    fields: [short("introKicker", "Opening section label"), short("introTitle", "Page title"), long("introLede", "Opening description"), short("noticeLead", "Access notice heading"), long("noticeBody", "Access notice explanation"), long("staffBody", "Staff alternatives explanation"), linkList("staffLinks", "Staff alternatives")],
    approvedValues: { introKicker: "Shape the resources we share", introTitle: "For contributors", introLede: "A place for invited colleagues to prepare, review, and share useful program resources.", noticeLead: "Contributor sign-in is not open yet.", noticeBody: "You can continue exploring and using the program resources.", staffBody: "Learning, practice, and support remain open to everyone.", staffLinks: [{ label: "Library", href: "/library" }, { label: "Practice", href: "/practice" }, { label: "Support", href: "/support" }] },
  }),
];

function communityBriefDefinition(brief: CommunityBrief): StaffSurfaceDefinition {
  const fields: StaffSurfaceFieldDefinition[] = [
    short("title", "Brief title"),
    short("kicker", "Brief section label"),
    short("owner", "Maintainer"),
    stringList("languages", "Languages named in the brief"),
    long("whoAndWhere", "Who and where"),
    long("whyItMatters", "Why it matters for DHS work"),
    long("withinGroupDiversity", "Differences within the community"),
    stringList("preferredNames", "Preferred names and terms"),
    optionalStringList("alsoUsedNames", "Other names and terms"),
    long("nameNote", "Naming guidance"),
    optionalLong("nameUncertainty", "What is still unclear"),
    stringList("whatToAsk", "What to ask"),
    stringList("accessChecks", "Access checks"),
    stringList("whoToInvolve", "Who to involve"),
    stringList("whatNotToAssume", "What not to assume"),
  ];
  const approvedValues: StaffSurfaceValues = {
    title: brief.title,
    kicker: brief.kicker,
    owner: brief.owner,
    languages: [...brief.languages],
    whoAndWhere: brief.level0.whoAndWhere,
    whyItMatters: brief.level0.whyItMattersForDhsWork,
    withinGroupDiversity: brief.level0.withinGroupDiversity,
    preferredNames: [...brief.names.preferred],
    alsoUsedNames: [...brief.names.alsoUsed],
    nameNote: brief.names.note,
    nameUncertainty: brief.names.uncertainty ?? "",
    whatToAsk: [...brief.level1.whatToAsk],
    accessChecks: [...brief.level1.accessChecks],
    whoToInvolve: [...brief.level1.whoToInvolve],
    whatNotToAssume: [...brief.level1.whatNotToAssume],
  };

  if (brief.id === "somali") {
    fields.push(short("spotlightTitle", "Community spotlight title"), long("spotlightBody", "Community spotlight"), short("spotlightLinkLabel", "Community spotlight link text"), optionalUrl("spotlightHref", "Community spotlight destination"), short("reflectionTitle", "Reflection title"), long("reflectionBody", "Reflection question"));
    Object.assign(approvedValues, {
      spotlightTitle: "A story still being written",
      spotlightBody: "Culture lives in what people create and share. The Somali Museum of Minnesota brings Somali art, dance, and cultural traditions into Minnesota’s public life. Its story began with objects collected by café owner Osman Ali—a personal collection that grew into a place for learning across generations and communities.",
      spotlightLinkLabel: "Meet the Somali Museum of Minnesota",
      spotlightHref: "https://www.mnhs.org/mnopedia/search/index/place/somali-museum-minnesota",
      reflectionTitle: "A different starting point",
      reflectionBody: "Think of a family you might meet through your work. Alongside the support they seek, what knowledge, relationships, and ambitions might they bring? What would you ask to learn more?",
    });
  }
  const spotlight = COMMUNITY_SPOTLIGHTS[brief.id];
  if (spotlight) {
    fields.push(short("spotlightTitle", "Community spotlight title"), long("spotlightBody", "Community spotlight"), short("spotlightLinkLabel", "Community spotlight link text"), optionalUrl("spotlightHref", "Community spotlight destination"), short("reflectionTitle", "Reflection title"), long("reflectionBody", "Reflection question"));
    Object.assign(approvedValues, { spotlightTitle: spotlight[0], spotlightBody: spotlight[1], spotlightLinkLabel: spotlight[2], spotlightHref: spotlight[3], reflectionTitle: "A different starting point", reflectionBody: spotlight[4] });
  }
  brief.level2?.forEach((section, index) => {
    fields.push(short(indexedFieldKey("deeper", index, "heading"), `Deeper context ${index + 1}: heading`));
    fields.push(long(indexedFieldKey("deeper", index, "body"), `Deeper context ${index + 1}: explanation`));
    approvedValues[indexedFieldKey("deeper", index, "heading")] = section.heading;
    approvedValues[indexedFieldKey("deeper", index, "body")] = section.body;
  });
  brief.sources.forEach((source, index) => {
    fields.push(short(indexedFieldKey("source", index, "label"), `Source ${index + 1}: name`));
    fields.push(long(indexedFieldKey("source", index, "note"), `Source ${index + 1}: note`));
    fields.push(optionalUrl(indexedFieldKey("source", index, "href"), `Source ${index + 1}: destination`));
    approvedValues[indexedFieldKey("source", index, "label")] = source.label;
    approvedValues[indexedFieldKey("source", index, "note")] = source.note;
    approvedValues[indexedFieldKey("source", index, "href")] = source.href ?? "";
  });
  brief.observances?.forEach((observance, index) => {
    fields.push(short(indexedFieldKey("observance", index, "title"), `Observance ${index + 1}: name`));
    fields.push(short(indexedFieldKey("observance", index, "when"), `Observance ${index + 1}: timing`));
    fields.push(long(indexedFieldKey("observance", index, "atWork"), `Observance ${index + 1}: workplace guidance`));
    approvedValues[indexedFieldKey("observance", index, "title")] = observance.title;
    approvedValues[indexedFieldKey("observance", index, "when")] = observance.when;
    approvedValues[indexedFieldKey("observance", index, "atWork")] = observance.atWork;
  });

  return defineSurface({
    surfaceId: communityBriefSurfaceId(brief.id),
    route: `/minnesota-communities/${brief.id}`,
    scopePolicy: "inheritable",
    protectedFields: ["status", "reviewDate", "representationReview", "tribalGate", "provenance", "relatedPathIds", "tags"],
    fields,
    approvedValues,
  });
}

function graduationPathDefinition(path: GraduationPath): StaffSurfaceDefinition {
  path = clarifyPracticePath(path);
  const fields: StaffSurfaceFieldDefinition[] = [
    short("title", "Path title"),
    short("staffLabel", "Path choice label"),
    stringList("signals", "Situations that may fit this path"),
    long("startingCompetence", "Starting point"),
    long("graduatedLooksLike", "What completing the path looks like"),
    stringList("askStarters", "Suggested Ask questions"),
    short("artifactTitle", "Working-notes title"),
    stringList("needsWork", "Examples that still need work"),
    stringList("readyToUse", "Examples that are ready to use"),
    long("privacy", "Path privacy reminder"),
  ];
  const approvedValues: StaffSurfaceValues = {
    title: path.title,
    staffLabel: path.staffLabel,
    signals: [...path.signals],
    startingCompetence: path.startingCompetence,
    graduatedLooksLike: path.graduatedLooksLike,
    askStarters: [...path.askStarters],
    artifactTitle: path.artifactTitle,
    needsWork: [...path.antiPerformative.fake],
    readyToUse: [...path.antiPerformative.real],
    privacy: path.privacy,
  };

  path.steps.forEach((step, index) => {
    fields.push(short(indexedFieldKey("step", index, "title"), `Step ${index + 1}: heading`));
    fields.push(long(indexedFieldKey("step", index, "guidance"), `Step ${index + 1}: guidance`));
    fields.push(optionalLinkList(indexedFieldKey("step", index, "links"), `Step ${index + 1}: links`));
    approvedValues[indexedFieldKey("step", index, "title")] = step.title;
    approvedValues[indexedFieldKey("step", index, "guidance")] = step.guidance;
    approvedValues[indexedFieldKey("step", index, "links")] = step.links.map((link) => ({ ...link }));
  });
  path.artifactFields.forEach((field, index) => {
    fields.push(short(indexedFieldKey("artifactField", index, "label"), `Working-notes field ${index + 1}: label`));
    fields.push(optionalLong(indexedFieldKey("artifactField", index, "help"), `Working-notes field ${index + 1}: help`));
    approvedValues[indexedFieldKey("artifactField", index, "label")] = field.label;
    approvedValues[indexedFieldKey("artifactField", index, "help")] = field.help;
  });
  path.rubric.forEach((rule, index) => {
    fields.push(short(indexedFieldKey("reviewRule", index, "label"), `Review item ${index + 1}: label`));
    fields.push(long(indexedFieldKey("reviewRule", index, "message"), `Review item ${index + 1}: guidance when incomplete`));
    approvedValues[indexedFieldKey("reviewRule", index, "label")] = rule.label;
    approvedValues[indexedFieldKey("reviewRule", index, "message")] = rule.failMessage;
  });

  return defineSurface({
    surfaceId: graduationPathSurfaceId(path.id),
    route: `/practice/${path.id}`,
    label: `${path.title} path`,
    scopePolicy: "inheritable",
    protectedFields: ["id", "launchType", "stepKeys", "artifactFieldIds", "artifactFieldTypes", "artifactFieldRequirements", "rubricKeys", "consultSupportType", "hrWall", "ciRequired", "participation"],
    fields,
    approvedValues,
  });
}

export const EDITABLE_SURFACE_REGISTRY: readonly StaffSurfaceDefinition[] = Object.freeze([
  ...NON_BRIEF_SURFACES,
  ...ALL_COURSE_SURFACES,
  ...PODCAST_SURFACES,
  ...DSD_SURFACES,
  ...DOMAIN_SURFACES,
  EQUITY_PRACTICE_SURFACE,
  ...GRADUATION_PATHS.map(graduationPathDefinition),
  ...BRIEFS.map(communityBriefDefinition),
]);

const SURFACE_BY_ID = new Map(EDITABLE_SURFACE_REGISTRY.map((surface) => [surface.surfaceId, surface]));

export function getEditableSurfaceDefinition(surfaceId: string): StaffSurfaceDefinition | undefined {
  return SURFACE_BY_ID.get(surfaceId) ?? getCommunityReadingSurface(surfaceId);
}

export function communityBriefSurfaceId(briefId: string): string {
  return `community-brief.${briefId}`;
}

export function graduationPathSurfaceId(pathId: string): string {
  return `graduation-path.${pathId}`;
}

export function stringValue(values: Readonly<StaffSurfaceValues>, key: string): string {
  const value = values[key];
  return typeof value === "string" ? value : "";
}

export function stringListValue(values: Readonly<StaffSurfaceValues>, key: string): string[] {
  const value = values[key];
  return Array.isArray(value) && (value.length === 0 || typeof value[0] === "string") ? [...value] as string[] : [];
}

export function linkListValue(values: Readonly<StaffSurfaceValues>, key: string): EditableLinkValue[] {
  const value = values[key];
  return Array.isArray(value) && (value.length === 0 || typeof value[0] === "object") ? [...value] as EditableLinkValue[] : [];
}

export function applyCommunityBriefValues(brief: CommunityBrief, values: Readonly<StaffSurfaceValues>): CommunityBrief {
  return {
    ...brief,
    title: stringValue(values, "title"),
    kicker: stringValue(values, "kicker"),
    owner: stringValue(values, "owner"),
    languages: stringListValue(values, "languages"),
    level0: {
      whoAndWhere: stringValue(values, "whoAndWhere"),
      whyItMattersForDhsWork: stringValue(values, "whyItMatters"),
      withinGroupDiversity: stringValue(values, "withinGroupDiversity"),
    },
    names: {
      preferred: stringListValue(values, "preferredNames"),
      alsoUsed: stringListValue(values, "alsoUsedNames"),
      note: stringValue(values, "nameNote"),
      ...(stringValue(values, "nameUncertainty") ? { uncertainty: stringValue(values, "nameUncertainty") } : {}),
    },
    level1: {
      whatToAsk: stringListValue(values, "whatToAsk"),
      accessChecks: stringListValue(values, "accessChecks"),
      whoToInvolve: stringListValue(values, "whoToInvolve"),
      whatNotToAssume: stringListValue(values, "whatNotToAssume"),
    },
    level2: brief.level2?.map((_, index) => ({ heading: stringValue(values, indexedFieldKey("deeper", index, "heading")), body: stringValue(values, indexedFieldKey("deeper", index, "body")) })),
    sources: brief.sources.map((_, index) => ({ label: stringValue(values, indexedFieldKey("source", index, "label")), note: stringValue(values, indexedFieldKey("source", index, "note")), ...(stringValue(values, indexedFieldKey("source", index, "href")) ? { href: stringValue(values, indexedFieldKey("source", index, "href")) } : {}) })),
    observances: brief.observances?.map((_, index) => ({ title: stringValue(values, indexedFieldKey("observance", index, "title")), when: stringValue(values, indexedFieldKey("observance", index, "when")), atWork: stringValue(values, indexedFieldKey("observance", index, "atWork")) })),
  };
}

export function applyGraduationPathValues(path: GraduationPath, values: Readonly<StaffSurfaceValues>): GraduationPath {
  return clarifyPracticePath({
    ...path,
    title: stringValue(values, "title"),
    staffLabel: stringValue(values, "staffLabel"),
    signals: stringListValue(values, "signals"),
    startingCompetence: stringValue(values, "startingCompetence"),
    graduatedLooksLike: stringValue(values, "graduatedLooksLike"),
    askStarters: stringListValue(values, "askStarters"),
    steps: path.steps.map((step, index) => ({
      ...step,
      title: stringValue(values, indexedFieldKey("step", index, "title")),
      guidance: stringValue(values, indexedFieldKey("step", index, "guidance")),
      links: linkListValue(values, indexedFieldKey("step", index, "links")).map((link) => ({ ...link })),
    })),
    artifactTitle: stringValue(values, "artifactTitle"),
    artifactFields: path.artifactFields.map((field, index) => ({
      ...field,
      label: stringValue(values, indexedFieldKey("artifactField", index, "label")),
      help: stringValue(values, indexedFieldKey("artifactField", index, "help")),
    })),
    rubric: path.rubric.map((rule, index) => ({
      ...rule,
      label: stringValue(values, indexedFieldKey("reviewRule", index, "label")),
      failMessage: stringValue(values, indexedFieldKey("reviewRule", index, "message")),
    })),
    antiPerformative: {
      fake: stringListValue(values, "needsWork"),
      real: stringListValue(values, "readyToUse"),
    },
    privacy: stringValue(values, "privacy"),
  });
}
