import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

/**
 * API connections for the portable offline edition. The owner enters keys in
 * the Consultant Workspace; they are kept in a machine-local file outside the
 * application folder, and the offline launcher passes them to the server as
 * the same settings a hosted deployment uses. Keys are never sent back to the
 * browser, only whether each one is present and its last four characters.
 */
export const CONNECTOR_KEYS = ["anthropicApiKey", "openaiApiKey", "perplexityApiKey"] as const;
export type ConnectorKey = (typeof CONNECTOR_KEYS)[number];

const ApiKey = z.string().regex(/^[\x21-\x7e]{8,400}$/);

export const ConnectorSettingsSchema = z.object({
  version: z.literal(1),
  generativePilot: z.enum(["on", "off"]),
  researchEnabled: z.enum(["on", "off"]),
  researchMonthlyUsdCap: z.string().regex(/^(?:0|[1-9][0-9]{0,4})(?:\.[0-9]{1,2})?$/),
  anthropicApiKey: ApiKey.or(z.literal("")),
  openaiApiKey: ApiKey.or(z.literal("")),
  perplexityApiKey: ApiKey.or(z.literal("")),
  updatedAt: z.string().nullable(),
}).strict();
export type ConnectorSettings = z.infer<typeof ConnectorSettingsSchema>;

export const EMPTY_CONNECTOR_SETTINGS: ConnectorSettings = {
  version: 1,
  generativePilot: "off",
  researchEnabled: "off",
  researchMonthlyUsdCap: "0",
  anthropicApiKey: "",
  openaiApiKey: "",
  perplexityApiKey: "",
  updatedAt: null,
};

export type ConnectorStatus = {
  generativePilot: "on" | "off";
  researchEnabled: "on" | "off";
  researchMonthlyUsdCap: string;
  keys: Record<ConnectorKey, { present: boolean; lastFour: string | null }>;
  updatedAt: string | null;
};

export async function readConnectorSettings(file: string): Promise<ConnectorSettings> {
  let text: string;
  try {
    text = await readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { ...EMPTY_CONNECTOR_SETTINGS };
    throw error;
  }
  return ConnectorSettingsSchema.parse(JSON.parse(text));
}

export function connectorStatus(settings: ConnectorSettings): ConnectorStatus {
  const keys = Object.fromEntries(CONNECTOR_KEYS.map((key) => {
    const value = settings[key];
    return [key, { present: value.length > 0, lastFour: value ? value.slice(-4) : null }];
  })) as ConnectorStatus["keys"];
  return {
    generativePilot: settings.generativePilot,
    researchEnabled: settings.researchEnabled,
    researchMonthlyUsdCap: settings.researchMonthlyUsdCap,
    keys,
    updatedAt: settings.updatedAt,
  };
}

/** Owner-facing wording for each problem; routes pass only the code in the URL. */
export const CONNECTOR_ERRORS = {
  cap: "Enter the monthly research limit as a dollar amount, such as 25 or 25.50.",
  key: "An API key looks incomplete. Paste the whole key, without spaces, and try again.",
  ai_key_needed: "Add an Anthropic or OpenAI key before turning on AI answers.",
  research_key_needed: "Add a Perplexity key before turning on external research.",
  request: "That request could not be read. Please try again.",
  unreadable: "The saved connections could not be read. Enter them again to replace them.",
  unsaved: "The connections could not be saved on this computer. Please try again.",
} as const;
export type ConnectorErrorCode = keyof typeof CONNECTOR_ERRORS;

export type ConnectorUpdate =
  | { ok: true; settings: ConnectorSettings }
  | { ok: false; code: ConnectorErrorCode };

/**
 * Apply a submitted form. A blank key field keeps the saved key; the matching
 * "remove" checkbox clears it. Toggles and the research cap are replaced.
 */
export function applyConnectorForm(current: ConnectorSettings, form: URLSearchParams, now = new Date()): ConnectorUpdate {
  const next: ConnectorSettings = { ...current };
  for (const name of ["generativePilot", "researchEnabled"] as const) {
    next[name] = form.get(name) === "on" ? "on" : "off";
  }
  const cap = (form.get("researchMonthlyUsdCap") ?? "").trim() || "0";
  if (!ConnectorSettingsSchema.shape.researchMonthlyUsdCap.safeParse(cap).success) {
    return { ok: false, code: "cap" };
  }
  next.researchMonthlyUsdCap = cap;
  for (const key of CONNECTOR_KEYS) {
    if (form.get(`remove_${key}`) === "on") {
      next[key] = "";
      continue;
    }
    const entered = (form.get(key) ?? "").trim();
    if (!entered) continue;
    if (!ApiKey.safeParse(entered).success) {
      return { ok: false, code: "key" };
    }
    next[key] = entered;
  }
  if (next.generativePilot === "on" && !next.anthropicApiKey && !next.openaiApiKey) {
    return { ok: false, code: "ai_key_needed" };
  }
  if (next.researchEnabled === "on" && !next.perplexityApiKey) {
    return { ok: false, code: "research_key_needed" };
  }
  next.updatedAt = now.toISOString();
  return { ok: true, settings: ConnectorSettingsSchema.parse(next) };
}

/** Write atomically so the launcher never reads a half-written file. */
export async function writeConnectorSettings(file: string, settings: ConnectorSettings): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(settings, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
}
