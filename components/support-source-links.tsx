import { SUPPORT_DIRECTORY, supportSourcesFor } from "@/lib/product/support-directory";
import type { ResponsibleDestinationId } from "@/lib/product/work-areas";

export function SupportSourceLinks({ destination }: { destination: ResponsibleDestinationId }) {
  const sources = supportSourcesFor(destination);
  return <div className="mt-2 text-sm">
    {sources.length > 0 ? <ul className="space-y-2 pl-5">{sources.map(source => <li key={source.id}>
      <a href={source.href} rel="noreferrer">{source.label}</a>
      <span className="block text-muted">{source.limitation}</span>
    </li>)}</ul> : <p className="text-muted">{SUPPORT_DIRECTORY[destination].fallback}</p>}
  </div>;
}
