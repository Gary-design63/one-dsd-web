import "server-only";

import { PROGRAM_SESSION_SECONDS } from "./program-identity";
import { offlineModeEnabled } from "@/lib/offline/mode";

export function programSessionCookieOptions(maxAge = PROGRAM_SESSION_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    // The offline edition is opened over plain HTTP on the local network.
    secure: (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") && !offlineModeEnabled(),
    path: "/",
    maxAge,
  };
}
