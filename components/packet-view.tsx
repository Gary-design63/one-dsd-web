import Link from "next/link";
import { AuthorityPill } from "@/components/ui";
import { PROGRAM } from "@/lib/constants";
import type { HeadsUpPacket } from "@/lib/intelligence/consult/schema";

const ASK_TOPIC_LABELS: Record<string, string> = {
  policy_orientation: "Policy guidance",
  practice_method: "Putting guidance into practice",
  launch_embed: "Planning a program or service",
  access_barriers: "Access and accessibility",
  workplace_culture: "Workplace culture",
  intercultural: "Intercultural practice",
  uncertainty_authority: "Finding the right source or policy owner",
  escalation: "When to involve another person",
  next_actions: "Next steps",
  facilitation: "Planning a session",
  boundary_refusal: "A question that needs a different channel",
};

const APPROVED_ASK_TOPIC_LABELS = new Set(Object.values(ASK_TOPIC_LABELS));

export function staffAskTopicLabel(value: string): string | undefined {
  const mapped = ASK_TOPIC_LABELS[value];
  if (mapped) return mapped;
  return APPROVED_ASK_TOPIC_LABELS.has(value) ? value : undefined;
}

export function PacketView({ packet, compact = false }: { packet: HeadsUpPacket; compact?: boolean }) {
  const askTopics = [
    ...new Set(
      packet.ask_context?.intents_tried
        .map(staffAskTopicLabel)
        .filter((label): label is string => Boolean(label)) ?? [],
    ),
  ];

  return (
    <div className={compact ? "space-y-3 text-sm" : "space-y-6"}>
      <section aria-labelledby="pk-snapshot">
        <h3 id="pk-snapshot" className="text-lg font-bold">
          1. At a glance
        </h3>
        <dl className="mt-1 grid gap-x-4 gap-y-1 sm:grid-cols-[max-content_1fr]">
          {Object.entries(packet.snapshot).map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-bold">{k}</dt>
              <dd className="m-0">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="pk-summary">
        <h3 id="pk-summary" className="text-lg font-bold">
          2. What support is needed
        </h3>
        {packet.summary.map((s) => (
          <p key={s} className="m-0">
            {s}
          </p>
        ))}
        <p className="mt-2 font-bold">Questions already considered</p>
        <ul className="list-disc pl-6">
          {packet.equity_questions_considered.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="pk-questions">
        <h3 id="pk-questions" className="text-lg font-bold">
          3. Questions to discuss
        </h3>
        <ul className="list-disc pl-6">
          {(compact ? packet.suggested_questions.slice(0, 5) : packet.suggested_questions).map((q) => (
            <li key={q.id}>{q.text}</li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="pk-resources">
        <h3 id="pk-resources" className="text-lg font-bold">
          4. Helpful resources
        </h3>
        {packet.related_resources.length ? (
          <ul className="list-disc pl-6">
            {packet.related_resources.map((r) => (
              <li key={r.id}>
                <Link href={r.href}>{r.title}</Link> <AuthorityPill authority={r.authority} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 text-muted">No program resource closely matches this request yet.</p>
        )}
      </section>
      <section aria-labelledby="pk-risks">
        <h3 id="pk-risks" className="text-lg font-bold">
          5. Risks and unknowns
        </h3>
        <ul className="list-disc pl-6">
          {packet.risks_unknowns.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="pk-agenda">
        <h3 id="pk-agenda" className="text-lg font-bold">
          6. Possible agenda (the {PROGRAM.practiceOwnerRole} can adapt it for the conversation)
        </h3>
        <table className="data mt-1">
          <thead>
            <tr>
              <th scope="col">Minutes</th>
              <th scope="col">Item</th>
              <th scope="col">Owner</th>
            </tr>
          </thead>
          <tbody>
            {packet.agenda.map((a) => (
              <tr key={a.item}>
                <td>{a.minutes}</td>
                <td>{a.item}</td>
                <td>{a.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {!compact ? (
        <section aria-labelledby="pk-calendar">
          <h3 id="pk-calendar" className="text-lg font-bold">
            7. Meeting details to copy into a calendar invitation
          </h3>
          <pre className="whitespace-pre-wrap rounded border border-line bg-panel p-3 text-sm">{packet.calendar_handoff}</pre>
        </section>
      ) : null}
      {packet.ask_context ? (
        <section aria-labelledby="pk-ask">
          <h3 id="pk-ask" className="text-lg font-bold">
            8. Relevant Ask history
          </h3>
          {askTopics.length ? <p className="m-0">Topics already explored: {askTopics.join(", ")}.</p> : null}
          <p className="m-0">Relevant excerpt: &quot;{packet.ask_context.excerpt}&quot;</p>
        </section>
      ) : null}
    </div>
  );
}
