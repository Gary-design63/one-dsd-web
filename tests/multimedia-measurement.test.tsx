// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MeasurementWorksheet } from "@/components/measurement-worksheet";
import { MeasurementEvidenceExample } from "@/components/multimedia/measurement-evidence-example";
import { MEASUREMENT_FIELD_IDS, MEASUREMENT_SURFACE, measurementNotesText, measurementText } from "@/lib/content/measurement-practice";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("makes every chart value available in a labeled table and distinguishes missing influence evidence", () => {
  render(<MeasurementEvidenceExample />);
  expect(screen.getByText("Fictional example · not DHS data")).toBeTruthy();
  const chart = screen.getByRole("img", { name: /Earlier notice: 60%. Revised notice: 78%/ });
  expect(chart.textContent).toContain("Two separate fictional groups of 100 readers");
  const table = screen.getByRole("table", { name: "The complete fictional evidence" });
  expect(within(table).getAllByRole("columnheader")).toHaveLength(4);
  expect(within(table).getAllByRole("rowheader")).toHaveLength(3);
  expect(within(table).getByText("60 of 100 readers (60%)")).toBeTruthy();
  expect(within(table).getByText("78 of 100 readers (78%)")).toBeTruthy();
  expect(within(table).getByText("Not documented")).toBeTruthy();
  expect(within(table).getByText("2 wording changes; reasons recorded for 2 other suggestions")).toBeTruthy();
});

it("lets readers reconsider activity, causation and supported evidence without recording a score", () => {
  render(<MeasurementEvidenceExample />);
  const consider = screen.getByRole("button", { name: "Consider this interpretation" });
  expect(consider).toHaveProperty("disabled", true);
  fireEvent.click(screen.getByRole("radio", { name: /^Holding more review sessions/ }));
  fireEvent.click(consider);
  expect(screen.getByText(/The session count tells us what happened/)).toBeTruthy();
  fireEvent.click(screen.getByRole("radio", { name: /^The revised wording caused/ }));
  expect(screen.queryByText(/The session count tells us what happened/)).toBeNull();
  fireEvent.click(consider);
  expect(screen.getByText(/The comparison does not establish the cause/)).toBeTruthy();
  fireEvent.click(screen.getByRole("radio", { name: /^More readers found the next action/ }));
  fireEvent.click(consider);
  expect(screen.getByText(/an 18 percentage-point difference/)).toBeTruthy();
  expect(screen.queryByText(/score|completed|passed/i)).toBeNull();
});

it("keeps all ten worksheet fields and exports only the learner's notes after using the companion", async () => {
  const copy = MEASUREMENT_SURFACE.approvedValues;
  const source = { title: "Current published measurement note", href: "/library/pn-measurement-without-surveillance" };
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  const storage = vi.spyOn(Storage.prototype, "setItem");
  const fetch = vi.spyOn(globalThis, "fetch");
  render(<MeasurementWorksheet copy={copy} source={source} />);
  expect(MEASUREMENT_FIELD_IDS).toHaveLength(10);
  expect(screen.getAllByRole("textbox")).toHaveLength(10);
  const values: Record<string, string> = {};
  for (const id of MEASUREMENT_FIELD_IDS) {
    values[id] = "My own working note about " + id + ".";
    fireEvent.change(screen.getByLabelText(measurementText(copy, id + "Label")), { target: { value: values[id] } });
  }
  fireEvent.click(screen.getByRole("radio", { name: /^More readers found the next action/ }));
  fireEvent.click(screen.getByRole("button", { name: "Consider this interpretation" }));
  for (const id of MEASUREMENT_FIELD_IDS) {
    expect(screen.getByLabelText(measurementText(copy, id + "Label"))).toHaveProperty("value", values[id]);
  }
  fireEvent.click(screen.getByRole("button", { name: "Copy notes" }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith(measurementNotesText(values, copy, source)));
  expect(writeText.mock.calls[0][0]).not.toMatch(/60%|78%|Fictional example|earlier notice/i);
  expect(storage).not.toHaveBeenCalled();
  expect(fetch).not.toHaveBeenCalled();
});


