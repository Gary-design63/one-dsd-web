// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MyViewClient } from "@/components/my-view-client";
import { BROWSER_STORAGE_KEYS, PRIVATE_BROWSER_STORAGE_KEYS, PRIVATE_BROWSER_STORAGE_PATTERNS, clearRegisteredPrivateBrowserData, isPrivateBrowserStorageKey } from "@/lib/client/storage-keys";
import { emptyPractice, PRACTICE_STORAGE_KEY } from "@/lib/content/learning-practice";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { GRADUATION_PATHS } from "@/lib/content/paths";

const copy = getEditableSurfaceDefinition("my-work.client")!.approvedValues;
const courseKey = "pac-course:intercultural-foundations:begin-with-curiosity";
const resumeKey = "pac-course-resume:intercultural-foundations";
const courses = [{ id: "intercultural-foundations", title: "Intercultural foundations", lessons: [{ id: "begin-with-curiosity", title: "Begin with curiosity" }] }];
const learningFoci = [{ id: "foundations", title: "My foundation practice" }, { id: "reflection", title: "My reflection" }];
const savedState = { schemaVersion: 1, fields: { notes: "Offer a written way to contribute." }, submitted: {}, completed: true };
function seed() {
  localStorage.setItem(courseKey, JSON.stringify(savedState));
  localStorage.setItem(resumeKey, "begin-with-curiosity");
  localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify({ version: 1, notes: {
    foundations: { ...emptyPractice(), situation: "A meeting", action: "Invite questions" },
    reflection: { ...emptyPractice(), situation: "A useful change", action: "Ask what helped" },
  } }));
}
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); vi.spyOn(window, "confirm").mockReturnValue(true); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("private learning continuity and deletion", () => {
  it("lists actual course notes and progress and opens the published lesson, plus each practice focus", () => {
    seed();
    render(<MyViewClient intakeEnabled={false} copy={copy} courses={courses} learningFoci={learningFoci} />);
    expect(screen.getAllByRole("link", { name: "Begin with curiosity (Intercultural foundations)" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Begin with curiosity (Intercultural foundations)" })[0].getAttribute("href")).toBe("/courses/intercultural-foundations/begin-with-curiosity");
    const focus = screen.getByRole("link", { name: "My foundation practice" });
    expect(focus.getAttribute("href")).toBe("/learn/intercultural?focus=foundations#practice-notebook");
    fireEvent.click(within(focus.closest("li")!).getByRole("button", { name: String(copy.deleteItemLabel) }));
    expect(JSON.parse(localStorage.getItem(PRACTICE_STORAGE_KEY)!).notes.foundations).toBeUndefined();
    expect(JSON.parse(localStorage.getItem(PRACTICE_STORAGE_KEY)!).notes.reflection.situation).toBe("A useful change");
    expect(localStorage.getItem(courseKey)).not.toBeNull();
  });

  it("keeps withdrawn-course notes readable without linking to an unavailable course or lesson", () => {
    seed();
    render(<MyViewClient intakeEnabled={false} copy={copy} />);
    expect(screen.queryByRole("link", { name: /Intercultural foundations/ })).toBeNull();
    expect(screen.getByText("Offer a written way to contribute.")).toBeTruthy();
    expect(screen.getAllByText(/this lesson is not currently available/)).toHaveLength(2);
    expect(localStorage.getItem(courseKey)).not.toBeNull();
  });

  it("clears course answers, course resume, notebook, ASK handoff and artifact source without touching unrelated data", () => {
    seed();
    sessionStorage.setItem(BROWSER_STORAGE_KEYS.askPracticeHandoff, JSON.stringify({ draft: "Practice draft" }));
    localStorage.setItem(BROWSER_STORAGE_KEYS.pathArtifactSource(GRADUATION_PATHS[0].id), JSON.stringify({ answerId: "synthetic" }));
    localStorage.setItem("another-app-preference", "keep");
    localStorage.setItem("pac-course:bad/id:lesson", "keep-invalid-namespace");
    sessionStorage.setItem(courseKey, "keep-wrong-area");
    render(<MyViewClient intakeEnabled={false} copy={copy} courses={courses} learningFoci={learningFoci} />);
    fireEvent.click(screen.getByRole("button", { name: String(copy.deleteAllLabel) }));
    expect(screen.getByRole("status").textContent).toContain("removed from this computer");
    expect(localStorage.getItem(courseKey)).toBeNull();
    expect(localStorage.getItem(resumeKey)).toBeNull();
    expect(localStorage.getItem(PRACTICE_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(BROWSER_STORAGE_KEYS.askPracticeHandoff)).toBeNull();
    expect(localStorage.getItem(BROWSER_STORAGE_KEYS.pathArtifactSource(GRADUATION_PATHS[0].id))).toBeNull();
    expect(localStorage.getItem("another-app-preference")).toBe("keep");
    expect(localStorage.getItem("pac-course:bad/id:lesson")).toBe("keep-invalid-namespace");
    expect(sessionStorage.getItem(courseKey)).toBe("keep-wrong-area");
    expect(screen.queryByRole("link", { name: "My foundation practice" })).toBeNull();
  });

  it("preserves the failed record and reports incomplete deletion while clearing other registered records", () => {
    seed();
    const original = Storage.prototype.removeItem;
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(function(this: Storage, key: string) {
      if (key === courseKey) throw new Error("Storage locked");
      return original.call(this, key);
    });
    render(<MyViewClient intakeEnabled={false} copy={copy} courses={courses} />);
    fireEvent.click(screen.getByRole("button", { name: String(copy.deleteAllLabel) }));
    expect(screen.getByRole("status").textContent).toContain("could not be deleted");
    expect(screen.queryByText("Your private information has been removed from this computer.")).toBeNull();
    expect(localStorage.getItem(courseKey)).toBe(JSON.stringify(savedState));
    expect(localStorage.getItem(resumeKey)).toBeNull();
    expect(localStorage.getItem(PRACTICE_STORAGE_KEY)).toBeNull();
  });

  it("acknowledges unreadable saved notes and keeps their contents until explicit deletion", () => {
    localStorage.setItem(courseKey, "broken-json");
    localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify({ version: 99, notes: { foundations: {} } }));
    render(<MyViewClient intakeEnabled={false} copy={copy} courses={courses} />);
    expect(screen.getByRole("status").textContent).toContain("could not be opened");
    expect(localStorage.getItem(courseKey)).toBe("broken-json");
    fireEvent.click(screen.getByRole("button", { name: String(copy.deleteAllLabel) }));
    expect(screen.queryByText(/Some saved notes could not be opened/)).toBeNull();
    expect(localStorage.getItem(courseKey)).toBeNull();
  });

  it("reports key discovery failure and still attempts every static registered deletion", () => {
    const clear = vi.fn(() => true);
    const result = clearRegisteredPrivateBrowserData(clear, () => { throw new Error("Read locked"); });
    expect(result).toEqual({ ok: false, discoveryFailed: true, failedKeys: [] });
    expect(clear).toHaveBeenCalledTimes(PRIVATE_BROWSER_STORAGE_KEYS.length);
  });

  it("registers exact dynamic course namespaces and honors area and ID bounds", () => {
    expect(PRIVATE_BROWSER_STORAGE_PATTERNS).toHaveLength(2);
    for (const key of [courseKey, resumeKey, PRACTICE_STORAGE_KEY]) expect(isPrivateBrowserStorageKey("local", key)).toBe(true);
    for (const key of ["pac-course:anything", "pac-course:valid:lesson:extra", "pac-course:bad/id:lesson", "pac-course-resume:" + "a".repeat(161), "unrelated"]) expect(isPrivateBrowserStorageKey("local", key)).toBe(false);
    expect(isPrivateBrowserStorageKey("session", courseKey)).toBe(false);
  });
});