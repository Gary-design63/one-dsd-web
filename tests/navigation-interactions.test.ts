import { readFileSync } from "node:fs";
import postcss, { type Container } from "postcss";
import { describe, expect, it } from "vitest";

const css = postcss.parse(readFileSync("app/program-design.css", "utf8"));
const focusSelector = ".program-design :is(a[href],button,summary,input,select,textarea):focus-visible";

function declarations(selector: string, parent: Container = css): Record<string, string> {
  const values: Record<string, string> = {};
  for (const node of parent.nodes ?? []) {
    if (node.type !== "rule" || node.selector.replace(/\s/g, "") !== selector.replace(/\s/g, "")) continue;
    node.walkDecls(declaration => { values[declaration.prop] = declaration.value; });
  }
  return values;
}
const mobile = css.nodes.find(node =>
  node.type === "atrule" && node.name === "media" && /max-width/.test(node.params) &&
  declarations(".program-design .program-navigation.is-open", node).display === "block",
);
if (!mobile || mobile.type !== "atrule") throw new Error("No responsive primary navigation rules found.");
const forcedColors = css.nodes.find(node => node.type === "atrule" && node.name === "media" && /forced-colors\s*:\s*active/.test(node.params));
if (!forcedColors || forcedColors.type !== "atrule") throw new Error("No forced-colors focus rules found.");

describe("shared navigation presentation", () => {
  it("shows hover feedback and a keyboard focus outline without moving links", () => {
    const hover = declarations(".program-design .primary-nav-link:hover");
    const focus = declarations(focusSelector);
    expect(hover["text-decoration"]).toContain("underline");
    expect(focus.outline).toMatch(/3px solid/);
    expect(focus["outline-offset"]).toBe("3px");
    expect(hover.transform).toBeUndefined();
    expect(focus.transform).toBeUndefined();
  });

  it("uses weight and an edge marker as non-color cues for the current location", () => {
    const current = declarations(".program-design .primary-nav-link--current");
    expect(current["font-weight"]).toBe("700");
    expect(current["border-bottom-color"]).not.toBe("transparent");
    expect(declarations(".program-design .primary-nav-link")["border-bottom"]).toContain("3px");
    expect(declarations(".program-design .primary-nav-link--current", mobile)["border-left-color"]).not.toBe("transparent");
    expect(declarations(".program-design .primary-nav-link", mobile)["border-left"]).toContain("3px");
  });

  it("keeps keyboard focus visible on light and dark backgrounds and in forced colors", () => {
    const focus = declarations(focusSelector);
    expect(focus.outline).toBe("3px solid #003865");
    expect(focus["box-shadow"]).toBe("0 0 0 3px white");
    expect(declarations(focusSelector, forcedColors)["outline-color"]).toBe("Highlight");
  });

  it("removes closed mobile navigation from layout and exposes the same navigation when opened", () => {
    expect(declarations(".program-design .program-menu-toggle").display).toBe("none");
    expect(declarations(".program-design .program-menu-toggle")["min-height"]).toBe("44px");
    expect(declarations(".program-design .program-menu-toggle", mobile).display).toBe("inline-flex");
    expect(declarations(".program-design .program-navigation", mobile).display).toBe("none");
    expect(declarations(".program-design .program-navigation.is-open", mobile).display).toBe("block");
    expect(declarations(".program-design .primary-nav-link")["min-height"]).toBe("48px");
  });

  it("applies the shared design on the root layout after the base styles", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toMatch(/<body[^>]+className="[^"]*\bprogram-design\b/);
    const base = layout.indexOf('import "./globals.css"');
    const design = layout.indexOf('import "./program-design.css"');
    expect(base).toBeGreaterThanOrEqual(0);
    expect(design).toBeGreaterThan(base);
  });
});
