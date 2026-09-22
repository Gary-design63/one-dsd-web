"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, Notice } from "@/components/ui";
import type { ResearchPolicy, ResearchUsageEvent, UsageSummary } from "@/lib/intelligence/research/governance";

type ProviderRow = { id: string; configured: boolean; credential_env: string; models: { current_web: string; deep_research: string } };

const RESEARCH_ERRORS: Record<string, string> = {
  research_not_configured: "the research connection was not ready",
  research_disabled: "research was turned off",
  research_stop: "research was paused",
  daily_cap_reached: "the daily limit was reached",
  monthly_cap_reached: "the monthly limit was reached",
};

function requestResult(event: ResearchUsageEvent) {
  if (event.ok) return "Completed";
  const reason = event.error_code ? RESEARCH_ERRORS[event.error_code] : undefined;
  return reason ? `Not completed â€” ${reason}` : "Not completed";
}

function requestSetting(event: ResearchUsageEvent) {
  if (event.model === "perplexity-search") return "Public-source search";
  if (event.provider === "fixture") return "Readiness-check sample";
  return event.depth === "deep_research" ? "In-depth research" : "Current answer";
}

export function researchAvailability(policyEnabled: boolean, configured: boolean, paused: boolean) {
  if (paused) {
    return {
      active: false,
      heading: "External research is paused",
      detail: "The emergency pause is active. No staff question can be sent to the research connection until that pause is removed.",
    };
  }
  if (!configured) {
    return {
      active: false,
      heading: "External research is off until the connection is ready",
      detail: "No research connection is ready. Staff questions stay inside the program.",
    };
  }
  if (!policyEnabled) {
    return {
      active: false,
      heading: "External research is off",
      detail: "The connection is ready, but staff cannot use it unless you turn external research on.",
    };
  }
  return {
    active: true,
    heading: "External research is available to staff",
      detail: "Ask may consult current public sources when the program library is not enough or when a staff member requests research.",
  };
}

export function ResearchControlsClient({ policy, summary, usage, providers, researchStopEnv }: { policy: ResearchPolicy; summary: UsageSummary; usage: ResearchUsageEvent[]; providers: ProviderRow[]; researchStopEnv: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [daily, setDaily] = useState(String(policy.daily_request_cap));
  const [monthly, setMonthly] = useState(String(policy.monthly_usd_cap));
  const [domains, setDomains] = useState(policy.allowed_domains.join("\n"));
  const anyConfigured = providers.some((p) => p.configured && p.id !== "fixture");
  const availability = researchAvailability(policy.enabled, anyConfigured, researchStopEnv);

  async function post(body: Record<string, unknown>, label: string) {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/consultant/research", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) {
        const reason = typeof data.error === "string" ? RESEARCH_ERRORS[data.error] : undefined;
        setMsg(reason ? `That change could not be completed because ${reason}.` : "That change could not be saved. Please try again.");
      }
      else {
        setMsg(`${label}.`);
        router.refresh();
      }
    } catch {
      setMsg("That change could not be saved. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className={`card ${!availability.active ? "notice--warn" : ""}`} aria-labelledby="rs-ctl">
        <p className="kicker">Availability</p>
        <h2 id="rs-ctl" className="text-2xl font-extrabold">
          {availability.heading}
        </h2>
        <p className="text-sm text-muted">{availability.detail}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {policy.enabled ? (
            <button type="button" className="btn btn--primary" style={{ background: "var(--red-strong)", borderColor: "var(--red-strong)" }} disabled={busy} onClick={() => post({ enabled: false }, "External research turned off")}>
              Turn external research off
            </button>
          ) : (
            <button type="button" className="btn btn--secondary" disabled={busy || !anyConfigured || researchStopEnv} onClick={() => post({ enabled: true }, "External research turned on")}>
              Turn external research on
            </button>
          )}
          <button type="button" className="btn btn--light" disabled={busy || !anyConfigured || researchStopEnv} onClick={() => post({ deep_research_enabled: !policy.deep_research_enabled }, policy.deep_research_enabled ? "In-depth research turned off" : "In-depth research allowed")}>
            {policy.deep_research_enabled ? "Allow in-depth research when research is on â€” select to turn off" : "In-depth research is off â€” select to allow"}
          </button>
        </div>
        {msg ? (
          <p className="mt-2 text-sm" role="status">
            {msg}
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2" aria-labelledby="rs-usage">
        <div className="panel">
          <p className="kicker">Usage</p>
          <h2 id="rs-usage" className="text-xl font-extrabold">
            Today and this month
          </h2>
          <table className="data mt-2">
            <thead>
              <tr>
                <th scope="col">Window</th>
                <th scope="col">Requests</th>
                <th scope="col">Cost (USD)</th>
                <th scope="col">Cap</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Today</th>
                <td>{summary.today.requests}</td>
                <td>{summary.today.usd.toFixed(4)}</td>
                <td>{summary.caps.daily_request_cap > 0 ? `${summary.caps.daily_request_cap} requests` : "no cap"}</td>
              </tr>
              <tr>
                <th scope="row">This month</th>
                <td>{summary.month.requests}</td>
                <td>{summary.month.usd.toFixed(4)}</td>
                <td>{summary.caps.monthly_usd_cap > 0 ? `$${summary.caps.monthly_usd_cap}` : "no cap"}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-sm text-muted">Costs use the amount reported by the research service when available. Otherwise, the program shows an estimate. The question itself is not stored in this record.</p>
        </div>
        <div className="panel">
          <p className="kicker">What Ask can use</p>
          <h2 className="text-xl font-extrabold">Three research paths</h2>
          <dl className="mt-2 grid gap-x-4 gap-y-2 sm:grid-cols-[max-content_1fr]">
            <dt className="font-bold">Program library</dt>
            <dd className="m-0">Always available. Answers use program resources and show their review status.</dd>
            <dt className="font-bold">Current public sources</dt>
            <dd className="m-0">{availability.active ? "Available to staff." : "Not available to staff right now."}</dd>
            <dt className="font-bold">In-depth research</dt>
            <dd className="m-0">{availability.active && policy.deep_research_enabled ? "Available when a question needs a fuller review." : "Not available to staff right now."}</dd>
          </dl>
        </div>
      </section>

      <details className="card">
        <summary>Connection details for setup or troubleshooting</summary>
        <p className="mt-3 text-sm">When you turn on external research, the program is set to connect directly to Perplexity. Public-source searches use its Search API. Current and in-depth answers use its Agent API.</p>
        <table className="data mt-2">
          <thead>
            <tr>
              <th scope="col">Order</th>
              <th scope="col">Technical connection</th>
              <th scope="col">Private key</th>
              <th scope="col">Current / in-depth settings</th>
            </tr>
          </thead>
          <tbody>
            {policy.provider_order.map((id, index) => {
              const provider = providers.find((item) => item.id === id);
              return (
                <tr key={id}>
                  <td>{index + 1}</td>
                  <td>{id === "perplexity_agent" ? "Perplexity Agent API and Search API" : id === "openai_web" ? "OpenAI public web search" : "Readiness-check sample"}<span className="block text-xs text-muted">{id}</span></td>
                  <td>{provider?.configured ? "Ready" : provider?.credential_env ? `Not found (${provider.credential_env})` : "Not needed"}</td>
                  <td className="text-xs">{id !== "fixture" ? `${provider?.models.current_web ?? "low"} / ${provider?.models.deep_research ?? "medium"}` : "Readiness checks only"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!anyConfigured ? <p className="notice notice--warn mt-3 text-sm">Add PERPLEXITY_API_KEY through the private Vercel settings before turning on external research. The program never displays or saves the key.</p> : null}
      </details>

      <details className="card">
        <summary>Optional spending limits and source preferences</summary>
        <form
          className="mt-3 grid gap-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            post(
              {
                daily_request_cap: Number(daily) || 0,
                monthly_usd_cap: Number(monthly) || 0,
                allowed_domains: domains
                  .split(/\s+/)
                  .map((d) => d.trim().toLowerCase())
                  .filter(Boolean),
              },
              "Research limits saved",
            );
          }}
        >
          <Field id="daily" label="Daily request limit" help="Enter 0 if you do not want a daily limit.">
            <input id="daily" type="text" inputMode="numeric" value={daily} onChange={(e) => setDaily(e.target.value.replace(/[^0-9]/g, ""))} />
          </Field>
          <Field id="monthly" label="Monthly spending limit in U.S. dollars" help="Enter 0 if you do not want a monthly limit.">
            <input id="monthly" type="text" inputMode="decimal" value={monthly} onChange={(e) => setMonthly(e.target.value.replace(/[^0-9.]/g, ""))} />
          </Field>
          <Field id="domains" label="Preferred public sites, if you want to limit them" help="Enter one site per line, up to 20. The research service will be asked to limit results to these sites. Leave this empty to allow any public source.">
            <textarea id="domains" value={domains} onChange={(e) => setDomains(e.target.value)} rows={4} />
          </Field>
          <Field id="recency" label="How recent sources should be" help="Choose Any time unless the question requires newer material.">
            <select id="recency" value={policy.recency} onChange={(e) => post({ recency: e.target.value }, "Source date preference saved")}>
              <option value="any">Any time</option>
              <option value="year">Past year</option>
              <option value="month">Past month</option>
              <option value="week">Past week</option>
            </select>
          </Field>
          <Field id="mode" label="When Ask looks beyond the program library" help="Choose As needed to allow research when the reviewed library is not enough or a question needs current information. Choose Only when requested to leave the decision with the staff member.">
            <select id="mode" value={policy.mode} onChange={(e) => post({ mode: e.target.value }, "Research choice saved")}>
              <option value="auto">As needed or when requested</option>
              <option value="on_request">Only when a staff member requests it</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <button type="submit" className="btn btn--light" disabled={busy}>
              Save limits and preferences
            </button>
          </div>
        </form>
      </details>

      <section aria-labelledby="rs-log">
        <h2 id="rs-log" className="text-xl font-extrabold">
          Recent requests ({usage.length})
        </h2>
        {usage.length ? (
          <div className="overflow-x-auto">
            <table className="data mt-2">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Research connection</th>
                  <th scope="col">Type</th>
                  <th scope="col">Research depth</th>
                  <th scope="col">Public sites cited</th>
                  <th scope="col">Cost</th>
                  <th scope="col">Result</th>
                </tr>
              </thead>
              <tbody>
                {usage.map((u) => (
                  <tr key={u.id}>
                    <td className="text-xs">{new Date(u.at).toLocaleString()}</td>
                    <td className="text-xs">{u.provider !== "fixture" ? "External public research" : "Readiness-check sample"}</td>
                    <td className="text-xs">{requestSetting(u)}</td>
                    <td className="text-xs">{u.model === "perplexity-search" ? "Public sources" : u.depth === "deep_research" ? "In-depth" : "Current"}</td>
                    <td className="text-xs">{u.domains.join(", ") || "none"}</td>
                    <td className="text-xs">
                      ${(u.reported_usd ?? u.estimated_usd).toFixed(4)} {u.reported_usd === undefined ? "(estimated)" : "(actual)"}
                    </td>
                    <td className="text-xs">{requestResult(u)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted">No external research requests have been recorded yet.</p>
        )}
      </section>

      {!anyConfigured ? <Notice tone="warn">External research remains off until its private connection is ready and the privacy checks have passed.</Notice> : null}
    </div>
  );
}
