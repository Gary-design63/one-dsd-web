const fs = require("fs"); const path = require("path");
const { AlignmentType, BorderStyle, Document, HeadingLevel, LevelFormat, Packer, PageNumber, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType, Footer, TabStopType } = require("docx");
const FONT = "Aptos", NAVY = "003865", GREEN = "2E6B12", INK = "181817", MUTED = "353532", LINE = "DDDDD9";
const tr = (text, o = {}) => new TextRun({ text, font: FONT, size: 22, color: INK, ...o });
const para = (c, o = {}) => new Paragraph({ spacing: { after: 140, line: 290 }, ...o, children: Array.isArray(c) ? c : [tr(c)] });
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 340, after: 140 }, children: [new TextRun({ text: t, font: FONT, size: 30, bold: true, color: NAVY })] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 260, after: 100 }, children: [new TextRun({ text: t, font: FONT, size: 24, bold: true, color: NAVY })] });
const bullet = (c) => new Paragraph({ numbering: { reference: "rp-bullets", level: 0 }, spacing: { after: 70, line: 280 }, children: Array.isArray(c) ? c : [tr(c)] });
const numbered = (c) => new Paragraph({ numbering: { reference: "rp-numbers", level: 0 }, spacing: { after: 70, line: 280 }, children: Array.isArray(c) ? c : [tr(c)] });
const cell = (text, { header = false, width, bold = false } = {}) => new TableCell({ width: { size: width, type: WidthType.DXA }, shading: header ? { type: ShadingType.CLEAR, fill: NAVY, color: "auto" } : undefined, margins: { top: 70, bottom: 70, left: 100, right: 100 }, children: [new Paragraph({ spacing: { after: 0, line: 264 }, children: [new TextRun({ text, font: FONT, size: 19, bold: header || bold, color: header ? "FFFFFF" : INK })] })] });
const borders = Object.fromEntries(["top", "bottom", "left", "right", "insideHorizontal", "insideVertical"].map((k) => [k, { style: BorderStyle.SINGLE, size: 4, color: LINE }]));
const table = (widths, headers, rows) => new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, borders, rows: [new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, { header: true, width: widths[i] })) }), ...rows.map((r) => new TableRow({ children: r.map((v, i) => cell(v, { width: widths[i], bold: i === 0 })) }))] });
const memoLine = (l, v) => new Paragraph({ spacing: { after: 70 }, tabStops: [{ type: TabStopType.LEFT, position: 1440 }], children: [new TextRun({ text: l, font: FONT, size: 22, bold: true, color: NAVY }), new TextRun({ text: "\t" + v, font: FONT, size: 22, color: INK })] });
const rule = () => new Paragraph({ spacing: { after: 220 }, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 4 } }, children: [] });
const b = (t) => tr(t, { bold: true });

const children = [
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "REPORTING PROCESS", font: FONT, size: 34, bold: true, color: NAVY })] }),
  new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "One DSD People, Access and Culture Program · Disability Services Division · Aging and Disability Services Administration · Minnesota Department of Human Services", font: FONT, size: 20, color: MUTED })] }),
  memoLine("TO:", "Leigh Ann Ahmad, Manager, Disability Services Division"),
  memoLine("FROM:", "Gary Banks, Equity and Inclusion Operations Consultant"),
  memoLine("DATE:", "September 18, 2026"),
  memoLine("SUBJECT:", "How the Program's work will be reported from October 2026 · draft for our review"),
  rule(),
  para("The memo on how the Program came to be was a reconstruction from notes. This document sets out how the work is tracked and reported from here, so that neither of us has to reconstruct it again. It gives one way of reporting: the same units of work, the same status words, a set cadence of artifacts, the measures that count, a decision log with owners and dates, and a clear path for escalation. It is built on the whole Program as it stands today, on the DSD DEIA Integration Framework's gate checks and quarterly learning reviews, on the DSD Operational Plan's quarterly correction loop, and on the ADSA Equity and Inclusion Implementation Plan's expectation that the Division's equity team plans, tracks and reports."),
  para("It serves three audiences in one chain: you, as my manager, for progress, barriers and support; Heidi as Director, when a decision or an exception is hers; and the ADSA Equity Committee, through the Division DEIA Council chair once seated, for the quarterly reporting the ADSA plan asks of every division."),

  h1("1. What is tracked"),
  para("Everything reported is one of six things. Each has a record with an owner."),
  table([2000, 4300, 3060], ["Unit", "What it is", "Where it lives"], [
    ["Workstream", "One of the ten areas in the operational workplan, each with outcomes, a target and a status.", "The operational workplan"],
    ["Work item", "A bounded piece of work with a decision owner, an intended outcome and evidence when done; the One DSD Team's items included.", "Team workspace record; workplan"],
    ["Release", "A change to the Program that staff can see: added, revised or withdrawn content, a tool, a curriculum.", "Monthly release note; release receipt"],
    ["Decision or support request", "Something a named person must decide or provide, with a date.", "Decision log and support register"],
    ["Barrier", "Something blocking a workstream or work item: what, since when, what has been tried, what would unblock it.", "Barrier entry in the workplan; raised at check-in"],
    ["Measure", "Evidence about program support and organizational patterns, never about individual employees.", "Quarterly report; dashboard once the baseline exists"],
  ]),

  h1("2. Status words and what 'done' means"),
  para("The same five words are used everywhere, so a status means one thing whether it appears in the workplan, a monthly update or a quarterly report."),
  bullet([b("Live. "), tr("In use by staff on the Program today.")]),
  bullet([b("In progress. "), tr("Work has started and has an owner, an outcome and a target.")]),
  bullet([b("Proposed. "), tr("Designed and ready, waiting on a decision, a dependency or capacity to begin.")]),
  bullet([b("Needs decision. "), tr("Cannot move until a named person decides; the decision is in the log with a date.")]),
  bullet([b("Blocked. "), tr("Started, then stopped by a barrier that is recorded and raised.")]),
  para([b("Done "), tr("means the intended outcome exists and the evidence for it is recorded. Activity is not an outcome: a meeting held, a page viewed or a course completed is not reported as a result. Where a target date is at risk, the timeline is marked amber; where it will be missed, red, with the new date and the reason.")]),

  h1("3. Cadence and artifacts"),
  table([1900, 3900, 1560, 2000], ["Artifact", "What it contains", "When", "Who"], [
    ["Check-in", "The workplan with the status column and the decision log updated beforehand; barriers since the last check-in; what I need from you.", "Every two weeks, thirty minutes", "You and me"],
    ["Monthly update", "One page: Done · Next · Blocked · Decisions needed · Measures. The release note for the month is attached.", "First working day of each month; first one October 1, 2026", "Me to you; shareable with the managers"],
    ["Quarterly report", "Progress against each workstream's target; the measures in section 4; Framework gate checks passed or not; support delivered or outstanding; a correction plan for any disparity that is not moving; next quarter's priorities.", "Within ten working days of quarter end; first one for October–December 2026 in January 2027", "Me to you and Heidi; to the ADSA Equity Committee through the DEIA Council chair once seated"],
    ["Quarterly learning review", "The councils examine the quarterly report and adjust strategy, as the Framework provides.", "Once the councils are chartered", "Executive Council and DEIA Council"],
    ["Annual report", "The year's outcomes against the Framework arc and the ADSA plan; charter reviews; next year's priorities.", "December each year; first in December 2027", "Me to Heidi through you"],
    ["Launch report", "Readiness against the definition of done; go/no-go recommendation; the launch date proposed for January 2027.", "December 2026", "Me to you and Heidi"],
  ]),

  h1("4. The measures that are reported"),
  para("Measures examine program support and organizational patterns. They never measure an individual employee, and an empty record means no evidence in that record, not that nothing happened elsewhere."),
  h2("Program support"),
  bullet("Can staff find trusted support faster: task success on Home, the One DSD entry and ASK, from moderated sessions."),
  bullet("Do they apply it to real work: voluntary participant accounts with source, the change described, the time period and its limits."),
  bullet("Can they tell when human authority is required: escalation paths visible; intake used appropriately."),
  bullet("What is inaccessible, outdated, missing, confusing or hard to apply: recorded dispositions with owners and review dates."),
  bullet("Did bounded work produce a change: work-item outcomes, with delivery, application and benefit kept distinct."),
  h2("Content stewardship"),
  bullet("Releases in the period; items added, revised and withdrawn; outside sources verified and reached before release; anything deferred to another office."),
  h2("Participation, in aggregate only"),
  bullet("Program use by area and resource type; Team and Amplify participation; learning cohorts started and completed. Never reported by name, never used to rank people or units."),
  h2("Governance and gate checks"),
  bullet("Framework gate checks One-A to Three-C answered yes or no with the verification named; decision-log items closed on time; protected time documented."),
  h2("Disparities data, once the baseline exists"),
  bullet("Disaggregated by race, disability, gender and language with a minimum cell size of five; recruitment, retention, advancement, accommodation and pay. When a quarterly report shows a disparity not improving, the DSD Operational Plan's correction plan is triggered: specific operational changes, named owners, due dates and the measure to be read next quarter."),

  h1("5. The decision log and support register"),
  para("Every ask of another person is written down once, with an owner and a date, and reviewed at every check-in. Nothing is asked twice by accident and nothing is forgotten."),
  table([3600, 5760], ["Field", "Rule"], [
    ["What is needed", "One sentence: a decision, an approval, time, data, a person."],
    ["From whom", "A named person or role: you, a manager, Heidi, HR, Data and Analytics, ADSA."],
    ["By when", "A date. If none can be given, the entry says why and when it will be revisited."],
    ["Workstream", "The workstream it unblocks."],
    ["Status", "Open · Provided · Declined · Deferred, with the date it changed."],
    ["Effect", "What moved once it was provided, written when it closes."],
  ]),

  h1("6. Escalation"),
  numbered("A barrier is raised at the check-in where it appears, with what I have tried and what would unblock it."),
  numbered("A barrier unresolved after two check-ins, or a decision past its date, goes into the monthly update under Decisions needed, addressed to you."),
  numbered("Where the decision or the time belongs to the managers, you convene them, or I bring it to the quarterly review with the managers."),
  numbered("Where it belongs to the Director, you bring Heidi in; the entry names what is being asked and the consequence of waiting."),
  numbered("Where it belongs to the Administration, it goes through the DEIA Council chair to the ADSA Equity Committee once that link exists; until then, through you."),

  h1("7. Records and boundaries"),
  bullet([b("Where records live. "), tr("The workplan, decision log, monthly updates and quarterly reports are kept in one place: the Program's records, or the dedicated SharePoint site if that is the system-of-record decision, with the same folder structure either way.")]),
  bullet([b("What never enters a record. "), tr("Case, medical, personnel, complaint or identifying details about any person. Work items are described by the work, not the people.")]),
  bullet([b("Voice. "), tr("Anything published to staff passes the staff voice standard and, once adopted, the Equity Lens Rubric.")]),
  bullet([b("Retention. "), tr("Follows the retention decision for consultation and staff-result records, made before intake opens.")]),
  bullet([b("Native American communities and Tribal Nations. "), tr("Any item concerning them is recorded as deferred to the Office of Indian Affairs and the DHS offices that handle Tribal relations and consultation; the Program does not complete or expand that content on its own.")]),

  h1("8. Templates"),
  h2("Monthly update, one page"),
  bullet("Done: outcomes reached this month, with the evidence."),
  bullet("Next: what is planned for the coming month, by workstream."),
  bullet("Blocked: barriers, since when, what has been tried."),
  bullet("Decisions needed: from the log, with owner and date."),
  bullet("Measures: the two or three numbers that moved, and the release note."),
  h2("Quarterly report"),
  bullet("Summary: three sentences on the quarter."),
  bullet("Workstreams: target, status, what was delivered, what slipped and why."),
  bullet("Measures: section 4, with the prior quarter beside it."),
  bullet("Gate checks: which passed, with the verification; which did not, and the plan."),
  bullet("Support: delivered, outstanding, declined."),
  bullet("Correction plans: any triggered, with owners and dates."),
  bullet("Next quarter: priorities and the decisions they depend on."),
  h2("Work-item record"),
  bullet("Title · workstream · decision owner · intended outcome · start · target · status · evidence when done · what changed for whom."),
  h2("Barrier entry"),
  bullet("What is blocked · since when · what I have tried · what would unblock it · who can provide it · raised on."),

  h1("9. Calendar, October 2026 to June 2027"),
  table([2200, 7160], ["When", "What"], [
    ["October 2026", "Reporting process starts. First monthly update October 1. Check-ins every two weeks. Unit organizational maps requested from the managers."],
    ["November 2026", "Monthly update. Organizational maps confirmed. First One DSD Team work item sponsored. Governance charters with Heidi for decision."],
    ["December 2026", "Monthly update. Launch report with the go/no-go recommendation and the January date. Quarterly report for October–December follows in January."],
    ["January 2027", "Division-wide launch from January, after the election, with the date confirmed with colleagues first. First One DSD Team meeting. Quarterly report for Q4 2026."],
    ["February–March 2027", "Monthly updates. Councils seated; gate checks One-A to One-C. Climate survey in the field. Working-group charters."],
    ["April 2027", "Quarterly report for January–March: launch evidence, gate checks, first measures."],
    ["May–June 2027", "Monthly updates. Barrier analysis to the Executive Council. Multi-year plan approved. Quarterly report for April–June in July."],
  ]),

  h1("10. From reconstruction to tracked work"),
  para("The memo on how the Program came to be is the baseline. From October 1, 2026, the workplan is updated as the work happens, the decision log carries every ask, and the monthly update and quarterly report replace reconstruction. The forward-looking workplan informs the actions and plans undertaken; this process is how you and I, and where needed Heidi and the ADSA Equity Committee, see them happen."),
  para("This is a draft for our meeting next week. I would like to agree the cadence, the measures and the escalation path with you, and then run it from October 1."),
];

const doc = new Document({
  creator: "Gary Banks", title: "Reporting process for the One DSD People, Access and Culture Program",
  styles: { default: { document: { run: { font: FONT, size: 22, color: INK } } } },
  numbering: { config: [
    { reference: "rp-bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    { reference: "rp-numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] },
  ] },
  sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Reporting process · One DSD People, Access and Culture Program · draft · Page ", font: FONT, size: 18, color: MUTED }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: MUTED })] })] }) },
    children }],
});
const out = path.join(__dirname, "One-DSD-PAC-Reporting-Process.docx");
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log("wrote", out, buf.length, "bytes"); });
