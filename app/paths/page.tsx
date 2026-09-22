import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { consultationIntakeEnabled } from "@/lib/intelligence/consult/availability";
import { ParticipationNotice } from "@/components/participation-notice";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { applyGraduationPathValues, graduationPathSurfaceId, stringValue } from "@/lib/content/staff-surface-registry";
import { requestedContentScope } from "@/lib/product/request-context";

export const metadata: Metadata = { title: ROUTES.paths.label };

export default async function PathsPage() {
  const intakeEnabled = consultationIntakeEnabled();
  const scope = await requestedContentScope();
  const [surface, ...pathSurfaces] = await Promise.all([
    prepareEditableSurface("paths.index", { scope }),
    ...GRADUATION_PATHS.map((path) => prepareEditableSurface(graduationPathSurfaceId(path.id), { scope, includeOwner: false })),
  ]);
  const copy = surface.values;
  const paths = GRADUATION_PATHS.flatMap((path, index) => pathSurfaces[index].available ? [applyGraduationPathValues(path, pathSurfaces[index].values)] : []);
  return (
    <EditableSurfaceRegion surface={surface}>
      <PageIntro kicker={stringValue(copy, "introKicker")} title={stringValue(copy, "introTitle")} lede={stringValue(copy, "introLede")} />
      <div className="wrap py-8">
        <ul className="grid list-none gap-x-10 gap-y-6 p-0 md:grid-cols-2">
          {paths.map((p) => (
            <li key={p.id} className="border-t border-line pt-4">
              <p className="kicker">{p.staffLabel}</p>
              <h2 className="text-xl font-extrabold">
                <Link href={`/paths/${p.id}`}>{p.title}</Link>
              </h2>
              <p className="text-sm text-muted">{stringValue(copy, "fitLabel")}: {p.startingCompetence}</p>
              <p className="text-sm">{stringValue(copy, "outcomeLabel")}: {p.graduatedLooksLike}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 max-w-3xl border-t border-line pt-5">
          <p className="kicker">{stringValue(copy, "completionKicker")}</p>
          <p className="m-0">{stringValue(copy, intakeEnabled ? "completionOpenBody" : "completionPreviewBody")}</p>
        </div>
        <div className="mt-10">
          <ParticipationNotice surface="learning" />
        </div>
      </div>
    </EditableSurfaceRegion>
  );
}
