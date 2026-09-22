import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { DocumentBlock, InlineRun, ResourceDocument } from "../model";
import { DOWNLOAD_THEME as T } from "../theme";

const PAGE = { width: 12240, height: 15840 };
const MARGIN = { top: 1080, bottom: 1080, left: 1260, right: 1260 };
const USABLE = PAGE.width - MARGIN.left - MARGIN.right;
const BODY = 22;
const BULLETS = "download-bullets";
const NUMBERS = "download-numbers";

const border = { style: BorderStyle.SINGLE, size: 4, color: T.line };
const tableBorders = {
  top: border,
  bottom: border,
  left: border,
  right: border,
  insideHorizontal: border,
  insideVertical: border,
};

function run(value: InlineRun, overrides: ConstructorParameters<typeof TextRun>[0] extends string ? never : Record<string, unknown> = {}) {
  return new TextRun({
    text: value.text,
    bold: value.bold,
    italics: value.italic,
    size: BODY,
    color: T.ink,
    font: T.fontFamily,
    ...overrides,
  });
}

function plain(text: string, overrides: Record<string, unknown> = {}) {
  return new TextRun({ text, size: BODY, color: T.ink, font: T.fontFamily, ...overrides });
}

function body(runs: InlineRun[], options: Record<string, unknown> = {}) {
  return new Paragraph({ spacing: { after: 160, line: 300 }, children: runs.map((value) => run(value)), ...options });
}

function cell(text: string, width: number, options: { header?: boolean; bold?: boolean; shade?: boolean } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    shading: options.header
      ? { type: ShadingType.CLEAR, fill: T.navy, color: "auto" }
      : options.shade
        ? { type: ShadingType.CLEAR, fill: T.panel, color: "auto" }
        : undefined,
    children: [
      new Paragraph({
        spacing: { line: 260 },
        children: [
          plain(text, {
            size: 20,
            bold: options.header || options.bold,
            color: options.header ? "FFFFFF" : options.bold ? T.navy : T.ink,
          }),
        ],
      }),
    ],
  });
}

function dataTable(headers: string[], rows: string[][]) {
  const columns = Math.max(headers.length, ...rows.map((row) => row.length), 1);
  const width = Math.floor(USABLE / columns);
  const widths = Array.from({ length: columns }, () => width);
  const pad = (row: string[]) => Array.from({ length: columns }, (_, index) => row[index] ?? "");
  return new Table({
    width: { size: USABLE, type: WidthType.DXA },
    columnWidths: widths,
    borders: tableBorders,
    rows: [
      ...(headers.length > 0
        ? [new TableRow({ tableHeader: true, children: pad(headers).map((text, index) => cell(text, widths[index], { header: true })) })]
        : []),
      ...rows.map(
        (row, rowIndex) =>
          new TableRow({
            children: pad(row).map((text, index) => cell(text, widths[index], { shade: rowIndex % 2 === 1, bold: index === 0 })),
          }),
      ),
    ],
  });
}

function fieldsTable(rows: { label: string; value: string }[]) {
  const labelWidth = Math.floor(USABLE * 0.28);
  const valueWidth = USABLE - labelWidth;
  return new Table({
    width: { size: USABLE, type: WidthType.DXA },
    columnWidths: [labelWidth, valueWidth],
    borders: tableBorders,
    rows: rows.map(
      (row) => new TableRow({ children: [cell(row.label, labelWidth, { bold: true, shade: true }), cell(row.value, valueWidth)] }),
    ),
  });
}

function renderBlock(block: DocumentBlock, state: { listInstance: number }): (Paragraph | Table)[] {
  switch (block.kind) {
    case "heading":
      return [
        new Paragraph({
          keepNext: true,
          heading: block.level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
          spacing: { before: block.level === 2 ? 280 : 200, after: 120 },
          children: [plain(block.text, { bold: true, size: block.level === 2 ? 26 : 24, color: T.navy })],
        }),
      ];
    case "paragraph":
      return [body(block.runs)];
    case "list": {
      const instance = block.ordered ? ++state.listInstance : 0;
      return block.items.map(
        (item) =>
          new Paragraph({
            spacing: { after: 80, line: 290 },
            numbering: block.ordered ? { reference: NUMBERS, level: 0, instance } : { reference: BULLETS, level: 0 },
            children: item.map((value) => run(value)),
          }),
      );
    }
    case "table":
      return [dataTable(block.headers, block.rows), new Paragraph({ spacing: { after: 120 }, children: [] })];
    case "quote":
      return [
        new Paragraph({
          indent: { left: 480 },
          spacing: { before: 120, after: block.cite ? 40 : 200, line: 300 },
          border: { left: { style: BorderStyle.SINGLE, size: 18, color: T.navy, space: 10 } },
          children: [plain(block.text, { italics: true })],
        }),
        ...(block.cite
          ? [
              new Paragraph({
                indent: { left: 480 },
                spacing: { after: 200 },
                children: [plain(`— ${block.cite}`, { size: 18, color: T.muted })],
              }),
            ]
          : []),
      ];
    case "callout":
      return [
        new Paragraph({
          shading: { type: ShadingType.CLEAR, fill: T.greenSoft, color: "auto" },
          spacing: { before: 120, after: 200, line: 300 },
          indent: { left: 200, right: 200 },
          children: [
            ...(block.label ? [plain(`${block.label}: `, { bold: true, color: T.green })] : []),
            plain(block.text),
          ],
        }),
      ];
    case "fields":
      return [fieldsTable(block.rows), new Paragraph({ spacing: { after: 120 }, children: [] })];
  }
}

export async function renderDocx(document: ResourceDocument): Promise<Buffer> {
  const state = { listInstance: 0 };
  const children: (Paragraph | Table)[] = [];

  if (document.kicker) {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [plain(document.kicker.toUpperCase(), { size: 17, color: T.muted, bold: true, characterSpacing: 20 })],
      }),
    );
  }
  children.push(
    new Paragraph({ spacing: { after: 120 }, children: [plain(document.title, { bold: true, size: 40, color: T.navy })] }),
  );
  if (document.subtitle) {
    children.push(new Paragraph({ spacing: { after: 160 }, children: [plain(document.subtitle, { italics: true, size: 23, color: T.muted })] }));
  }
  if (document.meta.length > 0) {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: T.navy, space: 12 } },
        children: document.meta.flatMap((entry, index) => [
          ...(index > 0 ? [plain("   ·   ", { size: 18, color: T.muted })] : []),
          plain(`${entry.label}: `, { size: 18, color: T.muted, bold: true }),
          plain(entry.value, { size: 18, color: T.muted }),
        ]),
      }),
    );
  } else {
    children.push(
      new Paragraph({ spacing: { after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: T.navy, space: 12 } }, children: [] }),
    );
  }

  for (const entry of document.sections) {
    if (entry.heading) {
      children.push(
        new Paragraph({
          keepNext: true,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 320, after: 140 },
          children: [plain(entry.heading, { bold: true, size: 28, color: T.navy })],
        }),
      );
    }
    for (const block of entry.blocks) children.push(...renderBlock(block, state));
  }

  if (document.sources && document.sources.length > 0) {
    children.push(
      new Paragraph({
        keepNext: true,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 320, after: 140 },
        children: [plain("Sources", { bold: true, size: 28, color: T.navy })],
      }),
    );
    for (const source of document.sources) {
      children.push(
        new Paragraph({
          spacing: { after: 80, line: 280 },
          numbering: { reference: BULLETS, level: 0 },
          children: [
            plain(source.title, { bold: true, size: 20 }),
            ...(source.note ? [plain(` — ${source.note}`, { size: 20, color: T.muted })] : []),
            ...(source.href
              ? [
                  plain(" ", { size: 20 }),
                  new ExternalHyperlink({
                    link: source.href,
                    children: [new TextRun({ text: source.href, size: 18, color: T.navy, underline: {}, font: T.fontFamily })],
                  }),
                ]
              : []),
          ],
        }),
      );
    }
  }

  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          plain(`${document.attribution}   ·   Page `, { size: 16, color: T.muted }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, color: T.muted, font: T.fontFamily }),
        ],
      }),
    ],
  });

  const file = new Document({
    creator: document.attribution,
    title: document.title,
    description: document.subtitle,
    styles: { default: { document: { run: { font: T.fontFamily, size: BODY, color: T.ink } } } },
    numbering: {
      config: [
        {
          reference: BULLETS,
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
        {
          reference: NUMBERS,
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: { page: { size: PAGE, margin: MARGIN } },
        footers: { default: footer },
        children,
      },
    ],
  });

  return Packer.toBuffer(file);
}
