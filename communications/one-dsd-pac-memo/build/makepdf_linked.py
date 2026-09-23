#!/usr/bin/env python3
"""Self-contained PDF of a package: the landing page first, every document behind it,
and every link a real PDF link (jump links to sections, cards to documents, contents
rows to sections), each showing the page it lands on. Bookmarks from the headings."""
import re, sys, pathlib
from weasyprint import HTML

DELIVERABLES = pathlib.Path(__file__).resolve().parent.parent / "deliverables"
src = sys.argv[1] if len(sys.argv) > 1 else str(DELIVERABLES / "One-DSD-PAC-Program-Package.html")
out = sys.argv[2] if len(sys.argv) > 2 else str(DELIVERABLES / "One-DSD-PAC-Program-Package.pdf")

html = pathlib.Path(src).read_text(encoding="utf-8")
# Jump links open the full memorandum and then scroll to a section in the browser;
# in the PDF they can go straight to the section.
html = re.sub(r'href="#doc-memofull"(\s+data-open="doc-memofull"\s+data-anchor="(s-[A-Za-z]+)")',
              r'href="#\2"\1', html)

PDF_CSS = """
@page { size: Letter; margin: 0.8in 0.8in 0.9in;
        @bottom-center { content: counter(page); font: 8pt "DejaVu Sans", sans-serif; color: #5A5A57; } }
@page :first { @bottom-center { content: none; } }
html, body { background: #fff !important; }
.topbar, .back, .doc-top, .doc-foot, footer.pg { display: none !important; }
.sheet { max-width: none; margin: 0; padding: 0; box-shadow: none; }
.sheet--memo { break-after: page; }
.memo-logo { width: 2.4in; height: auto; display: block; margin: 0 0 12px; }
.library { display: block !important; max-width: none; margin: 14px 0 0; padding: 0; box-shadow: none; }
.library#contents { break-before: page; }
.lib-head { margin: 0 0 8px; }
.toc { display: block !important; }
.toc-row { display: block; padding: 5px 0; border-bottom: 1px solid #E6E6E2; break-inside: avoid; }
.toc-t { display: inline; font-weight: 700; color: #003865; }
.toc-b { display: block; font-size: 8.4pt; color: #5A5A57; }
.toc-row::after, .card::after {
  content: "\\2192  p. " target-counter(attr(href), page);
  font-size: 8pt; color: #5A5A57; font-weight: 400; white-space: nowrap; }
a.jump::after { content: " p. " target-counter(attr(href), page);
  font-size: 8pt; color: #5A5A57; font-weight: 400; white-space: nowrap; }
.cards { display: block; }
.card { display: block; padding: 7px 0 7px; margin: 0; border: 0; border-bottom: 1px solid #E6E6E2;
        box-shadow: none; break-inside: avoid; }
.card-n { display: inline; font-size: 7.6pt; letter-spacing: .12em; color: #5A5A57; margin-right: 8px; }
.card-t { display: inline; font-weight: 700; color: #003865; }
.card-b { display: block; font-size: 8.6pt; color: #5A5A57; line-height: 1.35; margin-top: 2px; }
.card-go { display: none; }
a.jump { display: inline !important; color: #003865; font-weight: 700; text-decoration: none; }
/* The one link that leaves the package: keep it live, and print the address with it. */
a.open-link { display: inline !important; font-weight: 700; text-decoration: underline; }
a.open-link::after { content: " (" attr(href) ")"; font-weight: 400; font-size: 8.4pt; color: #5A5A57; }
.deliverable { border: 1pt solid #003865; padding: 9px 11px; margin: 10px 0; break-inside: avoid; }
.pull-more { display: block !important; }
.doc { display: block !important; break-before: page; max-width: none !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; background: #fff; }
.doc-title { font-size: 17pt; margin: 0 0 4px; }
.doc-blurb { color: #5A5A57; margin: 0 0 12px; }
.doc-body { font-size: 10pt; }
.doc-body table { font-size: 8.3pt; }
.doc-body img, .memo-fig img { max-width: 100%; height: auto; }
.memo-sec { break-inside: auto; }
h1, h2, h3 { break-after: avoid; }
a { color: #003865; text-decoration: none; }
/* Bookmarks: the memorandum, the contents, each document; section headings beneath them. */
.memo-word { bookmark-level: 1; bookmark-label: "Memorandum"; }
.library#contents .lib-head h2, .library#library .lib-head h2 { bookmark-level: 1; }
.doc-title { bookmark-level: 1; }
.doc h2 { bookmark-level: 2; }
.doc h3 { bookmark-level: 3; }
h2.memo-h { bookmark-level: 2; }
"""

assert html.count("</head>") == 1
html = html.replace("</head>", "<style>" + PDF_CSS + "</style></head>")
doc = HTML(string=html, base_url=str(pathlib.Path(src).parent)).render()
try:
    doc.write_pdf(out, pdf_variant="pdf/ua-1")
    print("tagged PDF (PDF/UA-1)")
except Exception as e:
    print("PDF/UA export failed, writing untagged:", e)
    doc.write_pdf(out)
print("wrote", out, "pages:", len(doc.pages))
