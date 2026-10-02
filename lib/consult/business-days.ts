/** Business-day arithmetic in Central time. Weekends are skipped; holidays are not modeled. */
const TZ = "America/Chicago";

function centralParts(date: Date): { weekday: number } {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" }).format(date);
  return { weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name) };
}

/** Moment by which a request received at `from` must be acknowledged: end of the Nth business day after receipt. */
export function addBusinessDays(from: Date, days: number): Date {
  const result = new Date(from.getTime());
  let remaining = days;
  while (remaining > 0) {
    result.setUTCDate(result.getUTCDate() + 1);
    const weekday = centralParts(result).weekday;
    if (weekday !== 0 && weekday !== 6) remaining -= 1;
  }
  return result;
}

export function isOverdue(input: { status: string; acknowledgedAt: string | null; acknowledgmentDueAt: string }, now = new Date()): boolean {
  if (input.acknowledgedAt) return false;
  if (!["received"].includes(input.status)) return false;
  return Date.parse(input.acknowledgmentDueAt) < now.getTime();
}
