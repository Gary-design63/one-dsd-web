"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ROUTING_SIGNALS } from "@/lib/content/paths";
import { pathRecommend } from "@/lib/intelligence/agents/graduation";
import { contextualizeSupportAction } from "@/lib/product";

export function GuidedStartClient({ intakeEnabled }: { intakeEnabled: boolean }) {
  const [selected, setSelected] = useState<string[]>([]);
  const recs = useMemo(() => pathRecommend(selected), [selected]);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <fieldset className="card">
        <legend className="kicker">Which of these describe your work right now?</legend>
        <div className="checks mt-2">
          {ROUTING_SIGNALS.map((s) => (
            <label key={s.id}>
              <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />
              <span>
                <strong>{s.label}</strong>
                <span className="block text-sm text-muted">{s.note}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <section className="panel" aria-live="polite" aria-labelledby="rec-title">
        <p className="kicker">Places to start</p>
        <h2 id="rec-title" className="text-xl font-extrabold">
          {recs.length ? "What may help, and why" : "Choose one or more situations"}
        </h2>
        {recs.length === 0 ? <p className="mt-2 text-muted">These suggestions are optional. You can also go directly to Ask, Minnesota Communities, or Resources.</p> : null}
        <ol className="mt-3 list-decimal pl-6">
          {recs.map((r, i) => (
            <li key={i} className="mb-3">
              {r.path ? (
                <>
                  <Link href={`/practice/${r.path.id}`} className="font-bold">
                    {r.path.title}
                  </Link>
                  <span className="block text-sm text-muted">{r.why}</span>
                  <span className="block text-sm">
                    Steps: {r.path.steps.map((s) => s.title).join(", ")}.
                  </span>
                </>
              ) : r.route ? (
                <>
                  <Link href={contextualizeSupportAction(r.route, "one_dsd", intakeEnabled).href} className="font-bold">
                    {contextualizeSupportAction(r.route, "one_dsd", intakeEnabled).label}
                  </Link>
                  <span className="block text-sm text-muted">{r.why}</span>
                  {r.escalate ? <span className="block text-sm font-bold" style={{ color: "var(--red-strong)" }}>For your privacy and protection, please use the formal channel for this.</span> : null}
                </>
              ) : null}
            </li>
          ))}
        </ol>
        {recs.length > 1 ? <p className="mt-2 text-sm text-muted">Several may help. Start with the one closest to your next deadline, and return to the others whenever you need them.</p> : null}
      </section>
    </div>
  );
}
