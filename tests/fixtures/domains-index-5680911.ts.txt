/**
 * Areas of work (DEC-002, DEC-003). The program operationalizes equity across decisions and
 * practices rather than confining it to awareness content. Each area names the real tasks
 * staff do, the practical work product for each task, the reviewed material behind it, the
 * roles that usually own it, and the DSD depth that the reference implementation adds.
 *
 * Content ids point at the reviewed Library. Path ids point at Practice paths.
 */
import { PROGRAM } from "@/lib/constants";

export type DomainId =
  | "workforce"
  | "policy-program-service"
  | "community-engagement"
  | "access-language"
  | "culture-trust"
  | "leadership-systems"
  | "measurement";

export type RoleFamily =
  | "program_policy"
  | "supervisor_manager"
  | "hiring_hr"
  | "fiscal_contracts"
  | "communications"
  | "data_quality"
  | "service_delivery"
  | "equity_professional"
  | "leadership";

export const ROLE_FAMILY_LABEL: Record<RoleFamily, string> = {
  program_policy: "Program and policy staff",
  supervisor_manager: "Supervisors and managers",
  hiring_hr: "Hiring managers and HR partners",
  fiscal_contracts: "Fiscal, contracts, and procurement",
  communications: "Communications and language access",
  data_quality: "Data, research, and quality",
  service_delivery: "Service delivery and support planning",
  equity_professional: "Equity Directors and Specialists",
  leadership: "Division and administration leadership",
};

export type WorkTask = {
  id: string;
  label: string;
  /** What "done well" looks like in one or two sentences. */
  outcome: string;
  roles: RoleFamily[];
  /** Practice path that produces the work product, when one exists. */
  pathId?: string;
  /** Library items to read first. */
  contentIds: string[];
  /** A starter question for Ask. */
  askStarter: string;
  /** Participation class for the task. Default is voluntary and private. */
  supportsRequired?: boolean;
};

export type DsdDepth = {
  /** DSD programs or functions where this area shows up most. Verified names only. */
  programs: string[];
  /** DSD scenarios written for this area. */
  scenarioIds: string[];
  /** What the DSD reference implementation adds in staff language. */
  note: string;
};

export type Domain = {
  id: DomainId;
  title: string;
  staffLabel: string;
  summary: string;
  whyItMatters: string;
  /** The questions an equity practitioner asks first in this area. */
  firstQuestions: string[];
  tasks: WorkTask[];
  /** Tools and frameworks that are inputs here, by Library id. */
  toolIds: string[];
  dsd: DsdDepth;
  /** The six-goal anchors this area serves. */
  goals: string[];
};

export const DOMAINS: Domain[] = [
  {
    id: "workforce",
    title: "Workforce equity and the employee lifecycle",
    staffLabel: "Hiring, advancement, pay, and retention",
    summary:
      "Equity in how people are recruited, screened, selected, welcomed, reviewed, paid, promoted, supported, and retained. It covers the whole lifecycle, not a single inclusive-hiring page.",
    whyItMatters:
      "Credential gatekeeping, vague culture-fit judgments, and unclear pathways are among the most consistent barriers DSD staff described. They are also decisions with owners, which means they can change.",
    firstQuestions: [
      "What does this work genuinely require, and which credible forms of experience show it?",
      "Where in the process do people drop out, and does that differ by community, language, disability, or place?",
      "Who decides, using what rubric, and how would we know the rubric was applied consistently?",
      "How does someone learn what advancement requires here, and who gets sponsored into it?",
    ],
    tasks: [
      {
        id: "design-role",
        label: "Design a role and its qualifications",
        outcome: "A position description whose requirements are tied to the actual work, with credential alternatives named and accommodation normalized.",
        roles: ["hiring_hr", "supervisor_manager"],
        pathId: "gp-6",
        contentIds: ["ja-inclusive-hiring-lifecycle", "ja-job-relatedness-check"],
        askStarter: "We are rewriting a position description. How do we test whether the degree requirement is really job related?",
      },
      {
        id: "run-selection",
        label: "Run a structured, accessible selection process",
        outcome: "Structured interviews, a job-relevant rubric, a diverse and prepared panel, accommodations offered without forcing disclosure, and a transparent offer.",
        roles: ["hiring_hr", "supervisor_manager"],
        pathId: "gp-6",
        contentIds: ["ja-inclusive-hiring-lifecycle", "ja-job-relatedness-check", "ja-accessible-meetings"],
        askStarter: "What should be in our interview rubric so we are not relying on culture fit?",
      },
      {
        id: "advancement-pay",
        label: "Examine advancement, classification, and pay practice",
        outcome: "A clear view of how people move, who gets visible work and sponsorship, and where classification or pay questions need HR and labor relations.",
        roles: ["supervisor_manager", "leadership", "hiring_hr"],
        contentIds: ["pn-pay-classification-advancement", "pn-mentoring-sponsorship"],
        askStarter: "People on my team say they do not know what it takes to advance. What practices help?",
      },
      {
        id: "accessible-leadership-pathways",
        label: "Build accessible leadership pathways and sponsorship for staff with disabilities",
        outcome: "A transparent pathway map, leadership criteria tested for job-relatedness, sponsorship with decision power, accommodations owned across every transition, and accessible cohort events by default, with no guessing about who is disabled and no individual tracking.",
        roles: ["leadership", "supervisor_manager", "hiring_hr", "equity_professional"],
        pathId: "gp-11",
        contentIds: ["pn-accessible-leadership-pathways", "ja-leadership-criteria-job-relatedness", "ja-accommodation-across-transitions", "pn-mentoring-sponsorship", "pn-pay-classification-advancement", "pn-stay-interviews-and-retention"],
        askStarter: "We are redesigning our lead-worker pathway. How do we make it work for staff with disabilities without asking anyone to disclose?",
      },
      {
        id: "retention",
        label: "Understand and improve retention",
        outcome: "Stay conversations, exit patterns reviewed at an appropriate level, and observable practices with owners rather than blame.",
        roles: ["supervisor_manager", "leadership"],
        pathId: "gp-4",
        contentIds: ["pn-stay-interviews-and-retention", "lm-workplace-climate"],
        askStarter: "How do I hold stay conversations that are useful and do not feel like an evaluation?",
      },
    ],
    toolIds: ["tool-eeoc-uniform-guidelines", "tool-mn-equity-toolkit"],
    dsd: {
      programs: ["DSD hiring panels and position design", "Supervisor and manager practice", "Division onboarding"],
      scenarioIds: ["dsd-hiring-panel", "dsd-advancement-conversation", "dsd-accommodation-cliff"],
      note: "One DSD adds the DSD inclusive hiring lifecycle, division-specific scenarios, and the consultation pathway for a real hiring or advancement decision.",
    },
    goals: ["Hiring and retention", "Eliminate disparities"],
  },
  {
    id: "policy-program-service",
    title: "Equitable policy, program, and service design",
    staffLabel: "Policies, programs, budgets, forms, and services",
    summary:
      "Building equity into the decisions that shape who gets what, how, and with what burden: policies, program design, budgets, forms and notices, technology, and service delivery.",
    whyItMatters:
      "Engagement that arrives after a decision is final cannot change it. The DHS equity policy makes an equity scan or full analysis part of some decisions, and good practice makes it part of all of them.",
    firstQuestions: [
      "What is the decision, and when does it stop being changeable?",
      "Who benefits, who carries the burden, and who is missing from the room?",
      "What evidence do we have by community, language, disability, and place, and what does it not show?",
      "What are the alternatives, who owns implementation, and when do we look again?",
    ],
    tasks: [
      {
        id: "equity-analysis",
        label: "Complete an equity scan or full equity analysis",
        outcome: "A documented analysis that names affected communities, evidence, benefits and burdens, alternatives, engagement, implementation owners, and follow-up.",
        roles: ["program_policy", "leadership", "fiscal_contracts"],
        pathId: "gp-7",
        contentIds: ["ja-equity-scan-or-full-analysis", "ext-dhs-equity-toolkit", "ja-operational-equity-canvas"],
        askStarter: "We are changing a program rule that goes to leadership. Does this need an equity scan or a full analysis, and what goes in it?",
        supportsRequired: true,
      },
      {
        id: "new-program",
        label: "Plan a new program, service, or digital application",
        outcome: "An equity and access checklist completed while the design is still open, with responsibilities and a review date.",
        roles: ["program_policy", "service_delivery"],
        pathId: "gp-1",
        contentIds: ["pn-embed-early", "ja-launch-embed-checklist", "ja-process-burden"],
        askStarter: "We are planning a new online application. What equity questions should we settle before the design is fixed?",
      },
      {
        id: "form-notice",
        label: "Change a policy, form, notice, or letter",
        outcome: "Plain-language, accessible, workable material with sources labeled and barriers removed before release.",
        roles: ["program_policy", "communications"],
        pathId: "gp-2",
        contentIds: ["ja-form-notice-change", "ja-plain-language", "ja-language-access-checklist"],
        askStarter: "We are revising a renewal notice. What access and burden questions should we work through?",
      },
      {
        id: "service-delivery",
        label: "Design or improve a service with the people who use it",
        outcome: "Person-centered, accessible service design that reflects the disability rights and community-based service frameworks DSD works within.",
        roles: ["service_delivery", "program_policy"],
        contentIds: ["lm-disability-rights-and-service-delivery", "ja-operational-equity-canvas"],
        askStarter: "How do we redesign an assessment process so it is person-centered and accessible without adding steps?",
      },
    ],
    toolIds: ["tool-mn-equity-toolkit", "tool-gare-racial-equity-toolkit", "tool-lifecourse"],
    dsd: {
      programs: ["Home and community-based services policy", "Support planning and access", "Positive supports and person-centered practice", "Olmstead work"],
      scenarioIds: ["dsd-policy-change", "dsd-service-redesign"],
      note: "One DSD adds division programs and service-delivery frameworks, scenarios from DSD work, and the consultation pathway for a real decision.",
    },
    goals: ["Eliminate disparities", "Communication and accessibility"],
  },
  {
    id: "community-engagement",
    title: "Community engagement and co-design",
    staffLabel: "Listening, engagement, and co-design",
    summary:
      "Engaging communities while a decision can still change, being honest about how much influence people have, and closing the loop on what happened with their input.",
    whyItMatters:
      "DSD's own engagement review found work that was fragmented, event-based, and repeated without coordination, and found that people rarely heard what changed. Trust is built by fixing those patterns.",
    firstQuestions: [
      "What decision can this engagement still influence, and by when?",
      "Are we informing, consulting, involving, collaborating, or co-designing? Have we said so?",
      "Who is affected and who is missing? Who has already been asked, and what were they told?",
      "How are people compensated, supported to participate, and told what changed?",
    ],
    tasks: [
      {
        id: "engagement-plan",
        label: "Plan engagement that shares influence",
        outcome: "An engagement plan with a clear influence level, access supports, compensation, trusted messengers, and a named owner for the relationship.",
        roles: ["program_policy", "communications", "equity_professional"],
        pathId: "gp-3",
        contentIds: ["ja-engagement-influence-ladder", "ja-access-checks", "ja-stakeholder-map"],
        askStarter: "We want community input on a service change. How do we decide how much influence people actually have, and say so honestly?",
      },
      {
        id: "report-back",
        label: "Report back on what was heard and what changed",
        outcome: "A short, accessible record of what people said, what changed, what could not change, why, and what happens next.",
        roles: ["program_policy", "communications"],
        contentIds: ["ja-report-back"],
        askStarter: "We finished listening sessions. What does a good report-back look like?",
      },
      {
        id: "community-context",
        label: "Prepare for work with a Minnesota community",
        outcome: "Better questions, planned access, and named partners, without treating a brief as a description of any one person.",
        roles: ["service_delivery", "program_policy"],
        contentIds: ["pn-intercultural-method", "pn-cultural-humility-briefs-as-questions"],
        askStarter: "How do I prepare for a listening session with a community I do not know well without stereotyping anyone?",
      },
    ],
    toolIds: ["tool-gare-racial-equity-toolkit", "tool-clas-standards"],
    dsd: {
      programs: ["DSD community engagement recommendations (January 2024)", "Advisory and stakeholder groups", "Provider and county partnerships"],
      scenarioIds: ["dsd-engagement-late", "dsd-report-back"],
      note: "One DSD adds the division's engagement findings as approved aggregate themes, DSD scenarios, and the consultation pathway. Tribal consultation stays a separate, government-to-government route.",
    },
    goals: ["Community engagement", "Eliminate disparities"],
  },
  {
    id: "access-language",
    title: "Accessibility, language access, and inclusive operations",
    staffLabel: "Accessibility, language, and inclusive meetings",
    summary:
      "Making documents, meetings, forms, systems, and contact points usable by people with disabilities and people who use languages other than English, as a matter of practice rather than exception.",
    whyItMatters:
      "Inaccessible forms, unclear accessibility ownership, and translation gaps were among the most concrete barriers DSD staff named. Each one has a fix with an owner.",
    firstQuestions: [
      "Who is responsible for accessibility of this item, and do they know it?",
      "Is this a vital document, and which languages and formats does it need?",
      "How will someone participate if the default format does not work for them?",
      "What does the process ask of people, and what can be removed?",
    ],
    tasks: [
      {
        id: "accessible-meeting",
        label: "Run an accessible and culturally responsive meeting",
        outcome: "Purpose and materials in advance, accommodation language that does not force disclosure, several ways to participate, clear decisions and owners, accessible follow-up.",
        roles: ["supervisor_manager", "program_policy"],
        pathId: "gp-8",
        contentIds: ["ja-accessible-meetings", "ja-access-checks"],
        askStarter: "What should I do before, during, and after a team meeting so everyone can actually take part?",
      },
      {
        id: "accessible-document",
        label: "Make a document, form, or notice accessible and plain",
        outcome: "Semantic structure, plain language, alternative formats, and a review before publication.",
        roles: ["communications", "program_policy"],
        pathId: "gp-2",
        contentIds: ["ja-plain-language", "ext-mn-accessibility", "lm-plain-language-carries-complexity"],
        askStarter: "How do I write a plain-language notice without losing the details people need?",
      },
      {
        id: "language-plan",
        label: "Plan language and cultural access for a program or contact point",
        outcome: "Languages, formats, interpreter availability at first contact, vital-document review, and trusted messengers planned together.",
        roles: ["communications", "service_delivery"],
        contentIds: ["ja-language-cultural-access-planning", "ja-language-access-checklist", "lm-interpreter"],
        askStarter: "We are opening a new intake line. What language and cultural access planning should happen first?",
      },
    ],
    toolIds: ["tool-clas-standards", "tool-mn-accessibility-standard"],
    dsd: {
      programs: ["MnCHOICES access and assessment", "Accessible documents and web content", "Sensory and communication accommodations", "Language access for waiver services"],
      scenarioIds: ["dsd-accessible-form", "dsd-interpreter-first-contact"],
      note: "One DSD adds division access practices, MnCHOICES and waiver examples, and DSD accommodation scenarios.",
    },
    goals: ["Communication and accessibility"],
  },
  {
    id: "culture-trust",
    title: "Workplace culture, intercultural practice, and trust",
    staffLabel: "Team climate, difference, and psychological safety",
    summary:
      "Everyday practices that let people speak, disagree, learn across difference, and repair harm, without shame, scoring, or hidden judgment.",
    whyItMatters:
      "DSD staff described dominant-culture defaults, limited psychological safety, and doubt that input changes decisions. Culture changes through observable practices with owners, not slogans.",
    firstQuestions: [
      "What would a team member see happening differently in a normal week?",
      "Who holds positional power here, and how does that shape who speaks?",
      "How do we distinguish unfamiliarity from intentional harm, and respond to each?",
      "When harm happens, who carries the repair, and how do we make sure it is not the person harmed?",
    ],
    tasks: [
      {
        id: "team-climate",
        label: "Strengthen team climate and participation",
        outcome: "Three to five observable practices with owners and a follow-up date, kept separate from any complaint or personnel matter.",
        roles: ["supervisor_manager"],
        pathId: "gp-4",
        contentIds: ["lm-workplace-climate", "ja-climate-action-plan", "lm-psychological-safety-and-repair"],
        askStarter: "People on my team do not speak up in meetings. What practices could change that?",
      },
      {
        id: "intercultural",
        label: "Work well across cultural difference",
        outcome: "Cultural humility in practice: asking rather than assuming, noticing positional power, and using tools like the IDI as inputs rather than labels.",
        roles: ["service_delivery", "supervisor_manager", "program_policy"],
        contentIds: ["pn-intercultural-method", "pn-idi-and-tool-registry", "lm-power-and-positional-authority"],
        askStarter: "What does cultural humility look like in a supervision conversation?",
      },
      {
        id: "power-identity",
        label: "Understand race, power, identity, and structural barriers",
        outcome: "Working knowledge of intersectionality, structural racism, and institutional power that connects to decisions rather than staying abstract.",
        roles: ["leadership", "supervisor_manager", "equity_professional"],
        contentIds: ["lm-intersectionality-foundations", "lm-structural-racism-and-institutions"],
        askStarter: "How does structural racism show up in a program rule that looks neutral on paper?",
      },
    ],
    toolIds: ["tool-idi", "tool-implicit-association"],
    dsd: {
      programs: ["DSD supervisors and team leads", "Division learning and communication", "One DSD Team"],
      scenarioIds: ["dsd-team-silence", "dsd-repair-after-harm"],
      note: "One DSD adds approved aggregate listening themes about culture and trust, DSD scenarios, and consultation for a real team situation.",
    },
    goals: ["Learning and development", "Hiring and retention"],
  },
  {
    id: "leadership-systems",
    title: "Leadership, governance, and systems change",
    staffLabel: "Leading equity work and changing systems",
    summary:
      "Moving from foundation to integration to institutionalization: decision rights, resources, accountability, and the leadership practices that make equity part of how the organization runs.",
    whyItMatters:
      "Approval bottlenecks, diffuse responsibility, and unclear decision rights were named repeatedly. Systems change is leadership work with owners, not an event.",
    firstQuestions: [
      "Who has the authority to change this, and what do they need to decide?",
      "What is treated as immovable that is actually a choice?",
      "Where are equity commitments funded, staffed, and reviewed, and where are they only stated?",
      "How will leaders learn what is working without surveilling staff?",
    ],
    tasks: [
      {
        id: "decision-record",
        label: "Make and record an equity-informed leadership decision",
        outcome: "A decision record that names the equity questions considered, alternatives, owners, and the date the decision will be revisited.",
        roles: ["leadership", "program_policy"],
        pathId: "gp-7",
        contentIds: ["ja-operational-equity-canvas", "pn-role-aware-entry"],
        askStarter: "What should a leadership decision record contain so equity considerations are visible later?",
      },
      {
        id: "procurement",
        label: "Build equity into a contract, grant, or procurement",
        outcome: "Equity considerations in the solicitation, evaluation, and monitoring, with vendor diversity practice and accessibility requirements named.",
        roles: ["fiscal_contracts", "program_policy"],
        pathId: "gp-10",
        contentIds: ["ja-procurement-contract-equity"],
        askStarter: "We are drafting a request for proposals. Where do equity and accessibility requirements belong?",
      },
      {
        id: "leadership-pathways",
        label: "Develop leaders and leadership pathways",
        outcome: "Transparent pathways, sponsorship, and leadership learning that connect to the State's Emerging Leaders Institute and DHS practice.",
        roles: ["leadership", "supervisor_manager"],
        contentIds: ["pn-mentoring-sponsorship", "ext-emerging-leaders-institute"],
        askStarter: "How do we build leadership pathways that people can actually see and enter?",
      },
    ],
    toolIds: ["tool-gare-racial-equity-toolkit", "tool-mn-equity-toolkit"],
    dsd: {
      programs: ["DSD leadership and strategy", "DSD equity implementation plan", "One DSD Team governance"],
      scenarioIds: ["dsd-leadership-bottleneck"],
      note: "One DSD adds division implementation-plan context, governance scenarios, and consultation for leadership decisions.",
    },
    goals: ["Contracts and procurement", "Learning and development", "Eliminate disparities"],
  },
  {
    id: "measurement",
    title: "Measurement, evaluation, and accountability",
    staffLabel: "Knowing whether it is working",
    summary:
      "Telling the difference between a platform that works and a program that improves equity practice, using baselines, mixed methods, disaggregation with protection, and honest limits.",
    whyItMatters:
      "Legacy data systems were built for billing and eligibility, not equity analysis. Good measurement protects private learning, refuses invented targets, and reports what the evidence does and does not show.",
    firstQuestions: [
      "What would change if we knew the answer?",
      "What is the baseline, the denominator, and the smallest group we will report?",
      "What do people's experiences add that the numbers cannot?",
      "How do we measure the program without scoring or ranking people?",
    ],
    tasks: [
      {
        id: "evaluation-plan",
        label: "Plan an evaluation or set of measures",
        outcome: "A logic model with baseline, mixed-method evidence, disaggregation rules, small-group protection, and limits stated plainly.",
        roles: ["data_quality", "program_policy", "leadership"],
        contentIds: ["pn-measurement-without-surveillance"],
        askStarter: "We want to know whether a service change reduced disparities. How do we set that up honestly?",
      },
      {
        id: "read-disaggregated-data",
        label: "Read and present disaggregated data responsibly",
        outcome: "Clear statements of what the data shows, what it does not, and which small groups are protected from identification.",
        roles: ["data_quality", "communications"],
        contentIds: ["pn-measurement-without-surveillance", "pn-partnership-spine"],
        askStarter: "How do I present service data by race and language without exposing small groups or overclaiming causes?",
      },
    ],
    toolIds: ["tool-mn-equity-toolkit"],
    dsd: {
      programs: ["DSD data and quality", "Needs assessment and listening evidence", "Program evaluation"],
      scenarioIds: ["dsd-small-group-data"],
      note: "One DSD adds the division's evaluation approach and approved aggregate findings, with limits recorded.",
    },
    goals: ["Eliminate disparities", "Community engagement"],
  },
];

export function getDomain(id: string): Domain | undefined {
  return DOMAINS.find((domain) => domain.id === id);
}

export function domainForPath(pathId: string): Domain | undefined {
  return DOMAINS.find((domain) => domain.tasks.some((task) => task.pathId === pathId));
}

export function tasksForRole(role: RoleFamily): Array<WorkTask & { domainId: DomainId; domainTitle: string }> {
  return DOMAINS.flatMap((domain) =>
    domain.tasks.filter((task) => task.roles.includes(role)).map((task) => ({ ...task, domainId: domain.id, domainTitle: domain.title })),
  );
}

export const DSD_SCOPE_NOTE = `Material marked for ${PROGRAM.oneDsdShortName} applies to the ${PROGRAM.oneDsdScope}. Everything else applies across DHS.`;
