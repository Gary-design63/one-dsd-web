import ExcelJS from "exceljs";
import { runsToText, type DocumentBlock, type ResourceDocument } from "../model";
import { DOWNLOAD_THEME as T } from "../theme";

type ContentRow = { section: string; heading: string; type: string; text: string; detail: string };

function styleHeader(sheet: ExcelJS.Worksheet) {
  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" }, name: T.fontFamily };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${T.navy}` } };
  header.alignment = { vertical: "middle", wrapText: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
}

function finishSheet(sheet: ExcelJS.Worksheet) {
  sheet.eachRow((row, index) => {
    if (index === 1) return;
    row.alignment = { vertical: "top", wrapText: true };
    row.font = { name: T.fontFamily, size: 11 };
  });
}

function sheetName(used: Set<string>, requested: string): string {
  const base = requested.replace(/[\[\]:*?/\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 28) || "Table";
  let name = base;
  let counter = 2;
  while (used.has(name.toLowerCase())) {
    name = `${base.slice(0, 25)} ${counter}`;
    counter += 1;
  }
  used.add(name.toLowerCase());
  return name;
}

const EXCEL_CELL = 32000;

function cell(value: string): string {
  return value.length > EXCEL_CELL ? `${value.slice(0, EXCEL_CELL - 1)}…` : value;
}

function blockRows(sectionTitle: string, block: DocumentBlock, currentHeading: { value: string }): ContentRow[] {
  const base = { section: sectionTitle, heading: currentHeading.value };
  switch (block.kind) {
    case "heading":
      currentHeading.value = block.text;
      return [{ ...base, heading: block.text, type: "Heading", text: cell(block.text), detail: "" }];
    case "paragraph":
      return [{ ...base, type: "Paragraph", text: cell(runsToText(block.runs)), detail: "" }];
    case "list":
      return block.items.map((item, index) => ({
        ...base,
        type: block.ordered ? `Step ${index + 1}` : "Bullet",
        text: cell(runsToText(item)),
        detail: "",
      }));
    case "table":
      return block.rows.map((row) => ({
        ...base,
        type: "Table row",
        text: cell(row[0] ?? ""),
        detail: cell(row
          .slice(1)
          .map((value, index) => (block.headers[index + 1] ? `${block.headers[index + 1]}: ${value}` : value))
          .join("\n")),
      }));
    case "quote":
      return [{ ...base, type: "Quote", text: cell(block.text), detail: cell(block.cite ?? "") }];
    case "callout":
      return [{ ...base, type: block.label ?? "Note", text: cell(block.text), detail: "" }];
    case "fields":
      return block.rows.map((row) => ({ ...base, type: "Field", text: cell(row.value), detail: cell(row.label) }));
  }
}

export async function renderXlsx(document: ResourceDocument): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = document.attribution;
  workbook.title = document.title;
  workbook.created = new Date();
  const usedNames = new Set<string>(["overview", "content", "sources"]);

  const overview = workbook.addWorksheet("Overview");
  overview.columns = [
    { header: "Field", key: "field", width: 22 },
    { header: "Value", key: "value", width: 110 },
  ];
  styleHeader(overview);
  if (document.kicker) overview.addRow({ field: "Program", value: document.kicker });
  overview.addRow({ field: "Title", value: document.title });
  if (document.subtitle) overview.addRow({ field: "Summary", value: document.subtitle });
  for (const entry of document.meta) overview.addRow({ field: entry.label, value: entry.value });
  overview.addRow({ field: "Attribution", value: document.attribution });
  finishSheet(overview);

  const content = workbook.addWorksheet("Content");
  content.columns = [
    { header: "Section", key: "section", width: 30 },
    { header: "Heading", key: "heading", width: 30 },
    { header: "Type", key: "type", width: 14 },
    { header: "Text", key: "text", width: 90 },
    { header: "Detail", key: "detail", width: 46 },
  ];
  styleHeader(content);

  const tableSheets: { name: string; headers: string[]; rows: string[][] }[] = [];
  document.sections.forEach((entry, index) => {
    const sectionTitle = entry.heading ?? (index === 0 ? "Overview" : `Section ${index + 1}`);
    const currentHeading = { value: "" };
    for (const block of entry.blocks) {
      for (const row of blockRows(sectionTitle, block, currentHeading)) content.addRow(row);
      if (block.kind === "table") tableSheets.push({ name: sheetName(usedNames, sectionTitle), headers: block.headers, rows: block.rows });
    }
  });
  finishSheet(content);

  for (const entry of tableSheets) {
    const sheet = workbook.addWorksheet(entry.name);
    const columns = Math.max(entry.headers.length, ...entry.rows.map((row) => row.length), 1);
    sheet.columns = Array.from({ length: columns }, (_, index) => ({
      header: entry.headers[index] ?? `Column ${index + 1}`,
      key: `c${index}`,
      width: index === 0 ? 34 : 48,
    }));
    styleHeader(sheet);
    for (const row of entry.rows) sheet.addRow(Array.from({ length: columns }, (_, index) => cell(row[index] ?? "")));
    finishSheet(sheet);
  }

  if (document.sources && document.sources.length > 0) {
    const sources = workbook.addWorksheet("Sources");
    sources.columns = [
      { header: "Source", key: "title", width: 60 },
      { header: "Link", key: "href", width: 60 },
      { header: "Note", key: "note", width: 70 },
    ];
    styleHeader(sources);
    for (const source of document.sources) {
      const row = sources.addRow({ title: source.title, href: source.href ?? "", note: source.note ?? "" });
      if (source.href) {
        row.getCell("href").value = { text: source.href, hyperlink: source.href };
        row.getCell("href").font = { name: T.fontFamily, size: 11, color: { argb: `FF${T.navy}` }, underline: true };
      }
    }
    finishSheet(sources);
  }

  const output = await workbook.xlsx.writeBuffer();
  return Buffer.isBuffer(output) ? output : Buffer.from(output as ArrayBuffer);
}
