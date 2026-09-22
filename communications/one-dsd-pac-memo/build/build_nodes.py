# -*- coding: utf-8 -*-
"""Builds the Equity Analysis Toolkit's two lenses on the Division -- twelve
program-area nodes and ten job-family nodes -- plus the index that links
every one of them to every other, and the general guide. All from one
shared instrument, so none of these twenty-three pages can drift from the
rest by hand-editing.

Every node, in either lens, is the same instrument -- the gate, the eight
steps, the six questions, the five surfaces, the four worked specimens, the
door, the intersectionality section, and the working draft, each collapsed
behind a native <details> disclosure so a reader sees the shape of the whole
page at a glance and opens only what they need. Only three folds differ per
node: what the area or role is and where equity usually shows up in it (open
by default, since it is the one part worth seeing without a click), who or
what else is usually part of the work, and what the page admits it does not
know.

Program-area content (node_data.py) is not invented: "does" and every entry
point are copied verbatim from lib/dsd/index.ts (DSD_PROGRAMS), owner-approved.
Every organizational fact and partner name is copied from
data/organization/minnesota-dhs.json, each traceable to a cited, dated
source. Job-family content (role_data.py) is built the same way: "does" is
WORK_PROFILES' own purpose sentence (lib/content/work-learning.ts), and every
named resource is a real title resolved from the ids WORK_PROFILES already
carries, not retyped from memory. In both lenses, only the connective prose
-- which step or question an entry point usually lands under, and the short
gap statement -- was written for these pages, in the probabilistic register
the content is meant to carry: "this usually surfaces under," never "this is
happening in your work."

The two lenses cross-reference each other. Each program node names the job
families whose work usually shows up in it; each job-family node names the
program areas its work usually touches. That crosswalk is a judgment call
computed from role_data.py's own "often_in" field, not a fact pulled from a
shared data column -- WORK_PROFILES carries no domains axis the way
DSD_PROGRAMS does -- and it is stated as a pattern, not asserted as
complete.

A third lens is deliberately not built: organizational units. No structure
anywhere in the Program's data groups these twelve program areas or ten job
families into the Division's actual units, names who leads each, or says who
sits in which. The organization file's own declared gap says as much
(data/organization/minnesota-dhs.json, "internal-relationships") and names
the consultant's own knowledge as the resolution. The index says this
plainly rather than inventing a unit taxonomy to fill the gap.

The shared instrument itself (node-source/toolkit-body.html, from the first
<details id="gate"> onward) is edited once and every page picks up the
change identically the next time this script runs. That separation, and
proving it holds, is the reason two nodes (HCBS and Data, Quality, and
Evaluation) were built and diffed byte-for-byte against each other before
any of this was templated; both are now data-driven like the rest.

    python3 build/build_nodes.py

Writes into deliverables/. Requires nothing beyond the standard library.
"""
import html
import pathlib
import re

from node_data import NODES
from role_data import ROLES

HERE = pathlib.Path(__file__).parent
SOURCE = HERE / "node-source"
PACKAGE = HERE.parent
DELIVERABLES = PACKAGE / "deliverables"

# Everything from here onward in toolkit-body.html is the shared instrument,
# byte-identical on every page this script produces.
SHARED_MARKER_ANCHOR = (
    '  <p class="max-w-3xl">An equity analysis is the point where equity '
)

# The order nodes appear in the index, matching DSD_PROGRAMS in lib/dsd/index.ts.
NODE_ORDER = [
    "hcbs-policy", "mnchoices-access", "support-planning", "positive-supports",
    "olmstead", "employment", "eidbi-children", "tbi-guardianship",
    "contracts-fiscal", "data-quality", "communications-training", "leadership-strategy",
]

# The order roles appear in the index, matching WORK_PROFILES in work-learning.ts.
ROLE_ORDER = [
    "leadership", "policy", "service", "management", "workforce",
    "fiscal", "data", "engagement", "communication", "equity",
]


def e(s):
    return html.escape(s, quote=False)


def entry_card(q, body):
    return f'''        <div class="eat-entry">
          <p class="eat-entry-q">{e(q)}</p>
          <p>{body}</p>
        </div>'''


def named_card(name, note):
    return f'''        <div class="eat-card">
          <h3>{e(name)}</h3>
          <p>{note}</p>
        </div>'''


def crosswalk_line(label, names, slug_by_title):
    """A short line naming related nodes in the other lens, linked where the
    target actually exists so it is navigation, not just a claim."""
    if not names:
        return ""
    links = []
    for name in names:
        slug = slug_by_title.get(name)
        if slug:
            links.append(f'<a href="Equity-Analysis-Toolkit-{slug}-Node.html">{e(name)}</a>')
        else:
            links.append(e(name))
    return f'\n      <p class="max-w-3xl"><strong>{label}</strong> {", ".join(links)}.</p>'


def cross_capsule(direct_names, indirect_names, slug_by_title, direct_label, indirect_label, none_label):
    """The direct/indirect crosswalk to the other lens, surfaced in the open
    header rather than behind a fold -- by position and function, never by
    a person's name, per the consultant's own direction that this program
    is built around what a role does, not who currently holds it."""
    if not direct_names and not indirect_names:
        return ""
    direct_html = crosswalk_line(direct_label, direct_names, slug_by_title)
    indirect_html = crosswalk_line(indirect_label, indirect_names, slug_by_title)
    if not direct_names:
        direct_html = f'\n      <p class="eat-quiet">{none_label}</p>'
    return f'''
  <div class="eat-cross max-w-3xl space-y-1">{direct_html}{indirect_html}
  </div>'''


def build_program_head(n, role_slug_by_title, roles_direct, roles_indirect):
    entry_cards = "\n".join(entry_card(q, b) for q, b in n["entries"])
    partner_cards = "\n".join(named_card(name, note) for name, note in n["partners"])
    n_count = len(n["entries"])
    org_note = n.get("org_note")
    neighbours_note = n.get("neighbours_note")
    neighbours_line = ", ".join(n["neighbours"])

    org_note_html = f'''
      <div class="eat-org">
        <p>{org_note}</p>
      </div>''' if org_note else ""

    neighbours_note_html = f'''
      <p class="eat-quiet">{neighbours_note}</p>''' if neighbours_note else ""

    roles_cross = cross_capsule(
        roles_direct, roles_indirect, role_slug_by_title,
        "Job families based here:", "Other job families that often help here:",
        "No single job family is based here — several help, though:",
    )

    return f'''  <p class="eat-back"><a href="Equity-Analysis-Toolkit-Index.html">&larr; All program areas and job families</a></p>
  <header class="max-w-3xl space-y-2">
    <p class="eat-eyebrow">One DSD &middot; People, Access and Culture &middot; {n["eyebrow"]}</p>
    <h1 class="text-4xl font-semibold">The Equity Analysis Toolkit for {e(n["title"])}</h1>
    <p class="text-xl">{e(n["does"])}</p>
    <p class="eat-tagline">Not required. Not scored. Nothing recorded.</p>
  </header>
{roles_cross}

  <details class="eat-fold" open>
    <summary><span>Where equity shows up first here <span class="eat-fold-count">{n_count}</span></span></summary>
    <div class="eat-fold-body space-y-4">
      <p class="eat-quiet">A likely pattern, not a description of your specific work &mdash; {n["brief_extra"]}</p>
      <div class="eat-entry-grid">
{entry_cards}
      </div>
    </div>
  </details>

  <details class="eat-fold">
    <summary><span>Who else is usually involved</span></summary>
    <div class="eat-fold-body space-y-4">{org_note_html}
      <div class="eat-grid">
{partner_cards}
      </div>
      <p class="max-w-3xl"><strong>Also touches:</strong> {e(neighbours_line)}.</p>{neighbours_note_html}
    </div>
  </details>

  <details class="eat-fold">
    <summary><span>Something here doesn&rsquo;t match your work?</span></summary>
    <div class="eat-fold-body">
      <p>This page does not know {n["gap_extra"]} &mdash; nothing here was guessed to fill that in. Telling the consultant is the single most useful thing you can do with it.</p>
    </div>
  </details>

  <p class="eat-shared-marker max-w-3xl">The rest of this page is the same for every program area and job family in the Division.</p>
'''


def build_role_head(r, program_slug_by_title):
    entry_cards = "\n".join(entry_card(q, b) for q, b in r["entries"])
    resource_cards = "\n".join(
        named_card(title, "Already built for this role.") for title in r["resources"]
    )
    n_count = len(r["entries"])
    programs_cross = cross_capsule(
        r["directly_in"], r["indirectly_in"], program_slug_by_title,
        "Where this job family is based:", "Other areas this job family often helps with:",
        "This job family isn't based in one program area — it shows up across several:",
    )
    program_link = r.get("program_link")
    link_html = ""
    if program_link:
        label, url, note = program_link
        link_html = f'''
      <p class="eat-quiet"><a href="{url}">{e(label)} &#8599;</a> &mdash; {note} Leaves this toolkit for the live Program site.</p>'''

    return f'''  <p class="eat-back"><a href="Equity-Analysis-Toolkit-Index.html">&larr; All program areas and job families</a></p>
  <header class="max-w-3xl space-y-2">
    <p class="eat-eyebrow">One DSD &middot; People, Access and Culture &middot; Job family</p>
    <h1 class="text-4xl font-semibold">The Equity Analysis Toolkit for {e(r["title"])}</h1>
    <p class="text-xl">{e(r["does"])}</p>
    <p class="eat-tagline">Not required. Not scored. Nothing recorded.</p>
  </header>
{programs_cross}

  <details class="eat-fold" open>
    <summary><span>Where equity shows up first in this role <span class="eat-fold-count">{n_count}</span></span></summary>
    <div class="eat-fold-body space-y-4">
      <p class="eat-quiet">A likely pattern, grounded in what this role is defined to do &mdash; not a description of the specific work in front of you.</p>
      <div class="eat-entry-grid">
{entry_cards}
      </div>
    </div>
  </details>

  <details class="eat-fold">
    <summary><span>Material already built for this role</span></summary>
    <div class="eat-fold-body space-y-4">
      <div class="eat-grid">
{resource_cards}
      </div>{link_html}
    </div>
  </details>

  <details class="eat-fold">
    <summary><span>Something here doesn&rsquo;t match your work?</span></summary>
    <div class="eat-fold-body">
      <p>This is a Program work category, not an official job classification, and it is not mapped to bargaining-unit representation &mdash; that data does not exist anywhere in the Program. It does not know {r["gap_extra"]} &mdash; nothing here was guessed to fill that in. Telling the consultant is the single most useful thing you can do with it.</p>
    </div>
  </details>

  <p class="eat-shared-marker max-w-3xl">The rest of this page is the same for every program area and job family in the Division.</p>
'''


def load_shared():
    """The banner, the <main> opening tag, and everything from the shared-
    instrument marker onward -- read once, reused for every node, the index,
    and the guide, so none of them can drift from the others."""
    full_body = (SOURCE / "toolkit-body.html").read_text(encoding="utf-8")
    banner = full_body.split("</header>\n")[0] + "</header>\n\n"
    logo = "data:image/png;base64," + (SOURCE / "logo.b64").read_text().strip()
    banner = banner.replace("__LOGO__", logo)
    main_open = (
        '<main id="main" tabindex="-1" class="learning-family-module__AKfwzq__page '
        'learning-family-module__AKfwzq__content learning-family-module__AKfwzq__readingPage '
        'space-y-6">\n\n'
    )
    shared_start = full_body.index(SHARED_MARKER_ANCHOR)
    shared_rest = full_body[shared_start:]
    guide_masthead = full_body[full_body.index('  <p class="eat-back">'):shared_start]
    css = (SOURCE / "program.css").read_text(encoding="utf-8")
    extra = (SOURCE / "toolkit-extra.css").read_text(encoding="utf-8")
    node_css = (SOURCE / "node-extra.css").read_text(encoding="utf-8")
    js = (SOURCE / "toolkit-script.js").read_text(encoding="utf-8")
    return banner, main_open, guide_masthead, shared_rest, css, extra, node_css, js


def wrap_page(title, body, css, extra, node_css, js=""):
    script_tag = f"<script>{js}</script>" if js else ""
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>{css}
{extra}
{node_css}</style>
</head>
<body>
{body}
{script_tag}
</body>
</html>
"""


def build_node_page(head, banner, main_open, shared_rest, css, extra, node_css, js, title):
    body = banner + main_open + head + "\n" + shared_rest
    return wrap_page(f"Equity Analysis Toolkit — {e(title)}", body, css, extra, node_css, js)


def build_guide_page(banner, main_open, guide_masthead, shared_rest, css, extra, node_css, js):
    body = banner + main_open + guide_masthead + "\n" + shared_rest
    return wrap_page("Equity Analysis Toolkit", body, css, extra, node_css, js)


def build_index(program_cards_data, role_cards_data, banner, css, extra, node_css):
    def card(slug, title, does, badge_text=None):
        badge = f'<span class="eat-tag" style="margin:0 0 .6rem">{e(badge_text)}</span>' if badge_text else ""
        return f'''      <a class="eat-index-card" href="Equity-Analysis-Toolkit-{slug}-Node.html">
        {badge}
        <h3>{e(title)}</h3>
        <p>{e(does)}</p>
      </a>'''

    program_cards_html = "\n".join(
        card(slug, title, does, "Pilot" if pilot else None)
        for slug, title, does, pilot in program_cards_data
    )
    role_cards_html = "\n".join(card(slug, title, does) for slug, title, does in role_cards_data)

    index_css = """
.eat-index-grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(17rem,1fr))}
.eat-index-card{display:flex;flex-direction:column;border:1px solid var(--color-line);
  border-top:3px solid var(--blue);padding:1.1rem 1.2rem;text-decoration:none;color:inherit}
.eat-index-card:hover{border-color:var(--blue)}
.eat-index-card h3{margin:0 0 .4rem;font-size:1.05rem;font-weight:700;color:var(--blue)}
.eat-index-card p{margin:0;font-size:.92rem;color:var(--color-ink)}
"""

    body = f"""{banner}<main id="main" tabindex="-1" class="learning-family-module__AKfwzq__page learning-family-module__AKfwzq__content learning-family-module__AKfwzq__readingPage space-y-6">

  <header class="max-w-3xl space-y-2">
    <p class="eat-eyebrow">One DSD &middot; People, Access and Culture</p>
    <h1 class="text-4xl font-semibold">The Equity Analysis Toolkit, by Program Area and Job Family</h1>
    <p class="text-xl">Two ways into the same Department instrument, cross-linked to each other, so no area and no role stands alone.</p>
    <p class="eat-tagline">Every card opens the same instrument. Only the first three folds change.</p>
  </header>

  <section class="eat-mandate space-y-3">
    <h2 class="text-xl font-semibold">Why this toolkit exists</h2>
    <p class="max-w-3xl">Minnesota requires every division in this administration to work on six equity goals. This toolkit is how DSD puts those goals into daily practice. Using it is not optional.</p>
    <div class="eat-grid">
      <div class="eat-card"><h3>1. Eliminate disparities</h3><p>This is the toolkit's main job: find unfair gaps before a decision is final, and reduce them.</p></div>
      <div class="eat-card"><h3>2. Community engagement</h3><p>The toolkit asks who is affected, and what they actually said. See <a href="Equity-Analysis-Toolkit-JF-Engagement-Node.html">Community Engagement and Partnership</a>.</p></div>
      <div class="eat-card"><h3>3. Hiring and retention</h3><p>Used on a hiring or retention decision, it asks about fair requirements and equal opportunity. See <a href="Equity-Analysis-Toolkit-JF-Workforce-Node.html">Hiring and Workforce Development</a>.</p></div>
      <div class="eat-card"><h3>4. Learning and development</h3><p>This toolkit, and the job pages built from it, are themselves how staff build this skill over time.</p></div>
      <div class="eat-card"><h3>5. Contracts and procurement</h3><p>Used on a contract, it asks whether a requirement quietly shuts out smaller organizations before anyone signs. See <a href="Equity-Analysis-Toolkit-JF-Fiscal-Node.html">Budgets, Grants, and Contracts</a>.</p></div>
      <div class="eat-card"><h3>6. Communication and accessibility</h3><p>The toolkit asks how results will reach the people affected, in a way they can actually use. See <a href="Equity-Analysis-Toolkit-JF-Communication-Node.html">Communication and Accessibility</a>.</p></div>
    </div>
    <p class="eat-quiet">This comes from the Aging and Disability Services Administration's (ADSA) Equity and Inclusion Implementation Plan, named in the consultant's own Operational Workplan.</p>
  </section>

  <section class="space-y-4">
    <h2 class="text-2xl font-semibold">By program area &mdash; what work this is</h2>
    <p class="max-w-3xl">Twelve functions, matching how the Division's own record names its work.</p>
    <div class="eat-index-grid">
{program_cards_html}
    </div>
  </section>

  <section class="space-y-4">
    <h2 class="text-2xl font-semibold">By job family &mdash; what kind of work this is</h2>
    <p class="max-w-3xl">The Program's own ten work categories, already used to tailor material by role &mdash; not official job classifications, and not yet mapped to bargaining-unit representation. Each page names the program areas its work usually touches, and each program page names the job families usually involved in it.</p>
    <div class="eat-index-grid">
{role_cards_html}
    </div>
  </section>

  <div class="eat-org">
    <p><strong>What this does not cover yet: organizational units.</strong> No page here groups these areas and roles into the Division's actual units, names who leads each, or says who sits in which &mdash; that structure does not exist anywhere in the Program's own data. Building it honestly needs the consultant's own knowledge of how the Division is currently organized, not a guess standing in for it.</p>
  </div>

  <section class="space-y-3">
    <h2 class="text-xl font-semibold">This toolkit is one part of a larger Program</h2>
    <p class="max-w-3xl">Two pieces already live in the wider One DSD People, Access and Culture Program, not rebuilt here:</p>
    <div class="eat-grid">
      <div class="eat-card"><h3><a href="https://one-dhs-pac.vercel.app/library/tool-idi">Tool card: Intercultural Development Inventory (IDI) &#8599;</a></h3><p>The Program's own theory of change for this kind of work &mdash; developmental, never scored or attached to a person.</p></div>
      <div class="eat-card"><h3><a href="https://one-dhs-pac.vercel.app/one-dsd/amplify/mentoring">Mentoring and peers &#8599;</a></h3><p>Peer-to-peer mentoring, already running under Amplify Equity.</p></div>
    </div>
    <p class="eat-quiet">Both links leave this toolkit for the live Program site.</p>
  </section>

  <p class="max-w-3xl"><a href="Equity-Analysis-Toolkit-Guide.html">Prefer no area or role anchored at the top? Open the general guide.</a></p>

  <p class="eat-foot">Please leave out case, medical, personnel, complaint, and identifying details anywhere in this program. It is not connected to DHS information systems, does not hold DHS case or personnel records, and does not replace decisions made by responsible department offices.</p>

</main>
"""
    return wrap_page("Equity Analysis Toolkit — Program Areas and Job Families", body, css, extra, node_css + index_css)


def main():
    DELIVERABLES.mkdir(exist_ok=True)
    banner, main_open, guide_masthead, shared_rest, css, extra, node_css, js = load_shared()

    nodes_by_id = {n["id"]: n for n in NODES}
    roles_by_id = {r["id"]: r for r in ROLES}

    program_slug_by_title = {n["title"]: n["slug"] for n in NODES}
    role_slug_by_title = {r["title"]: r["slug"] for r in ROLES}

    # Reverse each role's own directly_in/indirectly_in into "which roles sit
    # in this program, directly or indirectly," computed once so program and
    # role pages can never state the crosswalk inconsistently.
    roles_direct_in_program = {n["title"]: [] for n in NODES}
    roles_indirect_in_program = {n["title"]: [] for n in NODES}
    for r in ROLES:
        for program_title in r["directly_in"]:
            if program_title not in roles_direct_in_program:
                raise KeyError(f"role {r['id']!r} names unknown program {program_title!r}")
            roles_direct_in_program[program_title].append(r["title"])
        for program_title in r["indirectly_in"]:
            if program_title not in roles_indirect_in_program:
                raise KeyError(f"role {r['id']!r} names unknown program {program_title!r}")
            roles_indirect_in_program[program_title].append(r["title"])

    program_cards_data = []
    for nid in NODE_ORDER:
        n = nodes_by_id[nid]
        program_cards_data.append((n["slug"], n["title"], n["does"], n.get("pilot", False)))
        head = build_program_head(
            n, role_slug_by_title,
            roles_direct_in_program[n["title"]], roles_indirect_in_program[n["title"]],
        )
        html_out = build_node_page(head, banner, main_open, shared_rest, css, extra, node_css, js, n["title"])
        out_path = DELIVERABLES / f"Equity-Analysis-Toolkit-{n['slug']}-Node.html"
        out_path.write_text(html_out, encoding="utf-8")
        print(f"wrote {out_path.name}  {len(html_out.encode()) / 1024:.0f} kB")

    role_cards_data = []
    for rid in ROLE_ORDER:
        r = roles_by_id[rid]
        role_cards_data.append((r["slug"], r["title"], r["does"]))
        for program_title in r["directly_in"] + r["indirectly_in"]:
            if program_title not in program_slug_by_title:
                raise KeyError(f"role {rid!r} names unknown program {program_title!r}")
        head = build_role_head(r, program_slug_by_title)
        html_out = build_node_page(head, banner, main_open, shared_rest, css, extra, node_css, js, r["title"])
        out_path = DELIVERABLES / f"Equity-Analysis-Toolkit-{r['slug']}-Node.html"
        out_path.write_text(html_out, encoding="utf-8")
        print(f"wrote {out_path.name}  {len(html_out.encode()) / 1024:.0f} kB")

    guide_html = build_guide_page(banner, main_open, guide_masthead, shared_rest, css, extra, node_css, js)
    guide_path = DELIVERABLES / "Equity-Analysis-Toolkit-Guide.html"
    guide_path.write_text(guide_html, encoding="utf-8")
    print(f"wrote {guide_path.name}  {len(guide_html.encode()) / 1024:.0f} kB")

    index_html = build_index(program_cards_data, role_cards_data, banner, css, extra, node_css)
    index_path = DELIVERABLES / "Equity-Analysis-Toolkit-Index.html"
    index_path.write_text(index_html, encoding="utf-8")
    print(f"wrote {index_path.name}  {len(index_html.encode()) / 1024:.0f} kB")


if __name__ == "__main__":
    main()
