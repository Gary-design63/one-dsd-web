import { readFileSync } from "node:fs";
import path from "node:path";
import { expect } from "vitest";
import { POST as postAsk } from "@/app/api/ask/route";
import { PRIVACY_NOTICE } from "@/lib/constants";
import { STAFF_WRITE_CLOSED_CODE, STAFF_WRITE_CLOSED_MESSAGE } from "@/lib/product/staff-lock";

/** Staff Ask is browse-and-download only. Typed AskClient / localStorage suites are retired. */
export async function expectStaffAskClosed() {
  const response = await postAsk();
  expect(response.status).toBe(403);
  expect(await response.json()).toEqual({
    error: STAFF_WRITE_CLOSED_MESSAGE,
    code: STAFF_WRITE_CLOSED_CODE,
  });
  const page = readFileSync(path.join(process.cwd(), "app/ask/page.tsx"), "utf8");
  expect(page).toContain("StaffAskBrowse");
  expect(page).not.toContain("AskClient");
  expect(page).not.toContain("localStorage");
  expect(page).not.toContain("BROWSER_STORAGE_KEYS");
  expect(PRIVACY_NOTICE.ask).toMatch(/browse and download only/i);
  expect(PRIVACY_NOTICE.ask).toMatch(/does not send typed questions/i);
  expect(PRIVACY_NOTICE.ask).not.toMatch(/Perplexity|provider|API|model/i);
}
