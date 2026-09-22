import { describe, expect, it } from "vitest";
import { programIdentityHasRole } from "@/lib/auth/program-request";
import type { ProgramIdentity, ProgramRole, ProgramScope } from "@/lib/auth/program-identity";

function identityWith(
  grants: Array<{ scopeId: ProgramScope; role: ProgramRole; expiresAt?: string | null }>,
): ProgramIdentity {
  return {
    sessionId: "11111111-1111-4111-8111-111111111111",
    accountId: "22222222-2222-4222-8222-222222222222",
    signInId: "named.person",
    displayName: "Named Person",
    credentialId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    issuedAt: "2026-09-05T12:00:00.000Z",
    expiresAt: "2099-09-05T20:00:00.000Z",
    grants: grants.map((grant, index) => ({
      grantId: `${String(index + 3).repeat(8)}-${String(index + 3).repeat(4)}-4${String(index + 3).repeat(3)}-8${String(index + 3).repeat(3)}-${String(index + 3).repeat(12)}`,
      scopeId: grant.scopeId,
      role: grant.role,
      expiresAt: grant.expiresAt ?? null,
    })),
  };
}

describe("named-role scope checks", () => {
  it("accepts an exact grant and an ancestor-scope grant", () => {
    const identity = identityWith([
      { scopeId: "one-dhs", role: "content_contributor" },
    ]);
    expect(programIdentityHasRole(identity, "one-dhs", "content_contributor")).toBe(true);
    expect(programIdentityHasRole(identity, "dsd", "content_contributor")).toBe(true);
  });

  it("does not let a descendant grant govern its ancestor", () => {
    const identity = identityWith([
      { scopeId: "dsd", role: "program_steward" },
      { scopeId: "one-dsd-team", role: "publishing_approver" },
    ]);
    expect(programIdentityHasRole(identity, "adsa", "program_steward")).toBe(false);
    expect(programIdentityHasRole(identity, "dsd", "publishing_approver")).toBe(false);
  });

  it("rejects expired grants and keeps owner distinct from contribution roles", () => {
    const identity = identityWith([
      { scopeId: "one-dhs-pac", role: "owner" },
      {
        scopeId: "one-dhs",
        role: "content_contributor",
        expiresAt: "2000-01-01T00:00:00.000Z",
      },
    ]);
    expect(programIdentityHasRole(identity, "one-dhs-pac", "owner")).toBe(true);
    expect(programIdentityHasRole(identity, "one-dhs", "content_contributor")).toBe(false);
    expect(programIdentityHasRole(identity, "one-dhs", "program_steward")).toBe(false);
    expect(programIdentityHasRole(identity, "one-dhs", "publishing_approver")).toBe(false);
  });
});
