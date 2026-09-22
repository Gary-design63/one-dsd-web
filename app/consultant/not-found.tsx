import Link from "next/link";
import { PageIntro } from "@/components/ui";

/**
 * Not-found boundary for the Consultant Workspace. Rendered on the server inside
 * the workspace shell so a 404 under /consultant carries readable text, a
 * heading, and the page landmark without JavaScript.
 */
export default function ConsultantNotFound() {
  return (
    <>
      <PageIntro kicker="Consultant Workspace" title="We could not find that page" lede="The link may be old, or the item may not be published yet." />
      <div className="wrap py-8">
        <ul className="list-disc pl-6">
          <li>
            <Link href="/consultant">Back to the queue</Link>
          </li>
          <li>
            <Link href="/consultant/library">Open the program collection</Link>
          </li>
          <li>
            <Link href="/library">Search Resources</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
