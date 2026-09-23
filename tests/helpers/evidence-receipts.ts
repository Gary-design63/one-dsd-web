import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

/**
 * Write a test receipt under `evidence/`, creating its directory first.
 * Receipt directories are not part of a clean checkout, so a test that writes
 * straight into one fails with ENOENT on CI.
 */
export function writeEvidenceReceipt(relativePath: string, receipt: unknown): void {
  const target = path.resolve(relativePath);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(receipt, null, 2));
}
