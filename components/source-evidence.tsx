import Link from "next/link";
import { findSourceByHref, getSource, sourceAnchor, sourcesForResource, verificationFor, type RegisterSource, type ResourceType } from "@/lib/content/source-register";

const REGISTER_PATH = "/learn/sources";

/** The check state of one cited source, with a way into the register entry that shows where else it is used. */
export function SourceState({ source }: { source: RegisterSource | undefined }) {
  if (!source) return null;
  const verification = verificationFor(source);
  return (
    <span className="source-state" data-state={verification.state}>
      <span className="source-state__label" title={verification.detail}>{verification.label}</span>
      {" · "}
      <Link href={`${REGISTER_PATH}#${sourceAnchor(source)}`}>Where else this source is used</Link>
    </span>
  );
}

/** Looks a cited source up by address first, then by title, so course and brief sources without an address still match. */
export function registerSourceFor(citation: { href?: string | null; title: string }): RegisterSource | undefined {
  return findSourceByHref(citation.href) ?? getSource(`title:${citation.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120)}`);
}

/** Sources behind a library item or reference entry, drawn from the register. */
export function ResourceEvidence({ resourceType, resourceId, heading = "Sources behind this resource" }: { resourceType: ResourceType | ResourceType[]; resourceId: string; heading?: string }) {
  const types = Array.isArray(resourceType) ? resourceType : [resourceType];
  const sources = types.flatMap(type => sourcesForResource(type, resourceId)).filter(source => source.kind !== "program_route");
  if (!sources.length) return null;
  return (
    <section className="source-evidence" aria-labelledby="source-evidence-title">
      <h2 id="source-evidence-title">{heading}</h2>
      <ul>
        {sources.map(source => (
          <li key={source.sourceId}>
            {source.kind === "external" && source.href ? <a href={source.href} rel="noreferrer">{source.title}</a> : <span>{source.title}</span>}
            <div><SourceState source={source} /></div>
          </li>
        ))}
      </ul>
      <p><Link href={REGISTER_PATH}>All research and sources across the program</Link></p>
    </section>
  );
}
