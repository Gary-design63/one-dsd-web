import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET as ownerHandoff } from "@/app/api/offline/owner/route";
import { POST as saveConnectors } from "@/app/api/offline/connectors/route";
import { issueSessionCookieValue, isOwnerSession, OWNER_COOKIE } from "@/lib/auth/owner";
import {
  applyConnectorForm,
  connectorStatus,
  EMPTY_CONNECTOR_SETTINGS,
  readConnectorSettings,
} from "@/lib/offline/connectors";
import { isLoopbackHost, offlineConnectorsFile, offlineHandoffToken, offlineShareOrigin } from "@/lib/offline/mode";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";

const TOKEN = "offline-handoff-token-with-at-least-32-bytes";
const NAMES = ["PAC_OFFLINE_MODE", "PAC_OFFLINE_HANDOFF_TOKEN", "PAC_OFFLINE_CONNECTORS_FILE", "PAC_OFFLINE_SHARE_ORIGIN", "PAC_OWNER_KEY", "PAC_DATA_ENV"] as const;
const original = Object.fromEntries(NAMES.map((name) => [name, process.env[name]]));
let directory = "";

beforeEach(() => {
  resetStoreForTests();
  directory = mkdtempSync(path.join(tmpdir(), "pac-offline-"));
  process.env.PAC_OFFLINE_MODE = "on";
  process.env.PAC_OFFLINE_HANDOFF_TOKEN = TOKEN;
  process.env.PAC_OFFLINE_CONNECTORS_FILE = path.join(directory, "connectors.json");
  process.env.PAC_OWNER_KEY = "offline-owner-test-key-with-32-bytes-minimum";
  process.env.PAC_DATA_ENV = "local";
});

afterEach(() => {
  for (const name of NAMES) {
    if (original[name] === undefined) delete process.env[name];
    else process.env[name] = original[name];
  }
  rmSync(directory, { recursive: true, force: true });
});

describe("offline edition switches", () => {
  it("stay inert unless the launcher turns offline mode on", () => {
    const hosted = { PAC_OFFLINE_HANDOFF_TOKEN: TOKEN, PAC_OFFLINE_CONNECTORS_FILE: "x.json", PAC_OFFLINE_SHARE_ORIGIN: "http://office-pc:3100" };
    expect(offlineHandoffToken(hosted)).toBeNull();
    expect(offlineConnectorsFile(hosted)).toBeNull();
    expect(offlineShareOrigin(hosted)).toBeNull();
    expect(offlineHandoffToken({ PAC_OFFLINE_MODE: "on", PAC_OFFLINE_HANDOFF_TOKEN: "too-short" })).toBeNull();
  });

  it("accepts only a bare http(s) share origin", () => {
    expect(offlineShareOrigin({ PAC_OFFLINE_MODE: "on", PAC_OFFLINE_SHARE_ORIGIN: "http://office-pc:3100" })).toBe("http://office-pc:3100");
    expect(offlineShareOrigin({ PAC_OFFLINE_MODE: "on", PAC_OFFLINE_SHARE_ORIGIN: "http://office-pc:3100/path" })).toBeNull();
    expect(offlineShareOrigin({ PAC_OFFLINE_MODE: "on", PAC_OFFLINE_SHARE_ORIGIN: "javascript:alert(1)" })).toBeNull();
  });

  it("recognizes only this computer's own addresses", () => {
    for (const host of ["localhost:3100", "127.0.0.1:3100", "[::1]:3100", "LOCALHOST"]) expect(isLoopbackHost(host)).toBe(true);
    for (const host of ["office-pc:3100", "10.0.0.5:3100", "localhost.example.com", null]) expect(isLoopbackHost(host)).toBe(false);
  });
});

describe("owner handoff", () => {
  const request = (token: string, host = "localhost:3100") =>
    new NextRequest(`http://${host}/api/offline/owner?token=${encodeURIComponent(token)}`, { headers: { host } });

  it("opens the workspace with a valid owner session for the launcher's token", async () => {
    const response = await ownerHandoff(request(TOKEN));
    expect(response.status).toBe(303);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/consultant");
    const cookie = response.cookies.get(OWNER_COOKIE);
    expect(cookie?.httpOnly).toBe(true);
    expect(isOwnerSession(cookie?.value)).toBe(true);
  });

  it("refuses a wrong token, another computer, and hosted deployments", async () => {
    expect((await ownerHandoff(request("wrong-token-wrong-token-wrong-token-00"))).status).toBe(403);
    expect((await ownerHandoff(request(TOKEN, "office-pc:3100"))).status).toBe(404);
    delete process.env.PAC_OFFLINE_MODE;
    const hosted = await ownerHandoff(request(TOKEN));
    expect(hosted.status).toBe(404);
    expect(hosted.cookies.get(OWNER_COOKIE)).toBeUndefined();
  });
});

describe("API connections", () => {
  const form = (fields: Record<string, string>) => new URLSearchParams(fields);

  it("keeps a saved key when the field is left blank and clears it on request", () => {
    const first = applyConnectorForm(EMPTY_CONNECTOR_SETTINGS, form({ generativePilot: "on", anthropicApiKey: "sk-ant-abcdef123456" }));
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const kept = applyConnectorForm(first.settings, form({ generativePilot: "on" }));
    expect(kept.ok && kept.settings.anthropicApiKey).toBe("sk-ant-abcdef123456");
    const removed = applyConnectorForm(first.settings, form({ remove_anthropicApiKey: "on" }));
    expect(removed.ok && removed.settings.anthropicApiKey).toBe("");
    expect(connectorStatus(first.settings).keys.anthropicApiKey).toEqual({ present: true, lastFour: "3456" });
    expect(JSON.stringify(connectorStatus(first.settings))).not.toContain("sk-ant-abcdef123456");
  });

  it("requires a matching key before a service is turned on", () => {
    expect(applyConnectorForm(EMPTY_CONNECTOR_SETTINGS, form({ generativePilot: "on" }))).toEqual({ ok: false, code: "ai_key_needed" });
    expect(applyConnectorForm(EMPTY_CONNECTOR_SETTINGS, form({ researchEnabled: "on" }))).toEqual({ ok: false, code: "research_key_needed" });
    expect(applyConnectorForm(EMPTY_CONNECTOR_SETTINGS, form({ researchMonthlyUsdCap: "lots" }))).toEqual({ ok: false, code: "cap" });
    expect(applyConnectorForm(EMPTY_CONNECTOR_SETTINGS, form({ perplexityApiKey: "has space in it" }))).toEqual({ ok: false, code: "key" });
  });

  it("saves only for the signed-in owner on this computer", async () => {
    const post = (cookie: string | null, host = "localhost:3100") => new NextRequest(`http://${host}/api/offline/connectors`, {
      method: "POST",
      headers: {
        host,
        origin: `http://${host}`,
        "content-type": "application/x-www-form-urlencoded",
        ...(cookie ? { cookie: `${OWNER_COOKIE}=${cookie}` } : {}),
      },
      body: "researchEnabled=on&perplexityApiKey=pplx-1234567890&researchMonthlyUsdCap=25",
    });
    expect((await saveConnectors(post(null))).status).toBe(401);
    const session = issueSessionCookieValue()!;
    expect((await saveConnectors(post(session, "office-pc:3100"))).status).toBe(404);
    const saved = await saveConnectors(post(session));
    expect(saved.status).toBe(303);
    expect(new URL(saved.headers.get("location")!).searchParams.get("saved")).toBe("1");
    const stored = await readConnectorSettings(process.env.PAC_OFFLINE_CONNECTORS_FILE!);
    expect(stored).toMatchObject({ researchEnabled: "on", perplexityApiKey: "pplx-1234567890", researchMonthlyUsdCap: "25" });
    expect(readFileSync(process.env.PAC_OFFLINE_CONNECTORS_FILE!, "utf8")).toContain("\"version\": 1");
  });
});
