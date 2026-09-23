/** Research baseline, not a staff roster, reporting chart, or permission grant. */
export const WORKFORCE_RESEARCH = {
  checkedOn: "2026-09-06",
  organizationSource: "https://mn.gov/dhs/about-us/contact-us/agencywide-organization/",
  classificationSources: [
    "https://mn.gov/mmb/employee-relations/career-paths-and-families/classification-specifications/spec-h.jsp",
    "https://mn.gov/mmb/employee-relations/career-paths-and-families/classification-specifications/spec-s.jsp",
  ],
  coverage: "Public directory baseline; unit-level coverage and classification assignments require validation.",
} as const;

export type OrganizationalArea = { id: string; name: string; kind: "agency" | "administration" | "division" | "office" | "partner"; parentId: string | null; relationship: "agency-root" | "agency-area" | "within-administration" | "associated-service" };
export const ORGANIZATIONAL_AREAS: readonly OrganizationalArea[] = [
  { id: "dhs", name: "Department of Human Services", kind: "agency", parentId: null, relationship: "agency-root" },
  ...[
    ["adsa", "Aging and Disability Services Administration"], ["health-care", "Health Care Administration"],
    ["behavioral-health", "Behavioral Health Administration"], ["housing", "Homelessness, Housing and Support Services Administration"],
  ].map(([id, name]) => ({ id, name, kind: "administration" as const, parentId: "dhs", relationship: "agency-area" as const })),
  { id: "dsd", name: "Disability Services Division", kind: "division", parentId: "adsa", relationship: "within-administration" },
  ...[
    ["commissioner", "Office of the Commissioner"], ["finance", "Chief Financial Office"], ["compliance", "Compliance Office"],
    ["general-counsel", "General Counsel’s Office"], ["management-services", "Management Services"], ["inspector-general", "Office of Inspector General"],
    ["strategy-performance", "Office of Strategy and Performance"], ["employee-culture", "Office of Employee Culture"],
    ["communications", "Communications"], ["community-relations", "Community Relations"], ["county-relations", "County Relations"],
    ["equity-inclusion", "Equity and Inclusion"], ["federal-relations", "Federal Relations"], ["legislative-relations", "Legislative Relations"],
    ["indian-policy", "Office of Indian Policy"], ["business-solutions", "Business Solutions Office"], ["complex-projects", "Complex Projects"],
  ].map(([id, name]) => ({ id, name, kind: "office" as const, parentId: "dhs", relationship: "agency-area" as const })),
  { id: "mnit", name: "MNIT Services", kind: "partner", parentId: "dhs", relationship: "associated-service" },
];

// Verified index entries only. No claim these classes are allocated to a particular DHS unit.
export const CLASSIFICATION_REFERENCES = [
  { code: "2458", title: "Human Services Program Specialist 1" },
  { code: "2459", title: "Human Services Program Specialist 2" },
  { code: "3264", title: "Human Services Program Coordinator" },
  { code: "3322", title: "Human Services Program Consultant" },
  { code: "3916", title: "Human Services Manager 1" },
  { code: "3912", title: "Human Services Supervisor 1" },
  { code: "0498", title: "Human Resource Specialist 1" },
  { code: "3604", title: "State Program Administrator" },
  { code: "3606", title: "State Program Administrator Senior" },
  { code: "3607", title: "State Program Administrator Principal" },
] as const;

export type WorkAssignment = {
  id: string; areaId: string; workingTitle: string; classificationCode: string | null;
  responsibilities: string[]; taskIds: string[]; resourceIds: string[];
  state: "proposed" | "confirmed" | "vacant" | "retired";
  effectiveFrom: string; effectiveTo: string | null; supersedesId: string | null;
};

export function organizationLineage(id: string): string[] {
  const result: string[] = [];
  let area = ORGANIZATIONAL_AREAS.find(area => area.id === id);
  while (area && !result.includes(area.id)) {
    result.push(area.id);
    area = ORGANIZATIONAL_AREAS.find(candidate => candidate.id === area!.parentId);
  }
  return result;
}
