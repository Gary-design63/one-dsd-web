import Link from "next/link";
import { DHS_REFERENCE_PATH } from "@/lib/content/dhs-reference";
export function DhsReferenceLink() {
  return <aside className="my-6 rounded-xl border border-line bg-white p-6"><h2 className="text-2xl font-bold"><Link href={DHS_REFERENCE_PATH}>Understanding DHS</Link></h2><p className="mb-0 max-w-3xl">People, programs and partnerships across Minnesota DHS, with a closer look at Disability Services and the work we share.</p></aside>;
}
