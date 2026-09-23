import { LAUNCH_TYPE_LABEL } from "@/lib/content/question-banks";
import { GRADUATION_PATHS, type GraduationPath } from "@/lib/content/paths";
import type { DownloadKind } from "@/lib/downloads/catalog";

export type StaffAskDownload = {
  kind: DownloadKind;
  id: string;
  noun: string;
};

export type StaffAskTopic = {
  id: string;
  facet: string;
  title: string;
  question: string;
  answer: string;
  checks: string[];
  download: StaffAskDownload;
  links: Array<{ label: string; href: string }>;
};

const PROGRAM_TOPICS: StaffAskTopic[] = [
  {
    id: "equity-framework",
    facet: "Program foundation",
    title: "Equity Strategic Framework",
    question: "How does the program organize equity work from assessment through improvement?",
    answer:
      "The Equity Strategic Framework is the operational spine of the program. It runs as a continuous cycle: assess, plan, implement, measure, learn, improve. Move to the next stage when the people involved agree, not on a date. Use the published framework for the pillars, measures, tools, and launch package. Download a copy to keep with your work.",
    checks: [
      "Read the cycle as a workflow, not a calendar.",
      "Connect the work in front of you to a pillar and a measure.",
      "Download the framework if you need a copy at a meeting.",
    ],
    download: { kind: "equity-framework", id: "framework", noun: "framework" },
    links: [
      { label: "Open the Equity Strategic Framework", href: "/equity-framework" },
      { label: "Operationalizing equity", href: "/operationalizing-equity" },
    ],
  },
  {
    id: "operationalizing-equity",
    facet: "Program foundation",
    title: "Operationalizing equity",
    question: "How do I connect equity to an everyday decision, policy, or service?",
    answer:
      "Operationalizing equity means connecting equity to everyday decisions, workplace practices, policies, and services. Use the published questions and application rules. This is a reading and download, not a form to fill in.",
    checks: [
      "Name the decision, policy, or service in general terms.",
      "Use the published practice questions before the design is settled.",
      "Download the page if you need a shared copy.",
    ],
    download: { kind: "operationalizing-equity", id: "program", noun: "page" },
    links: [
      { label: "Open operationalizing equity", href: "/operationalizing-equity" },
      { label: "Equity Strategic Framework", href: "/equity-framework" },
    ],
  },
  {
    id: "measurement",
    facet: "Measurement",
    title: "Measurement worksheet",
    question: "How should we measure whether an equity change is working?",
    answer:
      "Use the published measurement worksheet. It separates leading indicators from outcomes and names early-warning thresholds. Download the worksheet rather than typing notes into this program.",
    checks: [
      "Choose one leading indicator and one outcome.",
      "Name who will look at the numbers and when.",
      "Download the worksheet to use with your team.",
    ],
    download: { kind: "measurement", id: "worksheet", noun: "worksheet" },
    links: [
      { label: "Open the measurement practice", href: "/practice/measurement" },
      { label: "Equity Strategic Framework", href: "/equity-framework" },
    ],
  },
  {
    id: "support-directory",
    facet: "Support",
    title: "Find the right office",
    question: "Who should handle this if it is not a learning question?",
    answer:
      "Use the DHS offices and guidance directory for workplace needs, public services, and program responsibilities. This program does not take consultation requests from staff. Download the directory or open Find the right person.",
    checks: [
      "Match the work to the office that already owns it.",
      "Do not send names, case details, or complaints here.",
      "Download the directory if you need a copy for your team.",
    ],
    download: { kind: "support-directory", id: "dhs", noun: "directory" },
    links: [
      { label: "Find the right person", href: "/support/right-person" },
      { label: "DHS offices and guidance", href: "/support/directory" },
    ],
  },
];

function facetFor(path: GraduationPath): string {
  return LAUNCH_TYPE_LABEL[path.launchType] ?? "Common work";
}

function topicFromPath(path: GraduationPath): StaffAskTopic {
  const resourceLinks = path.steps
    .filter((step) => step.key === "resources" || step.key === "ci")
    .flatMap((step) => step.links);
  return {
    id: path.id,
    facet: facetFor(path),
    title: path.title,
    question: path.askStarters[0] ?? path.staffLabel,
    answer: `${path.startingCompetence} ${path.graduatedLooksLike}`,
    checks: path.askStarters,
    download: { kind: "path", id: path.id, noun: "checklist" },
    links: [
      { label: `Open the ${path.title} path`, href: `/practice/${path.id}` },
      ...resourceLinks,
    ],
  };
}

export function staffAskTopics(): StaffAskTopic[] {
  return [...PROGRAM_TOPICS, ...GRADUATION_PATHS.map(topicFromPath)];
}

export function staffAskFacets(topics: StaffAskTopic[] = staffAskTopics()): string[] {
  return [...new Set(topics.map((topic) => topic.facet))];
}

export function getStaffAskTopic(id: string): StaffAskTopic | undefined {
  return staffAskTopics().find((topic) => topic.id === id);
}

/** Match a path id or a published question fragment without storing the query. */
export function matchStaffAskTopic(value: string | undefined): StaffAskTopic | undefined {
  const query = value?.trim();
  if (!query) return undefined;
  const topics = staffAskTopics();
  const exact = topics.find((topic) => topic.id === query);
  if (exact) return exact;
  const lowered = query.toLowerCase();
  return topics.find(
    (topic) =>
      topic.question.toLowerCase() === lowered ||
      topic.title.toLowerCase() === lowered ||
      topic.question.toLowerCase().includes(lowered) ||
      lowered.includes(topic.title.toLowerCase()),
  );
}
