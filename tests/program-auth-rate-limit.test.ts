import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { consumePseudonymousLimit, consumeRequestLimit } from "@/lib/security/rate-limit";
import { getStore, resetStoreForTests } from "@/lib/intelligence/memory/store";
const options = { scope: "program-login-account", limit: 10, windowSeconds: 900 };
beforeEach(() => { resetStoreForTests(); });
afterEach(() => vi.restoreAllMocks());
it("stores only pseudonymous target hashes while enforcing the exact account threshold", async () => {
  const spy = vi.spyOn(getStore(), "consumeRateLimit");
  for (let n=0;n<10;n++) expect((await consumePseudonymousLimit("synthetic.colleague", options)).allowed).toBe(true);
  expect((await consumePseudonymousLimit("synthetic.colleague", options)).allowed).toBe(false);
  expect(spy.mock.calls[0]).toEqual([options.scope, expect.stringMatching(/^[a-f0-9]{64}$/), 10, 900]);
  expect(JSON.stringify(spy.mock.calls)).not.toContain("synthetic.colleague");
  const firstHash=spy.mock.calls[0][1];
  await consumePseudonymousLimit("another.colleague", options);
  expect(spy.mock.lastCall![1]).not.toBe(firstHash);
});
it("preserves old finite scopes and accepts only the four exact new authentication limits", async () => {
  const request = new NextRequest("http://localhost/api/contribute/login");
  for (const [scope,limit,windowSeconds] of [
    ["program-login-network",40,900],["program-login-account",10,900],
    ["program-invitation-network",20,900],["program-invitation-code",10,900],
    ["staff-ask",30,600],["staff-program-outcome",10,600],["owner-login",10,900],
    ["consultation-intake",20,3600],["consultation-tracking",20,600],
  ] as const) expect((await consumeRequestLimit(request,{scope,limit,windowSeconds})).allowed).toBe(true);
  await expect(consumePseudonymousLimit("synthetic", { ...options, limit: 11 })).rejects.toThrow();
  await expect(consumePseudonymousLimit("synthetic", { ...options, scope: "unregistered-auth" })).rejects.toThrow();
});
it.each(["", "x".repeat(513), "contains\0null"])("rejects unbounded or ambiguous target identifiers", async subject => {
  const spy=vi.spyOn(getStore(),"consumeRateLimit");
  await expect(consumePseudonymousLimit(subject,options)).rejects.toThrow();
  expect(spy).not.toHaveBeenCalled();
});
