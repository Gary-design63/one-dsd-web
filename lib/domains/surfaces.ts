import { defineEditableSurface, type EditableSurfaceFieldDefinition, type EditableSurfaceValues } from "@/lib/content/editable-surface-contract";
import { DOMAINS, type Domain, type DomainId } from "./index";
import type { WorkAreaId } from "@/lib/product/work-areas";

const text = (key: string, label: string, kind: "short" | "long" = "short"): EditableSurfaceFieldDefinition => ({ key, label, kind, required: true, maxLength: kind === "long" ? 10000 : 1000 });
const list = (key: string, label: string): EditableSurfaceFieldDefinition => ({ key, label, kind: "string-list", required: true, maxLength: 4000, maxItems: 100 });
export function domainSurfaceId(id: string) { return `domain.${id}`; }
export function domainTaskFieldKey(id: string, suffix: "label" | "outcome" | "askStarter") {
  return "task" + id.split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join("") + suffix.charAt(0).toUpperCase() + suffix.slice(1);
}
export const WORK_AREA_DOMAINS: Record<WorkAreaId, readonly DomainId[]> = {
  workforce_equity: ["workforce"], policy_program_service_design: ["policy-program-service"],
  community_engagement_co_design: ["community-engagement"], accessibility_language_access: ["access-language"],
  culture_trust_repair: ["culture-trust"], leadership_systems_change: ["leadership-systems"],
  data_research_quality_measurement: ["measurement"], fiscal_grants_procurement_contracts: ["leadership-systems", "policy-program-service"],
  communications_public_information: ["access-language", "community-engagement"],
};
export const DOMAIN_SURFACES = DOMAINS.map(domain => defineEditableSurface({
  surfaceId: domainSurfaceId(domain.id), route: `/areas/${domain.id}`, label: domain.title, scopePolicy: "inheritable",
  protectedFields: ["domainId", "taskIds", "taskRoles", "pathIds", "contentIds", "toolIds", "scenarioIds", "supportsRequired"],
  fields: [text("title", "Title"), text("staffLabel", "Short label"), text("summary", "Introduction", "long"), text("whyItMatters", "Why this matters", "long"), list("firstQuestions", "First questions"), list("goals", "Goals"), list("dsdPrograms", "DSD connections"), text("dsdNote", "DSD context", "long"),
    text("whyTitle", "Why section heading"), text("questionsTitle", "Questions heading"), text("tasksTitle", "Tasks heading"), text("toolsTitle", "Tools heading"), text("dsdTitle", "DSD heading"), text("scenariosTitle", "Scenarios heading"), text("programsTitle", "Programs heading"), text("askLabel", "Ask link"), text("supportLabel", "Support link"), text("requiredLabel", "Required-work context"), text("backLabel", "Areas link"), text("learningTitle", "Learning links heading"), text("areaLibraryLabel", "Area resources link"), text("taskLibraryLabel", "Task resources link"),
    ...domain.tasks.flatMap(task => [text(domainTaskFieldKey(task.id,"label"), `${task.label}: title`), text(domainTaskFieldKey(task.id,"outcome"), `${task.label}: outcome`, "long"), text(domainTaskFieldKey(task.id,"askStarter"), `${task.label}: Ask question`, "long")])],
  approvedValues: { title: domain.title, staffLabel: domain.staffLabel, summary: domain.summary, whyItMatters: domain.whyItMatters, firstQuestions: domain.firstQuestions, goals: domain.goals, dsdPrograms: domain.dsd.programs, dsdNote: domain.dsd.note,
    whyTitle: "Why it matters", questionsTitle: "Questions to begin with", tasksTitle: "Work you can take forward", toolsTitle: "Tools and frameworks", dsdTitle: "In DSD work", scenariosTitle: "Situations to explore", programsTitle: "Connected programs", askLabel: "Ask about this", supportLabel: "Find the right person", requiredLabel: "Supports required work", backLabel: "Areas of work", learningTitle: "Learning connected to this work", areaLibraryLabel: "Library for this area", taskLibraryLabel: "Library for this task",
    ...Object.fromEntries(domain.tasks.flatMap(task => [[domainTaskFieldKey(task.id,"label"),task.label],[domainTaskFieldKey(task.id,"outcome"),task.outcome],[domainTaskFieldKey(task.id,"askStarter"),task.askStarter]])) },
}));
export function applyDomainValues(domain: Domain, values: Readonly<EditableSurfaceValues>): Domain {
  const text = (key: string) => typeof values[key] === "string" ? values[key] as string : "";
  const list = (key: string) => Array.isArray(values[key]) ? (values[key] as unknown[]).filter((value): value is string => typeof value === "string") : [];
  return { ...domain, title: text("title"), staffLabel: text("staffLabel"), summary: text("summary"), whyItMatters: text("whyItMatters"), firstQuestions: list("firstQuestions"), goals: list("goals"), dsd: { ...domain.dsd, programs: list("dsdPrograms"), note: text("dsdNote") }, tasks: domain.tasks.map(task => ({ ...task, label: text(domainTaskFieldKey(task.id,"label")), outcome: text(domainTaskFieldKey(task.id,"outcome")), askStarter: text(domainTaskFieldKey(task.id,"askStarter")) })) };
}
