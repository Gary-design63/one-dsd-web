// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { LearningCompanion } from "@/components/multimedia/learning-companion";
afterEach(cleanup);

it("shows survey group denominators and the combined result without treating the difference as cause", () => {
  render(<LearningCompanion courseId="employee-viewpoint-and-wellbeing-surveys" lessonId="vs-blend" />);
  expect(screen.getByRole("img", { name: /Predictable schedule: 90%/ })).toBeTruthy();
  const table = screen.getByRole("table", { name: "All fictional survey responses" });
  expect(within(table).getByText("90 / 100")).toBeTruthy();
  expect(within(table).getByText("50 / 100")).toBeTruthy();
  expect(within(table).getByText("140 / 200")).toBeTruthy();
  expect(within(table).getByText("70%")).toBeTruthy();
  expect(screen.getByText(/We do not know who did not respond or what caused the difference/)).toBeTruthy();
  expect(screen.getByText("Fictional example · not DHS data")).toBeTruthy();
});

it("makes the complete wait distribution available and calculates the stated average from those actual table values", () => {
  render(<LearningCompanion courseId="outcomes-not-intentions" lessonId="out-blend" />);
  expect(screen.getByRole("img", { name: /Nine applications waited 2 days. One waited 82 days/ })).toBeTruthy();
  const table = screen.getByRole("table", { name: "All ten fictional waits" });
  const values = within(table).getAllByRole("cell").map(cell => Number(cell.textContent));
  expect(values).toHaveLength(10);
  expect(values.reduce((sum, value) => sum + value, 0) / values.length).toBe(10);
  expect(values.filter(value => value === 2)).toHaveLength(9);
  expect(Math.max(...values)).toBe(82);
  expect(screen.getByText(/The median is 2 days and the longest wait is 82 days/)).toBeTruthy();
  expect(screen.getByText(/We have not been told why the last case waited longer/)).toBeTruthy();
});

it("keeps both charts off other lessons in those courses", () => {
  const { container } = render(<LearningCompanion courseId="outcomes-not-intentions" lessonId="out-gate" />);
  expect(container.textContent).toBe("");
  expect(screen.queryByRole("img")).toBeNull();
});

