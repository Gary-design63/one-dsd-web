import { notFound } from "next/navigation";
import { ownerPageGuard } from "@/lib/auth/owner-page";

export const dynamic = "force-dynamic";
/** Retired authoring route: the owner excluded this integration altogether. */
export default async function VisualStudioPage() {
  if (!(await ownerPageGuard())) return null;
  notFound();
}
