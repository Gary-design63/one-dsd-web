const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const DNS_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export const RESEARCH_USAGE_MODELS = new Set([
  "fixture/research-1",
  "perplexity-search",
  "fast",
  "low",
  "medium",
  "high",
]);

export function isOpaqueTraceId(value: unknown): value is string {
  return typeof value === "string" && UUID_V4.test(value);
}

export function assertOpaqueTraceId(value: unknown): asserts value is string {
  if (!isOpaqueTraceId(value)) throw new Error("Operational traces require an opaque UUID.");
}

export function isDnsHostname(value: unknown): value is string {
  if (typeof value !== "string" || value.length < 1 || value.length > 253 || value !== value.toLowerCase()) return false;
  const labels = value.endsWith(".") ? value.slice(0, -1).split(".") : value.split(".");
  return labels.length >= 2 && labels.every((label) => DNS_LABEL.test(label));
}

async function sha256(value: string): Promise<string> {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(value).digest("hex");
}

export async function opaqueProviderTraceId(value: string): Promise<string> {
  return `pth_${await sha256(value)}`;
}

export async function operationalResearchModel(value: string): Promise<string> {
  return RESEARCH_USAGE_MODELS.has(value) ? value : `msh_${await sha256(value)}`;
}

