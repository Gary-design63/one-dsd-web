// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CriticalIncidentScene } from "@/components/multimedia/critical-incident-scene";
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("shows the fictional image with a meaningful alternative and every scene beat without timed playback", () => {
  render(<CriticalIncidentScene />);
  expect(screen.getByRole("img", { name: /Four colleagues sit around a meeting table/ })).toBeTruthy();
  expect(screen.getByText(/Computer-generated fictional image/)).toBeTruthy();
  const moments = screen.getByRole("group", { name: "Choose a moment in the fictional scene" });
  expect(moments.querySelectorAll("button")).toHaveLength(3);
  const first = screen.getByRole("button", { name: "1. The handout arrives" });
  const second = screen.getByRole("button", { name: "2. A request is made" });
  const third = screen.getByRole("button", { name: "3. The decision is still open" });
  expect(first.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(second);
  expect(first.getAttribute("aria-pressed")).toBe("false");
  expect(second.getAttribute("aria-pressed")).toBe("true");
  const current = document.getElementById(second.getAttribute("aria-controls")!)!;
  expect(current.textContent).toContain("I need more time to read this version.");
  fireEvent.click(third);
  expect(current.textContent).toContain("No option has been selected.");
  expect(current.textContent).toContain("What do we need before we choose?");
  const fullScene = screen.getByText("Read the complete scene").closest("details")!;
  expect(fullScene.textContent).toContain("Two minutes before the planned decision");
  expect(fullScene.textContent).toContain("Could you send me the file?");
  expect(fullScene.textContent).toContain("What do we need before we choose?");
  expect(document.querySelector("video, audio")).toBeNull();
});

it("distinguishes observed timing and a request from inferred motives and ability without recording a score", () => {
  const storage = vi.spyOn(Storage.prototype, "setItem");
  const fetch = vi.spyOn(globalThis, "fetch");
  render(<CriticalIncidentScene />);
  const consider = screen.getByRole("button", { name: "Consider this opening line" });
  expect(consider).toHaveProperty("disabled", true);
  fireEvent.click(screen.getByRole("radio", { name: /^The facilitator did not care/ }));
  fireEvent.click(consider);
  expect(screen.getByText(/the scene does not establish what the facilitator cared about/)).toBeTruthy();
  fireEvent.click(screen.getByRole("radio", { name: /^The participant was not able/ }));
  expect(screen.queryByText(/the scene does not establish what the facilitator cared about/)).toBeNull();
  fireEvent.click(consider);
  expect(screen.getByText(/does not establish a person's ability/)).toBeTruthy();
  fireEvent.click(screen.getByRole("radio", { name: /^The revised summary arrived two minutes/ }));
  fireEvent.click(consider);
  expect(screen.getByText(/without claiming to know anyone's motive, ability or diagnosis/)).toBeTruthy();
  expect(screen.getByText(/Use “Notes to take with you” below/)).toBeTruthy();
  expect(storage).not.toHaveBeenCalled();
  expect(fetch).not.toHaveBeenCalled();
});


