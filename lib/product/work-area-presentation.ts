import type { WorkAreaId } from "./work-areas";

/** Existing program photographs, visually reviewed for these work-area contexts. */
export const WORK_AREA_PHOTOS: Record<WorkAreaId, { src: string; alt: string }> = {
  workforce_equity: { src: "/images/workforce-equity-collaboration-v2.png", alt: "Three colleagues collaborate around a desk, discussing a shared planning document." },
  policy_program_service_design: { src: "/images/course-sh/cover-form.jpg", alt: "Four colleagues review a document together at a meeting table." },
  community_engagement_co_design: { src: "/images/course-ea/engagement.jpg", alt: "Three people sit around a table for a listening conversation." },
  accessibility_language_access: { src: "/images/work-areas/accessibility-language-access.webp", alt: "An accessible reception counter is prepared with an assistive listening headset and space for visitors." },
  culture_trust_repair: { src: "/images/work-areas/culture-trust-repair.webp", alt: "Four chairs, notebooks, and water glasses are arranged for a listening conversation." },
  leadership_systems_change: { src: "/images/covers/equity-inclusion-leadership-systems.jpg", alt: "A group of colleagues reviews plans around a conference table." },
  data_research_quality_measurement: { src: "/images/course-ea/data-desk.jpg", alt: "Two colleagues compare printed charts and discuss the findings." },
  fiscal_grants_procurement_contracts: { src: "/images/work-areas/fiscal-grants-procurement-contracts.webp", alt: "Two colleagues review budget figures and procurement documents together at a table." },
  communications_public_information: { src: "/images/covers/plain-language.jpg", alt: "A staff member and an older man review a form together." },
};
