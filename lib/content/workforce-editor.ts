import { defineEditableSurface } from "./editable-surface-contract";
import { ORGANIZATIONAL_AREAS, WORKFORCE_RESEARCH } from "@/lib/product/workforce-map";
import type { EditableRichBlock } from "./editable-surface-contract";

const LEADERSHIP: Record<string, string[]> = {
  adsa: ["Assistant Commissioner and Deputy Assistant Commissioner: directory-listed leadership roles; individual decision responsibilities need confirmation.", "Disability Services Director and Deputy Director: directory-listed roles within this administration.", "Equity Director: administration-level role, distinct from the division consultant."],
  "health-care": ["Assistant Commissioner and deputy leadership roles appear in the public directory.", "Eligibility, research and quality, finance, and provider services leadership are listed; detailed reporting and delegated authority need confirmation."],
  "behavioral-health": ["Assistant Commissioner, Deputy Assistant Commissioner, and Chief Administrative Officer appear in the public directory."],
  housing: ["Assistant Commissioner and Equity Director appear in the public directory."],
  "employee-culture": ["Assistant Commissioner and leadership for human resources, workforce planning, recruitment, and learning appear in the public directory."],
  dsd: ["Division Director and Deputy Director appear in the public directory.", "The owner describes the Equity and Inclusion Operations Consultant as responsible for operationalizing division equity work. The specific position classification has not been confirmed."],
};

const DSD_ROLES: EditableRichBlock[] = [
  { type: "heading", level: 3, text: "Policy, program, and eligibility experience" },
  { type: "paragraph", text: "The owner identifies these areas of experience within the One DSD Team. This is not a complete divisional roster or a confirmed classification assignment." },
  { type: "bullet-list", items: ["Confirm recurring decisions and tasks with members before assigning learning.", "Keep participation in the team separate from a person's formal decision authority.", "Record responsibilities that continue when a position becomes vacant or moves."] },
  { type: "link-list", items: [{ label: "Policy and program learning", href: "/my-work/explore?role=policy" }, { label: "Eligibility and service learning", href: "/my-work/explore?role=service" }] },
];

const CLASS_ROLES: EditableRichBlock[] = [
  { type: "heading", level: 3, text: "Human Services Program Specialist 1 — classification 2458" },
  { type: "paragraph", text: "The specification describes professional support for program implementation, including analysis, research, fiscal review, and administrative work. Suggested learning connection: examine a process, interpret evidence, and communicate findings. Actual duties require position-level confirmation." },
  { type: "heading", level: 3, text: "Human Services Program Consultant — classification 3322" },
  { type: "paragraph", text: "The specification describes complex work across programs involving policy, legislation, services, or compliance. Suggested learning connection: examine cross-program effects, compare policy options, and plan an improvement with responsible partners. This does not identify the owner's classification." },
  { type: "heading", level: 3, text: "Human Services Manager 1 — classification 3916" },
  { type: "paragraph", text: "The specification describes program management involving priorities, people, resources, and evaluation. Suggested learning connection: examine resource decisions, clarify responsibility, and assess an improvement. A general classification description does not establish an individual's delegated authority." },
];

/** Published work maps can retain the older dated directory status. */
export function workforceStatusText(status: string): string {
  return status.replace(/\b(Public directory reference)\s+(?:checked|reviewed)\s+(?:on\s+)?(?:[A-Za-z]+\s+\d{1,2},\s+\d{4}|\d{4}-\d{2}-\d{2})\b/gi, "$1");
}

export const WORKFORCE_SURFACES = ORGANIZATIONAL_AREAS.map(area => defineEditableSurface({
  surfaceId: `workforce.${area.id}`, route: `/consultant/workforce/${area.id}`, label: `Work map: ${area.name}`, scopePolicy: "one-dhs",
  fields: [
    { key: "name", label: "Area name", kind: "short", required: true },
    { key: "relationship", label: "Organizational relationship", kind: "long", required: true },
    { key: "status", label: "What has been confirmed", kind: "long", required: true },
    { key: "leadership", label: "Leadership and decision responsibilities", kind: "string-list", required: false },
    { key: "roles", label: "Working roles and responsibilities", kind: "rich-blocks", required: false, maxItems: 200 },
    { key: "changes", label: "Changes to retain", kind: "string-list", required: false, maxItems: 200 },
    { key: "sources", label: "Supporting information", kind: "link-list", required: false },
    { key: "resources", label: "Related learning and tools", kind: "link-list", required: false },
  ],
  approvedValues: {
    name: area.name,
    relationship: area.id === "dsd" ? "Within the Aging and Disability Services Administration." : area.parentId ? "Listed as an agency area or associated service. This does not establish a direct reporting line." : "Agency-level reference.",
    status: "Public directory reference. Detailed positions and local responsibilities still need confirmation.",
    leadership: LEADERSHIP[area.id] ?? [], roles: area.id === "dsd" ? DSD_ROLES : area.id === "dhs" ? CLASS_ROLES : [], changes: [],
    sources: [{ label: "DHS organizational information", href: WORKFORCE_RESEARCH.organizationSource }, ...(area.id === "dhs" ? [
      { label: "Program Specialist 1 specification", href: "https://mn.gov/mmb-stat/hr-toolbox/002-class-and-compensation/001-classification/class-specs/h/2458-hum-serv-prog-spec-1.pdf" },
      { label: "Program Consultant specification", href: "https://mn.gov/mmb-stat/hr-toolbox/002-class-and-compensation/001-classification/class-specs/h/3322-hum-serv-prog-consultant.pdf" },
      { label: "Manager 1 specification", href: "https://mn.gov/mmb-stat/hr-toolbox/002-class-and-compensation/001-classification/class-specs/h/3916-hum-serv-mgr-1.pdf" },
    ] : [])],
    resources: [{ label: "Learning for your work", href: "/my-work/explore" }],
  },
}));
