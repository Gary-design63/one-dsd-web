"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const TYPES: Array<[string, string]> = [
  ["job_aid", "Job aid"],
  ["tool", "Tool"],
  ["checklist", "Checklist"],
  ["policy", "Policy"],
  ["practice_note", "Practice note"],
  ["learning_module", "Learning module"],
  ["scenario", "Scenario"],
  ["question_bank", "Question bank"],
  ["external_reference", "External reference"],
];

const INTENTS: Array<[string, string]> = [
  ["practice_method", "How to do the work"],
  ["policy_orientation", "Policy orientation"],
  ["launch_embed", "Starting or embedding a practice"],
  ["access_barriers", "Access barriers"],
  ["workplace_culture", "Workplace culture"],
  ["intercultural", "Intercultural practice"],
  ["uncertainty_authority", "Uncertainty and authority"],
  ["escalation", "Escalation"],
  ["next_actions", "Next actions"],
  ["facilitation", "Facilitation"],
  ["boundary_refusal", "Boundaries and refusal"],
];

/** Consultant form: write a new resource and publish it right away. */
export function NewResourceForm({ today }: { today: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(Array.from(form.entries()).map(([key, value]) => [key, String(value)]));
    data.reviewDate = today;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/consultant/resources/new", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "The resource could not be added.");
      router.push(body.href);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The resource could not be added.");
      setBusy(false);
    }
  };

  return (
    <form className="card mt-6" onSubmit={(event) => void submit(event)} data-new-resource="true">
      <div className="field">
        <label htmlFor="nr-title">Title</label>
        <input id="nr-title" name="title" type="text" required maxLength={300} />
      </div>
      <div className="field">
        <label htmlFor="nr-summary">Short summary (one or two sentences)</label>
        <textarea id="nr-summary" name="summary" rows={2} required maxLength={2000} />
      </div>
      <div className="field">
        <label htmlFor="nr-body">Main text</label>
        <p className="help m-0">Plain text. Leave a blank line between paragraphs.</p>
        <textarea id="nr-body" name="body" rows={10} required />
      </div>
      <div className="field">
        <label htmlFor="nr-why">Why it matters (optional)</label>
        <textarea id="nr-why" name="whyItMatters" rows={3} maxLength={3000} />
      </div>
      <div className="field">
        <label htmlFor="nr-view">Where it shows</label>
        <select id="nr-view" name="view" defaultValue="agencywide">
          <option value="agencywide">Both views: One DHS and One DSD</option>
          <option value="dsd">One DSD view only</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="nr-type">Kind of resource</label>
        <select id="nr-type" name="type" defaultValue="job_aid">
          {TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="nr-intent">What it helps with</label>
        <select id="nr-intent" name="intent" defaultValue="practice_method">
          {INTENTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="nr-href">Link to the source (optional)</label>
        <input id="nr-href" name="href" type="url" placeholder="https://" maxLength={2000} />
      </div>
      <div className="field">
        <label htmlFor="nr-source">Source name (optional)</label>
        <input id="nr-source" name="sourceName" type="text" maxLength={300} />
      </div>
      <div className="field">
        <label htmlFor="nr-tags">Tags, separated by commas (optional)</label>
        <input id="nr-tags" name="tags" type="text" maxLength={2000} />
      </div>
      <div className="field">
        <label htmlFor="nr-owner">Prepared by</label>
        <input id="nr-owner" name="owner" type="text" maxLength={200} defaultValue="Equity and Inclusion Operations Consultant" />
      </div>
      <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? "Adding…" : "Add and publish this resource"}</button>
      <p className="help mt-2">After it is added, open the resource to attach images, video, or documents.</p>
      {error ? <p role="alert" className="mt-2 text-sm">{error}</p> : null}
    </form>
  );
}
