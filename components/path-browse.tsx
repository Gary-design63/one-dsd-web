import Link from "next/link";
import type { GraduationPath } from "@/lib/content/paths";

/** Published checklist for a practice path. Staff do not fill or save notes here. */
export function PathBrowse({ path }: { path: GraduationPath }) {
  return (
    <div className="card mt-4">
      <p className="notice" role="note">
        <strong>Browse and download only. </strong>
        This checklist is published from the knowledge base. Staff notes are not filled in or saved on this page.
      </p>
      <ol className="mt-4 list-decimal space-y-4 pl-6">
        {path.artifactFields.map((field) => (
          <li key={field.id}>
            <strong>{field.label}</strong>
            {field.required ? <span className="label-pill ml-2">In the published checklist</span> : null}
            <p className="m-0 text-sm">{field.help}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm">
        Download the path above, or <Link href="/library">browse the Library</Link> for related job aids.
      </p>
    </div>
  );
}
