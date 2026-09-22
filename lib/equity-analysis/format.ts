const nf = new Intl.NumberFormat("en-US");
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Whole-number formatting shared by server pages and client charts. */
export const fmt = (n: number) => nf.format(n);

/** Renders a YYYY-MM-DD calendar date as "Month D, YYYY"; other strings pass through. */
export function formatDate(value: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? dateFmt.format(new Date(`${value}T00:00:00Z`)) : value;
}
