"use client";

import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="wrap py-10">
      <h1 className="text-2xl font-extrabold">Something did not load</h1>
      <p className="mt-2" role="status">
        This page could not be loaded right now. This is usually temporary. Try again in a moment, browse Resources, or visit Support.
      </p>
      {error?.digest ? <p className="mt-2 text-sm">Reference: {error.digest}</p> : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className="btn btn--primary" onClick={() => reset()}>
          Try again
        </button>
        <Link href="/library" className="btn btn--light">
          Search Resources
        </Link>
        <Link href="/support" className="btn btn--light">
          Visit Support
        </Link>
      </div>
    </div>
  );
}
