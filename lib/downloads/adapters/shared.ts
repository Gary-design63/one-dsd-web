import { PROGRAM } from "@/lib/constants";
import type { EditableRichBlock, EditableSurfaceLink } from "@/lib/content/editable-surface-contract";
import type { StaffProgramScope } from "@/lib/content/staff-publications";
import { runs, type DocumentBlock, type InlineRun } from "../model";

export function programName(scope: StaffProgramScope): string {
  return scope === "dsd" ? PROGRAM.oneDsdProgramName : PROGRAM.fullName;
}

export function kicker(scope: StaffProgramScope, noun: string): string {
  return `${programName(scope)} · ${noun}`;
}

/** A link as document text: the label, then where it goes. Program paths keep their path so a reader can find the page. */
export function linkRuns(link: EditableSurfaceLink | { label: string; href: string }): InlineRun[] {
  const destination = link.href.startsWith("/") ? `program page ${link.href}` : link.href;
  return [{ text: link.label, bold: true }, { text: ` — ${destination}` }];
}

export function linkList(links: ReadonlyArray<EditableSurfaceLink | { label: string; href: string }>): DocumentBlock | null {
  if (links.length === 0) return null;
  return { kind: "list", items: links.map(linkRuns) };
}

export function richBlocks(blocks: readonly EditableRichBlock[]): DocumentBlock[] {
  return blocks.flatMap((block): DocumentBlock[] => {
    switch (block.type) {
      case "heading":
        return [{ kind: "heading", level: block.level, text: block.text }];
      case "paragraph":
        return block.text.trim() ? [{ kind: "paragraph", runs: runs(block.text) }] : [];
      case "bullet-list":
        return [{ kind: "list", items: block.items.map(runs) }];
      case "numbered-list":
        return [{ kind: "list", ordered: true, items: block.items.map(runs) }];
      case "link-list":
        return [{ kind: "list", items: block.items.map(linkRuns) }];
    }
  });
}

export function nonEmpty(values: readonly string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}
