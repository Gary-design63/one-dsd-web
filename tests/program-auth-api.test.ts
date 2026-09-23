import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ active: true, signIn: vi.fn(), accept: vi.fn(), signOut: vi.fn(), configured: true, network: vi.fn(), target: vi.fn() }));
vi.mock("@/lib/auth/protected-feature-activation", () => ({ protectedFeatureActivation: () => ({ active: mocks.active }) }));
vi.mock("@/lib/auth/program-identity", () => ({
  PROGRAM_SESSION_COOKIE: "pac_program_session", PROGRAM_SESSION_SECONDS: 28800,
  programIdentityConfigured: () => mocks.configured,
  programIdentityStore: () => ({ signIn: mocks.signIn, acceptInvitation: mocks.accept, signOut: mocks.signOut }),
}));
vi.mock("@/lib/security/rate-limit", () => ({
  consumeRequestLimit: mocks.network, consumePseudonymousLimit: mocks.target,
  rateLimitHeaders: () => ({ "cache-control": "no-store", "retry-after": "60" }),
}));
import { POST as login } from "@/app/api/contribute/login/route";
import { POST as accept } from "@/app/api/contribute/accept/route";
import { POST as logout } from "@/app/api/contribute/logout/route";
import { programSessionCookieOptions } from "@/lib/auth/program-cookie";
import { PassphrasePolicyError, ProgramCredentialCapacityError } from "@/lib/auth/program-credentials";
const phrase = "A careful river has 27 stones.";
const loginBody = { signInId: "named.colleague", passphrase: phrase };
const acceptBody = { invitationCode: "a".repeat(43), passphrase: phrase, confirmPassphrase: phrase };
function request(endpoint: string, body: Record<string, string> | URLSearchParams = {}, origin = "https://program.example", token?: string) {
  return new NextRequest("https://program.example/api/contribute/" + endpoint, { method: "POST",
    headers: { origin, "content-type": "application/x-www-form-urlencoded", ...(token ? { cookie: "pac_program_session=" + token + "; pac_owner=unchanged" } : {}) },
    body: body instanceof URLSearchParams ? body : new URLSearchParams(body),
  });
}
beforeEach(() => {
  vi.resetAllMocks(); mocks.active = true; mocks.configured = true;
  mocks.network.mockResolvedValue({ allowed: true }); mocks.target.mockResolvedValue({ allowed: true });
  mocks.signIn.mockResolvedValue({ token: "s".repeat(43) }); mocks.accept.mockResolvedValue({ token: "t".repeat(43) }); mocks.signOut.mockResolvedValue(undefined);
});
afterEach(() => vi.unstubAllEnvs());
describe("named contributor sign-in boundaries", () => {
  it.each([["login", login, loginBody], ["accept", accept, acceptBody], ["logout", logout, {}]] as const)("rejects cross-origin %s without doing credential work", async (endpoint, handler, body) => {
    const response = await handler(request(endpoint, body, "https://outside.example", "s".repeat(43)));
    expect(response.status).toBe(403); expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.signIn).not.toHaveBeenCalled(); expect(mocks.accept).not.toHaveBeenCalled(); expect(mocks.signOut).not.toHaveBeenCalled();
  });
  it.each([["login", login, loginBody], ["accept", accept, acceptBody]] as const)("keeps %s inactive before configured activation", async (endpoint, handler, body) => {
    mocks.active = false;
    expect((await handler(request(endpoint, body))).status).toBe(503);
    expect(mocks.network).not.toHaveBeenCalled(); expect(mocks.signIn).not.toHaveBeenCalled(); expect(mocks.accept).not.toHaveBeenCalled();
  });
  it("uses both network and normalized account limits before sign-in", async () => {
    const response = await login(request("login", { ...loginBody, signInId: "  Named.Colleague  " }));
    expect(response.status).toBe(303);
    expect(mocks.network).toHaveBeenCalledWith(expect.anything(), { scope: "program-login-network", limit: 40, windowSeconds: 900 });
    expect(mocks.target).toHaveBeenCalledWith("named.colleague", { scope: "program-login-account", limit: 10, windowSeconds: 900 });
    expect(mocks.signIn).toHaveBeenCalledWith("  Named.Colleague  ", phrase);
    expect(response.headers.get("location")).toBe("https://program.example/contribute");
    expect(response.headers.get("set-cookie")).toContain("pac_program_session=");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("SameSite=strict");
    expect(response.headers.get("set-cookie")).not.toContain("pac_owner");
  });
  it("sets only the named cookie on accepted invitation", async () => {
    const response = await accept(request("accept", acceptBody));
    expect(response.status).toBe(303); expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.target).toHaveBeenCalledWith(acceptBody.invitationCode, { scope: "program-invitation-code", limit: 10, windowSeconds: 900 });
    expect(mocks.network).toHaveBeenCalledWith(expect.anything(), { scope: "program-invitation-network", limit: 20, windowSeconds: 900 });
    expect(mocks.accept).toHaveBeenCalledWith(acceptBody.invitationCode, phrase);
    expect(response.headers.get("set-cookie")).toContain("pac_program_session=");
    expect(response.headers.get("location")).not.toContain(acceptBody.invitationCode);
  });
  it.each([["login", login, loginBody], ["accept", accept, acceptBody]] as const)("stops %s on either limit and on limiter failure", async (endpoint, handler, body) => {
    mocks.network.mockResolvedValueOnce({ allowed: false });
    expect((await handler(request(endpoint, body))).status).toBe(429);
    expect(mocks.target).not.toHaveBeenCalled();
    mocks.target.mockResolvedValueOnce({ allowed: false });
    const targetLimit = await handler(request(endpoint, body));
    expect(targetLimit.status).toBe(429); expect(targetLimit.headers.get("retry-after")).toBe("60");
    mocks.network.mockRejectedValueOnce(Error("Synthetic limiter unavailable"));
    expect((await handler(request(endpoint, body))).status).toBe(503);
    expect(mocks.signIn).not.toHaveBeenCalled(); expect(mocks.accept).not.toHaveBeenCalled();
  });
  it.each([["login", login, loginBody], ["accept", accept, acceptBody]] as const)("rejects oversized and duplicate-field %s input", async (endpoint, handler, body) => {
    expect((await handler(request(endpoint, { ...body, extra: "x".repeat(5000) }))).status).toBe(413);
    const duplicate = new URLSearchParams(body); duplicate.append("passphrase", "another passphrase");
    expect((await handler(request(endpoint, duplicate))).status).toBe(400);
    expect(mocks.signIn).not.toHaveBeenCalled(); expect(mocks.accept).not.toHaveBeenCalled();
  });
  it("gives one generic sign-in refusal without reflecting identifiers or secrets", async () => {
    mocks.signIn.mockResolvedValueOnce(null);
    const response = await login(request("login", loginBody));
    expect(response.status).toBe(303); expect(response.headers.get("location")).toBe("https://program.example/contribute?denied=1");
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(await response.text()).not.toContain(phrase);
    mocks.signIn.mockRejectedValueOnce(Error("internal credential store details"));
    const failed = await login(request("login", loginBody));
    expect(failed.status).toBe(503); expect(await failed.text()).not.toContain("internal credential");
  });
  it("separates confirmation/policy/capacity failures without exposing invitation secrets", async () => {
    expect((await accept(request("accept", { ...acceptBody, confirmPassphrase: "Different phrase." }))).status).toBe(422);
    expect(mocks.accept).not.toHaveBeenCalled();
    mocks.accept.mockRejectedValueOnce(new PassphrasePolicyError("too_short"));
    expect((await accept(request("accept", acceptBody))).status).toBe(422);
    mocks.accept.mockRejectedValueOnce(new ProgramCredentialCapacityError());
    expect((await accept(request("accept", acceptBody))).status).toBe(503);
    mocks.accept.mockRejectedValueOnce(Error("private database reason"));
    const failed = await accept(request("accept", acceptBody));
    expect(failed.headers.get("location")).toBe("https://program.example/contribute/accept?denied=1");
    expect(await failed.text()).not.toContain("private database");
  });
  it("allows sign-out while sign-in is inactive and never touches the owner cookie", async () => {
    mocks.active = false;
    const response = await logout(request("logout", {}, "https://program.example", "s".repeat(43)));
    expect(mocks.signOut).toHaveBeenCalledWith("s".repeat(43));
    expect(response.headers.get("set-cookie")).toContain("pac_program_session=");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(response.headers.get("set-cookie")).not.toContain("pac_owner");
  });
  it("clears the browser bearer and truthfully flags failure to revoke the server session", async () => {
    mocks.signOut.mockRejectedValueOnce(Error("Synthetic unavailable"));
    const response = await logout(request("logout", {}, "https://program.example", "s".repeat(43)));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://program.example/contribute?signout=local_only");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });
  it("keeps deployed contributor cookies secure, strict and separate", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(programSessionCookieOptions()).toEqual({ httpOnly: true, sameSite: "strict", secure: true, path: "/", maxAge: 28800 });
    expect(programSessionCookieOptions(0).maxAge).toBe(0);
    vi.stubEnv("NODE_ENV", "test"); vi.stubEnv("VERCEL", "1");
    expect(programSessionCookieOptions().secure).toBe(true);
  });
});

it("reports browser-only sign-out when revocation configuration is unavailable", async () => { mocks.configured=false; const response=await logout(request("logout", {}, "https://program.example", "s".repeat(43))); expect(response.headers.get("location")).toBe("https://program.example/contribute?signout=local_only"); expect(response.headers.get("set-cookie")).toContain("Max-Age=0"); expect(mocks.signOut).not.toHaveBeenCalled(); });
