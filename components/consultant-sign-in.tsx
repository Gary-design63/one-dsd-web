"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { safeConsultantReturnPath } from "@/lib/auth/consultant-return";

export function ConsultantSignIn({ usesStarterKey }: { usesStarterKey: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo = safeConsultantReturnPath(pathname);

  return (
    <>
      {searchParams?.get("denied") === "1" ? (
        <p className="notice notice--stop mt-6 max-w-md" role="alert">
          The workspace access key did not match. Check it and try again.
        </p>
      ) : null}
      <form method="post" action="/api/consultant/login" className="card mt-6 max-w-md">
        <input type="hidden" name="returnTo" value={returnTo} />
        <div className="field">
          <label htmlFor="key">Workspace access key</label>
          <p className="help m-0">
            {usesStarterKey
              ? "This local copy still uses its starter access key: local-dev-owner. Replace it before anyone else uses the workspace."
              : "Enter your Consultant Workspace access key."}
          </p>
          <input id="key" name="key" type="password" autoComplete="current-password" required />
        </div>
        <button type="submit" className="btn btn--primary">Open the workspace</button>
      </form>
    </>
  );
}
