import { WorkOriginLinks } from "@/components/work-origin-links";
import { workOriginForPath, withWorkOrigin, type WorkOriginInput } from "@/lib/product/work-origin";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui";
import { ResourceDownloads } from "@/components/resource-downloads";
import { PathBrowse } from "@/components/path-browse";
import { getPath } from "@/lib/content/paths";
import { domainForPath, getDomain } from "@/lib/domains";
import { domainSurfaceId } from "@/lib/domains/surfaces";
import { consultationIntakeEnabled } from "@/lib/intelligence/consult/availability";
import { ProgramContextNote } from "@/components/program-context";
import { ParticipationNotice } from "@/components/participation-notice";
import { canonicalStaffHref, contextualizeSupportAction } from "@/lib/product";
import { requestedContentScope, requestedProductContext } from "@/lib/product/request-context";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { applyGraduationPathValues, graduationPathSurfaceId, stringValue } from "@/lib/content/staff-surface-registry";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = getPath(id);
  return { title: p ? `${p.title} (learning path)` : "Path" };
}

export default async function PathPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<WorkOriginInput> }) {
  const { id } = await params;
  const rawPath = getPath(id);
  if (!rawPath) notFound();
  const scope = await requestedContentScope();
  const [pathSurface, shellSurface] = await Promise.all([
    prepareEditableSurface(graduationPathSurfaceId(id), { scope }),
    prepareEditableSurface("practice.path-shell", { scope }),
  ]);
  const p = applyGraduationPathValues(rawPath, pathSurface.values);
  const shell = shellSurface.values;
  const intakeEnabled = consultationIntakeEnabled();
  const context = await requestedProductContext();
  const origin = workOriginForPath(await searchParams ?? {}, p.id);
  const domain = (origin.area ? getDomain(origin.area) : undefined) ?? domainForPath(p.id);
  const domainSurface = domain ? await prepareEditableSurface(domainSurfaceId(domain.id), { scope }) : undefined;
  return (
    <EditableSurfaceRegion surface={shellSurface}>
      <EditableSurfaceRegion surface={pathSurface}>
      <PageIntro kicker={`${stringValue(shell, "introKicker")} · ${p.staffLabel}`} title={p.title} lede={p.startingCompetence}>
        <p className="mt-3 text-sm text-muted">
          {/^By the end\b/i.test(p.graduatedLooksLike) ? "" : `${stringValue(shell, "outcomeLead")}: `}{p.graduatedLooksLike}
        </p>
        {domainSurface?.available ? (
          <p className="mt-2 text-sm">
            <Link href={withWorkOrigin(domainSurface.definition.route, origin)} className="font-semibold">{stringValue(domainSurface.values, "staffLabel")}</Link>
          </p>
        ) : null}
      </PageIntro>
      <div className="wrap py-8">
        <div className="mb-6 space-y-3"><ProgramContextNote /><WorkOriginLinks origin={origin} domainAvailable={domainSurface?.available} />{pathSurface.available ? <ResourceDownloads kind="path" id={p.id} noun="practice path" scope={scope} /> : null}</div>
        <section className="grid gap-4 md:grid-cols-2" aria-labelledby="steps-title">
          <div className="border-t border-line pt-5">
            <p className="kicker">{stringValue(shell, "pathKicker")}</p>
            <h2 id="steps-title" className="text-xl font-extrabold">
              {stringValue(shell, "stepsTitle")}
            </h2>
            <ol className="mt-2 list-decimal space-y-2 pl-6">
              {p.steps.map((s) => (
                <li key={s.key}>
                  <strong>{s.title}</strong>
                  {s.required ? <span className="label-pill ml-2">{stringValue(shell, "requiredLabel")}</span> : s.optional ? <span className="label-pill ml-2">{stringValue(shell, "optionalLabel")}</span> : null}
                  <span className="block text-sm">{s.guidance}</span>
                  {s.links.length ? (
                    <span className="block text-sm">
                      {s.links.map((l, i) => (
                        <span key={l.href}>
                          {i ? " · " : ""}
                          {(() => {
                            const action = contextualizeSupportAction(
                              { ...l, href: canonicalStaffHref(l.href) },
                              context,
                              intakeEnabled,
                            );
                            return <Link href={withWorkOrigin(action.href, origin)}>{action.label}</Link>;
                          })()}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
          <div className="border-t border-line pt-5">
            <p className="kicker">{stringValue(shell, "meaningKicker")}</p>
            <h2 className="text-xl font-extrabold">{stringValue(shell, "meaningTitle")}</h2>
            <p className="font-bold">{stringValue(shell, "needsWorkLabel")}:</p>
            <ul className="list-disc pl-6 text-sm">
              {p.antiPerformative.fake.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="mt-2 font-bold">{stringValue(shell, "readyLabel")}:</p>
            <ul className="list-disc pl-6 text-sm">
              {p.antiPerformative.real.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">{stringValue(shell, "privacyLabel")}: {p.privacy}</p>
            {p.hrWall ? <p className="mt-2 text-sm font-bold" style={{ color: "var(--red-strong)" }}>{stringValue(shell, "confidentialRouteNote")}</p> : null}
          </div>
        </section>

        <section className="mt-8" aria-labelledby="artifact-title">
          <p className="kicker">{stringValue(shell, "notesKicker")}</p>
          <h2 id="artifact-title" className="text-2xl font-extrabold">
            {p.artifactTitle}
          </h2>
          <p className="notice mt-2" role="note">
            <strong>Browse and download only. </strong>
            This published checklist is not a form. Staff notes are not saved here.
          </p>
          <PathBrowse path={p} />
        </section>
        <div className="mt-10">
          <ParticipationNotice surface="path_practice" />
        </div>
      </div>
      </EditableSurfaceRegion>
    </EditableSurfaceRegion>
  );
}
