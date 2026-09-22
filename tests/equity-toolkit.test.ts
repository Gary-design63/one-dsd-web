import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  EAT_CHOICES, EAT_DRAFT_FIELDS, EAT_ROLES, EAT_STAGES, EQUITY_TOOLKIT_SURFACE,
} from "@/lib/content/equity-toolkit";
import { WORK_PROFILES } from "@/lib/content/work-learning";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import {
  parseEditableSurfaceValues, surfaceMayBeEditedInScope, surfaceMayBeReadInScope, type EditableSurfaceValues,
} from "@/lib/content/editable-surface-contract";

const values: EditableSurfaceValues = EQUITY_TOOLKIT_SURFACE.approvedValues;
const component = readFileSync(path.resolve(__dirname, "../components/equity-toolkit-experience.tsx"), "utf8");
const page = readFileSync(path.resolve(__dirname, "../app/learn/equity-toolkit/page.tsx"), "utf8");

describe("Equity Analysis Toolkit learning companion", () => {
  it("registers parseable, scoped editable content rather than a separate publication path", () => {
    expect(getEditableSurfaceDefinition("equity-toolkit.home")).toBe(EQUITY_TOOLKIT_SURFACE);
    expect(EQUITY_TOOLKIT_SURFACE.route).toBe("/learn/equity-toolkit");
    expect(EQUITY_TOOLKIT_SURFACE.scopePolicy).toBe("inheritable");
    expect(parseEditableSurfaceValues(EQUITY_TOOLKIT_SURFACE, values)).toEqual(values);
    const keys = EQUITY_TOOLKIT_SURFACE.fields.map(field => field.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(keys)).toEqual(new Set(Object.keys(values)));
    expect(() => parseEditableSurfaceValues(EQUITY_TOOLKIT_SURFACE, { ...values, published: true })).toThrow();
    for (const scope of ["one-dhs", "dsd"] as const) {
      expect(surfaceMayBeReadInScope(EQUITY_TOOLKIT_SURFACE, scope)).toBe(true);
      expect(surfaceMayBeEditedInScope(EQUITY_TOOLKIT_SURFACE, scope)).toBe(true);
    }
    expect(page).toContain('prepareEditableSurface("equity-toolkit.home"');
    expect(page).toContain("EditableSurfaceRegion");
  });

  it("gives each companion stage four editable objectives and complete choice consequences", () => {
    expect(EAT_STAGES).toHaveLength(5);
    expect(new Set(EAT_STAGES.map(stage => stage.id)).size).toBe(EAT_STAGES.length);
    expect(EAT_CHOICES).toEqual(["a", "b", "c"]);
    for (const { id } of EAT_STAGES) {
      const objectives = values[`${id}Objectives`];
      expect(Array.isArray(objectives)).toBe(true);
      expect(objectives).toHaveLength(4);
      expect(new Set(objectives as string[]).size).toBe(4);
      expect(EQUITY_TOOLKIT_SURFACE.fields.find(field => field.key === `${id}Objectives`)?.kind).toBe("string-list");
      for (const suffix of ["Title", "Intro", "Scenario", ...EAT_CHOICES.flatMap(choice => [`Choice${choice}`, `Consequence${choice}`])]) {
        expect(typeof values[`${id}${suffix}`]).toBe("string");
        expect((values[`${id}${suffix}`] as string).trim().length).toBeGreaterThan(5);
      }
    }
  });

  it("covers all ten existing work areas with distinct editable contexts", () => {
    expect(EAT_ROLES).toHaveLength(10);
    expect(EAT_ROLES.map(role => role.id)).toEqual(WORK_PROFILES.map(([id]) => id));
    const contexts = EAT_ROLES.map(({ id }) => values[`${id}Context`]);
    expect(new Set(contexts).size).toBe(10);
    for (const [id, label] of WORK_PROFILES) {
      expect(values[`${id}Label`]).toBe(label);
      expect(typeof values[`${id}Context`]).toBe("string");
      expect((values[`${id}Context`] as string).length).toBeGreaterThan(50);
    }
  });

  it("distinguishes practice, qualitative scenarios, and drafts from official authority", () => {
    expect(values.companionNote).toMatch(/not the official toolkit sequence/i);
    expect(values.scenarioNote).toMatch(/fictional/i);
    expect(values.scenarioNote).toMatch(/not predictions/i);
    expect(values.authorityNote).toMatch(/cannot establish community agreement/i);
    expect(values.culturalContext).toMatch(/confirm preferences with the person/i);
    expect(values.draftIntro).toMatch(/separate from the fictional example/i);
    expect(values.draftIntro).toMatch(/not an approval/i);
    expect(values.draftPrivacy).toMatch(/do not enter names, case details/i);
    const copy = JSON.stringify(values);
    expect(copy).not.toMatch(/officially submitted|submission successful|DHS-approved certificate|compliance credit earned/i);
    expect(component).not.toMatch(/onSubmit\s*=|type=["']submit["']|formAction\s*=|<form\b/);
  });

  it("keeps notes in component memory with no network, persistent storage, or audio", () => {
    expect(component).toContain('"use client"');
    expect(component).toMatch(/const \[draft, setDraft\] = useState/);
    expect(component).toMatch(/const \[choices, setChoices\] = useState/);
    expect(component).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|axios|use server/);
    expect(component).not.toMatch(/<audio\b|new Audio\b|speechSynthesis|SpeechRecognition|AudioContext|\.mp3\b|\.wav\b/i);
    expect(JSON.stringify(values)).not.toMatch(/\.mp3\b|\.wav\b|listen to (this|the) lesson/i);
    const imports = [...component.matchAll(/from\s+["']([^"']+)["']/g)].map(match => match[1]);
    expect(imports.sort()).toEqual([
      "@/lib/content/editable-surface-contract", "@/lib/content/equity-toolkit", "react", "./multimedia/engagement-toolkit-route",
    ].sort());
    const companion = readFileSync(path.resolve(__dirname, "../components/multimedia/engagement-toolkit-route.tsx"), "utf8");
    expect(companion).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|axios|use server|<audio\b/);
  });

  it("keeps a separate draft field for every stage and offers explicit local clearing and printing", () => {
    expect(EAT_DRAFT_FIELDS.map(field => field.stageId)).toEqual(EAT_STAGES.map(stage => stage.id));
    expect(new Set(EAT_DRAFT_FIELDS.map(field => field.id)).size).toBe(EAT_STAGES.length);
    for (const { id } of EAT_DRAFT_FIELDS) {
      expect(typeof values[`${id}Label`]).toBe("string");
      expect(typeof values[`${id}Help`]).toBe("string");
    }
    expect(component).toContain("data-equity-working-draft");
    expect(component).toContain("setDraft({})");
    expect(component).toContain("setConfirmClear(true)");
    expect(component).toContain("window.print()");
    expect(component).toContain('value={draft[field.id] ?? ""}');
    expect(component).not.toMatch(/setDraft\([^;]*choices|setDraft\([^;]*Consequence/);
  });
});
