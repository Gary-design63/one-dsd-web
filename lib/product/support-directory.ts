import type { ResponsibleDestinationId } from "./work-areas";

export type SupportSource = Readonly<{
  id: string; label: string; href: string;
  kind: "guidance" | "office_directory" | "contact_page";
  audience: string; purpose: string; limitation: string;
  sourceDate: string | null; checkedOn: string; publisher: "Minnesota DHS";
}>;

const base = "https://mn.gov/dhs/";
export const SUPPORT_SOURCES: readonly SupportSource[] = [
  { id: "employee-accommodation", label: "Employee and applicant accommodation guidance", href: base + "assets/reasonable-accommodation-policy_tcm1053-646974.pdf", kind: "guidance", audience: "Employees and applicants", purpose: "Find the workplace accommodation process and the roles that can help.", limitation: "Use your current HR or ADA contact for forms and arrangements.", sourceDate: "2014 (incomplete issue and effective dates)", checkedOn: "2026-09-08", publisher: "Minnesota DHS" },
  { id: "workplace-concern", label: "Workplace discrimination, harassment and retaliation guidance", href: base + "assets/discrimination-harassment-retaliation_tcm1053-646912.pdf", kind: "guidance", audience: "DHS employees", purpose: "Explore the employee process and the formal ways to report a concern.", limitation: "A conversation with your supervisor or this program is not required before you use a formal process. Confirm current internal forms with the responsible office.", sourceDate: "2014 (later revision dates unfilled)", checkedOn: "2026-09-08", publisher: "Minnesota DHS" },
  { id: "service-civil-rights", label: "Civil rights in human services", href: base + "about-us/about-human-services/terms-rights-access/civil-rights-human-services/", kind: "contact_page", audience: "People using human services and those supporting them", purpose: "Find equal-access information and public-service discrimination contacts.", limitation: "For an employee workplace concern, use the separate workplace guidance.", sourceDate: null, checkedOn: "2026-09-08", publisher: "Minnesota DHS" },
  { id: "public-accessibility", label: "Accessible public materials guidance", href: base + "about-us/about-human-services/terms-rights-access/accessibility/", kind: "guidance", audience: "People preparing or using public DHS materials", purpose: "Find accessible-format and notification guidance.", limitation: "Your division maintains its own accessible-format response arrangements.", sourceDate: "February 2019 (accessible-format section)", checkedOn: "2026-09-08", publisher: "Minnesota DHS" },
  { id: "language-blocks", label: "Language-assistance notices for public documents", href: base + "assets/language-block-required-documents-available-general-public_tcm1053-646949.pdf", kind: "guidance", audience: "People preparing public documents", purpose: "Use the DHS language-block policy for public-document notices.", limitation: "Interpreter booking and translation arrangements depend on your program.", sourceDate: "September 1, 2017", checkedOn: "2026-09-08", publisher: "Minnesota DHS" },
  { id: "tribal-relations", label: "Tribal and Urban Indian Relations", href: base + "partners-and-providers/program-overviews/tribal-and-urban-indian-relations/", kind: "contact_page", audience: "People working on Tribal relations and program coordination", purpose: "Find the office's public contact information and role.", limitation: "Government-to-government consultation follows the applicable Tribal and agency processes.", sourceDate: null, checkedOn: "2026-09-08", publisher: "Minnesota DHS" },
  { id: "contracting", label: "DHS contract approval guidance", href: base + "assets/contracts_tcm1053-646906.pdf", kind: "guidance", audience: "DHS employees working on contracts", purpose: "Find guidance for working with your contract coordinator and Contracts and Legal Compliance.", limitation: "Your assigned coordinator and contract-specific instructions remain the starting point for the work.", sourceDate: "May 1, 2024", checkedOn: "2026-09-08", publisher: "Minnesota DHS" },
  { id: "agency-offices", label: "DHS agency office directory", href: base + "about-us/contact-us/agencywide-organization/", kind: "office_directory", audience: "Anyone looking for a DHS office", purpose: "Explore administration, HR, equity, communications, community relations and program offices.", limitation: "The directory helps identify offices; your team's assigned contact may differ.", sourceDate: null, checkedOn: "2026-09-08", publisher: "Minnesota DHS" },
  { id: "recruitment", label: "DHS careers and recruitment contacts", href: base + "about-us/employment/careers-human-services/", kind: "contact_page", audience: "Applicants and people with recruitment questions", purpose: "Find the recruiting office and careers information.", limitation: "For leave, payroll and other current-employee matters, use your assigned HR contact.", sourceDate: null, checkedOn: "2026-09-08", publisher: "Minnesota DHS" },
];

type Entry = Readonly<{ sources: readonly string[]; fallback: string }>;
export const SUPPORT_DIRECTORY: Readonly<Record<ResponsibleDestinationId, Entry>> = {
  supervisor_or_manager: { sources: [], fallback: "Use your usual team contact. For accommodation or a workplace concern, the formal processes below are also available." },
  administration_equity_director: { sources: ["agency-offices"], fallback: "Find the office for the administration where your work sits, then confirm the assigned equity contact." },
  equity_specialist: { sources: [], fallback: "Your administration's equity office can help identify the specialist supporting your work." },
  policy_or_program_owner: { sources: ["agency-offices"], fallback: "Confirm who owns the particular policy or decision within your program." },
  human_resources: { sources: ["employee-accommodation", "recruitment", "agency-offices"], fallback: "For other employment matters, use your assigned HR contact." },
  accessibility_or_language_access_lead: { sources: ["employee-accommodation", "public-accessibility", "language-blocks"], fallback: "Choose the guidance that matches your need; accommodation, accessible public materials and language assistance are handled differently." },
  procurement_or_contract_office: { sources: ["contracting"], fallback: "Start with your assigned contract coordinator or procurement contact." },
  data_or_quality_lead: { sources: ["agency-offices"], fallback: "Confirm the steward or quality lead responsible for the data you plan to use." },
  community_engagement_lead: { sources: ["agency-offices"], fallback: "Your program's engagement lead can help identify the relationships and participation process relevant to your work." },
  civil_rights_channel: { sources: ["workplace-concern", "service-civil-rights"], fallback: "Choose the employee-workplace or public-service process that fits the matter." },
  office_of_indian_policy_or_tribal_liaison: { sources: ["tribal-relations"], fallback: "Confirm the appropriate liaison and consultation process for the Nation and issue involved." },
  communications_or_public_information_office: { sources: ["agency-offices"], fallback: "Confirm your program's communications contact for the intended message and audience." },
};

export function supportSourcesFor(id: ResponsibleDestinationId): readonly SupportSource[] {
  return SUPPORT_DIRECTORY[id].sources.flatMap(sourceId => {
    const source = SUPPORT_SOURCES.find(candidate => candidate.id === sourceId);
    return source ? [source] : [];
  });
}
