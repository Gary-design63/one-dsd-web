// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { LeadershipLifecycleExplorer, SuccessionPracticeTool } from "@/components/leadership-lifecycle-tools";
afterEach(cleanup);
describe("Leadership learning tools",()=>{
 it("carries a reflection into a draft and clears it when the learning stage changes",()=>{
 render(<LeadershipLifecycleExplorer />);
 fireEvent.click(screen.getByRole("button",{name:"3. Interview and assess fairly"}));
 fireEvent.change(screen.getByLabelText(/What am I learning/),{target:{value:"Eye contact is not evidence for my rating."}});
 fireEvent.change(screen.getByLabelText("A practice I would like to try"),{target:{value:"Explain ratings using the candidate answer."}});
 fireEvent.click(screen.getByRole("button",{name:"Create my reflection"}));
 expect(screen.getByText(/Leadership reflection:/).textContent).toContain("Eye contact is not evidence for my rating.");
 expect(screen.getByText(/Leadership reflection:/).textContent).toContain("\n\n");
 fireEvent.click(screen.getByRole("button",{name:"4. Welcome and orient"}));
 expect(screen.queryByRole("button",{name:"Copy draft"})).toBeNull();
 expect((screen.getByLabelText("A practice I would like to try") as HTMLTextAreaElement).value).toBe("");
 });
 it("keeps a continuity plan grounded in supplied work and opportunities without inventing commitments",()=>{
 render(<SuccessionPracticeTool />);
 fireEvent.change(screen.getByLabelText("What critical work needs continuity?"),{target:{value:"Monthly service guidance review"}});
 fireEvent.change(screen.getByLabelText("Which capabilities and knowledge does it require?"),{target:{value:"Interpret evidence and explain decisions"}});
 fireEvent.change(screen.getByLabelText("What development opportunity could colleagues access?"),{target:{value:"Co-lead a review with feedback"}});
 fireEvent.click(screen.getByRole("button",{name:"Create continuity plan"}));
 const draft=screen.getByText(/DSD continuity and development plan/).textContent;
 expect(draft).toContain("Co-lead a review with feedback");
 expect(draft).toContain("To agree with the people involved.");
 expect(draft).toContain("applicable selection process");
 fireEvent.change(screen.getByLabelText("What critical work needs continuity?"),{target:{value:"Different function"}});
 expect(screen.queryByRole("button",{name:"Download draft"})).toBeNull();
 });
 it("does not create a continuity draft from whitespace-only required input",()=>{
 render(<SuccessionPracticeTool />);
 fireEvent.change(screen.getByLabelText("What critical work needs continuity?"),{target:{value:"   "}});
 fireEvent.click(screen.getByRole("button",{name:"Create continuity plan"}));
 expect(screen.queryByText("Your draft")).toBeNull();
 });
});
