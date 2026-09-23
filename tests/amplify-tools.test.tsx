// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AmplifyActivityStudio, AmplifyConversationTool } from "@/components/amplify-tools";
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
describe("Amplify tools", () => {
  it("builds a staff idea without claiming it was sent, and invalidates an outdated draft", () => {
    render(<AmplifyConversationTool mode="idea" />);
    fireEvent.change(screen.getByLabelText("What are you noticing?"), {target:{value:"Meeting papers arrive too late."}});
    fireEvent.change(screen.getByLabelText("Who could benefit, and what difference could it make?"), {target:{value:"Colleagues would have more time to prepare."}});
    fireEvent.click(screen.getByRole("button",{name:"Create my brief"}));
    expect(screen.getByText(/What I am noticing/).textContent).toContain("Meeting papers arrive too late.");
    expect(screen.getByText(/What I am noticing/).textContent).toContain("I would welcome help exploring possible approaches.");
    expect(screen.getByText(/Nothing is sent/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText("What are you noticing?"),{target:{value:"Updated idea"}});
    expect(screen.queryByRole("button",{name:"Copy draft"})).toBeNull();
  });
  it("reports a clipboard failure honestly and retains the draft", async () => {
    Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:vi.fn().mockRejectedValue(new Error("denied"))}});
    render(<AmplifyConversationTool mode="mentoring" />);
    fireEvent.change(screen.getByLabelText("What would you like help exploring?"),{target:{value:"Learning facilitation"}});
    fireEvent.change(screen.getByLabelText("What would make the conversation useful to you?"),{target:{value:"A practical example"}});
    fireEvent.click(screen.getByRole("button",{name:"Create my conversation outline"}));
    fireEvent.click(screen.getByRole("button",{name:"Copy draft"}));
    expect(await screen.findByText(/Copy is unavailable here/)).toBeTruthy();
    expect(screen.getByRole("button",{name:"Download draft"})).toBeTruthy();
  });
  it("filters activities and creates an invitation without inventing event details", () => {
    render(<AmplifyActivityStudio />);
    fireEvent.click(screen.getByRole("button",{name:"Grow"}));
    expect(screen.queryByRole("button",{name:"Explore a little joy"})).toBeNull();
    expect(screen.getByRole("button",{name:"Explore opportunity exchange"})).toBeTruthy();
    fireEvent.click(screen.getByRole("button",{name:"Create invitation and plan"}));
    expect(screen.getByText(/You're invited:/).textContent).toContain("Time and joining details: to be arranged.");
  });
});

