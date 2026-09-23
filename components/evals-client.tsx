"use client";

import { useState } from "react";
import type { EvalReport } from "@/lib/intelligence/eval/runner";

const CHECK_GROUP: Record<string, string> = {
  ask_mvp: "Ask",
  ci_mvp: "Minnesota Communities",
  ciq_mvp: "Consultation requests",
  gp_mvp: "Learning paths",
  mindset_abc: "Content and accessibility review",
};

export function EvalsClient({ past }: { past: EvalReport[] }) {
  const [report, setReport] = useState<EvalReport | null>(past[0] ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/consultant/evals", { method: "POST" });
      const data = await res.json();
      if (!res.ok) setError("The checks could not be completed. Review the current settings and try again.");
      else setReport(data as EvalReport);
    } catch {
      setError("The checks could not be completed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" className="btn btn--primary mt-3" onClick={run} disabled={busy}>
        {busy ? "Running checks" : "Run all required checks"}
      </button>
      {error ? (
        <p className="error mt-2" role="alert">
          {error}
        </p>
      ) : null}
      {report ? (
        <section className="mt-6" aria-live="polite">
          <h2 className="text-xl font-extrabold">
            {report.fail > 0
              ? `Not ready to release: ${report.fail} ${report.fail === 1 ? "check needs" : "checks need"} attention.`
              : report.manual > 0
                ? `A person still needs to complete ${report.manual} ${report.manual === 1 ? "release check" : "release checks"}.`
                : "All required checks are complete."}
          </h2>
          <p className="text-sm">
            {report.pass} passed. {report.fail} failed. {report.manual} {report.manual === 1 ? "waits" : "wait"} for a person to review.
          </p>
          <p className="text-sm text-muted">
            Completed {new Date(report.at).toLocaleString()}.
          </p>
          <div className="overflow-x-auto">
            <table className="data mt-2">
              <thead>
                <tr>
                  <th scope="col">Group</th>
                  <th scope="col">What was checked</th>
                  <th scope="col">Result</th>
                </tr>
              </thead>
              <tbody>
                {report.results.map((r) => (
                  <tr key={r.id}>
                    <td>{CHECK_GROUP[r.suite] ?? r.suite.replace(/_/g, " ")}</td>
                    <td>{r.scenario}</td>
                    <td className="font-bold">{r.status === "pass" ? "Passed" : r.status === "fail" ? "Failed" : "Needs review"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <p className="mt-4 text-muted">No checks have been run here yet.</p>
      )}
      {past.length > 1 ? (
        <details className="mt-6">
          <summary>Earlier check runs ({past.length - 1})</summary>
          <ul className="list-disc pl-6 text-sm">
            {past.slice(1).map((p) => (
              <li key={p.id}>
                {new Date(p.at).toLocaleString()}: {p.pass} passed, {p.fail} failed, {p.manual} still need review
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
