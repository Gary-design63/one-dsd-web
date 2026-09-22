import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";

export const PRACTICE_FIELDS = [
  {id:"situation",label:"The situation I want to work on",required:true},
  {id:"assumption",label:"An assumption I want to examine",required:false},
  {id:"perspective",label:"Another perspective or question to explore",required:false},
  {id:"action",label:"One thing I will try",required:true},
  {id:"feedback",label:"How I could find out whether it helped",required:false},
  {id:"observed",label:"What happened when I tried it",required:false},
  {id:"adjustment",label:"What I learned and what I will do next",required:false}
] as const;
export type PracticeField = typeof PRACTICE_FIELDS[number]["id"];
export type PracticeValues = Record<PracticeField, string>;
export type PracticeNotes = Record<string, PracticeValues>;
export const PRACTICE_STORAGE_KEY = "one-dhs-learning-practice-v1";
export function emptyPractice(): PracticeValues {
  return {situation:"",assumption:"",perspective:"",action:"",feedback:"",observed:"",adjustment:""};
}
export function buildPracticeNote(title: string, values: PracticeValues): string | null {
  if (!values.situation.trim() || !values.action.trim()) return null;
  return ["My learning in practice",title,...PRACTICE_FIELDS.map(field => field.label+"\n"+(values[field.id].trim() || "Not recorded.")),TRAINING_CREDIT_NOTICE].join("\n\n");
}
/** Restore this tool's own bounded notes only; do not treat arbitrary local data as valid. */
export function readPracticeNotes(raw: string, stopIds: readonly string[]): PracticeNotes {
  if (raw.length > 500000) throw new Error("Saved notes are too large.");
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || !("version" in parsed) || parsed.version !== 1 || !("notes" in parsed) ||
      !parsed.notes || typeof parsed.notes !== "object" || Array.isArray(parsed.notes)) throw new Error("Saved notes could not be read.");
  const notes: PracticeNotes = {};
  for (const [id, entry] of Object.entries(parsed.notes)) {
    if (!stopIds.includes(id)) continue;
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw new Error("Saved note could not be read.");
    const note = emptyPractice();
    for (const field of PRACTICE_FIELDS) {
      const value = (entry as Record<string, unknown>)[field.id];
      if (typeof value !== "string" || value.length > 2000) throw new Error("Saved note could not be read.");
      note[field.id] = value;
    }
    notes[id] = note;
  }
  return notes;
}

