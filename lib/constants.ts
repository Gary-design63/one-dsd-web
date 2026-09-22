/**
 * Official names and staff-facing strings.
 * Rule: never hard-code program or product names in components, templates, or agent prompts.
 * Source: Master PRD v2.2 §1 (locked decisions) + Staff Copy & Brand Pass v0.1.
 */
export const PROGRAM = {
  /** Full program name (Home headline). */
  fullName: "One DHS People, Access and Culture Program",
  /** Staff-facing name used in navigation, answers, and support routes. */
  staffBrand: "One DHS People, Access and Culture Program",
  /** Short descriptor used in copy. */
  descriptor: "an independently managed resource for DHS staff",
  /** Ownership and system boundary shown wherever the program identity appears. */
  ownership:
    "This independently managed program supports DHS staff learning and knowledge work. It is not connected to DHS information systems, does not hold DHS case or personnel records, and does not replace decisions made by responsible department offices.",
  /** Hero line (harvested pattern from One DHS live). */
  heroLede:
    "Practical support for workplace culture and equitable workforce, policy, program, and service decisions.",
  /** Practice owner appears only as a human role in consult context, never as product identity. */
  practiceOwnerRole: "Equity and Inclusion Operations Consultant",
  practiceOwnerName: "Gary Banks",
  /** DSD context and standing committee names. */
  oneDsdShortName: "One DSD",
  oneDsdProgramName: "One DSD People, Access and Culture Program",
  oneDsdTeamName: "One DSD Team",
  oneDsdScope:
    "Disability Services Division within the Aging and Disability Services Administration",
  /** Time zone for display of intake timestamps. */
  displayTimeZone: "America/Chicago",
} as const;

/** Route labels. Every control must remain understandable from its text label. */
export const ROUTES = {
  home: { href: "/", label: "Home" },
  start: { href: "/start", label: "Start" },
  ask: { href: "/ask", label: "Ask" },
  areas: { href: "/areas", label: "Areas of work" },
  communities: { href: "/minnesota-communities", label: "Minnesota Communities" },
  learn: { href: "/learn", label: "Learning and resources" },
  toolkitStudio: { href: "/toolkit-studio", label: "Toolkit Studio" },
  practice: { href: "/practice", label: "Practice" },
  library: { href: "/library", label: "Library" },
  oneDsd: { href: "/one-dsd", label: "One DSD" },
  support: { href: "/support", label: "Support" },
  rightPerson: { href: "/support/right-person", label: "Find the right person" },
  requestConsult: { href: "/support/request", label: "Request a consultation" },
  trackRequest: { href: "/support/track", label: "Check a request" },
  myWork: { href: "/my-work", label: "My Work" },
  about: { href: "/about", label: "About" },
  consultant: { href: "/consultant", label: "Consultant Workspace" },
  contribute: { href: "/contribute", label: "Contributor Workspace" },

  /** Compatibility aliases. New staff links should use the canonical routes above. */
  guidedStart: { href: "/start", label: "Start" },
  resources: { href: "/library", label: "Library" },
  paths: { href: "/practice", label: "Practice" },
  myView: { href: "/my-work", label: "My Work" },
  oneDsdTeam: { href: "/one-dsd/team/workspace", label: "One DSD Team" },
} as const;

export const PRIMARY_NAV = [
  ROUTES.home,
  ROUTES.start,
  ROUTES.ask,
  ROUTES.areas,
  ROUTES.learn,
  ROUTES.practice,
  ROUTES.oneDsd,
  ROUTES.support,
] as const;

/** Privacy notices (safety.privacy_notice). Shown at entry and above free-text fields. */
export const PRIVACY_NOTICE = {
  ask: "Ask is browse and download only. Choose a published topic to read the knowledge-base answer and download a copy. This page does not send typed questions or store staff writing. Do not include names, case details, medical or personnel information, complaints, confidential material, or anything else that should stay private.",
  communities:
    "These briefs can help you prepare for work with Minnesota communities, but they do not describe any one person. Please leave case details and personal identifiers out of your notes.",
  intake:
    `Please describe the program or situation in general terms. Leave out names, Social Security numbers, medical details, complaints about named people, and personnel information. When request submission is available, the ${PROGRAM.practiceOwnerRole} receives everything you choose to submit through this form.`,
  intakePreview:
    `Requests are not open yet. You can fill in the form and review the summary that would be shared, but nothing will be sent to the ${PROGRAM.practiceOwnerRole}. Please continue to leave out private information.`,
  artifact:
    "Your practice notes are saved on this computer. Someone else using this computer may be able to see them. Please leave out client names, case numbers, and medical details.",
} as const;

/** Degraded-mode copy (TRD §10.2). Plain language, no vendor names. */
export const DEGRADED_COPY = {
  generativeLimited:
    "Part of the program is temporarily unavailable. You can still search Resources, explore Minnesota Communities, or visit Support.",
  noSource: "We couldn't find a program source that closely answers that question. You can search Resources or see what a consultation request asks.",
} as const;

export const SIX_GOALS = [
  "Eliminate disparities",
  "Community engagement",
  "Hiring and retention",
  "Learning and development",
  "Contracts and procurement",
  "Communication and accessibility",
] as const;

export const TOOLKIT_FAMILIES = [
  "Equity Toolkit",
  "CLAS Practice Toolkit",
  "Accessibility Practice Toolkit",
  "LifeCourse Practice Toolkit",
] as const;

export const PARTNERSHIP_SPINE = [
  "Equity is everyone's work",
  "Build on existing infrastructure",
  "Center lived experience",
  "Follow the data",
  "Move at the speed of trust",
  "Work in partnership",
] as const;
