import type { Metadata } from "next";
import ResourcePage, { generateMetadata as resourceMetadata } from "@/app/resources/[id]/page";

export const dynamic = "force-dynamic";

export function generateMetadata(args: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return resourceMetadata(args);
}

export default ResourcePage;
