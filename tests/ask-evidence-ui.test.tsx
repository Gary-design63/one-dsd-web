import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StaffAskBrowse } from "@/components/staff-ask-browse";
import { staffAskTopics } from "@/lib/content/staff-ask-topics";
import { expectStaffAskClosed } from "./helpers/staff-ask-closed";

describe("staff Ask evidence presentation", () => {
  it("does not mount AskClient or a typed evidence composer", async () => {
    await expectStaffAskClosed();
    const html = renderToStaticMarkup(<StaffAskBrowse topics={staffAskTopics()} initialTopicId="gp-1" />);
    expect(html).toContain("Published answer");
    expect(html).not.toContain("Passages and interpretation");
    expect(html).not.toContain("<textarea");
    expect(html).not.toContain("Get an answer");
  });
});
