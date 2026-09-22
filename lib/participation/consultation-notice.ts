/**
 * Canonical identity for the active DSD consultation participation notice.
 *
 * This module must stay dependency-free. Both the participation registry and
 * consultation input validation load it during module initialization.
 */
export const CONSULTATION_PARTICIPATION_NOTICE_ID = "dsd_consultation_request" as const;
export const CONSULTATION_PARTICIPATION_NOTICE_CONTRACT_VERSION = 1 as const;
export const CONSULTATION_PARTICIPATION_NOTICE_VERSION =
  `${CONSULTATION_PARTICIPATION_NOTICE_CONTRACT_VERSION}.0.0` as const;
