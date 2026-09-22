type MutationRequest = Pick<Request, "headers" | "url">;

function parseOrigin(value: string): string | null {
  if (!value || value === "null" || value !== value.trim() || value.includes(",")) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) return null;
    if (value !== parsed.origin) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

function parseHost(value: string | null): string | null {
  if (!value || value !== value.trim() || value.includes(",") || /[\\/\\?#@]/.test(value)) return null;
  try {
    const parsed = new URL(`http://${value}`);
    if (parsed.pathname !== "/" || parsed.search || parsed.hash || parsed.username || parsed.password) return null;
    return parsed.host;
  } catch {
    return null;
  }
}

function parseForwardedProtocol(value: string | null): "http:" | "https:" | null {
  if (value === "http") return "http:";
  if (value === "https") return "https:";
  return null;
}

function addCandidate(candidates: Set<string>, protocol: string, host: string | null) {
  if (!host || (protocol !== "http:" && protocol !== "https:")) return;
  try {
    candidates.add(new URL(`${protocol}//${host}`).origin);
  } catch {
    // A malformed routing header is never accepted as provenance.
  }
}

/**
 * Browser mutations fail closed unless their Origin exactly matches the request's
 * public origin. Vercel forwarding headers are considered only while running on
 * Vercel, where the routing layer controls those headers.
 */
export function isSameOriginMutation(request: MutationRequest): boolean {
  const suppliedOrigin = parseOrigin(request.headers.get("origin") ?? "");
  if (!suppliedOrigin) return false;

  let requestUrl: URL;
  try {
    requestUrl = new URL(request.url);
  } catch {
    return false;
  }
  if (requestUrl.protocol !== "http:" && requestUrl.protocol !== "https:") return false;

  const candidates = new Set<string>([requestUrl.origin]);
  addCandidate(candidates, requestUrl.protocol, parseHost(request.headers.get("host")));

  if (process.env.VERCEL === "1") {
    const forwardedProtocol = parseForwardedProtocol(request.headers.get("x-forwarded-proto"));
    const forwardedHost = parseHost(request.headers.get("x-forwarded-host"));
    if (forwardedProtocol && forwardedHost) addCandidate(candidates, forwardedProtocol, forwardedHost);
  }

  return candidates.has(suppliedOrigin);
}
