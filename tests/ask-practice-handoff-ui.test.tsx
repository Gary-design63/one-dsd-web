// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { PathClient } from "@/components/path-client";
import { BROWSER_STORAGE_KEYS } from "@/lib/client/storage-keys";
import { writeStored } from "@/lib/client/storage";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { meetingArtifact, meetingPath } from "./helpers/practice-artifact-fixtures";
import { testTraceId } from "./helpers/opaque-identifiers";
const view = vi.hoisted(() => ({ context: "one_dsd" }));
vi.mock("@/components/program-context", () => ({ useProgramContext: () => ({ context: view.context }) }));
vi.mock("next/link", () => ({ default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} onClick={event => { props.onClick?.(event); event.preventDefault(); }} /> }));
const first = meetingArtifact();
const artifactKey = BROWSER_STORAGE_KEYS.pathArtifact("gp-8");
const sourceKey = BROWSER_STORAGE_KEYS.pathArtifactSource("gp-8");
const progressKey = BROWSER_STORAGE_KEYS.pathProgress("gp-8");
const handoffKey = BROWSER_STORAGE_KEYS.askPracticeHandoff;
const copy = getEditableSurfaceDefinition("practice.path-shell")!.approvedValues;
function showPath() { return render(<PathClient path={meetingPath} intakeEnabled={false} copy={copy} contract={first.pathContract} />); }
function field(id: string) { return document.getElementById("f-gp-8-" + id) as HTMLInputElement | HTMLTextAreaElement; }
function clear() {
  writeStored("local", artifactKey, null); writeStored("local", sourceKey, null); writeStored("local", progressKey, null);
  writeStored("session", handoffKey, null); writeStored("session", BROWSER_STORAGE_KEYS.askSession, null);
}
beforeEach(() => { view.context = "one_dsd"; clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); clear(); });
it("opens and imports only on the person's choice, with no automatic save or completion", () => {
  writeStored("session", handoffKey, first);
  showPath();
  expect(field("ahead").value).toBe("");
  expect(localStorage.getItem(artifactKey)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Use this draft" }));
  expect(field("ahead").value).toBe(first.values.ahead);
  expect(localStorage.getItem(artifactKey)).toBeNull();
  expect(localStorage.getItem(progressKey)).toBeNull();
  expect(localStorage.getItem(sourceKey)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: String(copy.saveNotesLabel) }));
  expect(JSON.parse(localStorage.getItem(artifactKey)!)).toEqual(first.values);
  expect(JSON.parse(localStorage.getItem(sourceKey)!)).toEqual(first);
  expect(JSON.parse(localStorage.getItem(progressKey)!)).toMatchObject({ complete: false });
});
it("preserves staff edits through a saved draft, reopening, and an explicitly imported later revision", () => {
  writeStored("session", handoffKey, first);
  const page = showPath();
  fireEvent.click(screen.getByRole("button", { name: "Use this draft" }));
  fireEvent.change(field("ahead"), { target: { value: "Our colleague's agenda, written here." } });
  fireEvent.click(screen.getByRole("button", { name: String(copy.saveNotesLabel) }));
  page.unmount();
  const second = meetingArtifact({ revisionId: testTraceId("ui-second"), parentRevisionId: first.revisionId, values: { ...first.values, ahead: "New AI agenda.", formats: ["Remote chat", "Written afterward"], owners: ["Proposed facilitator: invite remote voices; person to confirm"] } });
  writeStored("session", handoffKey, second);
  showPath();
  fireEvent.click(screen.getByRole("button", { name: "Use this draft" }));
  expect(field("ahead").value).toBe("Our colleague's agenda, written here.");
  expect(field("formats").value).toBe("Remote chat\nWritten afterward");
  expect(JSON.parse(localStorage.getItem(artifactKey)!).formats).toEqual(first.values.formats);
  expect(screen.getByRole("status").textContent).toContain("Your own notes were kept");
  fireEvent.click(screen.getByRole("button", { name: String(copy.saveNotesLabel) }));
  expect(JSON.parse(localStorage.getItem(artifactKey)!).ahead).toBe("Our colleague's agenda, written here.");
  expect(JSON.parse(localStorage.getItem(sourceKey)!).revisionId).toBe(second.revisionId);
});
it.each(["scope", "contract"])("keeps existing notes when the handoff has an incompatible %s", reason => {
  writeStored("local", artifactKey, { ahead: "Keep these notes." });
  writeStored("session", handoffKey, meetingArtifact(reason === "scope" ? { context: "one_dhs" } : { pathContract: "a".repeat(64) }));
  showPath();
  fireEvent.click(screen.getByRole("button", { name: "Use this draft" }));
  expect(field("ahead").value).toBe("Keep these notes.");
  expect(screen.getByRole("status").textContent).toMatch(/original program view|practice has changed/);
  expect(localStorage.getItem(sourceKey)).toBeNull();
});
it("deletes both the private notes and their ASK draft reference", () => {
  writeStored("local", artifactKey, first.values); writeStored("local", sourceKey, first);
  showPath();
  fireEvent.click(screen.getByRole("button", { name: String(copy.deleteNotesLabel) }));
  expect(localStorage.getItem(artifactKey)).toBeNull();
  expect(localStorage.getItem(sourceKey)).toBeNull();
  expect(field("ahead").value).toBe("");
});
it("reacts to a new handoff without applying it in the background", () => {
  showPath();
  act(() => { writeStored("session", handoffKey, first); });
  expect(screen.getByRole("button", { name: "Use this draft" })).toBeTruthy();
  expect(field("ahead").value).toBe("");
  expect(localStorage.getItem(artifactKey)).toBeNull();
});
