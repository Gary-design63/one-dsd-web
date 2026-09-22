import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Notice } from "@/components/ui";
import { NewResourceForm } from "@/components/new-resource-form";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { mediaAvailable } from "@/lib/content/media";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Add a resource" };

export default async function NewResourcePage() {
  if (!(await ownerPageGuard())) return null;
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <PageIntro
        kicker="Consultant Workspace"
        title="Add a resource"
        lede="Write a new resource and publish it. It appears in the library and learning pages right away, and in Ask."
      />
      <div className="wrap py-8">
        <p><Link href="/consultant/resources">← Resource review</Link></p>
        {!mediaAvailable() ? <Notice tone="warn">Adding resources is not connected in this copy of the program.</Notice> : <NewResourceForm today={today} />}
      </div>
    </>
  );
}
