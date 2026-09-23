import type { DocumentBlock, InlineRun } from "./model";

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  middot: "·",
  bull: "•",
  copy: "©",
  rarr: "→",
  larr: "←",
  times: "×",
};

export function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      const code = Number.parseInt(entity.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    if (entity.startsWith("#")) {
      const code = Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

const BLOCK_TAGS = new Set(["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "section", "article", "blockquote", "tr"]);
const TOKEN = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>|[^<]+/g;

type ListFrame = { ordered: boolean; items: InlineRun[][] };

/** Turns the simple authored HTML used in program content into document blocks. */
export function htmlToBlocks(html: string): DocumentBlock[] {
  const blocks: DocumentBlock[] = [];
  let current: InlineRun[] = [];
  let bold = 0;
  let italic = 0;
  let headingLevel: 2 | 3 | null = null;
  const lists: ListFrame[] = [];

  const flushParagraph = () => {
    const trimmed = trimRuns(current);
    current = [];
    if (trimmed.length === 0) return;
    const list = lists[lists.length - 1];
    if (list) {
      list.items.push(trimmed);
      return;
    }
    if (headingLevel) {
      blocks.push({ kind: "heading", level: headingLevel, text: trimmed.map((run) => run.text).join("") });
      return;
    }
    blocks.push({ kind: "paragraph", runs: trimmed });
  };

  for (const match of html.matchAll(TOKEN)) {
    const [token, tagName] = match;
    if (!tagName) {
      const text = decodeEntities(token).replace(/\s+/g, " ");
      if (!text) continue;
      const last = current[current.length - 1];
      if (last && Boolean(last.bold) === bold > 0 && Boolean(last.italic) === italic > 0) {
        last.text += text;
      } else {
        current.push({ text, ...(bold > 0 ? { bold: true } : {}), ...(italic > 0 ? { italic: true } : {}) });
      }
      continue;
    }
    const tag = tagName.toLowerCase();
    const closing = token.startsWith("</");
    if (tag === "br") {
      flushParagraph();
      continue;
    }
    if (tag === "strong" || tag === "b") {
      bold = Math.max(0, bold + (closing ? -1 : 1));
      continue;
    }
    if (tag === "em" || tag === "i") {
      italic = Math.max(0, italic + (closing ? -1 : 1));
      continue;
    }
    if (tag === "ul" || tag === "ol") {
      flushParagraph();
      if (closing) {
        const frame = lists.pop();
        if (frame && frame.items.length > 0) blocks.push({ kind: "list", ordered: frame.ordered, items: frame.items });
      } else {
        lists.push({ ordered: tag === "ol", items: [] });
      }
      continue;
    }
    if (tag === "li") {
      flushParagraph();
      continue;
    }
    if (BLOCK_TAGS.has(tag)) {
      flushParagraph();
      if (/^h[1-6]$/.test(tag)) headingLevel = closing ? null : tag === "h1" || tag === "h2" ? 2 : 3;
      continue;
    }
    // Inline tags such as <a>, <span>, <code> keep their text and drop their markup.
  }
  flushParagraph();
  while (lists.length > 0) {
    const frame = lists.pop();
    if (frame && frame.items.length > 0) blocks.push({ kind: "list", ordered: frame.ordered, items: frame.items });
  }
  return blocks;
}

/** Plain text for spreadsheet cells and slide bullets. */
export function htmlToText(html: string): string {
  return htmlToBlocks(html)
    .map((block) => {
      switch (block.kind) {
        case "heading":
          return block.text;
        case "paragraph":
          return block.runs.map((run) => run.text).join("");
        case "list":
          return block.items.map((item) => `• ${item.map((run) => run.text).join("")}`).join("\n");
        case "quote":
          return block.text;
        case "callout":
          return block.text;
        case "fields":
          return block.rows.map((row) => `${row.label}: ${row.value}`).join("\n");
        case "table":
          return block.rows.map((row) => row.join(" | ")).join("\n");
      }
    })
    .join("\n\n")
    .trim();
}

function trimRuns(value: InlineRun[]): InlineRun[] {
  const copy = value.map((run) => ({ ...run }));
  while (copy.length > 0) {
    const first = copy[0];
    first.text = first.text.replace(/^\s+/, "");
    if (first.text) break;
    copy.shift();
  }
  while (copy.length > 0) {
    const last = copy[copy.length - 1];
    last.text = last.text.replace(/\s+$/, "");
    if (last.text) break;
    copy.pop();
  }
  return copy;
}
