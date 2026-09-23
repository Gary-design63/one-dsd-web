// Renders memo2/final.json (the synthesized consultant memo) to Word.
// Design: Aptos; navy 003865, black, white only; Letter; 1" margins.
const fs = require("fs"); const path = require("path");
const { AlignmentType, BorderStyle, Document, HeadingLevel, LevelFormat, Packer, PageNumber, Paragraph,
  ShadingType, Table, TableCell, TableRow, TextRun, WidthType, Footer, TabStopType, ExternalHyperlink,
  ImageRun } = require("docx");

const FONT = "Aptos", NAVY = "003865", BLACK = "000000", WHITE = "FFFFFF";
// The package is always emitted beside the memo, so the link is a fixed relative name.
const BRIEFING_HREF = "One-DSD-PAC-Program-Package.html";
const src = process.argv[2] || path.join(__dirname, "final.json");
const memo = JSON.parse(fs.readFileSync(src, "utf8"));

// "**bold**" inline markup → runs
const runs = (text, base = {}) => {
  const out = []; const re = /\*\*(.+?)\*\*/g; let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), font: FONT, size: 21, color: BLACK, ...base }));
    out.push(new TextRun({ text: m[1], font: FONT, size: 21, color: BLACK, bold: true, ...base }));
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), font: FONT, size: 21, color: BLACK, ...base }));
  return out;
};
const plain = (t) => t.replace(/\*\*/g, "");

const para = (text, o = {}) => new Paragraph({ spacing: { after: 120, line: 264 }, ...o, children: runs(text) });
const h1 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 70 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 6 } },
  children: [new TextRun({ text: t.toUpperCase(), font: FONT, size: 18, bold: true, color: NAVY })],
});
const bullet = (text, ref) => new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 100, line: 276 }, children: runs(text) });
const callout = (text) => new Paragraph({
  spacing: { before: 120, after: 220, line: 300 }, indent: { left: 360 },
  border: { left: { style: BorderStyle.SINGLE, size: 24, color: NAVY, space: 12 } },
  children: runs(text, { size: 24, bold: true, color: NAVY }).map((r) => r),
});
const linkBlock = (label, text, note) => new Paragraph({
  spacing: { before: 60, after: 200, line: 276 },
  children: [
    new TextRun({ text: (label || "EVIDENCE") + "   ", font: FONT, size: 18, bold: true, color: NAVY, allCaps: true }),
    new ExternalHyperlink({ link: BRIEFING_HREF, children: [new TextRun({ text: plain(text), font: FONT, size: 22, bold: true, color: NAVY, underline: {} })] }),
    ...(note ? [new TextRun({ text: "  —  " + plain(note), font: FONT, size: 21, color: BLACK })] : []),
  ],
});

const cell = (text, { header = false, width, bold = false } = {}) => new TableCell({
  width: { size: width, type: WidthType.DXA },
  shading: header ? { type: ShadingType.CLEAR, fill: NAVY, color: "auto" } : undefined,
  margins: { top: 90, bottom: 90, left: 120, right: 120 },
  children: [new Paragraph({ spacing: { after: 0, line: 264 }, children: runs(String(text), { size: 19, bold: header || bold, color: header ? WHITE : BLACK }) })],
});
const borders = Object.fromEntries(["top", "bottom", "left", "right", "insideHorizontal", "insideVertical"]
  .map((k) => [k, { style: BorderStyle.SINGLE, size: 4, color: NAVY }]));
const widthsFor = (headers, rows) => {
  const n = headers.length, total = 9360;
  // weight columns by average content length, floor each at 1300 DXA
  const avg = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => (r[i] || "").length)) );
  const sum = avg.reduce((a, x) => a + x, 0) || 1;
  let w = avg.map((x) => Math.max(1300, Math.round((x / sum) * total)));
  const over = w.reduce((a, x) => a + x, 0) - total;
  if (over > 0) { const big = w.indexOf(Math.max(...w)); w[big] -= over; }
  return w;
};
const table = (headers, rows) => {
  const widths = widthsFor(headers, rows);
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: widths, borders,
    rows: [new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, { header: true, width: widths[i] })) }),
      ...rows.map((r) => new TableRow({ children: headers.map((_, i) => cell(r[i] ?? "", { width: widths[i], bold: i === 0 })) }))],
  });
};
const IMG_W = 624; // 6.5in text column at 96dpi
const FIG_ALT = {
  "diagram-a-how-the-levels-connect.png": "Diagram of four stacked levels: the Department, the Administration, the Division and the Program, with authority flowing down and practice and evidence flowing up.",
  "diagram-b-fixed-and-flexible.png": "Venn diagram of three circles: the DHS Equity Policy and DEIA principles, the only non-negotiable; ADSA's six equity goals, what must be achieved with how left open; and the Division's operating non-negotiables. The Program sits in the overlap.",
  "diagram-c-how-the-work-moves.png": "Workflow diagram: a question arises, staff open a resource, staff do the work, staff name the gap, and the consultant builds and updates; below it, responsibility shared across leadership, staff and the consultant.",
};
const altOf = (file, caption, alt) => {
  const d = alt || FIG_ALT[path.basename(file)] || caption || "Figure";
  return { title: d, description: d, name: path.basename(file) };
};
const figure = (file, caption, alt) => {
  const abs = path.isAbsolute(file) ? file : path.join(__dirname, file);
  const buf = fs.readFileSync(abs);
  // PNG header carries the intrinsic size; scale it to the column width.
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  const out = [new Paragraph({
    spacing: { before: 160, after: 40 }, alignment: AlignmentType.CENTER,
    children: [new ImageRun({ data: buf, type: "png", altText: altOf(file, caption, alt),
      transformation: { width: IMG_W, height: Math.round(IMG_W * h / w) } })],
  })];
  if (caption) out.push(new Paragraph({
    spacing: { after: 220 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: caption, font: FONT, size: 17, color: NAVY, italics: true })],
  }));
  return out;
};
const spacer = () => new Paragraph({ spacing: { after: 120 }, children: [] });
const rule = (before = 120, after = 260) => new Paragraph({ spacing: { before, after }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: NAVY, space: 2 } }, children: [] });
const memoLine = (l, v) => new Paragraph({
  spacing: { after: 90 }, tabStops: [{ type: TabStopType.LEFT, position: 1260 }],
  children: [new TextRun({ text: l, font: FONT, size: 21, bold: true, color: NAVY }), new TextRun({ text: "\t" + v, font: FONT, size: 22, color: BLACK })],
});

// The Division-designated DHS logo, top left. The file sits beside the diagrams in either layout.
const LOGO_ALT = "Minnesota Department of Human Services, Disability Services Division";
const logoPath = ["../connect/dsd-logo.png", "../diagrams/dsd-logo.png"].map((p) => path.join(__dirname, p)).find((p) => fs.existsSync(p));
const logoBuf = fs.readFileSync(logoPath);
const logoW = 250, logoH = Math.round(logoW * logoBuf.readUInt32BE(20) / logoBuf.readUInt32BE(16));
const children = [
  new Paragraph({ spacing: { after: 200 }, children: [new ImageRun({ data: logoBuf, type: "png",
    altText: { title: LOGO_ALT, description: LOGO_ALT, name: "dsd-logo.png" },
    transformation: { width: logoW, height: logoH } })] }),
  new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "MEMORANDUM", font: FONT, size: 32, bold: true, color: NAVY, characterSpacing: 60 })] }),
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Minnesota Department of Human Services", font: FONT, size: 19, color: BLACK })] }),
  new Paragraph({ spacing: { after: 220 }, children: [new TextRun({ text: "Aging and Disability Services Administration  |  Disability Services Division", font: FONT, size: 19, color: BLACK })] }),
  rule(0, 240),
  memoLine("TO", "Heidi Hamilton, Division Director  —  Leigh Ann Ahmad, Manager"),
  memoLine("", "Disability Services Division"),
  memoLine("FROM", "Gary Banks, Equity and Inclusion Operations Consultant"),
  memoLine("DATE", "September 18, 2026"),
  memoLine("SUBJECT", plain(memo.subject)),
  rule(120, 200),
];

for (const sec of memo.sections) {
  if (sec.heading && sec.heading.trim()) children.push(h1(plain(sec.heading)));
  for (const b of sec.blocks) {
    switch (b.type) {
      case "p": children.push(para(b.text || "")); break;
      case "callout": children.push(callout(b.text || "")); break;
      case "bullets": (b.items || []).forEach((t) => children.push(bullet(t, "m2-b"))); children.push(spacer()); break;
      case "numbered": (b.items || []).forEach((t) => children.push(bullet(t, "m2-n"))); children.push(spacer()); break;
      case "table": children.push(table(b.headers || [], b.rows || [])); children.push(spacer()); break;
      case "link": children.push(linkBlock(b.label, b.text || "The One DSD People, Access and Culture briefing", b.note)); break;
      case "figure": figure(b.file, b.caption, b.alt).forEach((x) => children.push(x)); break;
      default: children.push(para(b.text || ""));
    }
  }
}

const doc = new Document({
  creator: "Gary Banks", title: plain(memo.subject),
  description: "Memorandum to Heidi Hamilton and Leigh Ann Ahmad on the One DSD People, Access and Culture Program.",
  subject: "One DSD People, Access and Culture Program", keywords: "equity, DSD, DHS, memorandum",
  styles: { default: { document: { run: { font: FONT, size: 22, color: BLACK } } } },
  numbering: { config: [
    { reference: "m2-b", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    { reference: "m2-n", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] },
  ] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "One DSD People, Access and Culture Program        ", font: FONT, size: 17, color: BLACK }),
      new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 17, color: BLACK }),
    ] })] }) },
    children,
  }],
});
const out = process.argv[3] || path.join(__dirname, "One-DSD-PAC-Approval-Memo.docx");
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log("wrote", out, buf.length, "bytes"); });
