/**
 * Operational logging for hosted provider calls. Each failure log carries the
 * provider, the provider model id, the HTTP status, and a short redacted excerpt
 * of the provider's error body so an operator can tell a bad key from a bad
 * request shape. Credentials and staff content are never logged.
 */
const SECRET_PATTERN = /\b(?:sk|pplx|key)-[A-Za-z0-9_-]{8,}/g;

/** First 300 characters of a provider message, whitespace-collapsed, with any key-shaped token redacted. */
export function providerErrorExcerpt(text: unknown, limit = 300): string {
  const value = typeof text === "string" ? text : text instanceof Error ? text.message : text == null ? "" : String(text);
  return value.replace(/\s+/g, " ").replace(SECRET_PATTERN, "[redacted]").trim().slice(0, limit);
}

/** HTTP status carried by an SDK or adapter error, when present. */
export function errorStatus(error: unknown): number | undefined {
  return error && typeof error === "object" && "status" in error && typeof error.status === "number" ? error.status : undefined;
}

export type ProviderFailure = {
  provider: string;
  model: string;
  reason: string;
  status?: number;
  body?: string;
  trace_id?: string;
  detail?: Record<string, unknown>;
};

export function logProviderFailure(failure: ProviderFailure): void {
  const { detail, ...rest } = failure;
  console.error("provider_request_failed", { ...rest, ...(detail ?? {}) });
}
