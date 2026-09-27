import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import {
  CONNECTOR_ERRORS,
  connectorStatus,
  readConnectorSettings,
  type ConnectorErrorCode,
  type ConnectorKey,
  type ConnectorStatus,
} from "@/lib/offline/connectors";
import { isLoopbackHost, offlineConnectorsFile } from "@/lib/offline/mode";

export const metadata: Metadata = { title: "API connections" };
export const dynamic = "force-dynamic";

const KEY_FIELDS: Array<{ key: ConnectorKey; label: string; help: string }> = [
  { key: "anthropicApiKey", label: "Anthropic API key", help: "Used for AI-written answers when AI answers are on." },
  { key: "openaiApiKey", label: "OpenAI API key", help: "An alternative provider for AI-written answers." },
  { key: "perplexityApiKey", label: "Perplexity API key", help: "Used for current public research when external research is on." },
];

function savedKeyNote(status: ConnectorStatus, key: ConnectorKey): string {
  const saved = status.keys[key];
  return saved.present ? `A key ending in ••${saved.lastFour} is saved. Leave this blank to keep it.` : "No key saved.";
}

export default async function ConnectorsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const file = offlineConnectorsFile();
  // Keys can be managed only on the computer running this copy, never from a shared link.
  if (!file || !isLoopbackHost((await headers()).get("host"))) notFound();
  if (!(await ownerPageGuard())) return null;
  const params = await searchParams;
  const errorCode = typeof params.error === "string" && Object.hasOwn(CONNECTOR_ERRORS, params.error) ? params.error as ConnectorErrorCode : null;
  const saved = params.saved === "1";

  let status: ConnectorStatus | null = null;
  try {
    status = connectorStatus(await readConnectorSettings(file));
  } catch {
    status = null;
  }

  return (
    <>
      <PageIntro kicker="This computer" title="API connections" lede="Connect AI and research services for this copy of the program. The program works fully without them; connections are used only while this computer is online." />
      <div className="wrap max-w-3xl space-y-6 py-8">
        {saved ? <p role="status" className="rounded border border-line bg-[#eef6f1] p-4">Saved. The program is restarting to use these settings. If a page does not load, wait a few seconds and refresh.</p> : null}
        {errorCode ? <p role="alert" className="rounded border border-[#b42318] bg-[#fef3f2] p-4">{CONNECTOR_ERRORS[errorCode]}</p> : null}
        {status === null ? <p role="alert" className="rounded border border-[#b42318] bg-[#fef3f2] p-4">{CONNECTOR_ERRORS.unreadable}</p> : null}
        <p>Keys stay on this computer, in your Windows user folder, and are never included in the program folder or shown again in full. Anyone who signs in to this computer as you could read them, so use keys you can replace.</p>
        <form method="post" action="/api/offline/connectors" className="space-y-6" autoComplete="off">
          <fieldset className="space-y-4 rounded border border-line p-5">
            <legend className="px-1 font-semibold">AI answers</legend>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="generativePilot" defaultChecked={status?.generativePilot === "on"} className="h-5 w-5" />
              Turn on AI answers
            </label>
            {KEY_FIELDS.slice(0, 2).map((field) => <KeyField key={field.key} field={field} status={status} />)}
          </fieldset>
          <fieldset className="space-y-4 rounded border border-line p-5">
            <legend className="px-1 font-semibold">External research</legend>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="researchEnabled" defaultChecked={status?.researchEnabled === "on"} className="h-5 w-5" />
              Turn on external research
            </label>
            <KeyField field={KEY_FIELDS[2]} status={status} />
            <label className="block space-y-1">
              <span className="font-semibold">Monthly research spending limit (US dollars)</span>
              <input name="researchMonthlyUsdCap" inputMode="decimal" defaultValue={status?.researchMonthlyUsdCap ?? "0"} className="block w-40 rounded border border-[#64748b] p-2" />
              <span className="block text-sm text-muted">Research stops for the month when this amount is reached. A limit of 0 keeps research from running.</span>
            </label>
          </fieldset>
          <button type="submit" className="min-h-11 rounded bg-[#173d59] px-5 font-semibold text-white">Save connections</button>
        </form>
        {status?.updatedAt ? <p className="text-sm text-muted">Last saved {new Date(status.updatedAt).toLocaleString("en-US")}.</p> : null}
      </div>
    </>
  );
}

function KeyField({ field, status }: { field: (typeof KEY_FIELDS)[number]; status: ConnectorStatus | null }) {
  return (
    <div className="space-y-1">
      <label className="block space-y-1">
        <span className="font-semibold">{field.label}</span>
        <input type="password" name={field.key} spellCheck={false} className="block w-full rounded border border-[#64748b] p-2" />
      </label>
      <p className="text-sm text-muted">{field.help} {status ? savedKeyNote(status, field.key) : null}</p>
      {status?.keys[field.key].present ? (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name={`remove_${field.key}`} className="h-4 w-4" />
          Remove the saved {field.label}
        </label>
      ) : null}
    </div>
  );
}
