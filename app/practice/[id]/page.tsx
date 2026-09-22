import type { Metadata } from "next";
import PathPage, { generateMetadata as pathMetadata } from "@/app/paths/[id]/page";

export function generateMetadata(args: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return pathMetadata(args);
}

export default PathPage;
