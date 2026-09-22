import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/consultant/editing/route";
import { EDITING_COOKIE, editingModeFromCookies } from "@/lib/auth/request";
import { issueSessionCookieValue, OWNER_COOKIE } from "@/lib/auth/owner";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";

const { cookieStore } = vi.hoisted(() => ({ cookieStore: { value: undefined as string | undefined } }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: (name: string) => name === EDITING_COOKIE && cookieStore.value ? { value: cookieStore.value } : undefined }) }));

const ORIGINAL_OWNER_KEY = process.env.PAC_OWNER_KEY;
const ORIGINAL_DATA_ENV = process.env.PAC_DATA_ENV;

beforeEach(() => {
  resetStoreForTests();
  process.env.PAC_OWNER_KEY = "editing-mode-test-owner-key-32bytes";
  process.env.PAC_DATA_ENV = "local";
});

afterEach(() => {
  cookieStore.value = undefined;
  if (ORIGINAL_OWNER_KEY === undefined) delete process.env.PAC_OWNER_KEY;
  else process.env.PAC_OWNER_KEY = ORIGINAL_OWNER_KEY;
  if (ORIGINAL_DATA_ENV === undefined) delete process.env.PAC_DATA_ENV;
  else process.env.PAC_DATA_ENV = ORIGINAL_DATA_ENV;
});

function ownerRequest(url: string) {
  const token = issueSessionCookieValue();
  if (!token) throw new Error("Owner test session was not created.");
  return new NextRequest(url, { headers: { cookie: `${OWNER_COOKIE}=${token}` } });
}

describe("editing mode for the page editors", () => {
  it("is off for everyone until the owner turns it on for this browser", async () => {
    expect(await editingModeFromCookies()).toBe(false);
    cookieStore.value = "on";
    expect(await editingModeFromCookies()).toBe(true);
    cookieStore.value = "yes";
    expect(await editingModeFromCookies()).toBe(false);
  });

  it("does not turn editing on without an owner session", async () => {
    const response = await GET(new NextRequest("http://local/api/consultant/editing?mode=on&next=/about"));
    expect(response.status).toBe(401);
    expect(response.cookies.get(EDITING_COOKIE)).toBeUndefined();
  });

  it("turns editing on with a short-lived cookie and returns to the page the owner came from", async () => {
    const response = await GET(ownerRequest("http://local/api/consultant/editing?mode=on&next=/about"));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("http://local/about");
    const cookie = response.cookies.get(EDITING_COOKIE);
    expect(cookie?.value).toBe("on");
    expect(cookie?.maxAge).toBe(60 * 60 * 12);
  });

  it("turns editing off and refuses to redirect away from the program", async () => {
    const response = await GET(new NextRequest("http://local/api/consultant/editing?mode=off&next=//evil.example/x"));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("http://local/");
    expect(response.cookies.get(EDITING_COOKIE)?.maxAge).toBe(0);
  });
});
