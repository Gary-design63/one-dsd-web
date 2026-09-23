import { runsToText, type DocumentBlock, type ResourceDocument } from "../model";

function blockText(block: DocumentBlock): string {
  switch (block.kind) {
    case "heading":
      return block.text;
    case "paragraph":
      return runsToText(block.runs);
    case "list":
      return block.items
        .map((item, index) => `${block.ordered ? `${index + 1}.` : "•"} ${runsToText(item)}`)
        .join("\n");
    case "table":
      return [
        block.headers.join(" | "),
        block.headers.length ? block.headers.map(() => "---").join(" | ") : "",
        ...block.rows.map((row) => row.join(" | ")),
      ]
        .filter(Boolean)
        .join("\n");
    case "quote":
      return block.cite ? `“${block.text}” — ${block.cite}` : `“${block.text}”`;
    case "callout":
      return block.label ? `${block.label}: ${block.text}` : block.text;
    case "fields":
      return block.rows.map((row) => `${row.label}: ${row.value}`).join("\n");
  }
}

export function documentToPlainText(document: ResourceDocument): string {
  const parts = [
    document.kicker,
    document.title,
    document.subtitle,
    document.meta.map((entry) => `${entry.label}: ${entry.value}`).join(" · "),
    "",
    ...document.sections.flatMap((section) => [
      section.heading ? section.heading.toUpperCase() : "",
      ...section.blocks.map(blockText),
      "",
    ]),
  ];
  if (document.sources?.length) {
    parts.push("SOURCES", ...document.sources.map((source) => {
      const note = source.note ? ` — ${source.note}` : "";
      const href = source.href ? ` ${source.href}` : "";
      return `• ${source.title}${note}${href}`;
    }));
  }
  parts.push("", document.attribution);
  return parts.filter((part) => part !== undefined).join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

export function renderText(document: ResourceDocument): Buffer {
  return Buffer.from(documentToPlainText(document), "utf8");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function runsHtml(runs: { text: string; bold?: boolean; italic?: boolean }[]): string {
  return runs
    .map((run) => {
      let html = escapeHtml(run.text);
      if (run.bold) html = `<strong>${html}</strong>`;
      if (run.italic) html = `<em>${html}</em>`;
      return html;
    })
    .join("");
}

function blockHtml(block: DocumentBlock): string {
  switch (block.kind) {
    case "heading":
      return `<h${block.level}>${escapeHtml(block.text)}</h${block.level}>`;
    case "paragraph":
      return `<p>${runsHtml(block.runs)}</p>`;
    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      return `<${tag}>${block.items.map((item) => `<li>${runsHtml(item)}</li>`).join("")}</${tag}>`;
    }
    case "table": {
      const head = block.headers.length
        ? `<thead><tr>${block.headers.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead>`
        : "";
      const body = `<tbody>${block.rows
        .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
        .join("")}</tbody>`;
      return `<table>${head}${body}</table>`;
    }
    case "quote":
      return `<blockquote><p>${escapeHtml(block.text)}</p>${block.cite ? `<cite>${escapeHtml(block.cite)}</cite>` : ""}</blockquote>`;
    case "callout":
      return `<aside><p>${block.label ? `<strong>${escapeHtml(block.label)}:</strong> ` : ""}${escapeHtml(block.text)}</p></aside>`;
    case "fields":
      return `<dl>${block.rows.map((row) => `<dt>${escapeHtml(row.label)}</dt><dd>${escapeHtml(row.value)}</dd>`).join("")}</dl>`;
  }
}

export function documentToHtml(document: ResourceDocument): string {
  const meta = document.meta.map((entry) => `<p><strong>${escapeHtml(entry.label)}:</strong> ${escapeHtml(entry.value)}</p>`).join("");
  const sections = document.sections
    .map((section) => {
      const heading = section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : "";
      return `<section>${heading}${section.blocks.map(blockHtml).join("")}</section>`;
    })
    .join("");
  const sources = document.sources?.length
    ? `<section><h2>Sources</h2><ul>${document.sources
        .map((source) => {
          const title = source.href
            ? `<a href="${escapeHtml(source.href)}">${escapeHtml(source.title)}</a>`
            : escapeHtml(source.title);
          return `<li>${title}${source.note ? ` — ${escapeHtml(source.note)}` : ""}</li>`;
        })
        .join("")}</ul></section>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(document.title)}</title>
<style>
  body { font-family: Georgia, serif; line-height: 1.5; color: #182c3a; max-width: 52rem; margin: 2rem auto; padding: 0 1.25rem; }
  h1, h2, h3 { font-family: Calibri, sans-serif; color: #003865; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 0.95rem; }
  th, td { border: 1px solid #c5d0d7; padding: 0.4rem 0.55rem; vertical-align: top; }
  th { background: #003865; color: #fff; text-align: left; }
  aside { background: #eef6e5; padding: 0.8rem 1rem; }
</style>
</head>
<body>
${document.kicker ? `<p>${escapeHtml(document.kicker)}</p>` : ""}
<h1>${escapeHtml(document.title)}</h1>
${document.subtitle ? `<p><em>${escapeHtml(document.subtitle)}</em></p>` : ""}
${meta}
${sections}
${sources}
<p>${escapeHtml(document.attribution)}</p>
</body>
</html>
`;
}

export function renderHtml(document: ResourceDocument): Buffer {
  return Buffer.from(documentToHtml(document), "utf8");
}
