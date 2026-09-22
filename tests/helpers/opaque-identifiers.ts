import { createHash } from "node:crypto";

function hex(seed: string): string {
  return createHash("sha256").update(`pac-test:${seed}`).digest("hex");
}

/** Stable synthetic UUIDv4 for persistence-contract tests. */
export function testTraceId(seed: string): string {
  const value = hex(seed);
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-4${value.slice(13, 16)}-8${value.slice(17, 20)}-${value.slice(20, 32)}`;
}

export function testSpanId(seed: string): string {
  return hex(`span:${seed}`).slice(0, 8);
}

