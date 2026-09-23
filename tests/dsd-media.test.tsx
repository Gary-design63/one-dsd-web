// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { DsdProgramMedia } from "@/components/multimedia/dsd-program-media";
import { DsdScenarioMedia } from "@/components/multimedia/dsd-scenario-media";
import { DsdDataQualityExample } from "@/components/multimedia/dsd-data-quality-example";
import { DsdPolicyBurdenMap } from "@/components/multimedia/dsd-policy-burden-map";
import { DSD_PROGRAMS, DSD_SCENARIOS } from "@/lib/dsd";
import { DSD_PROGRAM_EXAMPLES, DSD_SCENARIO_EXAMPLES } from "@/components/multimedia/dsd-work-examples";
import { LeadershipDevelopmentStudio } from "@/components/leadership-development-studio";
import { LeadershipLifecycleExplorer, SuccessionPracticeTool } from "@/components/leadership-lifecycle-tools";
import { DEVELOPMENT_CAPABILITIES, DEVELOPMENT_ENTRIES } from "@/lib/content/leadership-development";
import { LEADERSHIP_STAGES } from "@/lib/content/leadership-lifecycle";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("DSD resource-specific companions", () => {
  it.each(DSD_PROGRAMS)("gives program $id a relevant companion with its full text equivalent", program => {
    render(<DsdProgramMedia programId={program.id} />);
    const example = DSD_PROGRAM_EXAMPLES[program.id];
    if (example) {
      expect(screen.getByRole("heading", { name: example.title })).toBeTruthy();
      for (const step of example.steps) {
        expect(screen.getByRole("heading", { name: step.title })).toBeTruthy();
        expect(screen.getByText(step.body)).toBeTruthy();
      }
      expect(screen.getByText(example.intro)).toBeTruthy();
    } else {
      expect(screen.getByRole("heading", { name: program.id === "data-quality" ? "A complete record is the beginning of a question" : "Make the next action easy to find" })).toBeTruthy();
    }
  });
  it.each(DSD_SCENARIOS)("gives scenario $id a companion while keeping the example clearly fictional", scenario => {
    render(<DsdScenarioMedia scenarioId={scenario.id} />);
    const example = DSD_SCENARIO_EXAMPLES[scenario.id];
    if (example) {
      expect(screen.getByRole("heading", { name: example.title })).toBeTruthy();
      expect(screen.getByText("Fictional worked example")).toBeTruthy();
      for (const step of example.steps) expect(screen.getByText(step.body)).toBeTruthy();
    } else {
      expect(screen.getByRole("heading", { name: scenario.id === "dsd-policy-change" ? "Follow the request from the family's side" : "What a small table can reveal" })).toBeTruthy();
    }
  });
  it("does not invent a companion for an unknown destination", () => {
    const view = render(<><DsdProgramMedia programId="unknown" /><DsdScenarioMedia scenarioId="unknown" /></>);
    expect(view.container.innerHTML).toBe("");
  });
  it("keeps the overall and grouped counts consistent and withholds complementary rows in the reporting view", () => {
    render(<DsdDataQualityExample />);
    const region = screen.getByRole("region", { name: "Fictional follow-up data" });
    expect(region.getAttribute("tabindex")).toBe("0");
    let table = screen.getByRole("table", { name: "Overall fictional follow-up" });
    expect(within(table).getAllByRole("columnheader")).toHaveLength(4);
    expect(within(table).getByText("120")).toBeTruthy();
    expect(within(table).getByText("90")).toBeTruthy();
    expect(within(table).getByText("75%")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Look at the groups" }));
    table = screen.getByRole("table", { name: "Grouped fictional follow-up" });
    const rowB = within(table).getByRole("rowheader", { name: "Group B" }).closest("tr")!;
    expect(within(rowB).getAllByRole("cell").map(cell => cell.textContent)).toEqual(["32", "20", "62.5%"]);
    const rowC = within(table).getByRole("rowheader", { name: "Group C" }).closest("tr")!;
    expect(within(rowC).getAllByRole("cell").map(cell => cell.textContent)).toEqual(["8", "2", "25%"]);
    fireEvent.click(screen.getByRole("button", { name: "Protect small groups" }));
    table = screen.getByRole("table", { name: "Fictional reporting view with two rows withheld" });
    for (const label of ["Group B", "Group C"]) {
      const row = within(table).getByRole("rowheader", { name: label }).closest("tr")!;
      expect(within(row).getAllByRole("cell").map(cell => cell.textContent)).toEqual(["Not reported", "Not reported", "Not reported"]);
    }
    expect(within(table).getByText("85%")).toBeTruthy();
    expect(screen.getByText(/For this example only, imagine a reporting rule/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Protect small groups" }).getAttribute("aria-pressed")).toBe("true");
  });
  it("lets a learner reconsider the investigation without keeping an old response or recording activity", () => {
    const storage = vi.spyOn(Storage.prototype, "setItem");
    const fetch = vi.spyOn(globalThis, "fetch");
    render(<DsdDataQualityExample privacyFocus />);
    const consider = screen.getByRole("button", { name: "Consider this next step" });
    expect(consider).toHaveProperty("disabled", true);
    expect(screen.getByRole("table", { name: "Fictional reporting view with two rows withheld" })).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: /^Treat a completed record/ }));
    fireEvent.click(consider);
    expect(screen.getByText(/A completed record describes the system's activity/)).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: /^Compare the record pattern/ }));
    expect(screen.queryByText(/A completed record describes the system's activity/)).toBeNull();
    fireEvent.click(consider);
    expect(screen.getByText(/two kinds of evidence to examine together/)).toBeTruthy();
    expect(storage).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
  });
  it("compares the documentation journeys while preserving all three options and the owner's decision boundary", () => {
    render(<DsdPolicyBurdenMap />);
    expect(screen.getByRole("heading", { name: "Find and return a copy" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Alternative to examine" }));
    expect(screen.queryByRole("heading", { name: "Find and return a copy" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Check the evidence already held" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Alternative to examine" }).getAttribute("aria-pressed")).toBe("true");
    const table = screen.getByRole("table", { name: "Three options to take to the decision owner" });
    expect(within(table).getAllByRole("rowheader")).toHaveLength(3);
    expect(screen.getByText(/The policy owner determines the required analysis/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "New-copy proposal" }));
    expect(screen.getByRole("heading", { name: "Find and return a copy" })).toBeTruthy();
  });
});

describe("Leadership companion integration and verified reuse", () => {
  it.each(DEVELOPMENT_CAPABILITIES)("shows a worked map for $id without changing the learner's field values", capability => {
    render(<LeadershipDevelopmentStudio />);
    fireEvent.change(screen.getByLabelText("What would you like to develop?"), { target: { value: "My own goal" } });
    fireEvent.change(screen.getByRole("combobox", { name: "A DEIA capability to focus on" }), { target: { value: capability.id } });
    const summary = screen.getByText("See a fictional map for this capability");
    const example = summary.closest("details")!;
    fireEvent.click(summary);
    expect(example.open).toBe(true);
    expect(within(example).getAllByRole("term")).toHaveLength(6);
    expect(within(example).getAllByRole("definition").every(item => item.textContent!.length > 30)).toBe(true);
    expect(screen.getByLabelText("What would you like to develop?")).toHaveProperty("value", "My own goal");
  });
  it.each(DEVELOPMENT_ENTRIES)("retains the existing $id starting point and its actual teaching", entry => {
    render(<LeadershipDevelopmentStudio />);
    const entryButton = screen.getByRole("button", { name: new RegExp(entry.title) });
    fireEvent.click(entryButton);
    expect(entryButton.getAttribute("aria-pressed")).toBe("true");
    for (const paragraph of entry.teaching) expect(screen.getByText(paragraph)).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Make your development map" })).toBeTruthy();
  });
  it.each(LEADERSHIP_STAGES)("reuses the complete $id stage and creates a reflection with that stage's question and evidence", stage => {
    render(<LeadershipLifecycleExplorer initialStage={stage.id} />);
    expect(screen.getByRole("heading", { name: stage.title })).toBeTruthy();
    expect(screen.getByText(stage.question)).toBeTruthy();
    expect(screen.getByText(stage.scenario)).toBeTruthy();
    for (const practice of stage.practice) expect(screen.getByText(practice)).toBeTruthy();
    expect(screen.getByRole("link", { name: stage.resourceLabel + " →" }).getAttribute("href")).toBe(stage.resource);
    fireEvent.change(screen.getByLabelText("A practice I would like to try"), { target: { value: "My next step for " + stage.id } });
    fireEvent.click(screen.getByRole("button", { name: "Create my reflection" }));
    const draft = screen.getByText(/Leadership reflection:/).textContent;
    expect(draft).toContain(stage.title); expect(draft).toContain(stage.question); expect(draft).toContain(stage.evidence);
    expect(draft).toContain("My next step for " + stage.id);
  });
  it("keeps the continuity example separate from the learner's plan and its export", () => {
    render(<SuccessionPracticeTool />);
    const summary = screen.getByText("See a fictional handover and readiness check");
    fireEvent.click(summary);
    expect(summary.closest("details")!.open).toBe(true);
    const fields = ["What critical work needs continuity?", "Which capabilities and knowledge does it require?", "What development opportunity could colleagues access?"];
    fields.forEach((label, index) => fireEvent.change(screen.getByLabelText(label), { target: { value: "My own answer " + index } }));
    fireEvent.click(screen.getByRole("button", { name: "Create continuity plan" }));
    const draft = screen.getByText(/DSD continuity and development plan/).textContent;
    fields.forEach((_, index) => expect(draft).toContain("My own answer " + index));
    expect(draft).not.toContain("Prepare a monthly list");
  });
});
