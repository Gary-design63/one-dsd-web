import { dispositionLabel, KIND_LABEL, STEPS, workTypeLabel, FRAME_FIELD_IDS } from "./model";
import type { FollowUp } from "./rollups";
import type { EquityAnalysisRecord } from "./schema";

const FIXED_COLUMNS = ["Reference", "Submitted", "Form", "Program view", "Administration", "Kind of work", "Work", "Approval date", "Disposition"];

const ANSWER_FIELDS = STEPS.flatMap((s) => s.fields).filter(
  (f) => !(FRAME_FIELD_IDS as readonly string[]).includes(f.id) && f.id !== "disposition",
);

function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function analysesToCsv(records: EquityAnalysisRecord[]): string {
  const header = [...FIXED_COLUMNS, ...ANSWER_FIELDS.map((f) => f.label)];
  const lines = records.map((r) =>
    [
      r.id,
      r.createdAt.slice(0, 10),
      KIND_LABEL[r.kind],
      r.programScope === "dsd" ? "One DSD" : "One DHS",
      r.administration,
      workTypeLabel(r.workType),
      r.workTitle,
      r.approvalDate ?? "",
      dispositionLabel(r.disposition),
      ...ANSWER_FIELDS.map((f) => r.answers[f.id as keyof typeof r.answers] ?? ""),
    ]
      .map(csvCell)
      .join(","),
  );
  return "\uFEFF" + [header.map(csvCell).join(","), ...lines].join("\r\n") + "\r\n";
}

function icsEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function followUpToIcs(f: FollowUp, recordUrl: string): string {
  const date = f.due.replace(/-/g, "");
  const next = new Date(new Date(`${f.due}T00:00:00Z`).getTime() + 86_400_000).toISOString().slice(0, 10).replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const summary = `${f.label}: ${f.workTitle}`;
  const description = [
    `Equity analysis follow-up: ${f.label}.`,
    f.role ? `Role: ${f.role}` : null,
    `Administration: ${f.administration}`,
    `Record: ${recordUrl}`,
  ]
    .filter(Boolean)
    .join("\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//One DHS People Access and Culture//Equity Analysis//EN",
    "BEGIN:VEVENT",
    `UID:${f.analysisId}-${f.key}@one-dhs-pac`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${date}`,
    `DTEND;VALUE=DATE:${next}`,
    `SUMMARY:${icsEscape(summary)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    `URL:${recordUrl}`,
    "BEGIN:VALARM",
    "TRIGGER:-P7D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(summary)} in one week`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadText(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
