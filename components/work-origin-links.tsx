import Link from "next/link";
import { getDomain } from "@/lib/domains";
import { WORK_AREAS } from "@/lib/product/work-areas";
import { normalizeWorkOrigin, withWorkOrigin, type WorkOrigin } from "@/lib/product/work-origin";

/** The caller supplies a published domain before offering a direct task return link. */
export function WorkOriginLinks({ origin: input, domainAvailable = false }: { origin: WorkOrigin; domainAvailable?: boolean }) {
  const origin = normalizeWorkOrigin(input);
  const area = WORK_AREAS.find(item => item.id === origin.originArea);
  const domain = domainAvailable && origin.area ? getDomain(origin.area) : undefined;
  const task = domain?.tasks.find(item => item.id === origin.task);
  if (!area && !task) return null;
  return <nav aria-label="Continue your work" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
    {area ? <Link href={"/areas#" + area.id}>Back to {area.label.toLowerCase()}</Link> : null}
    {domain && task ? <Link href={withWorkOrigin("/areas/" + domain.id + "#task-" + task.id, origin)}>Return to {task.label.toLowerCase()}</Link> : null}
  </nav>;
}
