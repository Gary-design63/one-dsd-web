"use client";

import { useSearchParams } from "next/navigation";

export function TeamSignIn({ usesStarterKey }: { usesStarterKey: boolean }) {
  const searchParams = useSearchParams();
  return (
    <>
      {searchParams?.get("denied") === "1" ? (
        <p className="notice notice--stop mt-6 max-w-md" role="alert">
          The team key did not match. Check it and try again.
        </p>
      ) : null}
      <form method="post" action="/api/one-dsd/team/login" className="card mt-6 max-w-md">
        <div className="field">
          <label htmlFor="team-key">Team key</label>
          <p className="help m-0">
            {usesStarterKey
              ? "This local copy still uses its starter team key: local-dev-team. Replace it before anyone else uses the team space."
              : "Enter the One DSD Team key shared with you by the Equity and Inclusion Operations Consultant."}
          </p>
          <input id="team-key" name="key" type="text" autoComplete="off" autoCapitalize="none" spellCheck={false} required />
        </div>
        <button type="submit" className="btn btn--primary">Open the team space</button>
      </form>
    </>
  );
}
