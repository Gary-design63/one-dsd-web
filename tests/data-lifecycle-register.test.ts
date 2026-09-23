import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { OWNER_COOKIE, OWNER_SESSION_SECONDS } from "@/lib/auth/owner";
import { PRIVATE_BROWSER_STORAGE_KEYS, PRIVATE_BROWSER_STORAGE_PATTERNS } from "@/lib/client/storage-keys";
import { PARTICIPATION_CONTRACTS, OPERATIONAL_EVENT_RETENTION_DAYS } from "@/lib/participation/contracts";
import { CONSULTATION_TOMBSTONE_RETENTION_DAYS } from "@/lib/privacy/consultation-terminal-retention";
import {
  OPERATIONAL_RECORD_RETENTION_DAYS,
  OPERATIONAL_RETENTION_BATCH_LIMIT,
} from "@/lib/privacy/operational-retention";

const ROOT = path.resolve(import.meta.dirname, "..");
const REGISTER_PATH = path.join(ROOT, "config", "data-lifecycle-register.json");
const REGISTER_SOURCE = readFileSync(REGISTER_PATH, "utf8");

type LifecycleDimension = { rule: string };
type LifecycleProfile = Record<string, unknown> & {
  retention: LifecycleDimension;
  deletion: LifecycleDimension;
  correction: LifecycleDimension;
  backup: LifecycleDimension;
  restore: LifecycleDimension;
  incident: LifecycleDimension;
  recovery: LifecycleDimension;
  end_of_program: LifecycleDimension;
  retention_days?: number;
  batch_limit?: number;
};

type LifecycleClass = {
  id: string;
  profile: string;
  sensitivity_classes: string[];
  participation_classes: string[];
  official_record: boolean;
  purpose: string;
  status: string;
  source: string;
  blocking_conditions?: string[];
};

type DatabaseClass = LifecycleClass & { physical_members: string[] };
type RuntimeSubtype = LifecycleClass & { work_kind: string; selector: string };
type CollaborationClass = LifecycleClass & { members: string[] };
type FileStoreClass = LifecycleClass & { physical_members: string[] };
type BrowserClass = LifecycleClass & {
  storage_area: "local" | "session" | "cookie";
  storage_purpose: string;
  key?: string;
  key_pattern?: string;
};
type ExternalBlobClass = LifecycleClass & { physical_members: string[]; locator: string };

type LifecycleRegister = {
  schema_version: string;
  required_dimensions: string[];
  status_definitions: Record<string, string>;
  lifecycle_profiles: Record<string, LifecycleProfile>;
  database_classes: DatabaseClass[];
  runtime_work_object_subtypes: RuntimeSubtype[];
  collaboration_nested_records: CollaborationClass[];
  file_store_records: FileStoreClass[];
  browser_records: BrowserClass[];
  external_blob_classes: ExternalBlobClass[];
};

const register = JSON.parse(REGISTER_SOURCE) as LifecycleRegister;
const CLASS_SECTIONS: LifecycleClass[][] = [
  register.database_classes,
  register.runtime_work_object_subtypes,
  register.collaboration_nested_records,
  register.file_store_records,
  register.browser_records,
  register.external_blob_classes,
];
const allClasses = CLASS_SECTIONS.flat();

function quotedValues(source: string): string[] {
  return [...source.matchAll(/"([A-Za-z][A-Za-z0-9_]*)"/g)].map((match) => match[1]);
}

describe("machine-readable data lifecycle register", () => {
  it("resolves every persisted class to all required lifecycle dimensions", () => {
    expect(register.schema_version).toMatch(/^1\./);
    expect(register.required_dimensions).toEqual([
      "retention",
      "deletion",
      "correction",
      "backup",
      "restore",
      "incident",
      "recovery",
      "end_of_program",
    ]);

    for (const [profileId, profile] of Object.entries(register.lifecycle_profiles)) {
      for (const dimension of register.required_dimensions) {
        const value = profile[dimension] as LifecycleDimension | undefined;
        expect(value, `${profileId}.${dimension}`).toBeDefined();
        expect(value?.rule.trim(), `${profileId}.${dimension}.rule`).not.toBe("");
      }
    }

    expect(new Set(allClasses.map((entry) => entry.id)).size).toBe(allClasses.length);
    for (const entry of allClasses) {
      expect(register.lifecycle_profiles[entry.profile], `${entry.id}.profile`).toBeDefined();
      expect(entry.sensitivity_classes.length, `${entry.id}.sensitivity_classes`).toBeGreaterThan(0);
      expect(entry.participation_classes.length, `${entry.id}.participation_classes`).toBeGreaterThan(0);
      expect(typeof entry.official_record, `${entry.id}.official_record`).toBe("boolean");
      expect(entry.purpose.trim(), `${entry.id}.purpose`).not.toBe("");
      expect(entry.source.trim(), `${entry.id}.source`).not.toBe("");
      expect(register.status_definitions[entry.status], `${entry.id}.status`).toBeDefined();
      if (["blocked_pending_authorization", "defined_feature_off", "preview_sample_only"].includes(entry.status)) {
        expect(entry.blocking_conditions?.length, `${entry.id}.blocking_conditions`).toBeGreaterThan(0);
      }
    }
  });

  it("covers every PostgreSQL table created by the migration set exactly once", () => {
    const migrationsDirectory = path.join(ROOT, "db", "migrations");
    const migrationTables = readdirSync(migrationsDirectory)
      .filter((name) => name.endsWith(".sql"))
      .flatMap((name) => {
        const source = readFileSync(path.join(migrationsDirectory, name), "utf8");
        return [...source.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?pac\.([a-z0-9_]+)/gi)]
          .map((match) => `pac.${match[1].toLowerCase()}`);
      })
      .sort();
    const registeredTables = register.database_classes
      .flatMap((entry) => entry.physical_members)
      .sort();

    expect(new Set(registeredTables).size).toBe(registeredTables.length);
    expect(registeredTables).toEqual([...new Set(migrationTables)].sort());
  });

  it("covers every runtime work kind and approved subtype selector", () => {
    const contractSource = readFileSync(path.join(ROOT, "lib", "trust", "work-object-contract.ts"), "utf8");
    const kindBlock = contractSource.match(/export type PersistedWorkObjectKind\s*=([\s\S]*?);/)?.[1] ?? "";
    const contractKinds = [...kindBlock.matchAll(/"([a-z_]+)"/g)].map((match) => match[1]).sort();
    const registeredKinds = [...new Set(register.runtime_work_object_subtypes.map((entry) => entry.work_kind))].sort();
    expect(registeredKinds).toEqual(contractKinds);

    expect(register.runtime_work_object_subtypes.map((entry) => entry.id).sort()).toEqual([
      "runtime.collaboration_workspace",
      "runtime.consultation_request.active",
      "runtime.consultation_request.tombstone",
      "runtime.decision.autonomy_policy",
      "runtime.decision.cycle",
      "runtime.decision.equity_analysis",
      "runtime.decision.equity_analysis_followup",
      "runtime.decision.equity_survey_wave",
      "runtime.decision.owner_session_revocation",
      "runtime.decision.proposal",
      "runtime.decision.rejected_recommendation",
      "runtime.decision.research_policy",
      "runtime.decision.research_usage",
      "runtime.decision.stale_flag",
      "runtime.eval_result",
    ]);

    for (const sourceSelector of [
      'id === "autonomy_policy"',
      'id === "research_policy"',
      'id.startsWith("research_usage:")',
      'id.startsWith("cycle:")',
      'id.startsWith("stale_flag:")',
      'id.startsWith("proposal:")',
      'id.startsWith("rejected_rec:")',
      'id.startsWith("equity_analysis:")',
      'id.startsWith("equity_followup:")',
      'id.startsWith("equity_survey:")',
    ]) {
      expect(contractSource, sourceSelector).toContain(sourceSelector);
    }
    expect(contractSource).toContain("owner-session-revoked-");
    expect(contractSource).toContain('value.record_type === "consultation_tombstone"');
    expect(contractSource).toContain('id !== "one_dsd_team"');
  });

  it("covers every nested collaboration record in the persisted aggregate", () => {
    const contractSource = readFileSync(path.join(ROOT, "lib", "trust", "work-object-contract.ts"), "utf8");
    const rootKeyBlock = contractSource.match(/const COLLABORATION_ROOT_KEYS\s*=\s*\[([\s\S]*?)\]\s*as const;/)?.[1];
    expect(rootKeyBlock).toBeDefined();
    const contractKeys = quotedValues(rootKeyBlock ?? "").sort();
    const registeredKeys = register.collaboration_nested_records.flatMap((entry) => entry.members).sort();
    expect(new Set(registeredKeys).size).toBe(registeredKeys.length);
    expect(registeredKeys).toEqual(contractKeys);
  });

  it("covers every registered browser record and the owner cookie", () => {
    const browserEntries = register.browser_records.filter((entry) => entry.storage_area !== "cookie");
    for (const stored of PRIVATE_BROWSER_STORAGE_KEYS) {
      const matches = browserEntries.filter((entry) =>
        entry.storage_area === stored.area
        && entry.storage_purpose === stored.purpose
        && (entry.key === stored.key || (entry.key_pattern ? new RegExp(entry.key_pattern).test(stored.key) : false))
      );
      expect(matches.map((entry) => entry.id), `${stored.area}:${stored.key}`).toHaveLength(1);
    }

    for (const entry of browserEntries) {
      const matches = PRIVATE_BROWSER_STORAGE_KEYS.filter((stored) =>
        entry.storage_area === stored.area
        && entry.storage_purpose === stored.purpose
        && (entry.key === stored.key || (entry.key_pattern ? new RegExp(entry.key_pattern).test(stored.key) : false))
      );
      const patterns = PRIVATE_BROWSER_STORAGE_PATTERNS.filter(stored => stored.area === entry.storage_area && stored.purpose === entry.storage_purpose && stored.keyPattern === entry.key_pattern);
      expect(matches.length + patterns.length, entry.id).toBeGreaterThan(0);
    }

    for (const stored of PRIVATE_BROWSER_STORAGE_PATTERNS) {
      expect(browserEntries.filter(entry => entry.storage_area === stored.area && entry.storage_purpose === stored.purpose && entry.key_pattern === stored.keyPattern)).toHaveLength(1);
    }

    const cookie = register.browser_records.find((entry) => entry.id === "browser.owner_session_cookie");
    expect(cookie).toMatchObject({ storage_area: "cookie", key: OWNER_COOKIE, profile: "owner_cookie" });
    expect(OWNER_SESSION_SECONDS).toBe(8 * 60 * 60);
  });

  it("covers source-carrier and versioned-asset external blobs", () => {
    expect(register.external_blob_classes.map((entry) => entry.id).sort()).toEqual([
      "blob.content_asset",
      "blob.source_carrier_representation",
    ]);
    expect(register.external_blob_classes.find((entry) => entry.id === "blob.source_carrier_representation")?.physical_members.sort())
      .toEqual(["derived_snapshot", "original", "repository_source"]);
    expect(register.external_blob_classes.find((entry) => entry.id === "blob.content_asset")?.physical_members.sort())
      .toEqual(["audio", "caption", "download", "primary", "source", "supplement", "thumbnail", "transcript"]);
  });
});

describe("retention implementation and disclosure parity", () => {
  it("keeps the 90-day operational rule equal in code, SQL, register, docs, and affected disclosures", () => {
    const migration = readFileSync(path.join(ROOT, "db", "migrations", "0013_pac_security_housekeeping.sql"), "utf8");
    const runbook = readFileSync(path.join(ROOT, "docs", "operations", "security-housekeeping.md"), "utf8");
    const profile = register.lifecycle_profiles.operational_90d;

    expect(OPERATIONAL_EVENT_RETENTION_DAYS).toBe(OPERATIONAL_RECORD_RETENTION_DAYS);
    expect(profile.retention_days).toBe(OPERATIONAL_RECORD_RETENTION_DAYS);
    expect(profile.batch_limit).toBe(OPERATIONAL_RETENTION_BATCH_LIMIT);
    expect(migration).toContain(`interval '${OPERATIONAL_RECORD_RETENTION_DAYS} days'`);
    expect(migration.match(/limit 10000/g)?.length).toBeGreaterThanOrEqual(4);
    expect(runbook).toContain(`${OPERATIONAL_RECORD_RETENTION_DAYS} days`);

    const affected = Object.values(PARTICIPATION_CONTRACTS).filter((contract) =>
      contract.creates.includes("privacy_minimized_operational_event")
      || contract.creates.includes("privacy_minimized_research_usage")
    );
    expect(affected.length).toBeGreaterThan(0);
    for (const contract of affected) {
      expect(contract.disclosure.retention, contract.surface)
        .toContain(`${OPERATIONAL_RECORD_RETENTION_DAYS} days`);
    }
  });

  it("keeps the 30-day tombstone rule equal in code, SQL, register, and operator disclosures", () => {
    const migration = readFileSync(path.join(ROOT, "db", "migrations", "0015_pac_terminal_consultation_cleanup.sql"), "utf8");
    const consultationRunbook = readFileSync(path.join(ROOT, "docs", "operations", "consultation-lifecycle.md"), "utf8");
    const lifecycleRunbook = readFileSync(path.join(ROOT, "docs", "operations", "data-lifecycle-and-recovery.md"), "utf8");
    const profile = register.lifecycle_profiles.consultation_tombstone_30d;

    expect(profile.retention_days).toBe(CONSULTATION_TOMBSTONE_RETENTION_DAYS);
    expect(migration).toContain(`interval '${CONSULTATION_TOMBSTONE_RETENTION_DAYS} days'`);
    expect(migration).toContain("idempotency_receipts_deleted");
    expect(migration).toContain("consultation_tombstones_deleted");
    expect(consultationRunbook).toContain(`${CONSULTATION_TOMBSTONE_RETENTION_DAYS} days`);
    expect(lifecycleRunbook).toContain(`${CONSULTATION_TOMBSTONE_RETENTION_DAYS}-day`);
  });
});
