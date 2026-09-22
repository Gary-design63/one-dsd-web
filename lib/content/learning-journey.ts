import { defineEditableSurface, type EditableSurfaceValues, type EditableSurfaceFieldDefinition } from "./editable-surface-contract";
import type { ContentItem } from "./types";

export const LEARNING_JOURNEY_HREF = "/learn/intercultural";
export const LEARNING_STOP_IDS = ["foundations", "perspectives", "communication", "decisions", "reflection"] as const;
export type LearningStopId = typeof LEARNING_STOP_IDS[number];
export type LearningStop = {
  id: LearningStopId; title: string; purpose: string; objectives: string[];
  example: string; practice: string; reflection: string; evidence: string; nextStep: string;
  resourceIds: string[];
};

const stops: LearningStop[] = [
  {
    id: "foundations", title: "Begin with curiosity",
    purpose: "A useful place to begin when you want shared language for culture, equity, and access. Our experience shapes what feels normal; another person's experience can reveal something we have not noticed.",
    objectives: ["Separate an observation from an interpretation in a workplace example.", "Identify one familiar expectation that may not work equally well for everyone.", "Frame a respectful question that leaves room for the person's own explanation."],
    example: "A colleague pauses before answering. You notice the pause; you do not yet know whether they are considering their words, need more context, or prefer another way to contribute. A question gives you better information than a label.",
    practice: "Choose a routine interaction. Write what you actually observed, what you initially thought it meant, and a question that could help you understand it. Consider other explanations before deciding what to do.",
    reflection: "Which part was evidence, and which part came from my own expectations?",
    evidence: "An observation, more than one plausible explanation, and a question you can use.",
    nextStep: "Explore whose perspective could add something to your understanding.",
    resourceIds: ["course-cultural-humility-vs-checklist", "course-intercultural-competence-without-a-score", "course-idi-denial", "course-idi-polarization", "pn-idi-and-tool-registry", "pn-intercultural-method"]
  },
  {
    id: "perspectives", title: "Make room for different experiences",
    purpose: "Explore this when a familiar approach seems fair, but people experience it differently. Shared needs and meaningful differences can both matter. Learning about a community offers context; listening helps you understand the individual.",
    objectives: ["Explain how the same process can place different burdens on people.", "Identify a perspective missing from a decision and a useful way to invite it.", "Revise an initial interpretation in light of another person's account."],
    example: "A team offers everyone the same opportunity to speak at a fast-moving meeting. Some colleagues contribute more fully after reading a question or thinking it through. A shared invitation may need more than one way to participate.",
    practice: "Take one meeting, notice, or service step. Consider who it works well for, who may face a barrier, and whose experience could help you check that understanding. Invite input without asking someone to speak for an entire community.",
    reflection: "What did I understand differently after considering another perspective?",
    evidence: "A revised question or participation approach, with the reason for the change.",
    nextStep: "Try an approach that responds to what you have learned.",
    resourceIds: ["course-what-minimization-does-in-dhs-work", "course-acceptance-in-dhs-work", "ja-stakeholder-map", "pn-partnership-spine"]
  },
  {
    id: "communication", title: "Adapt how you communicate",
    purpose: "Useful when you want to turn awareness into a more responsive conversation. Adaptation begins with the situation, the person, and the communication task. It includes checking preferences, making access possible, and adjusting after feedback.",
    objectives: ["Ask about communication preferences without assuming them from identity.", "Adapt a question, format, or conversation approach to a stated need.", "Check whether the revised approach helped someone understand or contribute."],
    example: "A service conversation becomes difficult to follow. Rather than speaking louder or repeating the same explanation, you check what would help: a clearer question, a written summary, accessible information, or qualified language support.",
    practice: "Choose a conversation or explanation you can improve. Ask what would make it easier to follow, adapt one part, and check understanding through the task itself. For interpreter-supported conversations, use the language-access resources.",
    reflection: "What did the other person's response tell me about the change?",
    evidence: "A revised explanation or conversation plan and a specific way to check its usefulness.",
    nextStep: "Look at the process around the conversation as well as your own approach.",
    resourceIds: ["course-intercultural-conflict-styles", "course-working-with-an-interpreter", "course-disability-and-language", "course-idi-adaptation", "lm-interpreter", "ja-language-access-checklist"]
  },
  {
    id: "decisions", title: "Carry learning into a decision",
    purpose: "Begin here when a policy, service, workplace practice, or resource decision is open to change. Connect what people experience with the rules, steps, and choices that shape those experiences. Consider alternatives with the people affected.",
    objectives: ["Identify a decision that could change an access or participation barrier.", "Compare alternatives using evidence and the perspectives of affected people.", "Describe a practical change, the responsibility needed, and what would indicate it helped."],
    example: "People repeatedly struggle with a renewal notice. A clearer explanation may help, but the team also examines the documentation burden, available formats, and steps required to respond. The improvement may involve both communication and process.",
    practice: "Use the Equity Analysis Toolkit companion to examine a current decision. Describe the barrier, compare options, identify who can shape the choice, and agree how its effects could be checked. Use the original policy and toolkit for applicable requirements.",
    reflection: "Did the proposed change address the source of the barrier, and whose knowledge shaped it?",
    evidence: "A reasoned option or draft analysis that names the change, available evidence, and questions still open.",
    nextStep: "After a change is tried, revisit what happened with the people affected.",
    resourceIds: ["course-from-noticing-to-shifting", "course-dhs-equity-analysis-toolkit", "ja-equity-impact-questions", "ja-process-burden", "pn-embed-early"]
  },
  {
    id: "reflection", title: "Learn from what happens next",
    purpose: "Return here after trying an idea, or when you want another perspective. A useful reflection connects what you intended, what actually happened, and what you will keep or change. Conversation with a willing colleague can deepen that learning.",
    objectives: ["Distinguish a completed activity from an observed change in the work.", "Describe feedback or an observation without overstating what it proves.", "Choose a specific adjustment or a question for further learning."],
    example: "You offered a written way to contribute before a meeting. More ideas arrived, but that alone does not establish that people had more influence. You also examine which ideas shaped the decision and invite feedback about the experience.",
    practice: "Return to your practice note. Describe what you tried, what you observed, and what remains uncertain. Keep a useful change, adjust it, or seek another perspective. Bring a question to a peer conversation or Learning Lab if that would help.",
    reflection: "What would I repeat, what would I change, and what do I still need to understand?",
    evidence: "A brief account of application, feedback or observations, and a next adjustment.",
    nextStep: "Revisit any part of this path as your work and questions change.",
    resourceIds: ["course-critical-incidents-in-the-work", "course-outcomes-not-intentions", "course-idi-integration", "pn-self-check", "ja-facilitation-session-plan", "lm-facilitation-application"]
  }
];

const copy = {
  title: "Intercultural learning in everyday work",
  intro: "Explore how culture, experience, and access shape everyday work—and how your learning can inform a conversation, a decision, or a change.",
  choice: "Begin with a question that matters to you. Follow the path from the foundations, choose a useful starting point, or return whenever you want another perspective.",
  previewTitle: "Find a path from learning to practice",
  previewBody: "Begin with curiosity, explore different experiences, adapt your approach, and put what you learn to use.",
  previewLink: "Explore intercultural learning",
  idiTitle: "Building on your IDI experience",
  idiBody: "If you have an Intercultural Development Inventory (IDI) profile and development plan, use the goals you explored in your debrief to choose useful learning here. You can also begin without an assessment. These activities support reflection and practice; they do not assess your orientation or replace your individual development plan.",
  idiLink: "https://www.idiinventory.com/products-and-services",
  connectionsTitle: "Keep the learning connected",
  connectionsIntro: "A question may lead to reading, a practical tool, a conversation, or a change in your work. These spaces offer different kinds of support.",
};
const approvedValues: EditableSurfaceValues = { ...copy, relatedLinks: [
  { label: "Program orientation", href: "/orientation" },
  { label: "Minnesota Communities", href: "/minnesota-communities" },
  { label: "Equity Analysis Toolkit", href: "/learn/equity-toolkit" },
  { label: "Guided practice", href: "/practice" },
  { label: "Learning for your work", href: "/my-work/explore" },
  { label: "Amplify Equity", href: "/one-dsd/amplify" },
  { label: "One DSD Team", href: "/one-dsd/team" },
  { label: "Learning Lab", href: "/one-dsd/team/learning-lab" },
  { label: "DEIA leadership and growth in DSD", href: "/one-dsd/leadership" }
]};
const fields: EditableSurfaceFieldDefinition[] = Object.keys(copy).map(key => ({
  key, label: key, kind: key === "idiLink" ? "url" : "long", required: true
}));
fields.push({key: "relatedLinks", label: "Connected program spaces", kind: "link-list", required: false});
for (const stop of stops) {
  const entries = { Title: stop.title, Purpose: stop.purpose, Objectives: stop.objectives,
    Example: stop.example, Practice: stop.practice, Reflection: stop.reflection,
    Evidence: stop.evidence, NextStep: stop.nextStep, Ids: stop.resourceIds };
  for (const [suffix, value] of Object.entries(entries)) {
    const key = stop.id + suffix;
    fields.push({ key, label: stop.title + ": " + suffix, kind: Array.isArray(value) ? "string-list" : "long", required: suffix !== "Ids", maxItems: 100 });
    approvedValues[key] = value;
  }
}
export const LEARNING_JOURNEY_SURFACE = defineEditableSurface({
  surfaceId: "learn.intercultural", label: "Intercultural learning and application", route: LEARNING_JOURNEY_HREF,
  scopePolicy: "inheritable", fields, approvedValues
});

export function journeyText(values: Readonly<EditableSurfaceValues>, key: string): string {
  return typeof values[key] === "string" ? values[key] as string : "";
}
function list(values: Readonly<EditableSurfaceValues>, key: string): string[] {
  return Array.isArray(values[key]) ? (values[key] as unknown[]).filter((value): value is string => typeof value === "string") : [];
}
export function getLearningJourney(values: Readonly<EditableSurfaceValues>): LearningStop[] {
  return LEARNING_STOP_IDS.map(id => ({
    id, title: journeyText(values, id + "Title"), purpose: journeyText(values, id + "Purpose"),
    objectives: list(values, id + "Objectives"), example: journeyText(values, id + "Example"),
    practice: journeyText(values, id + "Practice"), reflection: journeyText(values, id + "Reflection"),
    evidence: journeyText(values, id + "Evidence"), nextStep: journeyText(values, id + "NextStep"),
    resourceIds: list(values, id + "Ids")
  }));
}
/** Membership is resolved only against the caller's currently published collection. */
export function selectJourneyResources(stop: LearningStop, items: readonly ContentItem[]): ContentItem[] {
  const byId = new Map(items.map(item => [item.id, item]));
  return [...new Set(stop.resourceIds)].flatMap(id => byId.has(id) ? [byId.get(id)!] : []);
}
export function journeyResourceHref(item: ContentItem): string {
  return item.id.startsWith("course-") ? "/courses/" + encodeURIComponent(item.id.slice(7)) : "/library/" + encodeURIComponent(item.id);
}
export function learningStageHref(id: string): string {
  const anchors: Record<string, string> = { foundations: "foundations", "intercultural-practice": "perspectives", application: "decisions", "systems-practice": "decisions", "leadership-continuity": "reflection" };
  return id === "orientation" ? "/orientation" : LEARNING_JOURNEY_HREF + (anchors[id] ? "#" + anchors[id] : "");
}

