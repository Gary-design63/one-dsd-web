// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { PlainLanguageComparison } from "@/components/multimedia/plain-language-comparison";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("keeps both complete drafts readable while highlighting the writing moves on request", () => {
  render(<PlainLanguageComparison />);
  expect(screen.getByText("Fictional writing example")).toBeTruthy();
  const first = screen.getByRole("article", { name: "First draft" });
  const revised = screen.getByRole("article", { name: "Revised draft" });
  for (const draft of [first, revised]) {
    expect(draft.textContent).toContain("October 18");
    expect(draft.textContent).toContain("morning or afternoon");
    expect(draft.textContent).toContain("language or access support");
    expect(draft.textContent).toContain("questions");
  }
  const initialText = [first.textContent, revised.textContent];
  const highlight = screen.getByRole("button", { name: "Highlight the writing moves" });
  expect(highlight.getAttribute("aria-pressed")).toBe("false");
  fireEvent.click(highlight);
  expect(highlight.getAttribute("aria-pressed")).toBe("true");
  expect(within(revised).getByText("Choose a workshop time. Reply by October 18.").className).toContain("underline");
  expect([first.textContent, revised.textContent]).toEqual(initialText);
  fireEvent.click(highlight);
  expect(highlight.getAttribute("aria-pressed")).toBe("false");
  expect([first.textContent, revised.textContent]).toEqual(initialText);
});

it("supports reconsidering the missing contact detail without saving or reporting learner activity", () => {
  const storage = vi.spyOn(Storage.prototype, "setItem");
  const fetch = vi.spyOn(globalThis, "fetch");
  render(<PlainLanguageComparison />);
  const consider = screen.getByRole("button", { name: "Consider the missing detail" });
  expect(consider).toHaveProperty("disabled", true);
  fireEvent.click(screen.getByRole("radio", { name: "A more formal heading." }));
  fireEvent.click(consider);
  expect(screen.getByText(/A more formal heading would not help someone send a reply/)).toBeTruthy();
  fireEvent.click(screen.getByRole("radio", { name: /internal scheduling process/ }));
  expect(screen.queryByText(/A more formal heading would not help someone send a reply/)).toBeNull();
  fireEvent.click(consider);
  expect(screen.getByText(/The scheduling process is not needed to make this choice/)).toBeTruthy();
  fireEvent.click(screen.getByRole("radio", { name: "A working way to contact the workshop team." }));
  fireEvent.click(consider);
  expect(screen.getByText(/add and check the contact details/)).toBeTruthy();
  expect(screen.getByText(/Keep the original facts and any required wording/)).toBeTruthy();
  expect(storage).not.toHaveBeenCalled();
  expect(fetch).not.toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: /complete|save|submit/i })).toBeNull();
});

