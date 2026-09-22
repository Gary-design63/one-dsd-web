import { describe, expect, it, vi } from "vitest";
import { runProgramIdentityHousekeepingIfConfigured } from "@/lib/auth/program-identity-housekeeping";

describe("program identity housekeeping", () => {
  it("skips safely when the restricted runtime connection is absent", async () => {
    const factory = vi.fn();
    await expect(runProgramIdentityHousekeepingIfConfigured({ NODE_ENV: "test" }, factory)).resolves.toEqual({
      configured: false,
      expiredInvitationsClosed: 0,
      expiredSessionsDeleted: 0,
    });
    expect(factory).not.toHaveBeenCalled();
  });

  it("runs independently of feature and stop settings and returns counts only", async () => {
    const runSecurityHousekeeping = vi.fn().mockResolvedValue({
      expiredInvitationsClosed: 4,
      expiredSessionsDeleted: 7,
    });
    const result = await runProgramIdentityHousekeepingIfConfigured({
      NODE_ENV: "test",
      PAC_CONTRIBUTOR_DATABASE_URL: "postgresql://pac_contributor_runtime:secret@localhost/pac",
      PAC_PROTECTED_IDENTITY_ENABLED: "off",
      PAC_KILL_SWITCH: "on",
      PAC_SCHEDULED_OPERATION_KILL_SWITCH: "on",
    }, () => ({ runSecurityHousekeeping } as never));

    expect(runSecurityHousekeeping).toHaveBeenCalledOnce();
    expect(result).toEqual({
      configured: true,
      expiredInvitationsClosed: 4,
      expiredSessionsDeleted: 7,
    });
    expect(Object.keys(result).sort()).toEqual([
      "configured",
      "expiredInvitationsClosed",
      "expiredSessionsDeleted",
    ]);
  });
});
