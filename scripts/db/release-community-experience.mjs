#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

// Exact owner-authorized source publication, not an assertion of a new independent
// factual review. Default operation validates all changes and rolls them back.
// Usage: node --env-file=.env.local scripts/db/release-community-experience.mjs [--apply]
const root = resolve(import.meta.dirname, "../..");
const apply = process.argv.includes("--apply");
if (process.argv.slice(2).some(argument => argument !== "--apply")) throw new Error("Only --apply is supported.");
if (!process.env.PAC_DATABASE_URL?.trim()) throw new Error("Database setup credentials are required.");
if (apply && !process.env.PAC_RUNTIME_DATABASE_URL?.trim()) throw new Error("The restricted application connection is required to verify a committed release.");

const serialized = execFileSync(process.execPath, [resolve(root, "scripts/content/export-community-release.cjs")], {
  cwd: root, encoding: "utf8", maxBuffer: 20000000, windowsHide: true,
});
const bundle = JSON.parse(serialized);
const bundleHash = createHash("sha256").update(serialized).digest("hex");
const canonical = value => JSON.stringify(value, (_key, entry) => entry && typeof entry === "object" && !Array.isArray(entry)
  ? Object.fromEntries(Object.entries(entry).sort(([left], [right]) => left.localeCompare(right))) : entry);
const same = (left, right) => canonical(left) === canonical(right);
// Local audit clusters use loopback without TLS; hosted connections require it.
function connectionSsl(url) {
  return ["localhost", "127.0.0.1", "::1", "[::1]"].includes(new URL(url).hostname) ? false : "require";
}
const sql = postgres(process.env.PAC_DATABASE_URL, { ssl: connectionSsl(process.env.PAC_DATABASE_URL), max: 1, prepare: false, connect_timeout: 15, onnotice: () => {} });
const rollback = new Error("Community publication validation completed; transaction rolled back.");
const note = "The program owner authorized this preserved material for publication after the local design review. This decision does not represent a new independent factual review or community endorsement.";
let stage = "start";
let currentSurface = null;
let committed = false;
const result = { status: apply ? "applied" : "validated_and_rolled_back", scope: bundle.scope, bundleSha256: bundleHash, registered: [], extended: [], published: [], preservedPublications: [], setupConnectionReadsVerified: 0, runtimeReadsVerified: 0, runtimeReadGrantVerified: false };

function ensure(condition, reason) {
  if (!condition) { const error = new Error(reason); error.auditReason = reason; throw error; }
}

try {
  await sql.begin(async tx => {
    await tx`select pg_advisory_xact_lock(hashtextextended('one-dhs-pac-community-release-2026-09-07', 0))`;
    stage = "check_review_time_ordering";
    const clock = (await tx`select column_default from information_schema.columns where table_schema = 'pac' and table_name = 'surface_reviews' and column_name = 'recorded_at'`)[0]?.column_default;
    if (!String(clock).includes("clock_timestamp()")) {
      ensure(!apply, "Apply the reviewed forward migration for surface review timestamps before committing this release.");
      // Exercise the separately authorized forward correction only inside the
      // rollback-only dry run. Committing requires its recorded migration.
      await tx.unsafe("alter table pac.surface_reviews alter column recorded_at set default clock_timestamp()");
      result.reviewClockCorrectionValidated = true;
    }
    stage = "check_historical_author_validation";
    const authorMigration = "0024_pac_historical_author_wording.sql";
    const authorLedger = await tx`select migration_name from pac.schema_migrations where migration_name = ${authorMigration}`;
    if (!authorLedger.length) {
      ensure(!apply, "Apply the reviewed historical-author validation migration before committing this release.");
      const authorPath = resolve(root, "db/migrations", authorMigration);
      ensure(existsSync(authorPath), "The historical-author validation migration is not ready for the dry run.");
      await tx.unsafe(readFileSync(authorPath, "utf8").replace(/^begin;\s*/im, "").replace(/commit;\s*$/i, ""));
      result.historicalAuthorCorrectionValidated = true;
    }
    for (const surface of bundle.surfaces) {
      currentSurface = surface.surfaceId;
      stage = "inspect_registered_definition";
      const rows = await tx`select * from pac.surface_definitions where surface_id = ${surface.surfaceId}`;
      const existing = rows[0];
      if (existing) {
        const published = await tx`select * from pac.read_surface_publication(${bundle.scope}, ${surface.surfaceId})`;
        if (published.length) {
          result.preservedPublications.push(surface.surfaceId);
          continue;
        }
        ensure(existing.scope_policy === surface.scopePolicy && existing.route_pattern === surface.routePattern && existing.schema_version === 1 && existing.active === true,
          "An existing definition has a different route, scope, version, or availability; nothing was changed.");
        ensure(same(existing.protected_fields, surface.protectedFields) && same(existing.required_review_dimensions, surface.requiredReviewDimensions),
          "An existing definition has different protected fields or review requirements; nothing was changed.");
        if (!same(existing.field_contract, surface.fieldContract)) {
          ensure(surface.surfaceId.startsWith("community-brief."), "Only the approved brief field additions may extend an existing definition.");
          const newKeys = new Set(surface.fieldContract.map(field => field.key));
          ensure(existing.field_contract.every(field => newKeys.has(field.key)), "The proposed contract removes an existing field.");
          const additions = surface.fieldContract.filter(field => !existing.field_contract.some(previous => previous.key === field.key)).map(field => field.key);
          ensure(additions.every(key => ["spotlightTitle", "spotlightBody", "spotlightLinkLabel", "spotlightHref", "reflectionTitle", "reflectionBody"].includes(key)),
            "The proposed contract contains an unexpected field addition.");
          for (const previous of existing.field_contract) {
            const next = surface.fieldContract.find(field => field.key === previous.key);
            ensure(previous.kind === next.kind && previous.maxLength === next.maxLength && previous.maxItems === next.maxItems && previous.required === next.required,
              "A shared field's validation requirements changed; nothing was changed.");
          }
          stage = "extend_brief_field_contract";
          await tx`update pac.surface_definitions set field_contract = ${tx.json(surface.fieldContract)} where surface_id = ${surface.surfaceId}`;
          result.extended.push(surface.surfaceId);
        }
      } else {
        stage = "register_definition";
        await tx`insert into pac.surface_definitions (
          surface_id, route_pattern, staff_label, scope_policy, schema_version, field_contract,
          protected_fields, required_review_dimensions, active, registered_by
        ) values (${surface.surfaceId}, ${surface.routePattern}, ${surface.staffLabel}, ${surface.scopePolicy}, 1,
          ${tx.json(surface.fieldContract)}, ${surface.protectedFields}, ${surface.requiredReviewDimensions}, true, 'owner-authorized-community-release-2026-09-07')`;
        result.registered.push(surface.surfaceId);
      }

      stage = "create_review_and_publish_exact_revision";
      // Keep the existing guarded functions, but avoid a network round trip for
      // each review. No temporary function, altered gate, or direct history write.
      await tx`select set_config('pac.community_release_surface', ${JSON.stringify(surface)}, true), set_config('pac.community_release_note', ${note}, true)`;
      await tx.unsafe(`do $community_release$
        declare
          requested jsonb := current_setting('pac.community_release_surface')::jsonb;
          release_note text := current_setting('pac.community_release_note');
          area text := requested ->> 'surfaceId';
          requested_document jsonb := requested -> 'document';
          editing jsonb;
          review jsonb;
          dimension text;
          revision uuid;
        begin
          editing := pac.read_surface_editing_state('one-dhs', area);
          if editing #> '{draft,document}' is distinct from requested_document then
            editing := pac.create_surface_draft('one-dhs', area, nullif(editing ->> 'expectedRevisionId', '')::uuid,
              requested_document, 'Preserved community material approved for publication by the program owner.');
          end if;
          if editing #> '{draft,document}' is distinct from requested_document then
            raise exception 'The current draft does not exactly match the approved source document' using errcode = '22023';
          end if;
          revision := (editing #>> '{draft,revisionId}')::uuid;
          for dimension in select value from jsonb_array_elements_text(requested -> 'requiredReviewDimensions') loop
            select value into review from jsonb_array_elements(editing #> '{draft,reviews}') where value ->> 'dimension' = dimension;
            if review ->> 'status' is distinct from 'pass' then
              editing := pac.record_surface_review('one-dhs', area, revision, dimension, 'pass', nullif(review ->> 'reviewId', '')::uuid, release_note);
              select value into review from jsonb_array_elements(editing #> '{draft,reviews}') where value ->> 'dimension' = dimension;
              if review ->> 'status' is distinct from 'pass' then
                raise exception 'The owner publication review did not become effective' using errcode = '55000';
              end if;
            end if;
          end loop;
          editing := pac.publish_surface_draft('one-dhs', area, revision, nullif(editing #>> '{latestDecision,publicationDecisionId}', '')::bigint, release_note);
          if editing #> '{effective,document}' is distinct from requested_document then
            raise exception 'Publication did not return the exact approved source document' using errcode = '22023';
          end if;
        end
        $community_release$;`);
      result.published.push(surface.surfaceId);
    }

    stage = "verify_runtime_read_grant";
    const grant = (await tx`select has_function_privilege('pac_app_runtime', 'pac.read_surface_publication(text,text)', 'EXECUTE') as allowed`)[0]?.allowed;
    ensure(grant === true, "The application role does not have its existing scoped publication read permission.");
    result.runtimeReadGrantVerified = true;
    stage = "verify_setup_connection_publication_reads";
    for (const surface of bundle.surfaces) {
      currentSurface = surface.surfaceId;
      for (const scope of ["one-dhs", "dsd"]) {
        const rows = await tx`select document, scope_id from pac.read_surface_publication(${scope}, ${surface.surfaceId})`;
        ensure(rows.length === 1, "A released or inherited publication could not be read during validation.");
        if (result.published.includes(surface.surfaceId)) ensure(same(rows[0].document, surface.document), "The scoped publication function did not read the exact published source document.");
        result.setupConnectionReadsVerified += 1;
      }
    }
    // The setup connection is not allowed to assume the runtime role on this
    // hosted database. Dry runs report function reads and grant inspection only.
    // Actual runtime-credential reads follow a successful explicit commit.
    currentSurface = null;
    stage = apply ? "commit" : "rollback_validation";
    if (!apply) throw rollback;
  });
  committed = true;
  stage = "verify_committed_runtime_reads";
  const runtime = postgres(process.env.PAC_RUNTIME_DATABASE_URL, { ssl: connectionSsl(process.env.PAC_RUNTIME_DATABASE_URL), max: 1, prepare: false, connect_timeout: 15, onnotice: () => {} });
  try {
    for (const surface of bundle.surfaces) {
      currentSurface = surface.surfaceId;
      for (const scope of ["one-dhs", "dsd"]) {
        const rows = await runtime`select document, scope_id from pac.read_surface_publication(${scope}, ${surface.surfaceId})`;
        ensure(rows.length === 1, "The restricted application connection cannot read a committed publication.");
        if (result.published.includes(surface.surfaceId)) ensure(same(rows[0].document, surface.document), "The restricted application connection did not read the exact approved source document.");
        result.runtimeReadsVerified += 1;
      }
    }
  } finally { await runtime.end({ timeout: 3 }); }
  currentSurface = null;
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  if (error === rollback) console.log(JSON.stringify(result, null, 2));
  else {
    const validationMessages = new Set([
      "Page wording cannot be blank", "Page wording must use plain text", "Page wording must not contain serialized data",
      "Page wording includes technical product language that is not staff-facing", "Page wording must not contain icons",
      "Page links must use a program path or secure web address", "Page links must use a safe program path",
      "Page wording fields do not match this page area", "A page wording field is blank or too long",
      "A page wording list is empty, too long, or has the wrong kind of value", "A structured paragraph is blank or too long",
    ]);
    console.error(JSON.stringify({ status: committed ? "committed_runtime_verification_failed" : "rolled_back", stage, surfaceId: currentSurface, code: error.code ?? error.name,
      setupConnectionReadsVerified: result.setupConnectionReadsVerified, runtimeReadsVerified: result.runtimeReadsVerified,
      ...(error.auditReason ? { reason: error.auditReason } : validationMessages.has(error.message) ? { reason: error.message } : {}) }));
    process.exitCode = 1;
  }
} finally { await sql.end({ timeout: 3 }); }
