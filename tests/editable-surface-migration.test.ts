import { COURSE_SURFACES, AUTHORED_COURSE_SURFACES, ALL_COURSE_SURFACES } from "@/lib/content/courses/definitions";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  EDITABLE_SURFACE_REGISTRY,
} from "@/lib/content/staff-surface-registry";
import { editableSurfaceReviewDimensions, type EditableSurfaceValues } from "@/lib/content/editable-surface-contract";

const ROOT = path.resolve(__dirname, "..");
const migration = readFileSync(
  path.join(ROOT, "db", "migrations", "0018_pac_editable_surfaces.sql"),
  "utf8",
);

function embeddedRegistry(): Array<Record<string, unknown>> {
  const match = migration.match(/\$pac_registry\$(\[[\s\S]*?\])\$pac_registry\$::jsonb/);
  if (!match) throw new Error("Migration is missing its fixed registry seed.");
  return JSON.parse(match[1]) as Array<Record<string, unknown>>;
}

describe("governed editable surface migration", () => {
  it("preserves the exact historical registry while later surfaces, spotlight fields, and approved ASK wording evolve forward", () => {
    const embedded = embeddedRegistry();
    expect(embedded).toHaveLength(76);
    expect(createHash("sha256").update(migration.replace(/\r\n/g, "\n")).digest("hex")).toBe(
      "15ba145c983dcd7714b272f2a8006d2bf64759b3c54637ec18a5e6c0bce685f3",
    );
    const byId = new Map(embedded.map((surface) => [surface.surfaceId, surface]));
    const laterSurfaces = EDITABLE_SURFACE_REGISTRY.filter(surface => !byId.has(surface.surfaceId));
    expect(laterSurfaces.map(surface => surface.surfaceId)).toEqual([
      // September 12, 2026: the Research and sources page joined the registry ahead of the historical surfaces.
      "sources.page",
      "learn.intercultural", "practice.measurement", "amplify.mentoring", "amplify.well-being", "amplify.ideas",
      "equity-toolkit.home", "community-connections.home", ...COURSE_SURFACES.map(surface => surface.surfaceId), ...AUTHORED_COURSE_SURFACES.map(surface => surface.surfaceId), "podcast.equity-toolkit", "podcast.anti-racism-public-service", "one-dsd.inventory",
      ...["hcbs-policy","mnchoices-access","support-planning","positive-supports","olmstead","employment","eidbi-children","tbi-guardianship","contracts-fiscal","data-quality","communications-training","leadership-strategy"].map(id => `dsd-program.${id}`),
      ...["dsd-hiring-panel","dsd-advancement-conversation","dsd-accommodation-cliff","dsd-policy-change","dsd-service-redesign","dsd-engagement-late","dsd-report-back","dsd-accessible-form","dsd-interpreter-first-contact","dsd-team-silence","dsd-repair-after-harm","dsd-leadership-bottleneck","dsd-small-group-data"].map(id => `dsd-scenario.${id}`),
      ...["workforce","policy-program-service","community-engagement","access-language","culture-trust","leadership-systems","measurement"].map(id => `domain.${id}`),
      "equity.practice", ...[6,7,8,9,10,11,12,13].map(number => `graduation-path.gp-${number}`),
          ]);
    // September 12, 2026: the owner ordered all staff-facing wording humanized (plain English, no system or machine language).
    const addedPracticeKeys = ["handoffTitle","handoffBody","handoffUseLabel","draftSourceSummary","draftPreparedPrefix","draftOwnershipBody"];
    const forwardValues: Record<string, string[]> = {
      "learn.hub": ["cultureIds","interculturalIds","accessIds","structuralIds","partnershipIds","facilitationIds"],
      "amplify.materials": ["navigation"],
      "amplify.home": ["intro","navigation"],
      "amplify.gatherings": ["navigation"],
      "amplify.co-leads": ["navigation"],
      "dsd-team.home": ["body5"],
      "contribute.page": ["introKicker","introTitle","introLede","noticeLead","noticeBody","staffBody"],
      "practice.path-shell": [...addedPracticeKeys,"confidentialRouteNote","artifactPrivacy","readyPreviewBody","browserStorageBody","humanSupportKicker","supportDsdPreviewBody"],
      "paths.index": ["introLede","completionOpenBody","completionPreviewBody"],
      // e097334 (September 10, 2026, "Fix the 65 smoke-test defects ... branding") shortened the program name in the About lede.
      // September 14, 2026: the owner's whole-person purpose directive rewrote the purpose section to
      // stand alongside the transactional/service-delivery purpose, not beneath it.
      "about.page": ["introLede","purposeTitle","purposeBody","purposeBoundary","federationBody","federationBoundary","voluntaryBody","requiredBody","sourcesBody","sourcesBoundary","supportTitle"],
      "my-work.client": ["deleteAllConfirmation","requestsEmpty","intakePreviewBeforeRole","deleteReferenceBody"],
      "ask.page": ["introKicker","introLede","privacyNotice","questionHelp","modeAuto","modeProgram","researchUnavailableHelp","questionTooShort","howItems","shortAnswerTitle","sourceConflictLead","busyProgram","draftReadyBody","draftContinueLabel","draftTransferError","reviewDraftLabel","reviewDraftHelp","reviewDraftPlaceholder","evidencePassagesLabel","inferenceLabel","relatedReadingLabel","howOneDhsSupport","humanJudgmentLead","humanJudgmentBody","answerButton","libraryButton"],
      "site.context": ["oneDhsDescription","oneDsdDescription","choiceAccessNote","oneDsdViewNote","oneDsdActiveNote","optionalViewBody"],
      "start.page": ["introLede","formIntro","resultKicker","emptyResultBody","practiceLinkLabel","supportLinkLabel","areaCommunityEngagementCoDesignTasks"],
      "areas.page": ["introLede","askLabel","practiceLabel","supportLabel","boundaryAfterStart","areaCommunityEngagementCoDesignTasks"],
      "practice.page": ["introLede","choicesTitle","choicesIntro","moreKicker","moreBody","moreLinks"],
      "one-dsd.page": ["sharedItems","dsdItems","door3Description","areasKicker","consultBody","consultBoundary","routeTitle","routeLinks"],
      "support.page": ["introLede","oneDhsBody","oneDsdOpenBody","oneDsdPreviewBody","oneDsdPreviewLink"],
      "support.request.one-dhs": ["introLede","supportBody"],
      "support.request.dsd": ["previewKicker","previewLede","previewPrivacyNote"],
      "support.right-person": ["destinationCommunicationsOrPublicInformationOfficeDescription","destinationOfficeOfIndianPolicyOrTribalLiaisonDescription","eligibilityNotCheckedDescription","eligibilityNotDsdDescription","introKicker","introLede","formKicker","oneDhsRouteNote","submitLabel","resultKicker","emptyResultBody","directoryNote","dsdOptionBody","oneDhsDecisionBody","oneDsdDecisionBody"],
      "support.track.unavailable": ["introLede","availabilityNote"],
      "my-work.page": ["introKicker"],
      "my-view.page": ["introKicker","introLede"],
      "library.page": ["noResultsBody"],
      "graduation-path.gp-4": ["artifactField2Help","privacy"],
      "graduation-path.gp-2": ["graduatedLooksLike"],
      "graduation-path.gp-1": ["artifactField2Help","artifactField3Help","privacy","step3Guidance"],
      "learn.page": ["stageApplicationOutcomes"],
    };
    for (const number of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]) {
      const id = `graduation-path.gp-${number}`;
      forwardValues[id] = [...new Set([...(forwardValues[id] ?? []), "step0Links"])];
    }
    const laterBriefKeys = ["spotlightTitle","spotlightBody","spotlightLinkLabel","spotlightHref","reflectionTitle","reflectionBody"];
    const addedAskKeys = ["draftReadyBody","draftContinueLabel","draftTransferError","reviewDraftLabel","reviewDraftHelp","reviewDraftPlaceholder","evidencePassagesLabel","inferenceLabel","relatedReadingLabel"];
    for (const surface of EDITABLE_SURFACE_REGISTRY.filter(surface => byId.has(surface.surfaceId))) {
      const seeded = byId.get(surface.surfaceId)!;
      const seededValues = seeded.approvedValues as EditableSurfaceValues;
      const addedKeys = surface.surfaceId.startsWith("community-brief.") ? laterBriefKeys : surface.surfaceId === "ask.page" ? addedAskKeys : surface.surfaceId === "practice.path-shell" ? addedPracticeKeys : [];
      expect(surface.fields.filter(field => addedKeys.includes(field.key)).map(field => field.key)).toEqual(addedKeys);
      const changed = Object.keys(surface.approvedValues).filter(key => JSON.stringify(surface.approvedValues[key]) !== JSON.stringify(seededValues[key]));
      expect(changed.sort(),surface.surfaceId).toEqual([...(forwardValues[surface.surfaceId] ?? addedKeys)].sort());
      const historicalValues = { ...surface.approvedValues };
      for (const key of changed) {
        if (Object.hasOwn(seededValues,key)) historicalValues[key] = seededValues[key];
        else delete historicalValues[key];
      }
      const historicProtected = surface.surfaceId.startsWith("graduation-path.")
        ? (surface.protectedFields ?? []).filter(field => field !== "participation") : surface.protectedFields ?? [];
      if (surface.surfaceId.startsWith("graduation-path.")) expect(surface.protectedFields).toContain("participation");
      expect(seeded).toEqual({
        surfaceId: surface.surfaceId, routePattern: surface.route, staffLabel: surface.label, scopePolicy: surface.scopePolicy,
        fieldContract: surface.fields.filter(field => !addedKeys.includes(field.key)),
        protectedFields: historicProtected, requiredReviewDimensions: editableSurfaceReviewDimensions(surface), approvedValues: historicalValues,
      });
      if (surface.surfaceId === "ask.page") {
        expect(surface.approvedValues.introLede).toMatch(/do not accept typed questions/i);
        expect(surface.approvedValues.answerButton).toBe("Browse common questions");
        expect(surface.approvedValues.privacyNotice).toMatch(/browse and download only/i);
        expect(surface.approvedValues.modeProgram).toBe("Answer without a web search");
      }
      if (surface.surfaceId === "paths.index") expect(surface.approvedValues.introLede).toMatch(/thirteen paths/);
      if (surface.surfaceId === "learn.hub") for (const key of forwardValues["learn.hub"]) {
        const before = seededValues[key] as string[]; const after = surface.approvedValues[key] as string[];
        expect(before.every(id => after.includes(id))).toBe(true);
        expect(after.filter(id => !before.includes(id)).every(id => id.startsWith("podcast.") || ALL_COURSE_SURFACES.some(surface => id === "course-" + surface.surfaceId.slice(7)))).toBe(true);
      }
    }
  });

  it("keeps protected assets and the DHS logo outside editable documents", () => {
    const header = embeddedRegistry().find((surface) => surface.surfaceId === "site.header");
    expect(header?.protectedFields).toEqual([
      "dhsLogoAsset",
      "dhsLogoAltText",
      "dhsLogoDimensions",
    ]);
    expect(JSON.stringify(header?.approvedValues)).not.toMatch(/dhsLogo|logoAsset|imageData/i);
    expect(migration).toContain("Protected fields cannot be editable");
  });

  it("starts each community brief as pending governed review, not a publication", () => {
    expect(migration).toContain("seed_surface_id not like 'community-brief.%'");
    expect(migration).toContain("'representationReviewPending', true");
    expect(migration).toContain("else 'pending' end");
    for (const surface of EDITABLE_SURFACE_REGISTRY.filter(({ surfaceId }) => surfaceId.startsWith("community-brief."))) {
      expect(editableSurfaceReviewDimensions(surface)).toContain("community_representation");
      expect(editableSurfaceReviewDimensions(surface)).toContain("rights_and_consent");
    }
  });

  it("makes revisions, reviews, decisions, and events append-only", () => {
    for (const table of [
      "surface_revisions",
      "surface_reviews",
      "surface_publication_decisions",
      "surface_change_events",
    ]) expect(migration).toContain(`create trigger ${table}_append_only`);
    expect(migration).toContain("Editable surface history is append-only");
    expect(migration).not.toMatch(/\bupdate\s+pac\.surface_(?:revisions|reviews|publication_decisions|change_events)\b/i);
    expect(migration).not.toMatch(/\bdelete\s+from\s+pac\.surface_/i);
  });

  it("implements exact scope masking, inheritance, optimistic conflicts, and restoration", () => {
    for (const functionName of [
      "read_surface_publication",
      "read_surface_editing_state",
      "create_surface_draft",
      "record_surface_review",
      "publish_surface_draft",
      "withdraw_surface_publication",
      "resume_surface_inheritance",
      "restore_surface_revision",
    ]) expect(migration).toContain(`function pac.${functionName}`);
    expect(migration).toContain("local_decision.decision = 'withdraw'");
    expect(migration).toContain("local_decision.decision = 'publish'");
    expect(migration).toContain("ignoreThroughRevisionNumber");
    expect(migration.match(/using errcode = '40001'/g)?.length).toBeGreaterThanOrEqual(5);
    expect(migration).toContain("Only previously approved wording can be restored");
  });

  it("grants the application role only narrow function execution", () => {
    for (const table of [
      "surface_definitions",
      "surface_revisions",
      "surface_reviews",
      "surface_publication_decisions",
      "surface_change_events",
    ]) expect(migration).toContain(`revoke all privileges on pac.${table} from public, pac_app_runtime`);
    expect(migration).not.toMatch(/grant\s+(?:select|insert|update|delete)\s+on\s+pac\.surface_/i);
    for (const functionName of [
      "read_surface_publication",
      "read_surface_editing_state",
      "create_surface_draft",
      "record_surface_review",
      "publish_surface_draft",
      "withdraw_surface_publication",
      "resume_surface_inheritance",
      "restore_surface_revision",
    ]) expect(migration).toMatch(new RegExp(`grant execute on function pac\\.${functionName}`));
    for (const privateFunction of [
      "prevent_surface_history_change",
      "assert_surface_request",
      "assert_valid_surface_document",
      "enforce_surface_definition_contract",
      "enforce_surface_revision_contract",
      "enforce_surface_publication_gate",
    ]) expect(migration).toMatch(new RegExp(`revoke all privileges on function pac\\.${privateFunction}`));
  });
});
