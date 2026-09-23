import { describe, expect, it } from "vitest";
import { HISTORICAL_LEDGER_VARIANTS, appliedMigrationVariant, migrationBody, migrationHash, parseReleaseArguments, pendingReleaseMigrations, releaseMigrations } from "@/scripts/db/prepare-functional-production-migrations.mjs";

type PlannedMigration = { name: string; number: number; sha256: string; crlfSha256: string; body: string };
const currentFiles = releaseMigrations() as PlannedMigration[];
// This runner intentionally describes the historical 0039–0048 release.
// Later release files must not silently expand that approved boundary.
const files = currentFiles.filter((file) => file.number <= 48);
const ledgerThrough = (number: number) => files.filter((file) => file.number <= number).map((file) => ({ migration_name: file.name, migration_sha256: file.sha256 }));

describe("bounded functional production migration plan without a database connection", () => {
  it("requires the complete existing baseline and selects only0039 through0048", () => {
    expect(pendingReleaseMigrations(files, ledgerThrough(38)).map((file: PlannedMigration) => file.number)).toEqual([39,40,41,42,43,44,45,46,47,48]);
    expect(pendingReleaseMigrations(files, ledgerThrough(40)).map((file: PlannedMigration) => file.number)).toEqual([41,42,43,44,45,46,47,48]);
    expect(pendingReleaseMigrations(files, ledgerThrough(48))).toEqual([]);
  });
  it("stops for an older missing migration, altered history, unknown ledger entry or new pending release", () => {
    expect(() => pendingReleaseMigrations(files, ledgerThrough(38).filter((row) => !row.migration_name.startsWith("0009_")))).toThrow("older_migration_missing");
    const changed = ledgerThrough(38); changed[6].migration_sha256 = "A".repeat(64);
    expect(() => pendingReleaseMigrations(files, changed)).toThrow("migration_history_hash_mismatch");
    expect(() => pendingReleaseMigrations(files, [...ledgerThrough(38), {migration_name:"unknown.sql",migration_sha256:"A".repeat(64)}])).toThrow("unknown_applied_migration");
    expect(() => pendingReleaseMigrations([...files, {name:"0049_future.sql",number:49,sha256:"A".repeat(64),crlfSha256:"A".repeat(64),body:"select 1;"}], ledgerThrough(38))).toThrow("newer_pending_migration_outside_release");
    expect(currentFiles.some((file) => file.number > 48)).toBe(true);
    expect(() => pendingReleaseMigrations(currentFiles, ledgerThrough(48))).toThrow("newer_pending_migration_outside_release");
  });
  it("accepts only the two pinned historical hash pairs without changing ledger rows", () => {
    const ledger = ledgerThrough(38);
    for (const [name, variant] of Object.entries(HISTORICAL_LEDGER_VARIANTS)) ledger.find((row) => row.migration_name === name)!.migration_sha256 = variant.recordedSha256;
    const original = structuredClone(ledger);
    expect(pendingReleaseMigrations(files, ledger)).toHaveLength(10);
    expect(ledger).toEqual(original);
    for (const [name, variant] of Object.entries(HISTORICAL_LEDGER_VARIANTS)) {
      const file = files.find((item) => item.name === name)!;
      expect(appliedMigrationVariant(file, variant.recordedSha256)).toBe("verified_prior_line_ending_receipt");
      expect(() => appliedMigrationVariant({...file,sha256:"B".repeat(64)}, variant.recordedSha256)).toThrow("migration_history_hash_mismatch");
      expect(() => appliedMigrationVariant(file, "C".repeat(64))).toThrow("migration_history_hash_mismatch");
    }
  });
  it("keeps function dollar quoting and inner transactions unchanged when stripping only an outer wrapper", () => {
    const body = "\ncreate function pac.example() returns void language plpgsql as $$\nbegin\n perform 1;\nend;\n$$;\n";
    expect(migrationBody("-- approved\r\nBEGIN;" + body + "COMMIT;\n", "fixture.sql")).toBe("-- approved\r\n" + body);
    expect(migrationBody(body, "fixture.sql")).toBe(body);
    expect(() => migrationBody("begin; select 1;", "fixture.sql")).toThrow("unpaired_outer_transaction");
    expect(() => migrationBody("select 1; commit;", "fixture.sql")).toThrow("unpaired_outer_transaction");
    for (const file of files.filter((file) => file.number >= 39)) {
      expect(file.sha256).toMatch(/^[A-F0-9]{64}$/);
      expect(file.body.length).toBeGreaterThan(100);
    }
    expect(migrationHash("select 1;\r\n")).not.toBe(migrationHash("select 1;\n"));
  });
  it("defaults to rehearsal and permits no history-bypass or receipt escape arguments", () => {
    expect(parseReleaseArguments([]).apply).toBe(false);
    expect(parseReleaseArguments(["--apply"]).apply).toBe(true);
    expect(parseReleaseArguments(["--receipt=evidence/release.json"]).receiptPath).toMatch(/evidence[\\/]release\.json$/);
    for (const args of [["--force"],["--ignore-history"],["--apply","--apply"],["--receipt=evidence/../private.json"],["--receipt=.env.local"]]) {
      expect(() => parseReleaseArguments(args)).toThrow();
    }
  });
});
