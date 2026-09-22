import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { copyExactStage } from "../scripts/corpus/bootstrap-local-fixtures.mjs";

const cleanup: string[] = [];

function temporaryDirectory(label: string): string {
  const directory = mkdtempSync(path.join(tmpdir(), `pac-${label}-`));
  cleanup.push(directory);
  return directory;
}

function createStage(directory: string): void {
  mkdirSync(path.join(directory, "nested"), { recursive: true });
  writeFileSync(path.join(directory, "manifest.json"), '{"stage":"fixture"}\n', "utf8");
  writeFileSync(path.join(directory, "content_items.jsonl"), '{"id":"one"}\n', "utf8");
  writeFileSync(path.join(directory, "nested", "reviews.jsonl"), '{"status":"pending"}\n', "utf8");
}

afterEach(() => {
  for (const directory of cleanup.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe("local corpus fixture bootstrap", () => {
  it("copies and then accepts only a complete byte-identical stage", () => {
    const root = temporaryDirectory("fixture-replay");
    const source = path.join(root, "source");
    const destination = path.join(root, "destination");
    createStage(source);
    expect(copyExactStage(source, destination)).toBe("copied");
    expect(copyExactStage(source, destination)).toBe("exact_replay");
  });

  it.each([
    ["missing", (destination: string) => rmSync(path.join(destination, "content_items.jsonl"))],
    ["modified", (destination: string) => writeFileSync(path.join(destination, "content_items.jsonl"), '{"id":"changed"}\n', "utf8")],
    ["extra", (destination: string) => writeFileSync(path.join(destination, "unexpected.jsonl"), "{}\n", "utf8")],
  ])("refuses a %s file in an existing stage", (_case, alter) => {
    const root = temporaryDirectory(`fixture-${_case}`);
    const source = path.join(root, "source");
    const destination = path.join(root, "destination");
    createStage(source);
    expect(copyExactStage(source, destination)).toBe("copied");
    alter(destination);
    expect(() => copyExactStage(source, destination)).toThrow(/different or incomplete frozen stage/);
  });
});
