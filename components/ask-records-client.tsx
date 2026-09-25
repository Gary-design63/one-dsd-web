"use client";

import { useRef, useState } from "react";
import type { AskResponseRecord, AskRecordsListResult } from "@/lib/intelligence/observability/ask-records";

const OUTCOMES: Record<AskResponseRecord["status"], string> = {
  answered: "Answered", limited: "Answered with limits", refused: "Request declined",
  unavailable: "Service unavailable", failed: "Answer failed",
};
const RESEARCH: Record<AskResponseRecord["researchStatus"], string> = {
  not_requested: "Outside research was not used", used: "Outside research used",
  not_connected: "Research connection unavailable", failed: "Outside research failed",
};
function LinkText({ href, children }: { href: string; children: React.ReactNode }) {
  const safe = /^\/(?![\\/])/.test(href) || /^https:\/\//i.test(href);
  return safe ? <a href={href}>{children}</a> : <span>{children}</span>;
}
function Text({ children }: { children: string }) {
  return <p className="whitespace-pre-wrap break-words">{children}</p>;
}
export function AskRecordDetail({ record }: { record: AskResponseRecord }) {
  const response = record.response;
  return <div className="space-y-4">
    <div>
      <h3 className="text-lg font-bold">Question</h3>
      <Text>{record.question ?? "Question omitted because it contained private information."}</Text>
    </div>
    <div>
      <h3 className="text-lg font-bold">Response shown to staff</h3>
      {"error" in response ? <Text>{response.error}</Text> : response.kind === "refusal" ? <>
        {response.safety.message && <Text>{response.safety.message}</Text>}
        {response.safety.redirect && <p><LinkText href={response.safety.redirect.href}>{response.safety.redirect.label}</LinkText></p>}
        {!!response.safety.alternatives?.length && <ul className="list-disc pl-5">{response.safety.alternatives.map((item, index) => <li key={index}><LinkText href={item.href}>{item.label}</LinkText></li>)}</ul>}
      </> : <>
        <Text>{response.answer.shortAnswer}</Text>
        {response.answer.whyItMatters && <Text>{response.answer.whyItMatters}</Text>}
        {response.answer.notice && <Text>{response.answer.notice}</Text>}
        {!!response.answer.limits.length && <div><h4 className="font-bold">Limits</h4><ul className="list-disc pl-5">{response.answer.limits.map((limit, index) => <li key={index}>{limit}</li>)}</ul></div>}
        {!!response.answer.sources.length && <div><h4 className="font-bold">Program sources</h4><ul className="list-disc pl-5">{response.answer.sources.map((source, index) => <li key={index}><LinkText href={source.href}>{source.title}</LinkText><p className="text-sm">{source.authorityLabel}. {source.authorityDescription}</p></li>)}</ul></div>}
        {response.answer.publicResearch && <div>
          <h4 className="font-bold">{response.answer.publicResearch.heading}</h4>
          {response.answer.publicResearch.answer && <Text>{response.answer.publicResearch.answer}</Text>}
          <Text>{response.answer.publicResearch.note}</Text>
          <ol className="list-decimal pl-5">{response.answer.publicResearch.sources.map((source, index) => <li key={index}><LinkText href={source.url}>{source.title}</LinkText>{source.date && ` (${source.date})`}</li>)}</ol>
        </div>}
        {!!response.answer.nextActions.length && <div><h4 className="font-bold">Suggested next steps</h4><ul className="list-disc pl-5">{response.answer.nextActions.map((item, index) => <li key={index}><LinkText href={item.href}>{item.label}</LinkText></li>)}</ul></div>}
        {!!response.answer.questions?.length && <div><h4 className="font-bold">Follow-up questions</h4><ul className="list-disc pl-5">{response.answer.questions.map((item, index) => <li key={index}>{item.categoryLabel}: {item.text}</li>)}</ul></div>}
        {response.answer.conflict && <div><h4 className="font-bold">Source differences</h4><Text>{response.answer.conflict.message}</Text><ul className="list-disc pl-5">{response.answer.conflict.sources.map((source, index) => <li key={index}><LinkText href={source.href}>{source.title}</LinkText> — {source.authorityLabel}. {source.authorityDescription}</li>)}</ul></div>}
        {response.answer.pathSuggestion && <div><h4 className="font-bold">Suggested practice</h4><p><LinkText href={response.answer.pathSuggestion.href}>{response.answer.pathSuggestion.title}</LinkText></p><Text>{response.answer.pathSuggestion.why}</Text></div>}
        {response.answer.consultation && <div><h4 className="font-bold">Consultation option</h4><Text>{response.answer.consultation.reason}</Text><Text>{response.answer.consultation.questionSummary}</Text></div>}
      </>}
    </div>
    <details className="text-sm">
      <summary>Record details</summary>
      <p>Record: {record.id}</p><p>Related activity: {record.traceId}</p>
      <p>Research choice: {record.researchMode.replaceAll("_", " ")}. Response status: {record.httpStatus}.</p>
      <p>{record.expiresAt ? `Scheduled removal: ${record.expiresAt}` : "Kept until owner deletion."}</p>
      <details><summary>Complete saved response</summary><pre className="overflow-x-auto whitespace-pre-wrap break-words">{JSON.stringify(record.response, null, 2)}</pre></details>
    </details>
  </div>;
}

export function AskRecordsClient({ initialData, initialError = "" }: { initialData: AskRecordsListResult | null; initialError?: string }) {
  const [data, setData] = useState<AskRecordsListResult | null>(initialData);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const requestVersion = useRef(0);

  async function load(before?: string) {
    const version = ++requestVersion.current;
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/consultant/ask-records?limit=50${before ? `&before=${encodeURIComponent(before)}` : ""}`, { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(typeof body?.error === "string" ? body.error : "ASK response records could not be loaded.");
      if (!Array.isArray(body?.records) || !body?.recording) throw new Error("The record response was incomplete. Refresh to try again.");
      if (version !== requestVersion.current) return;
      setData(current => ({ ...body, records: before && current ? [...current.records, ...body.records.filter((record: AskResponseRecord) => !current.records.some(item => item.id === record.id))] : body.records }));
    } catch (problem) {
      if (version === requestVersion.current) setError(problem instanceof Error ? problem.message : "ASK response records could not be loaded.");
    } finally { if (version === requestVersion.current) setBusy(false); }
  }

  async function remove(id: string) {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/consultant/ask-records", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: [id] }) });
      const body = await response.json();
      if (!response.ok || !Number.isInteger(body?.deleted)) throw new Error("Deletion could not be confirmed. Refresh the records to check their current state.");
      setData(current => current ? { ...current, records: current.records.filter(record => record.id !== id) } : current);
      setMessage(body.deleted > 0 ? "The response record was deleted." : "That response record is no longer present.");
    } catch { setError("Deletion could not be confirmed. Refresh the records to check their current state."); }
    finally { setBusy(false); }
  }
  const normalized = query.trim().toLocaleLowerCase();
  const visible = data?.records.filter(record => !normalized || `${record.question ?? ""} ${JSON.stringify(record.response)}`.toLocaleLowerCase().includes(normalized)) ?? [];
  return <div className="space-y-6">
    <div className="flex flex-wrap items-end gap-4">
      <div className="field flex-1"><label htmlFor="ask-record-search">Find in loaded records</label><input id="ask-record-search" type="search" value={query} onChange={event => setQuery(event.target.value)} /></div>
      <button className="btn btn--secondary" onClick={() => void load()} disabled={busy}>Refresh records</button>
    </div>
    {busy && <p role="status">Updating response records…</p>}
    {error && <p role="alert" className="notice notice--warn">{error} {data ? "Previously loaded records remain below." : "Records have not been loaded."}</p>}
    {message && <p role="status">{message}</p>}
    {data && <>
      <div className="panel text-sm space-y-2">
        <p>{data.recording.durable ? "Response records are kept." : "Response records are temporary in this copy and can be lost when it restarts."}</p>
        <p>{data.recording.retentionDays === null ? "Records remain until you delete them. There is no automatic expiry." : `New records expire after ${data.recording.retentionDays} days. Each record shows its own scheduled removal.`}</p>
        <p>{data.records.length} records loaded. {normalized && `${visible.length} match your search within those records.`}</p>
        {data.recording.lastWriteFailure && <p role="alert">A response record could not be saved at {data.recording.lastWriteFailure.at}. This list may be missing that response.</p>}
      </div>
      {!visible.length && <p>{data.records.length ? "No loaded records match this search." : "No kept ASK response records were found."}</p>}
      {visible.map(record => <article className="card space-y-5" key={record.id}>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-xl font-bold">{OUTCOMES[record.status]} · {record.programScope === "dsd" ? "One DSD" : "One DHS"}</h2><p className="text-sm"><time dateTime={record.createdAt}>{record.createdAt.replace("T", " ").replace("Z", " UTC")}</time> · {RESEARCH[record.researchStatus]}</p></div>
          <button className="btn btn--ghost" disabled={busy} onClick={() => void remove(record.id)} aria-label={`Delete response record from ${record.createdAt}`}>Delete record</button>
        </header>
        <AskRecordDetail record={record} />
      </article>)}
      {data.nextCursor && <button className="btn btn--secondary" disabled={busy} onClick={() => void load(data.nextCursor!)}>Load older records</button>}
    </>}
  </div>;
}
