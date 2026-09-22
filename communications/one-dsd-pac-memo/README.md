# One DSD People, Access and Culture — leadership communication

The memorandum to Heidi Hamilton (Division Director) and Leigh Ann Ahmad (Manager),
dated 18 September 2026, together with its supporting record and everything needed to
rebuild it.

## What to send

`deliverables/One-DSD-PAC-Program-Package.html` — a single self-contained file. The
landing page is the memorandum in brief; the full communication and all fourteen
supporting documents are embedded behind internal links, so nothing can break when the
file is emailed or moved. It loads nothing over the network and installs nothing.

The Equity Analysis Toolkit is named immediately after the opening, before anything else
the landing page describes, and carries its own address —
`https://one-dhs-pac.vercel.app/share/equity-toolkit` — which opens the toolkit on its own
without the rest of the Program around it. Directly beneath it, a short showcase section
names four disability-focused courses and three job aids, each on its own share address, with
what each is worth to the reader who opens it, and states how the Program tailors material to
the role a person holds. Those addresses and the toolkit's are the only links on the landing
page that go out to the live Program; they are links the reader follows, not something the
file loads, so the package still makes no external request of its own. The site root is set
once, as `SITE` in `build/build_portal.py`, with `TOOLKIT_URL` and the `SHOWCASE` list beneath
it, and both versions take them from there.

`deliverables/One-DSD-PAC-Program-Package.pdf` is the same package for anyone who cannot
open HTML: the three-page landing page first, then the full memorandum and every supporting
document behind it. Every link on the landing page is a live PDF link that shows the page it
lands on, and the reader's bookmark panel lists every part. `deliverables/One-DSD-PAC-Approval-Memo.docx`
is the full memorandum as an editable Word file.

## Layout

| Path | What it holds |
| --- | --- |
| `build/` | The scripts that generate everything. `final.json` is the memorandum's content. |
| `deliverables/` | The generated packages (HTML and PDF) and Word documents. |
| `diagrams/` | The figures as PNGs, for reuse in slides, and the Division logo. |

## Rebuilding

Every path resolves inside this directory, so a checkout is all the build needs: the
figures come from `diagrams/`, the supporting documents from `deliverables/`, and the
rebuilt package is written back to `deliverables/`. Run the commands from here.

Requires Node (with the `docx` package resolvable via `NODE_PATH`) and Python with
`mammoth`, `matplotlib`, `Pillow` and `weasyprint`.

```sh
python3 build/diagrams-connect.py          # the three figures
python3 build/build_final_json.py          # memorandum content -> build/final.json
node     build/build-memo2.js              # -> Word memorandum
node     build/build-climate.js            # each supporting document, likewise
python3  build/build_portal.py             # assembles the single-file package
python3  build/makepdf_linked.py           # package -> PDF with live links and bookmarks
```

Version B is built the same way from `build/memo3/build_final_json.py` and
`build/build_portal_b.py`, then through `build/makepdf_linked.py` with its HTML and PDF
paths given as the two arguments.

`build/test2.mjs` opens the package in a headless browser and checks that every internal
link resolves, every document opens, and the page makes no external requests.
`build/axe.mjs` runs axe-core over the package against WCAG 2.0 and 2.1 A and AA.
`build/readability.py` reports Flesch-Kincaid grade for any .docx.

## Accessibility

The package is built to be read with assistive technology. Body text is 0.95rem
(about 15px) and never smaller than 0.72rem for labels; the DHS navy on white is
13:1. Every navigation control is a real link with a visible focus ring, a skip
link precedes the banner, the banner and footer are landmarks, the memorandum
opens with an `h1`, table headers carry `scope`, and each figure has alt text
describing what the figure shows rather than repeating its caption. The PDF is
exported as tagged PDF/UA-1 with a document language, so a screen reader follows
its structure. `build/axe.mjs` reports zero violations on the landing page and
with a document open.

## Two versions

Both open on the same reading map: a short list naming the three things the package holds
and how long each takes, so nobody has to guess what may be left unread. `orient_block()` in
`build_portal.py` writes it, in a long form for the extended version and a short one for
Version B, and it sits in the same place in each &mdash; after the opening, before anything
else.

`deliverables/One-DSD-PAC-Program-Package.html` is the extended version: a landing page of
roughly four printed pages, with the full twenty-section memorandum behind internal links.

`deliverables/One-DSD-PAC-Program-Package-Version-B.html` is the short form: a 1,400-word,
seven-move memorandum as the landing page, with the extended memorandum demoted to the first
card of the supporting record. Same facts, different shape. Its content is `build/memo3/`.
Where the extended version links out to the fourteen-page walk-through, Version B carries six
of those pages on the landing itself, as a two-across grid, so the short form still shows what
the Program looks like without becoming a tour. `snapshot_block()` picks them and takes their
captions from `walkthrough/shots.json`, so they never drift from the full walk-through. Its
images are scaled down in memory for this one use; the files on disk are untouched.
Each version has a matching PDF built the same way.

## Works without scripting

Every navigation control is a real anchor and every document is present in the page. If a
preview pane, an email client or a locked-down browser strips the inline script, the file
still works as one long document with a linked table of contents. With scripting, the same
links become the card interface. `build/nojs.mjs` and `build/nojs_b.mjs` verify the no-script
path; `build/test2.mjs` and `build/test2_b.mjs` verify the scripted one. Each check reads the
built file in `deliverables/`, resolved from the checkout, and takes a path as its first
argument to check something else. The browser and axe-core come from a local tooling
directory named at the top of each file.

## The walk through the Program

`walkthrough/` holds the fourteen screenshots that follow a staff member through the
Program in the order they meet it, and `walkthrough/shots.json` holds the plan: for each
one, the page, the tab, a caption and alternative text. `build_final_json.py` reads that file into the memorandum
as section XVIII, so the same fourteen figures with the same captions and the same
alternative text appear in the Word memorandum, in both packages and in both PDFs, and a
caption cannot drift from the picture it sits under. The landing page carries a pointer to
the section rather than a second copy of the images, which keeps each package to one copy
of each figure. `walkthrough/CAPTIONS.md` is the same content as text, for anyone who wants to
read the captions without opening the images.

The screenshots were taken on 2026-09-19 from a local run of this branch, because the
environment that builds this package cannot reach the site. Two things therefore do not
appear in them, and neither is a fault in the Program: files attached to a resource, which
need the program database, and live checking of current public sources, which needs the
research service. Nothing in any image was altered.

To retake them: build the app and serve it (`PORT=3100 npm run start`), then drive the
pre-installed Chromium at `http://localhost:3100` with `NO_PROXY='*'` so the agent proxy
does not intercept localhost. Load `/?view=one_dsd` first; the choice then sticks. Long
pages are captured from the top rather than stitched full-length, so a figure stays
legible at print size.

## Editing the memorandum

Change the text in `build/build_final_json.py`, then re-run the last four steps above.
A paragraph containing a blank line is split into separate paragraphs automatically.
The screenshot captions live in `walkthrough/shots.json`, not in the builder.
The Word file and the HTML landing page are both generated from `final.json`, so they
cannot drift apart.

## Names

Spellings confirmed by the author: Deqa Sayid, Nicole Urbach,
Maria Pabon, Sarah Shepherd, Jen Strei, Heidi Hamilton, Leigh Ann Ahmad.
