// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { ProgramOutcomeForm } from "@/components/program-outcome-form";
vi.mock("@/components/program-context", () => ({ useProgramContext: () => ({ context: "one_dsd" }) }));
afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it("sends only the chosen contribution and preserves writing when saving is unconfirmed", async () => {
  localStorage.setItem("private-practice", "This private note must never be included.");
  const fetcher = vi.fn().mockResolvedValueOnce({ ok: false, json: async () => ({ error: "Please try again." }) }).mockResolvedValueOnce({ ok: true, json: async () => ({ receipt: "program-outcome-example" }) });
  vi.stubGlobal("fetch", fetcher);
  const view = render(<ProgramOutcomeForm />);
  const values = ["An access barrier", "An earlier accessible agenda", "Shared materials earlier", "More useful questions", "Review the next meeting"];
  view.getAllByRole("textbox").filter(element => element.tagName === "TEXTAREA").forEach((element, index) => fireEvent.change(element, { target: { value: values[index] } }));
  fireEvent.click(view.getByRole("checkbox"));
  fireEvent.submit(view.container.querySelector("form")!);
  await waitFor(() => expect(view.getByRole("alert").textContent).toBe("Please try again."));
  expect((view.getByLabelText("What were you trying to improve?") as HTMLTextAreaElement).value).toBe(values[0]);
  const first = JSON.parse(fetcher.mock.calls[0][1].body);
  expect(first).toMatchObject({ problem: values[0], consent: true, programScope: "dsd", sourceRoute: "/support/share-result" });
  expect(JSON.stringify(first)).not.toContain("private-practice");
  expect(JSON.stringify(first)).not.toContain("private note");
  fireEvent.submit(view.container.querySelector("form")!);
  await waitFor(() => expect(view.getByRole("status").textContent).toContain("Thank you for sharing"));
  expect(JSON.parse(fetcher.mock.calls[1][1].body).submissionId).toBe(first.submissionId);
});