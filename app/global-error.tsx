"use client";

import Link from "next/link";
import "./globals.css";
import "./program-design.css";

/**
 * Last-resort error page. Next.js renders this when the root layout itself
 * throws (for example, when the database is unreachable while the header
 * wording is being read). It replaces the whole document, so it must supply
 * its own <html> and <body>.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="program-design">
        <main id="main" className="wrap py-10" tabIndex={-1}>
          <h1 className="text-2xl font-extrabold">Something did not load</h1>
          <p className="mt-2">
            The site could not load this page right now. This is usually temporary. Try again in a moment.
          </p>
          {error?.digest ? <p className="mt-2 text-sm">Reference: {error.digest}</p> : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn btn--primary" onClick={() => reset()}>
              Try again
            </button>
            <Link href="/" className="btn btn--light">
              Go to the home page
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
