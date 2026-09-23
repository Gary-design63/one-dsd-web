import { readFileSync } from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  handleResourceReleaseGet,
  handleResourceReleasePost,
} from "@/app/api/consultant/resources/[id]/release/handlers";
import { issueSessionCookieValue, OWNER_COOKIE } from "@/lib/auth/owner";
import { CORPUS } from "@/lib/content/corpus";
import {
  staffReleaseValidationIssues,
  type ResourceReleaseState,
} from "@/lib/content/resource-release-contract";
import {
  PostgresResourceReleaseStore,
  type ResourceReleaseDatabase,
} from "@/lib/content/resource-release";

const ROOT = path.resolve(__dirname, "..");
const RESOURCE = CORPUS[0];
const PUBLISHED_REVISION = "00000000-0000-4000-8000-000000000001";
const REVIEW_ID = "00000000-0000-4000-8000-000000000003";
const DRAFT_REVISION = "00000000-0000-4000-8000-000000000002";
const ORIGINAL_OWNER_KEY = process.env.PAC_OWNER_KEY;

function releaseState(overrides: Partial<ResourceReleaseState> = {}): ResourceReleaseState {
  const publishedPayload = { ...RESOURCE, status: "approved" as const, accessibility: "reviewed" as const };
  const draftPayload = {
    ...RESOURCE,
    title: "Reviewed draft resource",
    status: "under_review" as const,
    accessibility: "pending" as const,
  };
  return {
    contentItemId: RESOURCE.id,
    requestedScopeId: "one-dhs",
    scopeDecisionId: "1",
    scopeDecision: "publish",
    published: {
      revisionId: PUBLISHED_REVISION,
      revisionNumber: 1,
      publicationDecisionId: "1",
      scopeId: "one-dhs",
      payload: publishedPayload,
      decidedAt: "2026-09-05T00:00:00.000Z",
      isInherited: false,
    },
    draft: {
      revisionId: DRAFT_REVISION,
      revisionNumber: 2,
      payload: draftPayload,
      changeSummary: "Clarified the resource.",
      createdAt: "2026-09-05T01:00:00.000Z",
      requiredReviewDimensions: [
        "language_alignment",
        "factual_currentness",
        "accessibility",
        "scope",
        "placement",
      ],
      reviews: [
        {
          dimension: "language_alignment",
          reviewId: REVIEW_ID,
          status: "pending",
          note: null,
          recordedAt: "2026-09-05T01:00:00.000Z",
        },
      ],
      readyToPublish: false,
    },
    withdrawn: false,
    history: [
      {
        revisionId: PUBLISHED_REVISION,
        revisionNumber: 1,
        publicationDecisionId: "1",
        scopeId: "one-dhs",
        title: RESOURCE.title,
        payload: publishedPayload,
        isInherited: false,
        decidedAt: "2026-09-05T00:00:00.000Z",
        isCurrent: true,
      },
    ],
    ...overrides,
  };
}

function request(method: "GET" | "POST", body: unknown, owner = true, crossSite = false) {
  const headers = new Headers({ origin: crossSite ? "https://outside.example" : "https://program.example" });
  if (method === "POST") headers.set("content-type", "application/json");
  if (owner) headers.set("cookie", `${OWNER_COOKIE}=${issueSessionCookieValue()}`);
  return new NextRequest(`https://program.example/api/consultant/resources/${RESOURCE.id}/release`, {
    method,
    headers,
    body: method === "POST" ? JSON.stringify(body) : undefined,
  });
}

beforeEach(() => {
  process.env.PAC_OWNER_KEY = "resource-release-test-owner";
});

afterEach(() => {
  if (ORIGINAL_OWNER_KEY === undefined) delete process.env.PAC_OWNER_KEY;
  else process.env.PAC_OWNER_KEY = ORIGINAL_OWNER_KEY;
});

describe("owner resource release route", () => {
  // Owner access is automatic: an unsigned request is no longer rejected on that basis
  // alone. The cross-site origin check still applies to mutations.
  it("rejects a cross-site mutation, regardless of the owner cookie", async () => {
    const crossSite = await handleResourceReleasePost(
      request("POST", { action: "withdraw" }, true, true),
      RESOURCE.id,
    );
    expect(crossSite.status).toBe(403);
  });

  it("rejects an oversized release action before calling the release service", async () => {
    const service = {
      read: vi.fn(async () => releaseState()),
      act: vi.fn(async () => releaseState()),
    };
    const response = await handleResourceReleasePost(
      request("POST", { action: "withdraw", reason: "x".repeat(17_000) }),
      RESOURCE.id,
      service,
    );

    expect(response.status).toBe(413);
    expect(service.read).not.toHaveBeenCalled();
    expect(service.act).not.toHaveBeenCalled();
  });

  it("records an owner review decision without publishing", async () => {
    const state = releaseState();
    const service = {
      read: vi.fn(async () => state),
      act: vi.fn(async () => state),
    };
    const action = {
      action: "review",
      revisionId: DRAFT_REVISION,
      dimension: "accessibility",
      expectedPriorReviewId: REVIEW_ID,
      decision: "pass",
      note: "Checked with keyboard and screen reader use.",
    };
    const response = await handleResourceReleasePost(
      request("POST", action),
      RESOURCE.id,
      service,
    );
    expect(response.status).toBe(200);
    expect(service.read).not.toHaveBeenCalled();
    expect(service.act).toHaveBeenCalledWith(RESOURCE.id, action);
  });

  it("checks staff language, formatting, and icons again before publication", async () => {
    const unsafe = releaseState();
    unsafe.draft!.payload.title = "AI helper **draft** 🤖";
    const service = {
      read: vi.fn(async () => unsafe),
      act: vi.fn(async () => unsafe),
    };
    const response = await handleResourceReleasePost(
      request("POST", {
        action: "publish",
        revisionId: DRAFT_REVISION,
        expectedScopeDecisionId: "1",
        reason: "Approved after review.",
        sensitivityClass: "S1",
        unauthenticatedExposurePermitted: true,
        exposureReason: "Reviewed internal-purpose material approved for the staff-facing web address.",
      }),
      RESOURCE.id,
      service,
    );
    expect(response.status).toBe(422);
    expect(service.act).not.toHaveBeenCalled();
    expect(staffReleaseValidationIssues(unsafe.draft!.payload)).not.toHaveLength(0);
  });

  it("rejects publish and restore requests without an explicit safe exposure decision", async () => {
    const state = releaseState();
    const service = {
      read: vi.fn(async () => state),
      act: vi.fn(async () => state),
    };
    const missingDecision = await handleResourceReleasePost(
      request("POST", {
        action: "publish",
        revisionId: DRAFT_REVISION,
        expectedScopeDecisionId: "1",
        reason: "Approved after review.",
      }),
      RESOURCE.id,
      service,
    );
    const protectedClassification = await handleResourceReleasePost(
      request("POST", {
        action: "republish",
        revisionId: PUBLISHED_REVISION,
        expectedScopeDecisionId: "1",
        reason: "Restore the approved version.",
        sensitivityClass: "S2",
        unauthenticatedExposurePermitted: true,
        exposureReason: "This request must not make unreviewed material visible.",
      }),
      RESOURCE.id,
      service,
    );
    const exposureNotApproved = await handleResourceReleasePost(
      request("POST", {
        action: "republish",
        revisionId: PUBLISHED_REVISION,
        expectedScopeDecisionId: "1",
        reason: "Restore the approved version.",
        sensitivityClass: "S1",
        unauthenticatedExposurePermitted: false,
        exposureReason: "This request must record an affirmative decision.",
      }),
      RESOURCE.id,
      service,
    );

    expect(missingDecision.status).toBe(400);
    expect(protectedClassification.status).toBe(400);
    expect(exposureNotApproved.status).toBe(400);
    expect(service.read).not.toHaveBeenCalled();
    expect(service.act).not.toHaveBeenCalled();
  });
});

describe("least-privilege resource release store", () => {
  it("uses only fixed database functions for reads and changes", async () => {
    const state = releaseState();
    const calls: Array<{ statement: string; parameters: readonly unknown[] }> = [];
    const database: ResourceReleaseDatabase = {
      async query<T extends Record<string, unknown>>(
        statement: string,
        parameters: readonly unknown[] = [],
      ): Promise<T[]> {
        calls.push({ statement, parameters });
        if (statement.includes("list_resource_release_queue")) {
          return [{
            content_item_id: RESOURCE.id,
            title: RESOURCE.title,
            has_draft: true,
            ready_to_publish: false,
            is_published: true,
            changed_at: "2026-09-05T01:00:00.000Z",
          }] as unknown as T[];
        }
        return [{ release_state: state }] as unknown as T[];
      },
      async close() {},
    };
    const store = new PostgresResourceReleaseStore({
      databaseUrl: "postgresql://pac_app_runtime:secret@example.test:5432/postgres",
      databaseFactory: () => database,
    });

    await store.read(RESOURCE.id, "one-dhs");
    await store.list("one-dhs");
    await store.recordReview(RESOURCE.id, "one-dhs", DRAFT_REVISION, "scope", REVIEW_ID, "pass", null);
    await store.publish(
      RESOURCE.id,
      "one-dhs",
      DRAFT_REVISION,
      "1",
      "Approved after review.",
      "S1",
      true,
      "Reviewed internal-purpose material approved for staff access without sign-in.",
    );
    await store.withdraw(RESOURCE.id, "one-dhs", PUBLISHED_REVISION, "1", "Temporarily unavailable.");
    await store.republish(
      RESOURCE.id,
      "one-dhs",
      PUBLISHED_REVISION,
      "1",
      "Restore the approved version.",
      "S1",
      true,
      "Reviewed internal-purpose material approved for staff access without sign-in.",
    );

    const statements = calls.map((call) => call.statement).join("\n");
    for (const functionName of [
      "read_resource_release_state",
      "list_resource_release_queue",
      "record_resource_review",
      "publish_resource_draft",
      "withdraw_resource_publication",
      "republish_resource_revision",
    ]) {
      expect(statements).toContain(`pac.${functionName}`);
    }
    expect(statements).not.toMatch(
      /\b(?:from|join|insert into|update|delete from)\s+pac\.(?:content_|review_|publication_|change_|source_)/i,
    );
  });
});

describe("trusted resource release migration", () => {
  const migration = readFileSync(
    path.join(ROOT, "db", "migrations", "0010_pac_trusted_resource_release.sql"),
    "utf8",
  );

  it("requires explicit S0/S1 exposure data and removes the legacy runtime path", () => {
    expect(migration).toContain("requested_sensitivity_class not in ('S0', 'S1')");
    expect(migration).toContain("requested_unauthenticated_exposure_permitted is distinct from true");
    expect(migration).toContain("unauthenticated_exposure_permitted, exposure_reason");
    expect(migration).toContain("requested_revision.sensitivity_class is distinct from requested_sensitivity_class");
    expect(migration).toContain(
      "revoke execute on function pac.publish_resource_draft(text, text, uuid, bigint, text) from pac_app_runtime",
    );
    expect(migration).toContain(
      "grant execute on function pac.publish_resource_draft(text, text, uuid, bigint, text, text, boolean, text) to pac_app_runtime",
    );
  });

  it("limits the legacy correction to the named governed seed release", () => {
    expect(migration).toContain("permanent-seed-staff-release-2026-09-05");
    expect(migration).toMatch(/release_rows\s*<>\s*25\s+or\s+release_items\s*<>\s*25/);
    expect(migration).toContain("trust_decision_source', 'governed_seed_release'");
    expect(migration).toContain("model_context_allowed = false");
  });
});

describe("append-only resource release migration", () => {
  const migration = readFileSync(
    path.join(ROOT, "db", "migrations", "0008_pac_owner_resource_release.sql"),
    "utf8",
  );

  it("requires explicit reviews and release decisions without direct table grants", () => {
    expect(migration.match(/security definer/g)).toHaveLength(8);
    expect(migration).toContain("Complete every required review before publication");
    expect(migration).toContain("perform pac.assert_resource_staff_release(draft_revision.revision_id)");
    expect(migration).toContain("perform pac.assert_resource_staff_release(release_revision_id)");
    expect(migration).toContain("insert into pac.publication_decisions");
    expect(migration).toContain("'withdraw'");
    expect(migration).toContain("'restored_previous_revision', true");
    expect(migration).not.toMatch(/grant\s+(?:select|insert|update|delete)\s+on\s+pac\./i);
    expect(migration).not.toMatch(/\bupdate\s+pac\.|\bdelete\s+from\s+pac\./i);
  });

  it("grants the runtime login only the fixed resource editing and release functions", () => {
    const grants = migration.match(/grant execute on function pac\.[^;]+;/g) ?? [];
    expect(grants).toHaveLength(8);
    expect(grants.every((grant) => grant.endsWith("to pac_app_runtime;"))).toBe(true);
    expect(migration).toContain("revoke all privileges on pac.publication_decisions from pac_app_runtime");
    expect(migration).toContain("revoke all privileges on pac.review_records from pac_app_runtime");
  });
});
