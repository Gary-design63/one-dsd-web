import "server-only";

import { getStore } from "@/lib/intelligence/memory/store";
import { verifiedOwnerSession } from "./owner";
import {
  ownerSessionRevocationId,
  type OwnerSessionRevocation,
} from "./owner-session-revocation";

export async function ownerSessionIsActive(cookieValue: string | undefined): Promise<boolean> {
  const session = verifiedOwnerSession(cookieValue);
  if (!session) return false;
  try {
    const revoked = await getStore().get<OwnerSessionRevocation>("decision", ownerSessionRevocationId(session.sid));
    return revoked === null;
  } catch {
    return false;
  }
}

export async function revokeOwnerSession(cookieValue: string | undefined): Promise<boolean> {
  const session = verifiedOwnerSession(cookieValue);
  if (!session) return false;
  const objectId = ownerSessionRevocationId(session.sid);
  const sessionHash = objectId.slice("owner-session-revoked-".length);
  const value: OwnerSessionRevocation = {
    kind: "owner_session_revocation",
    session_hash: sessionHash,
    revoked_at: new Date().toISOString(),
    expires_at: new Date(session.exp * 1000).toISOString(),
  };
  await getStore().put("decision", objectId, value);
  return true;
}
