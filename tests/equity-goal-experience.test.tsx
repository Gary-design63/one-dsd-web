// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { EquityGoalExperience } from "@/components/equity-goal-experience";
import model from "@/lib/program/equity-goals.json";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it("keeps all six goals visible while filtering only released resource connections", () => {
  const one = model.goals[0].resources[0];
  render(<EquityGoalExperience resourceLinks={[{...one, title: "Released canvas"}]} linkPrefix="#" />);
  expect(screen.getByRole("heading", { name: "Six goals. Practical decisions. Supported action." }).style.color).toBe("rgb(255, 255, 255)");
  for (const goal of model.goals) expect(screen.getByRole("heading", { name: goal.title })).toBeDefined();
  expect(screen.getByRole("link", { name: "Released canvas" }).getAttribute("href")).toBe(`#${one.href}`);
  expect(screen.queryByRole("link", { name: model.goals[0].resources[1].title })).toBeNull();
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "6" } });
  expect(screen.queryByRole("link", { name: "Released canvas" })).toBeNull();
  for (const goal of model.goals) expect(screen.getByRole("heading", { name: goal.title })).toBeDefined();
});

it("limits selection to three, retains deselected notes, exports without network or storage, and confirms clearing", async () => {
  let exported: Blob | undefined;
  Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn((blob: Blob) => { exported = blob; return "blob:goal-plan"; }) });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  const network = vi.fn(); vi.stubGlobal("fetch", network);
  const storage = vi.spyOn(Storage.prototype, "setItem");
  render(<EquityGoalExperience scope="one-dhs" />);
  const boxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
  const download = screen.getByRole("button", { name: "Export three-goal plan (.md)" }) as HTMLButtonElement;
  expect(download.disabled).toBe(true);
  fireEvent.click(boxes[0]);
  fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "Review application burden <script>not executed</script>" } });
  fireEvent.click(boxes[1]); fireEvent.click(boxes[2]);
  expect(boxes[3].disabled).toBe(true);
  expect(download.disabled).toBe(false);
  fireEvent.click(boxes[0]); fireEvent.click(boxes[0]);
  expect((screen.getAllByRole("textbox")[0] as HTMLTextAreaElement).value).toContain("Review application burden");
  fireEvent.click(download);
  expect(exported).toBeDefined();
  const text = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsText(exported!); });
  expect(text).toContain("One DHS People, Access and Culture");
  expect(text.match(/^## Goal /gm)).toHaveLength(3);
  expect(text).toContain("Review application burden");
  expect(text).toContain("not submitted, approved or a completed equity analysis");
  expect(network).not.toHaveBeenCalled(); expect(storage).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Clear all plan notes and selections" }));
  fireEvent.click(screen.getByRole("button", { name: "Keep my draft" }));
  expect(boxes[0].checked).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Clear all plan notes and selections" }));
  fireEvent.click(screen.getByRole("button", { name: "Yes, clear this draft" }));
  expect(boxes.every(box => !box.checked)).toBe(true);
  fireEvent.click(boxes[0]);
  expect((screen.getAllByRole("textbox")[0] as HTMLTextAreaElement).value).toBe("");
});
