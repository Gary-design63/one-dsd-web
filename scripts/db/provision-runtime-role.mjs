#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import { resolve } from "node:path";
import postgres from "postgres";
import {
  PAC_RUNTIME_ROLE,
  buildRuntimeDatabaseUrl,
  writeRuntimeDatabaseSetting,
} from "./runtime-role-lib.mjs";

const repositoryRoot = resolve(import.meta.dirname, "../..");
const apply = process.argv.includes("--apply");

function databaseOptions(url, configuredValue) {
  const configured = (configuredValue ?? "").trim().toLowerCase();
  if (["disable", "false", "off"].includes(configured)) return { ssl: false };
  if (["require", "true", "on"].includes(configured)) return { ssl: "require" };
  const hostname = new URL(url).hostname;
  return { ssl: ["localhost", "127.0.0.1", "::1"].includes(hostname) ? false : "require" };
}

if (!apply) {
  console.log(JSON.stringify({
    ok: true,
    mode: "check",
    databaseChanged: false,
    environmentChanged: false,
    role: PAC_RUNTIME_ROLE,
    next: "Run this command with --apply after migration 0002 is present in the target database.",
  }, null, 2));
  process.exit(0);
}

const ownerDatabaseUrl = process.env.PAC_DATABASE_URL?.trim();
if (!ownerDatabaseUrl) {
  console.error(JSON.stringify({ ok: false, code: "missing_owner_database_setting" }));
  process.exit(1);
}

const password = randomBytes(36).toString("base64url");
const runtimeDatabaseUrl = buildRuntimeDatabaseUrl(ownerDatabaseUrl, password);
const owner = postgres(ownerDatabaseUrl, {
  max: 1,
  prepare: false,
  ...databaseOptions(ownerDatabaseUrl, process.env.PAC_DATABASE_SSL),
});

try {
  const readiness = await owner.unsafe(
    "select to_regrole($1::text)::text as role_name, to_regclass('pac.runtime_work_objects')::text as runtime_table",
    [PAC_RUNTIME_ROLE],
  );
  if (readiness[0]?.role_name !== PAC_RUNTIME_ROLE || !readiness[0]?.runtime_table) {
    throw Object.assign(new Error("Runtime role migration is not ready."), { code: "runtime_migration_missing" });
  }

  const formatted = await owner.unsafe(
    "select format('alter role %I password %L', $1::text, $2::text) as statement",
    [PAC_RUNTIME_ROLE, password],
  );
  const statement = formatted[0]?.statement;
  if (typeof statement !== "string") {
    throw Object.assign(new Error("Could not prepare password rotation."), { code: "password_rotation_prepare_failed" });
  }
  await owner.unsafe(statement);

  const runtime = postgres(runtimeDatabaseUrl, {
    max: 1,
    prepare: false,
    ...databaseOptions(runtimeDatabaseUrl, process.env.PAC_RUNTIME_DATABASE_SSL),
  });
  try {
    const identity = await runtime.unsafe(
      "select current_user, has_schema_privilege(current_user, 'pac', 'create') as can_create",
    );
    if (identity[0]?.current_user !== PAC_RUNTIME_ROLE || identity[0]?.can_create !== false) {
      throw Object.assign(new Error("The restricted runtime login did not pass its boundary check."), {
        code: "runtime_boundary_check_failed",
      });
    }
    await runtime.unsafe("select 1 from pac.runtime_work_objects where false");
  } finally {
    await runtime.end({ timeout: 5 });
  }

  const envFile = await writeRuntimeDatabaseSetting(repositoryRoot, runtimeDatabaseUrl);
  console.log(JSON.stringify({
    ok: true,
    mode: "apply",
    role: PAC_RUNTIME_ROLE,
    passwordRotated: true,
    connectionVerified: true,
    environmentFile: envFile,
  }, null, 2));
} catch (error) {
  console.error(JSON.stringify({
    ok: false,
    code: typeof error?.code === "string" ? error.code : "runtime_role_provision_failed",
  }));
  process.exitCode = 1;
} finally {
  await owner.end({ timeout: 5 });
}