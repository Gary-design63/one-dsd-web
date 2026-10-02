import Link from "next/link";
import styles from "@/components/consult/consult.module.css";
import {
  STATUS_LABEL,
  SUPPORT_LABEL,
  TIMING_LABEL,
  type ConsultEvent,
  type ConsultStatus,
  type LeaderRequestView,
} from "@/lib/consult/types";
import type { Summary } from "@/lib/consult/service";

const TZ = "America/Chicago";
export function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString("en-US", { timeZone: TZ, month: "short", day: "numeric", year: "numeric" }) : "—";
}
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { timeZone: TZ, month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

/** A date as a person would write it in a sentence: "September 28, 2026". */
export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { timeZone: TZ, month: "long", day: "numeric", year: "numeric" });
}

/** "2026-09" becomes "September 2026". */
export function formatMonth(key: string): string {
  const [year, month] = key.split("-").map(Number);
  if (!year || !month) return key;
  return new Date(Date.UTC(year, month - 1, 15)).toLocaleDateString("en-US", { timeZone: "UTC", month: "long", year: "numeric" });
}

const SMALL_NUMBERS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
export function countWord(n: number): string {
  return n >= 0 && n < SMALL_NUMBERS.length ? SMALL_NUMBERS[n] : String(n);
}
export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** One short line about acknowledgment, shown under the status. */
function acknowledgmentLine(request: LeaderRequestView): string | null {
  if (request.acknowledgedAt) return `Acknowledged ${formatDate(request.acknowledgedAt)}`;
  if (request.status === "received") return `To be acknowledged by ${formatDate(request.acknowledgmentDueAt)}`;
  return null;
}

export function StatusPill({ status, overdue = false }: { status: ConsultStatus; overdue?: boolean }) {
  const tone = status === "resolved"
    ? styles.pillDone
    : status === "waiting_on_requester"
      ? "label-pill--draft"
      : status === "withdrawn"
        ? ""
        : "label-pill--authority";
  return (
    <span className={styles.statusRow}>
      <span className={`label-pill ${tone}`}>{STATUS_LABEL[status]}</span>
      {overdue ? <span className="label-pill label-pill--draft">Waiting past two days</span> : null}
    </span>
  );
}

/** Where things stand, in sentences a person would say. */
export function SummarySentences({ summary }: { summary: Summary }) {
  const { acknowledged, onTime } = summary.acknowledgedWithinTwoDays;
  const lines: string[] = [];
  if (summary.total === 0) {
    lines.push("There are no requests yet.");
  } else {
    lines.push(summary.open === 0 ? "No requests are open." : `${capitalize(countWord(summary.open))} ${summary.open === 1 ? "request is" : "requests are"} open.`);
    if (summary.overdue > 0) {
      lines.push(`${capitalize(countWord(summary.overdue))} ${summary.overdue === 1 ? "has" : "have"} been waiting longer than two business days to be acknowledged.`);
    }
    if (acknowledged > 0) {
      if (onTime === acknowledged) lines.push("So far, every acknowledgment has come within two business days.");
      else if (onTime === 0) lines.push("So far, none of the acknowledgments has come within two business days.");
      else lines.push(`So far, ${countWord(onTime)} of the ${countWord(acknowledged)} acknowledgments ${onTime === 1 ? "has" : "have"} come within two business days.`);
    }
    if (summary.withRecordedOutcome > 0) {
      lines.push(`${capitalize(countWord(summary.withRecordedOutcome))} ${summary.withRecordedOutcome === 1 ? "has" : "have"} been resolved, with the outcome on record.`);
    }
  }
  return <p className={styles.summaryText}>{lines.join(" ")}</p>;
}

function CountList({ id, title, rows, empty }: { id: string; title: string; rows: Array<{ label: string; value: string }>; empty: string }) {
  return (
    <section aria-labelledby={id}>
      <h3 id={id}>{title}</h3>
      {rows.length === 0 ? (
        <p className={styles.quiet}>{empty}</p>
      ) : (
        <ul className={styles.plainList}>
          {rows.map((row) => <li key={row.label}><span>{row.label}</span><span>{row.value}</span></li>)}
        </ul>
      )}
    </section>
  );
}

/** The month at a glance, as short lines rather than a table of figures. */
export function SummaryDetails({ summary }: { summary: Summary }) {
  const kinds = Object.entries(summary.bySupport).filter(([, value]) => value > 0).map(([label, value]) => ({ label, value: capitalize(countWord(value)) }));
  const standing = (Object.keys(STATUS_LABEL) as ConsultStatus[]).filter((key) => summary.byStatus[key] > 0).map((key) => ({ label: STATUS_LABEL[key], value: capitalize(countWord(summary.byStatus[key])) }));
  const months = summary.months.map((row) => ({
    label: formatMonth(row.month),
    value: `${capitalize(countWord(row.received))} received, ${countWord(row.resolved)} resolved`,
  }));
  return (
    <div className={styles.tables}>
      <CountList id="by-kind" title="By kind of help" rows={kinds} empty="No requests yet." />
      <CountList id="by-status" title="Where requests stand" rows={standing} empty="No requests yet." />
      <CountList id="by-month" title="Month by month" rows={months} empty="No requests yet." />
    </div>
  );
}

/** Requests as a list of people and their work, not a table of codes. */
export function RequestList({ requests, detailHref }: { requests: LeaderRequestView[]; detailHref?: (id: string) => string }) {
  if (requests.length === 0) return <p className={styles.empty}>There are no requests here yet.</p>;
  return (
    <ul className={styles.requestList}>
      {requests.map((request) => {
        const acknowledgment = acknowledgmentLine(request);
        return (
          <li key={request.id} className={styles.requestRow}>
            <div>
              <h3>{detailHref ? <Link href={detailHref(request.id)}>{request.workTitle}</Link> : request.workTitle}</h3>
              <p className={styles.requestMeta}>Asked by {request.requesterName}{request.requesterUnit ? ` (${request.requesterUnit})` : ""} on {formatDate(request.createdAt)}</p>
              <p className={styles.requestMeta}>{SUPPORT_LABEL[request.supportType]}. {TIMING_LABEL[request.timing]}.</p>
              <p className={styles.requestMeta}>Supervisor: {request.supervisorName}</p>
              {request.referredTo ? <p className={styles.requestMeta}>Passed to {request.referredTo}</p> : null}
              {request.outcome ? <p className={styles.requestOutcome}><strong>Outcome.</strong> {request.outcome}</p> : null}
            </div>
            <div className={styles.requestAside}>
              <div>
                <strong>Where it stands</strong>
                <StatusPill status={request.status} overdue={request.overdue} />
                {acknowledgment ? <span>{acknowledgment}</span> : null}
              </div>
              <div>
                <strong>Taking it on</strong>
                <span>{request.ownerName ?? "Not named yet"}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function describe(event: ConsultEvent): string {
  switch (event.kind) {
    case "submitted": return "Request received";
    case "acknowledged": return "The consultant acknowledged the request";
    case "status_changed": return `The request is now ${event.toStatus ? STATUS_LABEL[event.toStatus].toLowerCase() : "updated"}`;
    case "owner_assigned": return event.note ?? "Someone was named to take this on";
    case "referred": return event.note ?? "Passed to another office";
    case "outcome_recorded": return `Resolved. Outcome: ${event.note ?? ""}`.trim();
    case "withdrawn": return "The request was withdrawn";
    case "overdue_flagged": return "Flagged for follow-up: still waiting to be acknowledged after two business days";
    case "note": return event.note ? `Note: ${event.note}` : "A note was added";
    default: return "An update was recorded";
  }
}

export function Timeline({ events, withTime = false }: { events: ConsultEvent[]; withTime?: boolean }) {
  return (
    <ol className={styles.history}>
      {events.map((event) => (
        <li key={event.id}>
          <span className={styles.historyWhen}>{withTime ? formatDateTime(event.occurredAt) : formatDate(event.occurredAt)}</span>
          <span className={styles.historyWhat}>
            {describe(event)}
            {event.visibleToRequester ? null : <span className={styles.historyPrivate}>Not shown to the requester</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
