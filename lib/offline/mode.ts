import "server-only";

/**
 * Portable offline edition switches. Every offline-only capability is inert
 * unless the offline launcher starts the server with PAC_OFFLINE_MODE=on, so
 * hosted deployments keep their existing behavior.
 */
type Environment = Record<string, string | undefined>;

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function offlineModeEnabled(environment: Environment = process.env): boolean {
  return environment.PAC_OFFLINE_MODE?.trim() === "on";
}

/** The per-launch secret the launcher uses to open the workspace for the owner. */
export function offlineHandoffToken(environment: Environment = process.env): string | null {
  if (!offlineModeEnabled(environment)) return null;
  const token = environment.PAC_OFFLINE_HANDOFF_TOKEN?.trim();
  return token && Buffer.byteLength(token, "utf8") >= 32 ? token : null;
}

/** The machine-local file where the owner's API connections are kept. */
export function offlineConnectorsFile(environment: Environment = process.env): string | null {
  if (!offlineModeEnabled(environment)) return null;
  return environment.PAC_OFFLINE_CONNECTORS_FILE?.trim() || null;
}

/**
 * The network address other people use to open this copy, for example
 * http://OFFICE-PC:3100. Share links use it when the host browses on localhost.
 */
export function offlineShareOrigin(environment: Environment = process.env): string | null {
  if (!offlineModeEnabled(environment)) return null;
  const configured = environment.PAC_OFFLINE_SHARE_ORIGIN?.trim();
  if (!configured) return null;
  try {
    const url = new URL(configured);
    return /^https?:$/.test(url.protocol) && url.origin === configured.replace(/\/+$/, "") ? url.origin : null;
  } catch {
    return null;
  }
}

/** Offline-only routes answer only on this computer's own addresses. */
export function isLoopbackHost(hostHeader: string | null): boolean {
  if (!hostHeader) return false;
  const host = hostHeader.trim().toLowerCase();
  const name = host.startsWith("[") ? host.slice(0, host.indexOf("]") + 1) : host.split(":")[0];
  return LOOPBACK_HOSTS.has(name);
}
