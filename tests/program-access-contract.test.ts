import { describe, expect, it } from "vitest";
import {
  ACCESS_ASSIGNABLE_ROLES,
  ACCESS_ROLE_SCOPES,
  ProgramAccessActionSchema,
} from "@/lib/auth/program-access-contract";

const ACCOUNT_ID = "11111111-1111-4111-8111-111111111111";
const GRANT_ID = "22222222-2222-4222-8222-222222222222";

describe("program people-and-access action contract", () => {
  it("exposes only the exact assignable protected-v1 role and scope matrix", () => {
    expect(ACCESS_ASSIGNABLE_ROLES).toEqual([
      "content_contributor",
      "program_steward",
      "publishing_approver",
      "one_dsd_team_member",
    ]);
    expect(ACCESS_ROLE_SCOPES).toEqual({
      content_contributor: ["one-dhs", "dsd"],
      program_steward: ["one-dhs", "dsd"],
      publishing_approver: ["one-dhs", "dsd"],
      one_dsd_team_member: ["one-dsd-team"],
    });
    expect(ACCESS_ASSIGNABLE_ROLES).not.toContain("owner");
    expect(ACCESS_ASSIGNABLE_ROLES).not.toContain("equity_director");
  });

  it.each([
    ["content_contributor", "one-dhs"],
    ["content_contributor", "dsd"],
    ["program_steward", "one-dhs"],
    ["program_steward", "dsd"],
    ["publishing_approver", "one-dhs"],
    ["publishing_approver", "dsd"],
    ["one_dsd_team_member", "one-dsd-team"],
  ] as const)("accepts %s only within its supported %s area", (role, scopeId) => {
    expect(ProgramAccessActionSchema.safeParse({
      action: "issue_grant",
      accountId: ACCOUNT_ID,
      role,
      scopeId,
      expiresInDays: 90,
      reason: "Approved named responsibility",
    }).success).toBe(true);
  });

  it.each([
    ["content_contributor", "one-dsd-team"],
    ["program_steward", "one-dsd-team"],
    ["publishing_approver", "one-dsd-team"],
    ["one_dsd_team_member", "one-dhs"],
    ["one_dsd_team_member", "dsd"],
  ] as const)("rejects the unsupported %s and %s combination", (role, scopeId) => {
    expect(ProgramAccessActionSchema.safeParse({
      action: "issue_grant",
      accountId: ACCOUNT_ID,
      role,
      scopeId,
      expiresInDays: 90,
      reason: "Unsupported assignment",
    }).success).toBe(false);
  });

  it("rejects unknown fields, unbounded durations, control characters, and owner allocation", () => {
    const base = {
      action: "issue_grant",
      accountId: ACCOUNT_ID,
      role: "content_contributor",
      scopeId: "one-dhs",
      expiresInDays: 90,
      reason: "Approved named responsibility",
    } as const;
    expect(ProgramAccessActionSchema.safeParse({ ...base, unexpected: true }).success).toBe(false);
    expect(ProgramAccessActionSchema.safeParse({ ...base, expiresInDays: 9_999 }).success).toBe(false);
    expect(ProgramAccessActionSchema.safeParse({ ...base, reason: "line\nbreak" }).success).toBe(false);
    expect(ProgramAccessActionSchema.safeParse({ ...base, role: "owner", scopeId: "one-dhs-pac" }).success).toBe(false);
  });

  it("matches database-safe reason limits for account revocation and owner transfer", () => {
    const accountState = (length: number) => ProgramAccessActionSchema.safeParse({
      action: "change_account_state",
      accountId: ACCOUNT_ID,
      state: "revoked",
      reason: "r".repeat(length),
      confirmSignInId: "named.person",
    }).success;
    const transfer = (length: number) => ProgramAccessActionSchema.safeParse({
      action: "transfer_owner",
      successorAccountId: ACCOUNT_ID,
      expectedIdentityVersion: 1,
      confirmSignInId: "next.owner",
      reason: "r".repeat(length),
    }).success;

    expect(accountState(483)).toBe(true);
    expect(accountState(484)).toBe(false);
    expect(transfer(471)).toBe(true);
    expect(transfer(472)).toBe(false);
  });

  it("accepts only the bounded invitation and reset lifetimes", () => {
    for (const expiresInHours of [24, 72, 168]) {
      expect(ProgramAccessActionSchema.safeParse({
        action: "invite_account",
        signInId: "named.person",
        displayName: "Named Person",
        expiresInHours,
      }).success).toBe(true);
    }
    expect(ProgramAccessActionSchema.safeParse({
      action: "invite_account",
      signInId: "named.person",
      displayName: "Named Person",
      expiresInHours: 720,
    }).success).toBe(false);

    for (const expiresInHours of [1, 8, 24]) {
      expect(ProgramAccessActionSchema.safeParse({
        action: "invite_credential_reset",
        accountId: ACCOUNT_ID,
        expiresInHours,
      }).success).toBe(true);
    }
    expect(ProgramAccessActionSchema.safeParse({
      action: "invite_credential_reset",
      accountId: ACCOUNT_ID,
      expiresInHours: 168,
    }).success).toBe(false);
  });

  it("requires typed identifiers for revocation actions", () => {
    expect(ProgramAccessActionSchema.safeParse({
      action: "revoke_grant",
      grantId: GRANT_ID,
      reason: "Responsibility ended",
    }).success).toBe(true);
    expect(ProgramAccessActionSchema.safeParse({
      action: "revoke_grant",
      grantId: "not-a-grant",
      reason: "Responsibility ended",
    }).success).toBe(false);
  });

  it("requires separate exact confirmation only for permanent account revocation", () => {
    const base = {
      action: "change_account_state",
      accountId: ACCOUNT_ID,
      reason: "Approved account lifecycle change",
    } as const;
    expect(ProgramAccessActionSchema.safeParse({ ...base, state: "revoked" }).success).toBe(false);
    expect(ProgramAccessActionSchema.safeParse({
      ...base,
      state: "revoked",
      confirmSignInId: "named.person",
    }).success).toBe(true);
    expect(ProgramAccessActionSchema.safeParse({
      ...base,
      state: "suspended",
      confirmSignInId: "named.person",
    }).success).toBe(false);
    expect(ProgramAccessActionSchema.safeParse({ ...base, state: "suspended" }).success).toBe(true);
  });

  it("accepts only a strict, versioned identity-correction request", () => {
    const correction = {
      action: "correct_account_identity",
      accountId: ACCOUNT_ID,
      expectedIdentityVersion: 2,
      confirmCurrentSignInId: "named.person",
      signInId: "corrected.person",
      displayName: "Corrected Person",
      reason: "Correct a verified entry error",
    } as const;
    expect(ProgramAccessActionSchema.safeParse(correction).success).toBe(true);
    expect(ProgramAccessActionSchema.safeParse({ ...correction, expectedIdentityVersion: 0 }).success).toBe(false);
    expect(ProgramAccessActionSchema.safeParse({ ...correction, confirmCurrentSignInId: "UPPER.CASE" }).success).toBe(true);
    const parsed = ProgramAccessActionSchema.parse({ ...correction, confirmCurrentSignInId: "UPPER.CASE" });
    expect(parsed.action).toBe("correct_account_identity");
    if (parsed.action !== "correct_account_identity") throw new Error("Unexpected parsed action.");
    expect(parsed.confirmCurrentSignInId).toBe("upper.case");
    expect(ProgramAccessActionSchema.safeParse({ ...correction, extraHistory: true }).success).toBe(false);
    expect(ProgramAccessActionSchema.safeParse({ ...correction, reason: "private\ncase" }).success).toBe(false);
  });
});
