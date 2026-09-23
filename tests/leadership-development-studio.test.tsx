// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { LeadershipDevelopmentStudio } from "@/components/leadership-development-studio";
import { LeadershipLifecycleExplorer } from "@/components/leadership-lifecycle-tools";
import { buildDevelopmentMap } from "@/lib/content/leadership-development";
afterEach(cleanup);
const fillRequired=()=>{
 fireEvent.change(screen.getByLabelText("What would you like to develop?"),{target:{value:"Facilitate equitable conversations"}});
 fireEvent.change(screen.getByLabelText("What opportunity will help you practice?"),{target:{value:"Co-lead a DSD Learning Lab"}});
 fireEvent.change(screen.getByLabelText("What would show useful growth?"),{target:{value:"Feedback changes the next invitation"}});
};
describe("DSD development pathways",()=>{
 it("keeps each starting point's notes while exploring another entry and clears outdated drafts on edit",()=>{
  render(<LeadershipDevelopmentStudio />);fillRequired();
  fireEvent.click(screen.getByRole("button",{name:"Create my development map"}));
  expect(screen.getByText(/My DSD leadership development map/).textContent).toContain("I want to explore leadership");
  fireEvent.click(screen.getByRole("button",{name:/Someone has encouraged me/}));
  expect((screen.getByLabelText("What would you like to develop?") as HTMLTextAreaElement).value).toBe("");
  expect(screen.queryByRole("button",{name:"Copy draft"})).toBeNull();
  fireEvent.click(screen.getByRole("button",{name:/I want to explore leadership/}));
  expect((screen.getByLabelText("What would you like to develop?") as HTMLTextAreaElement).value).toBe("Facilitate equitable conversations");
  expect(screen.getByRole("button",{name:"Copy draft"})).toBeTruthy();
  fireEvent.change(screen.getByLabelText("What would show useful growth?"),{target:{value:"Revised evidence"}});
  expect(screen.queryByRole("button",{name:"Copy draft"})).toBeNull();
 });
 it("builds the selected capability and after-practice learning into the map",()=>{
  render(<LeadershipDevelopmentStudio />);fillRequired();
  fireEvent.change(screen.getByRole("combobox",{name:"A DEIA capability to focus on"}),{target:{value:"continuity"}});
  fireEvent.change(screen.getByLabelText("What changed in your understanding?"),{target:{value:"The handover missed how exceptions are handled."}});
  fireEvent.click(screen.getByRole("button",{name:"Create my development map"}));
  const text=screen.getByText(/My DSD leadership development map/).textContent;
  expect(text).toContain("Share knowledge and build future capability");
  expect(text).toContain("The handover missed how exceptions are handled.");
  expect(text).toContain("proposals until agreed");
 });
 it("does not carry another entry's custom validation error into a populated map",()=>{
  render(<LeadershipDevelopmentStudio />);fillRequired();
  fireEvent.click(screen.getByRole("button",{name:/Someone has encouraged me/}));
  fireEvent.change(screen.getByLabelText("What would you like to develop?"),{target:{value:"   "}});
  expect((screen.getByLabelText("What would you like to develop?") as HTMLTextAreaElement).validity.customError).toBe(true);
  fireEvent.click(screen.getByRole("button",{name:/I want to explore leadership/}));
  expect((screen.getByLabelText("What would you like to develop?") as HTMLTextAreaElement).validity.valid).toBe(true);
 });
 it("shows a correction when a restored entry still contains whitespace",()=>{
  render(<LeadershipDevelopmentStudio />);fillRequired();
  fireEvent.change(screen.getByLabelText("What would you like to develop?"),{target:{value:"   "}});
  fireEvent.click(screen.getByRole("button",{name:/Someone has encouraged me/}));
  fireEvent.click(screen.getByRole("button",{name:/I want to explore leadership/}));
  fireEvent.click(screen.getByRole("button",{name:"Create my development map"}));
  expect((screen.getByLabelText("What would you like to develop?") as HTMLTextAreaElement).validity.customError).toBe(true);
  expect(screen.queryByRole("button",{name:"Copy draft"})).toBeNull();
 });
 it("does not turn blank required input or an unknown path into a fabricated plan",()=>{
  expect(buildDevelopmentMap("exploring","evidence",{goal:" ",practice:"Try",evidence:"Observe"})).toBeNull();
  expect(buildDevelopmentMap("unknown","evidence",{goal:"Learn",practice:"Try",evidence:"Observe"})).toBeNull();
 });
 it("opens a linked life-cycle stage and handles an unknown stage gracefully",()=>{
  const view=render(<LeadershipLifecycleExplorer initialStage="develop" />);
  expect(screen.getByRole("button",{name:"6. Mentor, sponsor, and develop"}).getAttribute("aria-pressed")).toBe("true");
  view.unmount();render(<LeadershipLifecycleExplorer initialStage="unknown" />);
  expect(screen.getByRole("button",{name:"1. Design the role and posting"}).getAttribute("aria-pressed")).toBe("true");
 });
});
