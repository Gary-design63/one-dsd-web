import courseMemberships from "./courses/theme-memberships.json";
import { defineEditableSurface, type EditableSurfaceFieldDefinition, type EditableSurfaceValues } from "./editable-surface-contract";
import type { ContentItem } from "./types";

export const HUB_THEMES = [
  { id: "culture", title: "Workplace culture and well-being", intro: "Participation, psychological safety, and the everyday conditions that help people thrive at work.", ids: ["podcast.anti-racism-public-service", "lm-workplace-climate", "ja-climate-action-plan", "pn-when-to-escalate"], noteTitle: "Amplify Equity", note: "A voluntary space for conversation, cultural celebrations, and shared experiences. Topics can include equity, workplace stress, and well-being. Staff perspectives can help the Equity and Inclusion Operations Consultant understand what needs attention." },
  { id: "intercultural", title: "Intercultural practice", intro: "Understanding differences without making assumptions about the person in front of us.", ids: ["lm-interpreter", "pn-intercultural-method", "ext-clas", "ja-language-access-checklist"], noteTitle: "A moment to consider", note: "What might you learn by asking someone how they prefer to communicate, rather than assuming that a familiar approach will work for them?" },
  { id: "access", title: "Accessibility and responsive services", intro: "Language, communication, and service design that make participation possible.", ids: ["lm-interpreter", "ext-clas", "ext-ada", "ext-title-vi-lep", "ext-mn-accessibility", "ja-language-access-checklist", "ja-plain-language", "ja-access-checks", "ja-process-burden", "ja-form-notice-change"], noteTitle: "Consider the experience", note: "A form may be accurate and still be difficult to use. What would help someone understand it, complete it, and get the service they need?" },
  { id: "structural", title: "Anti-racism and structural equity", intro: "History, institutional practices, and the decisions that shape access and opportunity.", ids: ["podcast.equity-toolkit", "podcast.anti-racism-public-service", "ext-dhs-equity-toolkit", "pn-equity-in-practice", "ja-equity-impact-questions", "ja-process-burden", "pn-embed-early", "ja-launch-embed-checklist"], noteTitle: "From understanding to change", note: "A rule can be applied consistently and still place a greater burden on some people. What evidence would help us understand its effects, and what could change?" },
  { id: "partnership", title: "Community partnership and planning", intro: "Shared decisions, lived experience, and relationships that shape better services.", ids: ["podcast.equity-toolkit", "pn-partnership-spine", "ja-stakeholder-map", "pn-embed-early", "ext-dhs-equity-toolkit", "pn-intercultural-method", "pn-self-check"], noteTitle: "Whose perspective is missing?", note: "People affected by a decision may notice barriers that are easy to miss from inside an organization. Their involvement can change both the question and the solution." },
  { id: "facilitation", title: "Learning together", intro: "Accessible conversations and learning experiences that carry into everyday practice.", ids: ["lm-facilitation-application", "ja-facilitation-session-plan", "ja-access-checks", "lm-workplace-climate"], noteTitle: "Beyond the session", note: "After a lunch and learn, what would help people use an idea in their work? Time to practice and a later conversation can help learning continue." },
] as const;

const wording = {
  title: "Learning and resources", intro: "Knowledge, practical tools, and perspectives for fair services and inclusive workplaces.",
  searchLabel: "Search learning and resources", searchButton: "Search", themeLabel: "Explore by theme", allLabel: "All themes", formatLabel: "Format", allFormats: "All formats", clearLabel: "Clear filters", coursesTitle: "Learning modules", resourcesTitle: "Tools, guidance, and further reading", emptyTitle: "No matching resources", emptyBody: "Try another word or explore all themes.", countLabel: "resources found", countSingular: "resource found", readingTitle: "Watch and read", readingNote: "The PBS conversation includes captions and a transcript.",
};
const fields: EditableSurfaceFieldDefinition[] = Object.keys(wording).map((key) => ({ key, label: key.replace(/([A-Z])/g, " $1"), kind: "long", required: true, maxLength: 1000 }));
const approvedValues: EditableSurfaceValues = { ...wording, readingLinks: [
  { label: "Tim Wise — Minds That Matter on PBS", href: "https://www.pbs.org/video/minds-that-matter-tim-wise-myglub/" },
  { label: "White Fragility by Robin DiAngelo — about the book", href: "https://www.beacon.org/White-Fragility-P1672.aspx" },
] };
fields.push({ key: "readingLinks", label: "Reading and video links", kind: "link-list", required: false });
for (const theme of HUB_THEMES) {
  for (const [suffix, value] of Object.entries({ Title: theme.title, Intro: theme.intro, NoteTitle: theme.noteTitle, Note: theme.note, Ids: [...theme.ids, ...courseMemberships[theme.id]] })) {
    const key = `${theme.id}${suffix}`;
    fields.push({ key, label: `${theme.title}: ${suffix}`, kind: suffix === "Ids" ? "string-list" : "long", required: suffix === "Title", maxItems: 500 });
    approvedValues[key] = value;
  }
}
export const LEARNING_HUB_SURFACE = defineEditableSurface({ surfaceId: "learn.hub", label: "Learning and resource themes", route: "/learn", scopePolicy: "inheritable", fields, approvedValues });

/** Resolve many-to-many membership against the caller's scoped, published collection. */
export function selectHubItems(items: readonly ContentItem[], values: EditableSurfaceValues, options: { theme?: string; q?: string; type?: string } = {}): ContentItem[] {
  const theme = HUB_THEMES.find(({ id }) => id === options.theme);
  const ids = theme ? values[`${theme.id}Ids`] : undefined;
  const membership = Array.isArray(ids) ? new Set(ids.filter((id): id is string => typeof id === "string")) : undefined;
  const terms = (options.q ?? "").trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    if (membership && !membership.has(item.id)) return false;
    if (options.type && item.type !== options.type) return false;
    const text = [item.title, item.summary, ...item.body, ...item.tags].join(" ").toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });
}
