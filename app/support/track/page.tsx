import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageIntro } from "@/components/ui";
import { TrackClient } from "@/components/track-client";
import { ParticipationNotice } from "@/components/participation-notice";
import { ROUTES } from "@/lib/constants";
import {
  consultationCorrectionEnabled,
  consultationTrackingActivationStatus,
} from "@/lib/intelligence/consult/availability";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";

export const metadata: Metadata = { title: ROUTES.trackRequest.label };

const ALTERNATIVES = [
  { href: ROUTES.ask.href, label: ROUTES.ask.label, note: "Ask a general question about learning and practice." },
  { href: ROUTES.support.href, label: ROUTES.support.label, note: "See every kind of support in one place." },
  { href: ROUTES.rightPerson.href, label: ROUTES.rightPerson.label, note: "Find the role or office that decides." },
  { href: "/support/directory", label: "DHS offices and guidance", note: "Find the office or guidance that applies to your work." },
];

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const tracking = consultationTrackingActivationStatus();
  const trackingEnabled = tracking.ready;
  const correctionEnabled = trackingEnabled && consultationCorrectionEnabled();
  const surface = await prepareEditableSurface(
    trackingEnabled ? "support.track.available" : "support.track.unavailable",
    { scope: "dsd" },
  );
  const copy = surface.values;
  if (!trackingEnabled) {
    return (
      <EditableSurfaceRegion surface={surface}>
        <PageIntro kicker={stringValue(copy, "introKicker")} title={stringValue(copy, "introTitle")} lede={stringValue(copy, "introLede")} />
        <div className="wrap max-w-3xl space-y-6 py-8">
          <Notice>
            <strong>Request tracking is not open yet. </strong>
            {stringValue(copy, "availabilityNote")}
          </Notice>
          <section aria-labelledby="track-will-do">
            <h2 id="track-will-do" className="text-xl font-bold">What this page will do</h2>
            <p className="mt-2">When it opens, you will enter the reference number and access key from a consultation confirmation to see the latest update, and you will be able to withdraw a request while it is still Received or Under review. No reference number or access key is collected here today.</p>
          </section>
          <section aria-labelledby="track-alternatives">
            <h2 id="track-alternatives" className="text-xl font-bold">Where to go now</h2>
            <ul className="mt-2 list-disc pl-6">
              {ALTERNATIVES.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link> <span>{item.note}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </EditableSurfaceRegion>
    );
  }
  return (
    <EditableSurfaceRegion surface={surface}>
      <PageIntro kicker={stringValue(copy, "introKicker")} title={stringValue(copy, "introTitle")} lede={stringValue(copy, "introLede")} />
      <div className="wrap space-y-6 py-8">
        <p className="notice max-w-4xl" role="note">
          <strong>{stringValue(copy, "privacyKicker")} </strong>
          {stringValue(copy, "privacyNote")}
        </p>
        <TrackClient initialId={id} correctionEnabled={correctionEnabled} />
        <ParticipationNotice
          surface="consultation_tracking"
          consultationRetentionDays={tracking.retentionDays}
          correctionEnabled={correctionEnabled}
        />
      </div>
    </EditableSurfaceRegion>
  );
}
