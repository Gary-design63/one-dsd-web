// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DevelopmentFocus } from "@/components/development-focus";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it("downloads the chosen practice guide without submitting or saving staff information", async () => {
  let documentBlob: Blob | undefined;
  const createObjectURL = vi.fn((blob: Blob) => { documentBlob = blob; return "blob:practice-guide"; });
  const revokeObjectURL = vi.fn();
  Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectURL });
  const clicked: HTMLAnchorElement[] = [];
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function(this: HTMLAnchorElement) { clicked.push(this); });
  const network = vi.fn();
  vi.stubGlobal("fetch", network);
  const storage = vi.spyOn(Storage.prototype, "setItem");
  render(<DevelopmentFocus initialFocus="workplace-culture" />);
  fireEvent.change(screen.getByLabelText("What would you like to explore?"), { target: { value: "access-and-communication" } });
  expect(screen.getByRole("link", { name: "Open this pathway →" }).getAttribute("href")).toBe("/journeys/access-and-communication");
  fireEvent.click(screen.getByRole("button", { name: "Download this practice guide" }));
  expect(clicked[0].download).toBe("access-and-communication-practice-guide.txt");
  expect(documentBlob).toBeDefined();
  const text = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsText(documentBlob!);
  });
  expect(text).toContain("Make access work in practice");
  expect(text).toContain("Reflect and sustain");
  expect(text).toContain("Learning with other people");
  expect(text).toContain("/journeys/access-and-communication");
  expect(text).not.toContain("/library/");
  expect(revokeObjectURL).toHaveBeenCalledWith("blob:practice-guide");
  expect(network).not.toHaveBeenCalled();
  expect(storage).not.toHaveBeenCalled();
});
