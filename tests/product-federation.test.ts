import { describe, expect, it } from "vitest";
import {
  DEFAULT_PRODUCT_CONTEXT,
  DSD_ELIGIBILITY_OPTIONS,
  NO_PROTECTED_ACCESS,
  PRODUCT_CONTEXTS,
  PROTECTED_CAPABILITIES,
  START_ROLES,
  START_URGENCIES,
  SUPPORT_DESTINATIONS,
  WORK_AREAS,
  buildStartRecommendation,
  canonicalStaffHref,
  contextualizeSupportAction,
  contextLineage,
  resolveFederatedContext,
  resolveProductContext,
  routeSupport,
  validateStartIntake,
  type DsdEligibilityId,
  type ProductContextId,
  type ProtectedAccess,
  type StartIntake,
} from "@/lib/product";

const BASE_START: StartIntake = {
  role: "staff_member",
  task: "workforce_equity",
  urgency: "exploratory",
};

describe("One DHS and One DSD product federation", () => {
  it("uses One DHS as the default shared spine and layers One DSD over it", () => {
    expect(DEFAULT_PRODUCT_CONTEXT).toBe("one_dhs");
    expect(resolveProductContext()).toBe("one_dhs");
    expect(resolveProductContext("unknown")).toBe("one_dhs");
    expect(contextLineage("one_dhs")).toEqual(["one_dhs"]);
    expect(contextLineage("one_dsd")).toEqual(["one_dhs", "one_dsd"]);
    expect(PRODUCT_CONTEXTS).toEqual([
      expect.objectContaining({ id: "one_dhs", relationship: "shared_spine", inheritsFrom: null }),
      expect.objectContaining({ id: "one_dsd", relationship: "modular_overlay", inheritsFrom: "one_dhs" }),
    ]);
  });

  it("never turns a context preference into protected access", () => {
    const access = {
      ...NO_PROTECTED_ACCESS,
      edit_content: true,
    } satisfies ProtectedAccess;
    const oneDhs = resolveFederatedContext("one_dhs", access);
    const oneDsd = resolveFederatedContext("one_dsd", access);

    expect(oneDhs.contextPreferenceGrantsAccess).toBe(false);
    expect(oneDsd.contextPreferenceGrantsAccess).toBe(false);
    expect(oneDhs.protectedAccess).toEqual(access);
    expect(oneDsd.protectedAccess).toEqual(access);
    for (const capability of PROTECTED_CAPABILITIES) {
      expect(oneDsd.protectedAccess[capability]).toBe(oneDhs.protectedAccess[capability]);
    }
    expect(resolveFederatedContext("one_dsd").protectedAccess).toEqual(NO_PROTECTED_ACCESS);
  });
});

describe("work-area and Start contracts", () => {
  it("normalizes active legacy staff links without rewriting historical records", () => {
    expect(canonicalStaffHref("/guided-start")).toBe("/start");
    expect(canonicalStaffHref("/resources/pn-example?from=ask")).toBe("/library/pn-example?from=ask");
    expect(canonicalStaffHref("/paths/foundations#step-2")).toBe("/practice/foundations#step-2");
    expect(canonicalStaffHref("/paths")).toBe("/learn");
    expect(canonicalStaffHref("/my-view")).toBe("/my-work");
    expect(canonicalStaffHref("https://example.org/resources")).toBe("https://example.org/resources");
  });

  it("contains the nine work areas from the controlling build authority", () => {
    expect(WORK_AREAS.map((area) => area.label)).toEqual([
      "Workforce equity",
      "Policy, program, and service design",
      "Community engagement and co-design",
      "Accessibility and language access",
      "Culture, trust, and repair",
      "Leadership and systems change",
      "Data, research, quality, and measurement",
      "Fiscal, grants, procurement, and contracts",
      "Communications and public information",
    ]);
    expect(new Set(WORK_AREAS.map((area) => area.id)).size).toBe(9);
    for (const area of WORK_AREAS) {
      expect(area.tasks.length).toBeGreaterThanOrEqual(3);
      expect(area.responsibleDestinations.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("requires role, task, and urgency while defaulting an omitted context to One DHS", () => {
    expect(validateStartIntake({})).toEqual({
      ok: false,
      issues: [
        { field: "role", message: "Choose the role closest to your work." },
        { field: "task", message: "Choose the area closest to your task." },
        { field: "urgency", message: "Choose when you need to act." },
      ],
    });
    expect(validateStartIntake(BASE_START)).toEqual({
      ok: true,
      value: { ...BASE_START, contextPreference: "one_dhs" },
    });
    expect(validateStartIntake({ ...BASE_START, contextPreference: "other" })).toEqual({
      ok: false,
      issues: [{ field: "contextPreference", message: "Choose One DHS or One DSD." }],
    });
  });

  it("uses all three Start answers in a clear recommendation", () => {
    const recommendation = buildStartRecommendation({
      contextPreference: "one_dsd",
      role: "data_research_or_quality_professional",
      task: "data_research_quality_measurement",
      urgency: "hard_deadline",
    });
    expect(recommendation).toMatchObject({
      context: "one_dsd",
      lineage: ["one_dhs", "one_dsd"],
      basis: {
        role: "data_research_or_quality_professional",
        task: "data_research_quality_measurement",
        urgency: "hard_deadline",
      },
      role: { label: "Data, research, or quality professional" },
      workArea: { label: "Data, research, quality, and measurement" },
      urgency: { label: "I have a firm deadline" },
      heading: "Start with Data, research, quality, and measurement.",
    });
    expect(recommendation.guidance).toContain("Use evidence");
    expect(recommendation.guidance).toContain("deadline");
  });
});

describe("institutional support routing", () => {
  it("never exposes a DSD consultation action in the One DHS view", () => {
    const consultation = { label: "Request a consultation", href: "/support/request?from=resource" };

    expect(contextualizeSupportAction(consultation, "one_dhs", true)).toEqual({
      label: "Find the right person or office",
      href: "/support/right-person",
    });
    expect(contextualizeSupportAction(consultation, "one_dhs", false)).toEqual({
      label: "Find the right person or office",
      href: "/support/right-person",
    });
    expect(contextualizeSupportAction(consultation, "one_dsd", false)).toEqual({
      label: "Preview a DSD consultation request",
      href: "/support/request?from=resource",
    });
    expect(contextualizeSupportAction(consultation, "one_dsd", true)).toEqual(consultation);
  });

  it("offers DSD consultation only for DSD context with a separate DSD attestation", () => {
    const contexts: Array<ProductContextId | undefined> = [undefined, "one_dhs", "one_dsd"];
    const eligibilityOptions = DSD_ELIGIBILITY_OPTIONS.map((option) => option.id);

    for (const contextPreference of contexts) {
      for (const dsdEligibility of eligibilityOptions) {
        const decision = routeSupport({ ...BASE_START, contextPreference, dsdEligibility });
        const shouldOfferDsd = contextPreference === "one_dsd" && dsdEligibility === "self_attested_dsd";
        expect(decision.kind).toBe(shouldOfferDsd ? "dsd_consultation" : "right_person");
        expect(decision.contextPreferenceGrantsAccess).toBe(false);
        if (decision.kind === "dsd_consultation") {
          expect(decision).toMatchObject({
            scope: "one_dsd",
            dsdConsultation: {
              destination: "one_dsd_consultation_intake",
              entryStatus: "pending_eligibility_review",
              activeQueueAdmission: false,
            },
          });
        } else {
          expect(decision.scope).toBe("one_dhs");
          expect(decision.dsdConsultation).toBeNull();
        }
      }
    }
  });

  it("routes every non-DSD work area to responsible institutional roles or offices", () => {
    for (const area of WORK_AREAS) {
      const decision = routeSupport({
        ...BASE_START,
        contextPreference: "one_dsd",
        task: area.id,
        dsdEligibility: "not_dsd",
      });
      expect(decision.kind).toBe("right_person");
      expect(decision.destinations.map((destination) => destination.category)).toEqual(
        expect.arrayContaining(["supervisor", "equity_director", "equity_specialist"]),
      );
      expect(decision.destinations.some((destination) =>
        ["office_or_lead", "formal_channel"].includes(destination.category))).toBe(true);
    }
  });

  it("includes formal accommodation routes in accessibility and language-access support", () => {
    const decision = routeSupport({
      ...BASE_START,
      task: "accessibility_language_access",
      dsdEligibility: "not_dsd",
    });
    expect(decision.destinations.map(({ id }) => id)).toEqual(
      expect.arrayContaining([
        "accessibility_or_language_access_lead",
        "human_resources",
        "civil_rights_channel",
      ]),
    );
  });

  it("uses role and task to order the right responsible route", () => {
    const staffRoute = routeSupport({
      ...BASE_START,
      dsdEligibility: "not_dsd",
    });
    const workforceRoute = routeSupport({
      ...BASE_START,
      role: "workforce_or_human_resources_professional",
      dsdEligibility: "not_dsd",
    });
    const procurementRoute = routeSupport({
      ...BASE_START,
      role: "fiscal_procurement_or_contracts_professional",
      task: "fiscal_grants_procurement_contracts",
      dsdEligibility: "not_dsd",
    });

    expect(staffRoute.destinations[0].id).toBe("supervisor_or_manager");
    expect(workforceRoute.destinations[0].id).toBe("human_resources");
    expect(procurementRoute.destinations[0].id).toBe("procurement_or_contract_office");
  });

  it("rejects an unknown eligibility value instead of widening consultation", () => {
    expect(() => routeSupport({
      ...BASE_START,
      contextPreference: "one_dsd",
      dsdEligibility: "unknown" as DsdEligibilityId,
    })).toThrow("Choose whether this work is within the Disability Services Division.");
  });

  it("uses warm adult labels without naming a person or a personal queue", () => {
    const staffCopy = [
      ...PRODUCT_CONTEXTS.flatMap((item) => [item.label, item.description]),
      ...WORK_AREAS.flatMap((item) => [item.label, item.summary, ...item.tasks]),
      ...START_ROLES.flatMap((item) => [item.label, item.guidance]),
      ...START_URGENCIES.flatMap((item) => [item.label, item.guidance]),
      ...SUPPORT_DESTINATIONS.flatMap((item) => [item.label, item.description]),
      ...DSD_ELIGIBILITY_OPTIONS.flatMap((item) => [item.label, item.description]),
      JSON.stringify(routeSupport({
        ...BASE_START,
        contextPreference: "one_dsd",
        dsdEligibility: "self_attested_dsd",
      })),
    ];

    for (const text of staffCopy) {
      expect(text.trim().length).toBeGreaterThan(2);
      expect(text).not.toMatch(/\b(?:orchestrator|agent persona|risk taxonomy|RBAC)\b/i);
      expect(text).not.toMatch(/\bGary\b|\bBanks\b|personal queue|my queue|consultant queue/i);
    }
  });
});
