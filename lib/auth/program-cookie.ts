import "server-only";

import { PROGRAM_SESSION_SECONDS } from "./program-identity";

export function programSessionCookieOptions(maxAge = PROGRAM_SESSION_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production" || process.env.VERCEL === "1",
    path: "/",
    maxAge,
  };
}
