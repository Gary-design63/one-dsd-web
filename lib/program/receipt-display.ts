/** Keep saved audit receipts intact while omitting source-check and content-review dates from the page. */
export function receiptBodyForDisplay(body: string, method: string): string {
  if (method === "program_record_review") {
    return body
      .replace(/(^|\n\n)Checked: \d{4}-\d{2}-\d{2}T[^\n]*(?=\n\n|$)/, "")
      .replace(/; review (?:\d{4}-\d{2}-\d{2}|not recorded)\./g, ".");
  }
  if (method === "source_check") {
    return body
      .replace(/^Source access checked \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z\./, "Source access checked.")
      .replace(/; the canonical source review date remains unchanged\./, ".");
  }
  return body;
}
