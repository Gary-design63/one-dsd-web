import PDFDocument from "pdfkit";
import type { DocumentBlock, InlineRun, ResourceDocument } from "../model";
import { DOWNLOAD_THEME, hex } from "../theme";

const MARGIN = { top: 60, bottom: 64, left: 58, right: 58 };
const BODY_SIZE = 10.5;
const LINE_GAP = 3;

const REGULAR = "Helvetica";
const BOLD = "Helvetica-Bold";
const ITALIC = "Helvetica-Oblique";
const BOLD_ITALIC = "Helvetica-BoldOblique";

type Pdf = InstanceType<typeof PDFDocument>;

function fontFor(run: InlineRun): string {
  if (run.bold && run.italic) return BOLD_ITALIC;
  if (run.bold) return BOLD;
  if (run.italic) return ITALIC;
  return REGULAR;
}

class Writer {
  readonly doc: Pdf;
  readonly usable: number;

  constructor(doc: Pdf) {
    this.doc = doc;
    this.usable = doc.page.width - MARGIN.left - MARGIN.right;
  }

  get bottom(): number {
    return this.doc.page.height - MARGIN.bottom;
  }

  ensure(height: number) {
    if (this.doc.y + height > this.bottom) this.doc.addPage();
  }

  body() {
    this.doc.font(REGULAR).fontSize(BODY_SIZE).fillColor(hex(DOWNLOAD_THEME.ink));
  }

  runs(runs: InlineRun[], options: { x?: number; width?: number; size?: number; color?: string } = {}) {
    const width = options.width ?? this.usable;
    const x = options.x ?? MARGIN.left;
    const size = options.size ?? BODY_SIZE;
    const color = options.color ?? hex(DOWNLOAD_THEME.ink);
    if (runs.length === 0) return;
    this.ensure(size * 2);
    runs.forEach((run, index) => {
      this.doc.font(fontFor(run)).fontSize(size).fillColor(color);
      if (index === 0) {
        this.doc.text(run.text, x, this.doc.y, { width, lineGap: LINE_GAP, continued: runs.length > 1 });
      } else {
        this.doc.text(run.text, { width, lineGap: LINE_GAP, continued: index < runs.length - 1 });
      }
    });
    this.doc.x = MARGIN.left;
  }

  paragraph(runs: InlineRun[]) {
    this.runs(runs);
    this.doc.moveDown(0.6);
  }

  heading(text: string, level: 1 | 2 | 3) {
    const size = level === 1 ? 15 : level === 2 ? 13 : 11.5;
    this.ensure(size * 3);
    this.doc.moveDown(level === 1 ? 0.9 : 0.5);
    this.doc.font(BOLD).fontSize(size).fillColor(hex(DOWNLOAD_THEME.navy)).text(text, MARGIN.left, this.doc.y, { width: this.usable });
    if (level === 1) {
      const y = this.doc.y + 3;
      this.doc.moveTo(MARGIN.left, y).lineTo(MARGIN.left + this.usable, y).lineWidth(1).strokeColor(hex(DOWNLOAD_THEME.green)).stroke();
      this.doc.y = y + 8;
    } else {
      this.doc.moveDown(0.3);
    }
    this.body();
  }

  list(items: InlineRun[][], ordered: boolean) {
    const indent = 18;
    items.forEach((item, index) => {
      this.ensure(BODY_SIZE * 2.5);
      const y = this.doc.y;
      const marker = ordered ? `${index + 1}.` : "•";
      this.doc.font(REGULAR).fontSize(BODY_SIZE).fillColor(hex(DOWNLOAD_THEME.navy)).text(marker, MARGIN.left, y, { width: indent, lineBreak: false });
      this.doc.y = y;
      this.runs(item, { x: MARGIN.left + indent, width: this.usable - indent });
      this.doc.moveDown(0.25);
    });
    this.doc.moveDown(0.4);
  }

  table(headers: string[], rows: string[][]) {
    const columns = Math.max(headers.length, ...rows.map((row) => row.length), 1);
    const colWidth = this.usable / columns;
    const pad = 5;
    const size = 9.5;
    const cellHeight = (values: string[], font: string) => {
      this.doc.font(font).fontSize(size);
      return Math.max(...values.map((value) => this.doc.heightOfString(value || " ", { width: colWidth - pad * 2, lineGap: 1 }))) + pad * 2;
    };
    const drawRow = (values: string[], options: { header?: boolean; shade?: boolean }) => {
      const cells = Array.from({ length: columns }, (_, index) => (values[index] ?? "").slice(0, 4000));
      const font = options.header ? BOLD : REGULAR;
      const pageRoom = Math.max(this.bottom - MARGIN.top - 8, BODY_SIZE * 4);
      const height = Math.min(cellHeight(cells, font), pageRoom);
      if (this.doc.y + height > this.bottom) {
        this.doc.addPage();
        if (!options.header && headers.length > 0) drawRow(headers, { header: true });
      }
      const y = this.doc.y;
      if (options.header) {
        this.doc.rect(MARGIN.left, y, this.usable, height).fill(hex(DOWNLOAD_THEME.navy));
      } else if (options.shade) {
        this.doc.rect(MARGIN.left, y, this.usable, height).fill(hex(DOWNLOAD_THEME.panel));
      }
      cells.forEach((value, index) => {
        const x = MARGIN.left + colWidth * index;
        this.doc.rect(x, y, colWidth, height).lineWidth(0.5).strokeColor(hex(DOWNLOAD_THEME.line)).stroke();
        this.doc
          .font(options.header ? BOLD : index === 0 ? BOLD : REGULAR)
          .fontSize(size)
          .fillColor(options.header ? "#FFFFFF" : index === 0 ? hex(DOWNLOAD_THEME.navy) : hex(DOWNLOAD_THEME.ink))
          .text(value, x + pad, y + pad, { width: colWidth - pad * 2, lineGap: 1 });
      });
      this.doc.x = MARGIN.left;
      this.doc.y = y + height;
    };
    this.ensure(size * 4);
    if (headers.length > 0) drawRow(headers, { header: true });
    rows.forEach((row, index) => drawRow(row, { shade: index % 2 === 1 }));
    this.doc.moveDown(0.8);
    this.body();
  }

  quote(text: string, cite?: string) {
    const indent = 16;
    this.doc.font(ITALIC).fontSize(BODY_SIZE);
    const height = this.doc.heightOfString(text, { width: this.usable - indent - 4, lineGap: LINE_GAP });
    this.ensure(height + 20);
    const y = this.doc.y;
    this.doc.rect(MARGIN.left, y, 3, height).fill(hex(DOWNLOAD_THEME.navy));
    this.doc.font(ITALIC).fontSize(BODY_SIZE).fillColor(hex(DOWNLOAD_THEME.ink)).text(text, MARGIN.left + indent, y, { width: this.usable - indent - 4, lineGap: LINE_GAP });
    if (cite) {
      this.doc.font(REGULAR).fontSize(9).fillColor(hex(DOWNLOAD_THEME.muted)).text(`— ${cite}`, MARGIN.left + indent, this.doc.y + 2, { width: this.usable - indent });
    }
    this.doc.x = MARGIN.left;
    this.doc.moveDown(0.8);
    this.body();
  }

  callout(text: string, label?: string) {
    const pad = 10;
    const width = this.usable - pad * 2;
    this.doc.font(REGULAR).fontSize(BODY_SIZE);
    const labelHeight = label ? this.doc.heightOfString(label, { width }) + 2 : 0;
    const height = this.doc.heightOfString(text, { width, lineGap: LINE_GAP }) + labelHeight + pad * 2;
    this.ensure(height + 8);
    const y = this.doc.y;
    this.doc.rect(MARGIN.left, y, this.usable, height).fill(hex(DOWNLOAD_THEME.greenSoft));
    let textY = y + pad;
    if (label) {
      this.doc.font(BOLD).fontSize(BODY_SIZE).fillColor(hex(DOWNLOAD_THEME.green)).text(label, MARGIN.left + pad, textY, { width });
      textY = this.doc.y + 2;
    }
    this.doc.font(REGULAR).fontSize(BODY_SIZE).fillColor(hex(DOWNLOAD_THEME.ink)).text(text, MARGIN.left + pad, textY, { width, lineGap: LINE_GAP });
    this.doc.x = MARGIN.left;
    this.doc.y = y + height;
    this.doc.moveDown(0.7);
    this.body();
  }

  fields(rows: { label: string; value: string }[]) {
    this.table(["Item", "Detail"], rows.map((row) => [row.label, row.value]));
  }

  block(block: DocumentBlock) {
    switch (block.kind) {
      case "heading":
        return this.heading(block.text, block.level);
      case "paragraph":
        return this.paragraph(block.runs);
      case "list":
        return this.list(block.items, Boolean(block.ordered));
      case "table":
        return this.table(block.headers, block.rows);
      case "quote":
        return this.quote(block.text, block.cite);
      case "callout":
        return this.callout(block.text, block.label);
      case "fields":
        return this.fields(block.rows);
    }
  }
}

export function renderPdf(document: ResourceDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margins: MARGIN,
      bufferPages: true,
      info: { Title: document.title, Author: document.attribution, Subject: document.subtitle ?? document.title },
    });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const writer = new Writer(doc);

    if (document.kicker) {
      doc.font(BOLD).fontSize(8.5).fillColor(hex(DOWNLOAD_THEME.muted)).text(document.kicker.toUpperCase(), MARGIN.left, doc.y, { width: writer.usable, characterSpacing: 1 });
      doc.moveDown(0.4);
    }
    doc.font(BOLD).fontSize(22).fillColor(hex(DOWNLOAD_THEME.navy)).text(document.title, MARGIN.left, doc.y, { width: writer.usable, lineGap: 2 });
    doc.moveDown(0.3);
    if (document.subtitle) {
      doc.font(ITALIC).fontSize(11.5).fillColor(hex(DOWNLOAD_THEME.muted)).text(document.subtitle, MARGIN.left, doc.y, { width: writer.usable, lineGap: 2 });
      doc.moveDown(0.4);
    }
    if (document.meta.length > 0) {
      doc.font(REGULAR).fontSize(9).fillColor(hex(DOWNLOAD_THEME.muted));
      document.meta.forEach((entry, index) => {
        doc.font(BOLD).text(`${entry.label}: `, index === 0 ? MARGIN.left : doc.x, index === 0 ? doc.y : doc.y, { continued: true, width: writer.usable });
        doc.font(REGULAR).text(entry.value, { continued: index < document.meta.length - 1 });
        if (index < document.meta.length - 1) doc.text("   ·   ", { continued: true });
      });
      doc.x = MARGIN.left;
      doc.moveDown(0.5);
    }
    const ruleY = doc.y + 2;
    doc.moveTo(MARGIN.left, ruleY).lineTo(MARGIN.left + writer.usable, ruleY).lineWidth(1.5).strokeColor(hex(DOWNLOAD_THEME.navy)).stroke();
    doc.y = ruleY + 14;
    writer.body();

    for (const entry of document.sections) {
      if (entry.heading) writer.heading(entry.heading, 1);
      for (const block of entry.blocks) writer.block(block);
    }

    if (document.sources && document.sources.length > 0) {
      writer.heading("Sources", 1);
      writer.list(
        document.sources.map((source) => [
          { text: source.title, bold: true },
          ...(source.note ? [{ text: ` — ${source.note}` }] : []),
          ...(source.href ? [{ text: ` ${source.href}` }] : []),
        ]),
        false,
      );
    }

    const range = doc.bufferedPageRange();
    for (let index = range.start; index < range.start + range.count; index += 1) {
      doc.switchToPage(index);
      const savedBottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      doc
        .font(REGULAR)
        .fontSize(8)
        .fillColor(hex(DOWNLOAD_THEME.muted))
        .text(`${document.attribution}   ·   Page ${index - range.start + 1} of ${range.count}`, MARGIN.left, doc.page.height - 40, {
          width: writer.usable,
          align: "center",
          lineBreak: false,
        });
      doc.page.margins.bottom = savedBottom;
    }
    doc.end();
  });
}
