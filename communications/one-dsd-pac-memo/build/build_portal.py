#!/usr/bin/env python3
"""Builds a single self-contained HTML file: a memo landing page plus
every supporting document, all embedded so no link can break."""
import base64, html, json, os, re, sys
import mammoth

# Everything the package is built from lives in this directory, so a checkout is
# all that is needed to rebuild it.
PACKAGE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(PACKAGE, "build")
DELIVERABLES = os.path.join(PACKAGE, "deliverables")
DIAGRAMS = os.path.join(PACKAGE, "diagrams")
WALKTHROUGH = os.path.join(PACKAGE, "walkthrough")
SHOTS = os.path.join(WALKTHROUGH, "shots")
OUT = f"{DELIVERABLES}/One-DSD-PAC-Program-Package.html"

DOCS = [
    ("climate",   "DHS Equity Landscape and Climate Report",
                  "The standing assessment, offered in support: how the Department is functioning on equity, what is in place, and where the connections between the pieces could be stronger.",
                  f"{DELIVERABLES}/DHS-Equity-Landscape-and-Climate-Report.docx"),
    ("donut",     "The Position, Decomposed",
                  "The agreed decomposition of the consultant's role, co-created in early 2023 and reproduced without alteration, with what each duty requires of others.",
                  f"{DELIVERABLES}/The-Position-Decomposed-Role-Agreement.docx"),
    ("alloc",     "Goal Allocation Worksheet",
                  "How the six equity goals divide across the Division: what each decomposes into, who must hold it, and an owner column left blank for leadership to complete.",
                  f"{DELIVERABLES}/Goal-Allocation-Worksheet.docx"),
    ("prd",       "Program Requirements Document",    "The executive brief: what the Program is, what it is for, what the Division gains, and how it aligns to the Administration's six equity goals.", f"{DELIVERABLES}/Program-Requirements-Document.docx"),
    ("evidence",  "Evidence Record",                  "The 23 division-wide sessions in full: 172 findings and 131 recommendations, attributed to teams and de-identified.", f"{DELIVERABLES}/Evidence-Record-DSD-Equity-Sessions.docx"),
    ("analysis",  "What the Division Said",           "The axial analysis of those findings: ten categories, the central finding, and seven consultant recommendations.", f"{DELIVERABLES}/What-the-Division-Said-Axial-Analysis.docx"),
    ("logic",     "Program Logic Model",              "The chain from what was invested, to what was built, to what changes because it exists.", f"{DELIVERABLES}/Program-Logic-Model.docx"),
    ("workplan",  "Operational Workplan",             "October 2026 through June 2027: what I am working on, what it should produce, and where I will need help.", f"{DELIVERABLES}/Operational-Workplan-Oct-2026-Jun-2027.docx"),
    ("reporting", "Reporting Process",                "How progress, barriers, and decisions are tracked and reported from October 2026 forward.", f"{DELIVERABLES}/Reporting-Process.docx"),
    ("crosswalk", "Program Crosswalk",                "The Program checked goal by goal against the DHS ecosystem and ADSA's six equity goals.", f"{DELIVERABLES}/Program-Crosswalk-and-Correlation-Analysis.docx"),
    ("roadmap",   "Three-Year Plan and Blueprint",    "January 2027 through December 2029: what comes next, in order, and what is still to be built.", f"{DELIVERABLES}/Three-Year-Roadmap-and-Blueprint.docx"),
    ("pm",        "Project-Management Version",       "The same plan as a timeline, a workflow diagram, a dependency map, and a decision-rights table.", f"{DELIVERABLES}/Three-Year-Roadmap-PM-Companion.docx"),
    ("standard",  "Research and Evaluation Standard", "A working document of mine. How the Program stays steady and trustworthy over time, as people and priorities change.", f"{DELIVERABLES}/Research-and-Evaluation-Standard.docx"),
    ("evalplan",  "Program Evaluation Plan",          "A working document of mine. The regular checks the Program is held to as it continues.", f"{DELIVERABLES}/Program-Evaluation-Harness.docx"),
]

SITE = "https://one-dhs-pac.vercel.app"
TOOLKIT_URL = f"{SITE}/share/equity-toolkit"

# A representative few of what the Program holds, each on its own shareable
# address, with what it is worth to the person who opens it. Courses resolve at
# /share/courses/<id>, library material at /share/library/<id>; both open the one
# item without the rest of the Program around it.
SHOWCASE = [
    ("courses", "di-disability-diversity-belonging", "Disability, Diversity and Belonging",
     "The grounding course. Disability as an ordinary part of any workforce and any caseload, which is the assumption the rest of the Division's work rests on."),
    ("courses", "di-rights-policy-and-organizational-duties", "Disability Rights, Policy and Organizational Duties",
     "For anyone who writes, reviews or applies a rule: where the duties come from, read as obligations on the organization rather than as law in the abstract."),
    ("courses", "di-conflict-resolution-and-neurodiversity", "Conflict Resolution That Works for Neurodivergent Staff",
     "For supervisors and managers. Standard conflict processes quietly assume one kind of communicator; this shows how to run one that more than one kind of person can actually use."),
    ("courses", "di-capstone-remove-a-real-barrier", "Capstone: Remove a Real Barrier",
     "The Program does not stop at reading. The capstone has a staff member carry one real barrier in their own work through to a change, and produce the record of it."),
    ("library", "ja-equity-impact-questions", "Equity impact questions for policy, budget, technology, and procurement",
     "A single page a policy analyst or contract manager can hold beside a proposal and work through in the meeting they are already in."),
    ("library", "ja-process-burden", "Questions about the steps, time, and effort a process requires",
     "For service and eligibility work: what the Division asks of a person before they receive anything, counted honestly."),
    ("library", "ja-access-checks", "Access checks before a meeting, outreach, or session",
     "The shortest useful thing here. A supervisor can apply it to this afternoon's meeting without preparation."),
]
LOGO = f"{DIAGRAMS}/dsd-logo.png"
LOGO_ALT = "Minnesota Department of Human Services, Disability Services Division"
FIG_ALT = {
 "diagram-a-how-the-levels-connect.png": "Diagram of four stacked levels — the Department, the Administration, the Division and the Program — with authority flowing down and practice and evidence flowing up.",
 "diagram-b-fixed-and-flexible.png": "Venn diagram of three circles: the DHS Equity Policy and DEIA principles, the only non-negotiable; ADSA's six equity goals, what must be achieved with how left open; and the Division's operating non-negotiables. The Program sits in the overlap.",
 "diagram-c-how-the-work-moves.png": "Workflow diagram: a question arises, staff open a resource, staff do the work, staff name the gap, and the consultant builds and updates; below it, responsibility shared across leadership, staff and the consultant.",
}

def img_data_uri(path):
    with open(path, "rb") as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode("ascii")


def img_data_uri_jpeg(path, quality=88):
    """A screenshot carried as JPEG, at its own size.

    The walk-through photographs are whole pages now, and several run past nine
    thousand pixels. As PNG they add sixteen megabytes to a file that has to
    survive being emailed. At this quality the text in them is visually
    identical and costs a third as much. The diagrams stay PNG: flat colour and
    hairline rules are what JPEG handles worst.
    """
    from PIL import Image
    import io
    with Image.open(path) as im:
        buf = io.BytesIO()
        im.convert("RGB").save(buf, format="JPEG", quality=quality, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


# Figures drawn inside the supporting .docx files. mammoth carries no
# alternative text through, so it is supplied here, keyed on a distinctive
# phrase in the paragraph that introduces each one. Every figure in the
# package is reachable by screen reader this way.
DOC_FIG_ALT = {
 "how long that workstream stays in active work":
   "Bar chart, Three-year roadmap by workstream, January 2027 to December 2029. Ten workstreams run as horizontal bars against quarters from the first quarter of 2027 to the fourth of 2029, with markers for the Year 1 and Year 2 reviews, the 2029 assessment, and the Year 3 close. Workstream 1, keeping the Program current and ready, runs the whole length and is hatched to show ongoing maintenance; the other nine, from Division-wide launch through governance, learning and the legislative dimension, are solid navy for their active build and delivery periods.",
 "the same flow no matter which workstream":
   "Flow diagram, How a work item moves through the Program's governance. Five boxes run left to right: staff or team raises a need; the One DSD Team takes it in as a bounded work item with a named decision owner; it is routed by kind, with content to Workstream 1, a decision to the Executive or DEIA Council, and data to Workstream 4; the outcome is recorded with delivery, application and benefit kept distinct; and monthly and quarterly reporting follows in aggregate only. An arrow returns from the end to the beginning, closing the loop into the content log, Ask, and the next release.",
 "This map states that plainly":
   "Dependency map, What has to be true before what. Workstream 1, the Program maintained, is already built and ongoing, and leads to two workstreams that unlock in Year 1: Division-wide launch and governance seated. Governance seated in turn unlocks four: Team and Amplify, learning and IDI, vision and communications, and the data baseline. Those unlock the last three, as data, vision and communications mature: equity before the decision, community engagement, and the legislative dimension.",
}

def convert(path):
    """docx -> clean HTML, with images inlined as data URIs."""
    def handler(image):
        with image.open() as s:
            enc = base64.b64encode(s.read()).decode("ascii")
        return {"src": f"data:{image.content_type};base64,{enc}"}
    with open(path, "rb") as f:
        r = mammoth.convert_to_html(f, convert_image=mammoth.images.img_element(handler))
    h = r.value
    # The docx builders emit the title block as bold paragraphs and the
    # TO/FROM/DATE rows as tab-separated bold runs. Promote and tidy them.
    h = re.sub(r"<p><strong>([A-Z][A-Z —/&]{2,40})</strong>\t(.*?)</p>",
               r'<p class="metaline"><span class="metakey">\1</span><span class="metaval">\2</span></p>', h)
    h = h.replace("<h1><strong>", "<h1>").replace("</strong></h1>", "</h1>")
    h = h.replace("<h2><strong>", "<h2>").replace("</strong></h2>", "</h2>")
    h = add_doc_fig_alt(h)
    return h

def add_doc_fig_alt(h):
    """Give every converted figure alternative text, from DOC_FIG_ALT."""
    out, pos = [], 0
    for m in re.finditer(r"<img (?![^>]*\balt=)([^>]*?)/?>", h):
        before = h[:m.start()]
        alt = next((a for key, a in DOC_FIG_ALT.items() if key in before[-1500:]), None)
        out.append(h[pos:m.start()])
        out.append(f'<img {m.group(1)} alt="{html.escape(alt, quote=True)}">' if alt else m.group(0))
        pos = m.end()
    out.append(h[pos:])
    return "".join(out)

def strip_docheader(h):
    """Drop the first three paragraphs (title block) — the portal supplies its own."""
    parts = re.split(r"(?=<p)", h)
    kept, dropped = [], 0
    for seg in parts:
        if dropped < 3 and seg.startswith("<p>") and "metaline" not in seg:
            dropped += 1
            continue
        kept.append(seg)
    return "".join(kept)

SECTION_GLOSS = {
 "Preface": "An affirmation, what this memorandum is for, how the role is oriented, and what would help most.",
 "I": "The 71 interviews, the 23 sessions concluding December 2023, and the question leadership itself asked after the 2024 training.",
 "II": "Credit where it is due: what the project manager brought, who built the Program, and why the impression was natural.",
 "III": "What the Program holds, and what it means for staff, for supervisors and for you.",
 "IV": "Department, Administration, Division, Program \u2014 who sets what, and where direction comes from.",
 "V": "The DHS Equity Policy as the only non-negotiable, and how much latitude exists beneath it.",
 "VI": "The Equity Director\u2019s direction that the Division executes all six goals, the latitude that came with it, and the open question of how the work divides.",
 "VII": "Where the organization stands on the intercultural continuum, and the opportunity in it.",
 "VIII": "How the role works, with three concrete examples of the Program supplying the capability and staff carrying the work.",
 "IX": "The agreed decomposition of the role, crosswalked duty by duty against what has been built.",
 "X": "The working cycle, and accountability sitting in three places at once.",
 "XI": "Room for professional judgment, a line of sight into what is under way, and the appetite for this in the Division.",
 "XII": "What is built, what is outstanding, and why none of it requires waiting.",
 "XIII": "HCBS as the first pilot, measured for behavioral and cognitive change before any expansion.",
 "XIV": "An answer to the question about strong convictions, and why the interest is stated openly.",
 "XV": "Praise for the ADSA committees, allies in the work, and the question that remains open.",
 "XVI": "The four things that would help most, set out concretely.",
 "XVII": "A pattern worth guarding against together, and the destination all of it serves.",
 "XVIII": "Fourteen pages of the Program, in the order a member of staff meets them.",
 "XIX": "Where each supporting document sits.",
}

def sec_key(heading):
    if not heading.strip(): return "pre"
    m = re.match(r"([IVX]+)\.", heading.strip())
    return m.group(1) if m else "pre"

def inline(t):
    t = html.escape(t, quote=False)
    return re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)

def jump(label, key):
    return (f'<a class="jump" href="#doc-memofull" data-open="doc-memofull" '
            f'data-anchor="s-{key}">{label}</a>')

def fold(heading, hint, body, open=False):
    """Heavy material behind a click.

    The landing page is meant to be read in one sitting, and a run of whole-page
    photographs or a catalogue of links is where a reader's attention gives out
    before the ask. A fold keeps the section's heading in place and its
    contents one click away. It is a native <details>: no script, reached and
    operated from the keyboard, announced as expandable, and printed in full,
    so the paper copy loses nothing.
    """
    return (f'<details class="fold"{" open" if open else ""}>'
            f'<summary><h2 class="memo-h">{heading}</h2>'
            f'<span class="fold-hint">{hint}</span></summary>'
            f'<div class="fold-body">{body}</div></details>')

def _figure_html(b, figdir, scaled):
    src=b["file"] if os.path.isabs(b["file"]) else os.path.join(figdir,b["file"])
    cap=f'<figcaption>{inline(b["caption"])}</figcaption>' if b.get("caption") else ""
    alt=b.get("alt") or FIG_ALT.get(os.path.basename(src)) or b.get("caption","")
    shot = os.path.normpath(src).startswith(os.path.normpath(SHOTS) + os.sep)
    uri = (img_data_uri_scaled(src) if scaled
           else img_data_uri_jpeg(src) if shot
           else img_data_uri(src))
    return (f'<figure class="memo-fig"><img src="{uri}" '
            f'alt="{html.escape(alt, quote=True)}">{cap}</figure>')

def render_blocks(blocks, figdir, scaled=False):
    out=[]
    pending_pair=None
    def flush():
        nonlocal pending_pair
        if pending_pair:
            out.append('<div class="diagram-pair">' + "".join(pending_pair) + '</div>')
        pending_pair=None
    for b in blocks:
        t=b.get("type","p")
        if not (t=="figure" and b.get("pair")): flush()
        if t in (None,"p"):
            out.append(f'<p>{inline(b["text"])}</p>')
        elif t in ("bullets","numbered"):
            tag="ol" if t=="numbered" else "ul"
            items="".join(f"<li>{inline(i)}</li>" for i in b["items"])
            out.append(f'<{tag} class="memo-list">{items}</{tag}>')
        elif t=="figure":
            if b.get("pair"):
                # A run of figures marked pair renders side by side. Other
                # consumers of the same content ignore the flag and get them
                # one after another, which is the right fallback.
                if pending_pair is None: pending_pair=[]
                pending_pair.append(_figure_html(b, figdir, scaled))
                continue
            out.append(_figure_html(b, figdir, scaled))
        elif t=="table":
            head="".join(f'<th scope="col">{inline(h)}</th>' for h in b["headers"])
            rows="".join("<tr>"+"".join(f"<td>{inline(c)}</td>" for c in r)+"</tr>" for r in b["rows"])
            out.append(f'<table class="memo-tbl"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>')
        elif t=="link":
            out.append(f'<p class="memo-close">{inline(b.get("text",""))}'
                       + (f' &mdash; {inline(b["note"])}' if b.get("note") else "") + '</p>')
    flush()
    return out

def memo_json():
    return json.load(open(f"{BUILD}/final.json", encoding="utf-8"))

def full_memo_html(scaled=False):
    """The complete memorandum as one linked document, each section anchored.

    scaled=True renders the figures at reading size rather than at capture
    resolution, for the short package, which embeds this whole document behind
    a memorandum that is meant to be the light thing to open.
    """
    memo = memo_json()
    figdir = BUILD
    out=['<div class="doc-top"><a class="back" href="#memo" data-back>&larr; Back to the memorandum</a>'
         '<div class="doc-of">The memorandum in full</div></div>',
         '<h1 class="doc-title">The memorandum, in full</h1>',
         '<p class="doc-blurb">Every section of the communication in one place. Use the contents on the landing page '
         'to go straight to a particular part.</p>',
         '<div class="doc-body">']
    for sec in memo["sections"]:
        k=sec_key(sec.get("heading",""))
        h=sec.get("heading","").strip()
        out.append(f'<section class="memo-sec" id="s-{k}">')
        if h: out.append(f'<h2 class="memo-h">{inline(h)}</h2>')
        out += render_blocks(sec["blocks"], figdir, scaled)
        out.append('</section>')
    out.append('</div><div class="doc-foot"><a class="back" href="#memo" data-back>'
               '&larr; Back to the memorandum</a></div>')
    return "\n".join(out)

def contents_html():
    memo = memo_json()
    rows=[]
    for sec in memo["sections"]:
        h=sec.get("heading","").strip() or "Preface"
        k=sec_key(sec.get("heading",""))
        gloss=SECTION_GLOSS.get(k if k!="pre" else "Preface","")
        rows.append(f'<a class="toc-row" href="#s-{k}" data-open="doc-memofull" data-anchor="s-{k}">'
                    f'<span class="toc-t">{html.escape(h)}</span>'
                    f'<span class="toc-b">{html.escape(gloss)}</span></a>')
    return "\n".join(rows)

def toolkit_block():
    """The Program's central instrument, named where leadership will see it first."""
    return f"""<h2 class="memo-h">The instrument to open first: the Equity Analysis Toolkit</h2>
<div class="deliverable">
  <p><strong>If you open one thing in this package, open this.</strong> The Equity Analysis Toolkit
  companion takes a decision someone is actually facing &mdash; a policy, a service, a change in
  practice &mdash; and works through it in five stages: the decision and what is genuinely still
  open, who is affected and how, what the options are, how affected people can influence it, and
  what to review before it is settled. Each stage carries a worked example to try and a place to
  draft the analysis of one's own work.</p>
  <p class="deliverable-open"><a class="open-link" href="{TOOLKIT_URL}">Open the Equity Analysis
  Toolkit &rarr;</a></p>
  <p>That address opens the toolkit on its own, with none of the rest of the Program around it, so
  it can be forwarded to anyone who should see it. It goes out to the live Program, as do the
  resource addresses in the next section; every other link in this package opens inside the file.</p>
  <p class="memo-close">This is the Program's companion to the Minnesota Equity Analysis Toolkit, not
  a substitute for it. It submits nothing to DHS, it grants no approval, and it does not replace
  required review or engagement with the people a decision affects.</p>
</div>"""

def showcase_block():
    """A few real things from the Program, each openable on its own."""
    rows = "\n".join(
        f'  <li><a class="open-link" href="{SITE}/share/{kind}/{ident}">{html.escape(title)}</a>'
        f'<span class="showcase-why">{html.escape(why)}</span></li>'
        for kind, ident, title, why in SHOWCASE
    )
    n = len(SHOWCASE)
    words = {7: "Seven", 6: "Six", 8: "Eight", 5: "Five", 9: "Nine", 10: "Ten"}.get(n, str(n))
    catalogue = f"""<p>Every one of these is built and published. The Program holds far more, and all
of it works the same way.</p>
<ul class="showcase">
{rows}
</ul>"""
    return fold("What a member of your staff can open today",
                f"{words} things, chosen to show the range. Each opens on its own and can be forwarded "
                "to a team.",
                catalogue) + f"""
<p>There is an entry point for each area of work in the Division: executive and division
leadership; supervision and management; policy and program analysis; eligibility and service
delivery; data, research and quality; budgets, grants and contracts; hiring and workforce
development; community engagement and partnership; communication and accessibility; and
equity practice itself. <strong>Every level of the Division is addressed, and no one is asked
to translate someone else's material into their own job.</strong></p>"""


def diagram_pair():
    """The two pictures that carry the argument, side by side and early.

    The four levels say where authority runs; the Venn says what is fixed and
    what is genuinely the Division's to decide. Between them they answer the
    question a reader brings to a memorandum like this one, which is what they
    are being asked to approve. Nothing: one boundary is the Department's, and
    the rest is theirs. They used to sit one on the landing page and one in
    section V of the extended memorandum; a reader who never opened that
    section never saw the second.
    """
    def fig(name, caption):
        return (f'<figure class="memo-fig"><img src="{img_data_uri(DIAGRAMS + "/" + name)}" '
                f'alt="{html.escape(FIG_ALT[name], quote=True)}"><figcaption>{caption}</figcaption></figure>')
    return ('<div class="diagram-pair">'
            + fig("diagram-a-how-the-levels-connect.png",
                  "The four levels, and the direction of authority. " + jump("How the Program connects &rarr;", "IV"))
            + fig("diagram-b-fixed-and-flexible.png",
                  "What is fixed, and what is genuinely open. " + jump("Fixed and open &rarr;", "V"))
            + '</div>')

def walkthrough_block():
    """A pointer from the landing page to the walk-through inside the memorandum.

    The fourteen screenshots themselves live in the memorandum's own section, so
    the file carries each image once. walkthrough/shots.json is the single source
    for the pages, the captions and the alternative text; build_final_json.py
    reads it into the memorandum and this block only announces it.
    """
    return f"""<h2 class="memo-h">What it actually looks like</h2>
<p>Fourteen pages of the Program, in the order a member of your staff meets them, from the
front door through to what they keep. Every tab is there, and each one carries a caption
saying what it shows. {jump("Walk through the Program &rarr;", "XVIII")}</p>"""

def orient_block(short=False):
    """What the reader has, and what they can safely leave unread.

    The package holds three things at three depths, and without saying so the
    landing page reads as an undifferentiated pile of links. short=True is the
    Version B wording, where the landing page is the whole memorandum rather
    than a summary of a longer one.
    """
    first = ('<li><strong>This memorandum.</strong> A few minutes. What the Program is and where '
             'it stands. The four requests above are the whole of what I am asking.</li>'
             if short else
             '<li><strong>This page.</strong> A few minutes. What the Program is, what it is for, '
             'and what I am asking of you. If you read only this, you have what you need to reply.</li>')
    second = ('<li><strong>The extended memorandum.</strong> The same account at length, first in '
              'the record below. Written to be entered at the section you want rather than read '
              'end to end.</li>'
              if short else
              '<li><strong>The communication in full.</strong> Longer, and written to be entered at '
              'the section you want rather than read end to end. Every link on this page opens the '
              'part that treats that point properly.</li>')
    third = ('<li><strong>The rest of the record.</strong> The documents behind the work, following '
             'it. You do not need to read any of them. They are there so that anything you want to '
             'check is one click away.</li>'
             if short else
             '<li><strong>The supporting record.</strong> The documents behind the work, at the foot '
             'of this page. You do not need to read any of them. They are there so that anything you '
             'want to check is one click away.</li>')
    return f'<div class="orient">\n  <ol>\n    {first}\n    {second}\n    {third}\n  </ol>\n</div>'

def img_data_uri_scaled(src, max_w=1180):
    """A figure-sized copy of a screenshot, for documents that only need one.

    The walk-through images are captured at double resolution so the extended
    memorandum can be read closely. A short memorandum showing six of them does
    not need that, and carrying them at full size made the short package larger
    than the long one. This scales a copy down in memory; the file on disk is
    untouched and the extended memorandum still uses the full-resolution image.
    """
    from PIL import Image
    import io
    with Image.open(src) as im:
        if im.width > max_w:
            im = im.convert("RGB").resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
        else:
            im = im.convert("RGB")
        buf = io.BytesIO()
        im.save(buf, format="JPEG", quality=82, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii")

SNAPSHOT = ["01-home.png", "06-course-open.png", "11-one-dsd.png"]

def _shots_index():
    """Every walk-through shot by file name, from the one source the package uses."""
    data = json.load(open(os.path.join(PACKAGE, "walkthrough", "shots.json"), encoding="utf-8"))
    return {sh["file"]: sh for st in data["stages"] for sh in st["shots"]}

def snapshot_block():
    """Three pages, for the short memorandum.

    The extended memorandum carries all fourteen. A reader of the short form
    should see what the Program looks like without being handed a tour, so
    this takes the three that carry the argument between them: arriving, a
    course open, and the Division's own view. It was six while these were
    viewport crops; as whole pages six of them ran to sixteen printed pages
    and stopped being a snapshot. Captions and alternative text come from
    walkthrough/shots.json so this never drifts from the full walk-through.
    """
    idx = _shots_index()
    figs = []
    for name in SNAPSHOT:
        sh = idx.get(name)
        if not sh:
            print("MISSING SHOT:", name, file=sys.stderr); continue
        src = os.path.join(PACKAGE, "walkthrough", "shots", name)
        first = sh["caption"].split(". ")[0].rstrip(".") + "."
        figs.append(f'<figure class="memo-fig"><img src="{img_data_uri_scaled(src)}" '
                    f'alt="{html.escape(sh["alt"], quote=True)}">'
                    f'<figcaption><strong>{html.escape(sh["title"])}.</strong> '
                    f'{html.escape(first)}</figcaption></figure>')
    return fold("What it actually looks like",
                "Three pages of the Program, whole, in the order a member of your staff meets "
                "them. The walk through all fourteen is in the extended memorandum.",
                '<p>' + jump("Walk through the Program &rarr;", "XVIII") + '</p>\n'
                + '<div class="snapgrid">' + "\n".join(figs) + '</div>')

def memo_html():
    """The landing page: what has to be seen now, with links into the detail."""
    return f"""<div class="memo-head">
  <img class="memo-logo" src="{img_data_uri(LOGO)}" alt="{LOGO_ALT}">
  <h1 class="memo-word">Memorandum</h1>
  <div class="memo-org">Minnesota Department of Human Services<br>
    Aging and Disability Services Administration &nbsp;|&nbsp; Disability Services Division</div>
</div>
<table class="memo-meta">
  <tr><th>To</th><td>Heidi Hamilton, Division Director<br>Leigh Ann Ahmad, Manager</td></tr>
  <tr><th>From</th><td>Gary Banks, Equity and Inclusion Operations Consultant</td></tr>
  <tr><th>Date</th><td>September 18, 2026</td></tr>
  <tr><th>Subject</th><td>The One DSD People, Access and Culture Program: what it is, where it
      stands, and an invitation to shape it with me</td></tr>
</table>

<p>Let me begin with something I want said plainly. <strong>In my professional judgment, both of
you are genuinely interested in equity and in the cultural and organizational change this work asks
for.</strong> I have witnessed both of you earnestly engaging in that work, and it is a large part of
why I am glad to bring this to you now.</p>

<p>I would like to show you what the One DSD People, Access and Culture Program has become, and ask
for your thinking on it. <strong>This is not a request for approval, and nothing here waits on a
decision from you.</strong> What would help me most is your honest reading by December 1 &mdash; what
looks useful, what looks thin, and what you would want to see that is not here yet.</p>

<p>This page carries what matters immediately, and I would genuinely welcome the conversation
more than the reading. So that you know what is in front of you, and what you can safely leave:</p>

{orient_block()}

<div class="pull">
  <p><strong>What has been built is usable today.</strong> Nothing here is waiting on next year, or
  the year after. If no further work were done from this moment, there is already enough in hand to
  begin operationalizing equity with staff and leadership across the Division &mdash; and to sustain
  that for somewhere between one and five years.</p>
  <p class="pull-more">{jump("Where the work honestly stands &rarr;", "XII")}</p>
</div>

{toolkit_block()}

{showcase_block()}

{walkthrough_block()}

<h2 class="memo-h">What it is</h2>
<p>Somewhere a staff member can go the moment a real question comes up in real work: courses and
applied practice material, community briefs on the people this Division serves, short job aids, and
a way to ask a question and get a substantiated answer with its sources attached. Nearly all of it
can be downloaded, adapted to a unit, or handed to a colleague.</p>
<p>For staff, that means help at the point of need. For supervisors, material that is ready to use
with a team &mdash; which matters most when preparation time is the scarcest thing you have. For
you, one place to see what the Division is doing on equity, and a record you can point to
whenever the Administration or the Department asks. {jump("What it is, and whom it serves &rarr;", "III")}</p>

<h2 class="memo-h">How it connects to what the Department is asking for</h2>
<p><strong>The Department sets the course. It is the North Star.</strong> My intention is to stay in
alignment with the Department's mandate and its Equity Policy, working alongside the Aging and
Disability Services Administration as part of the DHS equity ecosystem the Department contemplates.
What I have tried to do is line the levels up, so that what we build here fits that rather than running
alongside it, and to stay alert to whatever Department policy directs next so that the work here does
not become disjointed from it.</p>
{diagram_pair()}
<p>Beneath that, there is real room. <strong>The DHS Equity Policy, and the
DEIA principles beneath it, are the only non-negotiable.</strong> The Administration's six equity
goals say what must be achieved, not how &mdash; and Deqa Sayid confirmed that the Division holds
that discretion. {jump("What is fixed, and what is genuinely open &rarr;", "V")}
&nbsp;&middot;&nbsp; {jump("Executing all six goals &rarr;", "VI")}
&nbsp;&middot;&nbsp; {jump("Where the organization stands &rarr;", "VII")}</p>

<h2 class="memo-h">How the role works</h2>
<p>This is a guidance instrument. My part is to supply the knowledge, the instruments and the
resources so that staff can build equity into work they already own: <strong>the Program supplies the
capability, and staff carry the work.</strong> That is how the position was decomposed and agreed with
leadership in early 2023, and the accompanying record sets it out duty by duty against what has been
built. {jump("How this role operates &rarr;", "VIII")}
&nbsp;&middot;&nbsp; {jump("The position as it was decomposed and agreed &rarr;", "IX")}</p>

<h2 class="memo-h">Where the work stands, and where it begins</h2>
<p>A good deal is built and a good deal remains. Three things are outstanding: a way to tell whether
any of this is changing conditions for people, which is the most consequential and the one
I would most value your thinking on; a defined pathway for developing leaders, which needs a decision
and funding above my level; and the relationship to state law and policy.</p>
<p>Leigh Ann &mdash; the commitment on the pilot is unchanged. <strong>When the Program opens, HCBS
is the first unit to run it</strong>, for whatever interval you judge right, measured for behavioral
and cognitive change before anything expands. Every other unit carries on exactly as it is.
{jump("Where this begins: the pilot in HCBS &rarr;", "XIII")}</p>

<h2 class="memo-h">What would help most</h2>
<ol class="memo-list">
  <li><strong>Your assessment, by December 1</strong> &mdash; whether this looks capable of genuinely
  helping your people, whether anything is missing, and what you would change.</li>
  <li><strong>That staff be invited to work on this with me.</strong> A program of this kind cannot be
  built well at a distance from the people it is for.</li>
  <li><strong>A line of sight into what is under way</strong> &mdash; the Division's OneNote, or an
  equivalent; for awareness, not for direction.</li>
  <li><strong>An inventory of the equity work already under way</strong> across the Division, so that
  none of us builds the same thing twice.</li>
</ol>
<p>Several duties in the agreed decomposition name their counterpart directly &mdash; hiring
managers, subject matter experts, contract managers, the DSD data team, FARM. Those parts of the work
are built to be done together, and they go faster and better that way. What I am asking for is
collaboration, in the ordinary sense of the word. {jump("The four asks in full &rarr;", "XVI")}</p>

<p>Everything here serves something the Department has already named and that this Division is
entirely capable of reaching: becoming a multicultural, anti-racist organization in daily practice,
not only in commitment. In practice that means something quite specific: that when a decision is made
here, more than one cultural perspective is available to the people making it, and the perspective of
those the decision affects is among them. <strong>That is work a division does together</strong> &mdash; staff,
supervisors, managers and leadership each holding a piece no one else can hold for them. My part is
to make sure none of you has to invent your piece from scratch.</p>

<p class="memo-close"><strong>This is advisory, offered as a tool in service of the Division's goals,
the Administration's, and the Department's.</strong> I advise, and how it is put to use is where
your judgment matters most. What I am hoping for is common ground &mdash; a shared
understanding of where this work is going, and the chance to get there with you.</p>
"""

def build():
    doc_html = []
    for key, name, blurb, path in DOCS:
        if not os.path.exists(path):
            print("MISSING:", path, file=sys.stderr); continue
        body = strip_docheader(convert(path))
        doc_html.append(f'''<article class="doc" id="doc-{key}">
  <div class="doc-top">
    <a class="back" href="#memo" data-back>&larr; Back to the memorandum</a>
    <div class="doc-of">Supporting document</div>
  </div>
  <h1 class="doc-title">{html.escape(name)}</h1>
  <p class="doc-blurb">{html.escape(blurb)}</p>
  <div class="doc-body">{body}</div>
  <div class="doc-foot"><a class="back" href="#memo" data-back>&larr; Back to the memorandum</a></div>
</article>''')

    cards = "\n".join(
        f'''<a class="card" href="#doc-{k}" data-open="doc-{k}">
  <span class="card-n">{i:02d}</span>
  <span class="card-t">{html.escape(n)}</span>
  <span class="card-b">{html.escape(b)}</span>
  <span class="card-go">Open &rarr;</span>
</a>''' for i, (k, n, b, _) in enumerate(DOCS, 1))

    tpl = open(f"{BUILD}/template.html", encoding="utf-8").read()
    doc_html.insert(0, '<article class="doc" id="doc-memofull">' + full_memo_html() + '</article>')
    out = tpl.replace("{{MEMO}}", memo_html()).replace("{{CONTENTS}}", contents_html()).replace("{{CARDS}}", cards).replace("{{DOCS}}", "\n".join(doc_html))
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(out)
    print("wrote", OUT, os.path.getsize(OUT), "bytes")

if __name__ == "__main__":
    build()
