#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

const root = resolve(import.meta.dirname, "../..");
const apply = process.argv.includes("--apply");
const receiptPath = process.argv.slice(2).find(value => value.startsWith("--receipt="))?.slice(10);
if (process.argv.slice(2).some(value => value !== "--apply" && !value.startsWith("--receipt="))) throw new Error("Only --apply and --receipt=path are supported.");
const databaseUrl = process.env.PAC_DATABASE_URL;
const runtimeUrl = process.env.PAC_RUNTIME_DATABASE_URL;
if (!databaseUrl || !runtimeUrl) throw new Error("Setup and restricted application connections are required.");
const ssl = url => ["localhost", "127.0.0.1", "::1", "[::1]"].includes(new URL(url).hostname) ? false : "require";
const bundle = JSON.parse(execFileSync(process.execPath, [resolve(root, "scripts/content/export-podcast-release.cjs")], { cwd: root, encoding: "utf8", windowsHide: true }));
const canonical = value => JSON.stringify(value, (_key, entry) => entry && typeof entry === "object" && !Array.isArray(entry) ? Object.fromEntries(Object.entries(entry).sort(([a], [b]) => a.localeCompare(b))) : entry);
const sql = postgres(databaseUrl, { ssl: ssl(databaseUrl), max: 1, prepare: false });
const runtime = postgres(runtimeUrl, { ssl: ssl(runtimeUrl), max: 1, prepare: false });
const receipt = { checkedAt: new Date().toISOString(), mode: apply ? "applied" : "validated_and_rolled_back", registered: [], published: [], preserved: [], scopedReads: [] };
const rollback = new Error("Validated, then rolled back.");
try {
  await sql.begin(async tx => {
    await tx`select pg_advisory_xact_lock(hashtextextended('podcast-owner-release-2026-09-07',0))`;
    for (const surface of bundle.surfaces) {
      const [existing] = await tx`select * from pac.surface_definitions where surface_id=${surface.surfaceId}`;
      if (existing) {
        if (existing.route_pattern !== surface.routePattern || existing.scope_policy !== surface.scopePolicy || !existing.active || canonical(existing.field_contract) !== canonical(surface.fieldContract) || canonical(existing.protected_fields) !== canonical(surface.protectedFields)) throw new Error(`Existing definition differs: ${surface.surfaceId}`);
      } else {
        await tx`insert into pac.surface_definitions(surface_id,route_pattern,staff_label,scope_policy,schema_version,field_contract,protected_fields,required_review_dimensions,active,registered_by)
          values(${surface.surfaceId},${surface.routePattern},${surface.staffLabel},${surface.scopePolicy},1,${tx.json(surface.fieldContract)},${surface.protectedFields},${surface.requiredReviewDimensions},true,'owner-approved-podcast-release-2026-09-07')`;
        receipt.registered.push(surface.surfaceId);
      }
      const [row] = await tx`select pac.read_surface_editing_state('one-dhs',${surface.surfaceId}) state`;
      const state = row.state;
      if (state.effective) {
        receipt.preserved.push(surface.surfaceId);
      } else {
        // A rerun must never reactivate an intentionally withdrawn recording.
        if (state.latestDecision || state.draft) throw new Error(`Existing availability or draft requires an explicit owner edit: ${surface.surfaceId}`);
        const [saved] = await tx`select pac.save_owner_approved_surface('one-dhs',${surface.surfaceId},${state.expectedRevisionId}::uuid,null,${tx.json(surface.document)},'The program owner supplied and approved this recording and its accompanying wording.') state`;
        if (canonical(saved.state.effective?.document) !== canonical(surface.document)) throw new Error("The approved podcast wording did not become available intact.");
        receipt.published.push({ surfaceId: surface.surfaceId, revisionId: saved.state.effective.revisionId, publicationDecisionId: saved.state.effective.publicationDecisionId });
      }
      for (const scope of ['one-dhs','dsd']) {
        const rows = await tx`select * from pac.read_surface_publication(${scope},${surface.surfaceId})`;
        if (rows.length !== 1) throw new Error(`Podcast missing from ${scope}`);
      }
    }
    // Connect only recordings newly published by this run. Reruns preserve owner
    // theme removals and prior availability decisions.
    const newIds = new Set(receipt.published.map(row => row.surfaceId));
    if (newIds.size) {
      const [hubRow] = await tx`select pac.read_surface_editing_state('one-dhs','learn.hub') state`;
      const hub = hubRow.state;
      if (!hub.effective || (hub.draft && canonical(hub.draft.document) !== canonical(hub.effective.document))) throw new Error("Preserve the existing Learning hub draft or availability decision before connecting new recordings.");
      const document = structuredClone(hub.effective.document);
      for (const membership of bundle.memberships.filter(row => newIds.has(row.surfaceId))) {
        for (const theme of membership.themes) {
          const key = `${theme}Ids`;
          document.values[key] = [...new Set([...(document.values[key] ?? []), membership.surfaceId])];
        }
      }
      const [saved] = await tx`select pac.save_owner_approved_surface('one-dhs','learn.hub',${hub.expectedRevisionId}::uuid,${hub.latestDecision.publicationDecisionId}::bigint,${tx.json(document)},'Connect the owner-supplied podcasts to their relevant resource themes.') state`;
      receipt.themePublication = { revisionId: saved.state.effective.revisionId, publicationDecisionId: saved.state.effective.publicationDecisionId };
    }
    if (!apply) throw rollback;
  });
  for (const surface of bundle.surfaces) for (const scope of ['one-dhs','dsd']) {
    const rows = await runtime`select * from pac.read_surface_publication(${scope},${surface.surfaceId})`;
    if (rows.length !== 1) throw new Error(`Restricted application cannot read podcast in ${scope}`);
    receipt.scopedReads.push({ surfaceId: surface.surfaceId, requestedScope: scope, sourceScope: rows[0].scope_id, revisionId: rows[0].revision_id, passed: true });
  }
} catch (error) {
  if (error !== rollback) throw error;
} finally {
  await runtime.end({ timeout: 5 }); await sql.end({ timeout: 5 });
}
if (receiptPath) writeFileSync(receiptPath, JSON.stringify(receipt,null,2));
process.stdout.write(JSON.stringify(receipt,null,2));
