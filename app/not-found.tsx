import Link from "next/link";
import { PageIntro } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <PageIntro title="We could not find that page" lede="The link may be old, or the page may not be available yet." />
      <div className="wrap py-8">
        <ul className="list-disc pl-6">
          <li>
            <Link href="/library">Search Resources</Link>
          </li>
          <li>
            <Link href="/ask">Browse common questions</Link>
          </li>
          <li>
            <Link href="/support">Support</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
