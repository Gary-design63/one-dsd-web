import type { Metadata } from "next";
import Link from "next/link";
import { OneDsdTeamClient } from "@/components/one-dsd-team-client";
import { Notice, PageIntro } from "@/components/ui";
import { ParticipationNotice } from "@/components/participation-notice";
import { ownerFromCookies } from "@/lib/auth/request";
import { getMicrosoftBridgeState } from "@/lib/collaboration/microsoft-boundary";
import { readOneDsdTeamWorkspace } from "@/lib/collaboration/store";
import { toOneDsdTeamWorkspaceView } from "@/lib/collaboration/view";
import { PROGRAM } from "@/lib/constants";

export const metadata: Metadata = { title: `${PROGRAM.oneDsdTeamName} space` };
export const dynamic = "force-dynamic";

export default async function OneDsdTeamWorkspacePage() {
  const authorized = await ownerFromCookies();

  if (!authorized) {
    return (
      <div className="wrap py-8">
        <Link href="/one-dsd/team">Back to {PROGRAM.oneDsdTeamName}</Link>
        <PageIntro
          kicker={PROGRAM.oneDsdProgramName}
          title={`${PROGRAM.oneDsdTeamName} space`}
          lede="Staff pages are browse and download only. This working space is not open for staff writes."
        />
        <Notice>
          <strong>Team writes are closed. </strong>
          Browse published One DSD pages and downloads. The working space loads only for the Consultant Workspace owner.
        </Notice>
        <p className="mt-6"><Link href="/one-dsd">Open One DSD</Link> · <Link href="/consultant">Consultant Workspace</Link></p>
      </div>
    );
  }

  const [workspaceState, microsoft] = await Promise.all([
    readOneDsdTeamWorkspace(),
    Promise.resolve(getMicrosoftBridgeState()),
  ]);
  const workspace = toOneDsdTeamWorkspaceView(workspaceState);

  return (
    <>
      <div className="wrap pt-6">
        <Link href="/one-dsd/team">Back to {PROGRAM.oneDsdTeamName}</Link>
      </div>
      <PageIntro
        kicker={PROGRAM.oneDsdProgramName}
        title={`${PROGRAM.oneDsdTeamName} space`}
        lede={`A working space for the standing volunteer equity committee serving the ${PROGRAM.oneDsdScope}.`}
      />
      <div className="wrap flex flex-wrap items-start justify-between gap-4 pt-8">
        <ParticipationNotice surface="one_dsd_team" />
        <form method="post" action="/api/consultant/logout">
          <button type="submit" className="btn">Sign out</button>
        </form>
      </div>
      <OneDsdTeamClient initialState={workspace} microsoftConnection={microsoft.status} />
    </>
  );
}
