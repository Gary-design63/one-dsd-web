import "server-only";

import {
  programIdentityConfigured,
  programIdentityStore,
  type PostgresProgramIdentityStore,
} from "./program-identity";

export type ProgramIdentityHousekeepingResult = Readonly<{
  configured: boolean;
  expiredInvitationsClosed: number;
  expiredSessionsDeleted: number;
}>;

type HousekeepingStore = Pick<PostgresProgramIdentityStore, "runSecurityHousekeeping">;

/**
 * Remove expired bearer material whenever the restricted runtime connection is
 * configured. This intentionally does not depend on feature activation or a
 * stop control: disabling a feature must never extend secret retention.
 */
export async function runProgramIdentityHousekeepingIfConfigured(
  environment: NodeJS.ProcessEnv = process.env,
  storeFactory: () => HousekeepingStore = programIdentityStore,
): Promise<ProgramIdentityHousekeepingResult> {
  if (!programIdentityConfigured(environment)) {
    return Object.freeze({
      configured: false,
      expiredInvitationsClosed: 0,
      expiredSessionsDeleted: 0,
    });
  }

  const result = await storeFactory().runSecurityHousekeeping();
  return Object.freeze({ configured: true, ...result });
}
