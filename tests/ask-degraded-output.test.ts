import { describe, it } from "vitest";
import { expectStaffAskClosed } from "./helpers/staff-ask-closed";

describe("ASK degraded answering", () => {
  it("retires typed staff Ask fallbacks; staff Ask is browse-and-download only", async () => {
    await expectStaffAskClosed();
  });
});
