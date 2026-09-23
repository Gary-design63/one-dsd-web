import { describe, expect, it } from "vitest";
import { PRIVACY_NOTICE } from "@/lib/constants";
import { expectStaffAskClosed } from "./helpers/staff-ask-closed";

describe("Ask research choices", () => {
  it("states that staff Ask does not send typed questions outside the program", async () => {
    await expectStaffAskClosed();
    expect(PRIVACY_NOTICE.ask).toMatch(/names.*case details.*medical or personnel information.*confidential material/i);
    expect(PRIVACY_NOTICE.ask).not.toMatch(/only the question you type is sent to an outside research service/i);
  });
});
