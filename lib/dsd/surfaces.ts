import { defineEditableSurface, type EditableSurfaceFieldDefinition } from "@/lib/content/editable-surface-contract";
import { DSD_PROGRAMS, DSD_SCENARIOS } from "./index";

const text = (key: string, label: string, kind: "short" | "long" = "short"): EditableSurfaceFieldDefinition => ({ key, label, kind, maxLength: kind === "long" ? 10000 : 500 });
const list = (key: string, label: string, kind: "string-list" | "link-list" = "string-list"): EditableSurfaceFieldDefinition => ({ key, label, kind, maxLength: 4000, maxItems: 100 });

export const DSD_INVENTORY_SURFACE = defineEditableSurface({
  surfaceId: "one-dsd.inventory", route: "/one-dsd", label: "One DSD programs and scenarios", scopePolicy: "dsd",
  fields: [text("programsTitle", "Programs heading"), text("scenariosTitle", "Scenarios heading")],
  approvedValues: { programsTitle: "Where equity shows up in DSD work", scenariosTitle: "Situations DSD staff actually face" },
});

export const DSD_PROGRAM_SURFACES = DSD_PROGRAMS.map(program => defineEditableSurface({
  surfaceId: "dsd-program." + program.id, route: "/one-dsd/programs/" + program.id,
  label: program.name, scopePolicy: "dsd",
  fields: [text("title", "Program name"), text("intro", "What this program does", "long"), list("equityEntryPoints", "Equity entry points"), text("entryPointsTitle", "Entry points heading"), text("areasTitle", "Areas heading"), text("scenariosTitle", "Scenarios heading"), text("backLabel", "One DSD link")],
  protectedFields: ["programId", "domainIds"],
  approvedValues: { title: program.name, intro: program.whatItDoes, equityEntryPoints: program.equityEntryPoints, entryPointsTitle: "Equity entry points", areasTitle: "Connected areas of work", scenariosTitle: "Related situations", backLabel: "One DSD" },
}));

export const DSD_SCENARIO_SURFACES = DSD_SCENARIOS.map(scenario => defineEditableSurface({
  surfaceId: "dsd-scenario." + scenario.id, route: "/one-dsd/scenarios/" + scenario.id,
  label: scenario.title, scopePolicy: "dsd",
  fields: [text("title", "Scenario title"), text("situation", "The situation", "long"), list("whatToNotice", "What to notice first"), list("questions", "Questions to ask"), list("moves", "Practical next moves", "link-list"), text("handoff", "Professional handoff", "long"), text("situationTitle", "Situation heading"), text("noticeTitle", "Notice heading"), text("questionsTitle", "Questions heading"), text("movesTitle", "Next steps heading"), text("handoffTitle", "Handoff heading"), text("relatedTitle", "Related scenarios heading"), text("backLabel", "One DSD link")],
  protectedFields: ["scenarioId", "domainId"],
  approvedValues: { title: scenario.title, situation: scenario.situation, whatToNotice: scenario.whatToNotice, questions: scenario.questions, moves: scenario.moves, handoff: scenario.handoff, situationTitle: "The situation", noticeTitle: "What to notice first", questionsTitle: "Questions to ask before acting", movesTitle: "Practical next moves", handoffTitle: "Who to involve", relatedTitle: "Related scenarios", backLabel: "One DSD" },
}));

export const DSD_SURFACES = [DSD_INVENTORY_SURFACE, ...DSD_PROGRAM_SURFACES, ...DSD_SCENARIO_SURFACES];
