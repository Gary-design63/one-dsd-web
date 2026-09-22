import type { Metadata } from "next";
import ResourcesPage from "@/app/resources/page";

export const metadata: Metadata = { title: "Library" };
export const dynamic = "force-dynamic";

export default ResourcesPage;
