#!/usr/bin/env python3
"""Version B package: the short-form memorandum as the landing page, the extended
memorandum demoted to the supporting record, every other document unchanged."""
import html, json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
import build_portal as bp

OUT = f"{bp.DELIVERABLES}/One-DSD-PAC-Program-Package-Version-B.html"

def landing_html():
    memo = json.load(open(f"{bp.BUILD}/memo3/final.json", encoding="utf-8"))
    out = ['<div class="memo-head">',
           f'  <img class="memo-logo" src="{bp.img_data_uri(bp.LOGO)}" alt="{bp.LOGO_ALT}">',
           '  <h1 class="memo-word">Memorandum</h1>',
           '  <div class="memo-org">Minnesota Department of Human Services<br>',
           '    Aging and Disability Services Administration &nbsp;|&nbsp; Disability Services Division</div>',
           '</div>',
           '<table class="memo-meta">',
           '  <tr><th>To</th><td>Heidi Hamilton, Division Director<br>Leigh Ann Ahmad, Manager</td></tr>',
           '  <tr><th>From</th><td>Gary Banks, Equity and Inclusion Operations Consultant</td></tr>',
           '  <tr><th>Date</th><td>September 18, 2026</td></tr>',
           f'  <tr><th>Subject</th><td>{bp.inline(memo["subject"])}</td></tr>',
           '</table>']
    for i, sec in enumerate(memo["sections"]):
        h = sec.get("heading", "").strip()
        if h: out.append(f'<h2 class="memo-h">{bp.inline(h)}</h2>')
        out += bp.render_blocks(sec["blocks"], bp.BUILD)
        # The reading map follows the ask, so the ask is the first thing after
        # the opening and nothing displaces it. The three built-in sections sit
        # after "What it is", where showing the Program is what comes next.
        if i == 1: out.append(bp.orient_block(short=True))
        if i == 3: out.extend([bp.toolkit_block(), bp.showcase_block(), bp.snapshot_block()])
    return "\n".join(out)

def build():
    doc_html = []
    for key, name, blurb, path in bp.DOCS:
        if not os.path.exists(path):
            print("MISSING:", path, file=sys.stderr); continue
        body = bp.strip_docheader(bp.convert(path))
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
    # the extended memorandum joins the record, section anchors intact
    doc_html.insert(0, '<article class="doc" id="doc-memofull">' + bp.full_memo_html(scaled=True) + '</article>')

    cards = [f'''<a class="card" href="#doc-memofull" data-open="doc-memofull">
  <span class="card-n">00</span>
  <span class="card-t">The extended memorandum</span>
  <span class="card-b">The full account, in twenty sections: every fact, figure and consideration behind the page above, for anyone who wants the whole of it.</span>
  <span class="card-go">Open &rarr;</span>
</a>''']
    cards += [f'''<a class="card" href="#doc-{k}" data-open="doc-{k}">
  <span class="card-n">{i:02d}</span>
  <span class="card-t">{html.escape(n)}</span>
  <span class="card-b">{html.escape(b)}</span>
  <span class="card-go">Open &rarr;</span>
</a>''' for i, (k, n, b, _) in enumerate(bp.DOCS, 1)]

    # the "contents" slot points at the extended version's sections, so nothing is buried
    contents = bp.contents_html()

    tpl = open(f"{bp.BUILD}/template.html", encoding="utf-8").read()
    tpl = tpl.replace("<h2>The memorandum in full</h2>", "<h2>The extended memorandum, section by section</h2>")
    tpl = tpl.replace("The landing page above carries what matters immediately. This is the complete communication,\n         section by section &mdash; open any part directly.",
                      "The page above is the memorandum. The extended version behind it holds every fact, figure and\n         consideration in full &mdash; open any section directly.")
    out = (tpl.replace("{{MEMO}}", landing_html())
              .replace("{{CONTENTS}}", contents)
              .replace("{{CARDS}}", "\n".join(cards))
              .replace("{{DOCS}}", "\n".join(doc_html)))
    with open(OUT, "w", encoding="utf-8") as f: f.write(out)
    print("wrote", OUT, os.path.getsize(OUT), "bytes")

if __name__ == "__main__":
    build()
