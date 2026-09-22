import { notFound, permanentRedirect } from "next/navigation";
import { getDomain } from "@/lib/domains";
export default async function LegacyDomainPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!getDomain(id)) notFound(); permanentRedirect(`/areas/${id}`); }
