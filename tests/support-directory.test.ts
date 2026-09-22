import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { SUPPORT_DESTINATIONS } from "@/lib/product/support-routing";
import { SUPPORT_DIRECTORY, SUPPORT_SOURCES, supportSourcesFor } from "@/lib/product/support-directory";
import { SupportSourceLinks } from "@/components/support-source-links";

describe("responsible support sources", () => {
  it("provides a sourced choice or an honest assigned-role fallback for each destination", () => {
    for (const destination of SUPPORT_DESTINATIONS) {
      const entry = SUPPORT_DIRECTORY[destination.id];
      expect(entry.fallback.length).toBeGreaterThan(30);
      expect(supportSourcesFor(destination.id)).toHaveLength(entry.sources.length);
      for (const source of supportSourcesFor(destination.id)) {
        expect(source.checkedOn).toBe("2026-09-08");
        expect(source.publisher).toBe("Minnesota DHS");
        const url = new URL(source.href);
        expect(url.origin).toBe("https://mn.gov");
        expect(url.search).toBe("");
        expect(url.hash).toBe("");
      }
    }
  });
  it("keeps employee and public-service civil rights routes distinct with direct access", () => {
    const sources = supportSourcesFor("civil_rights_channel");
    expect(sources.map(source => source.id)).toEqual(["workplace-concern", "service-civil-rights"]);
    expect(sources[0].audience).toBe("DHS employees");
    expect(sources[0].limitation).toContain("not required before");
    const html = renderToStaticMarkup(createElement(SupportSourceLinks, { destination: "civil_rights_channel" }));
    for (const source of sources) expect(html).toContain(`href="${source.href}"`);
    expect(html).not.toContain("/support/request");
  });
  it("does not substitute public formats or recruitment for employee accommodation", () => {
    expect(supportSourcesFor("accessibility_or_language_access_lead").map(source => source.id)).toEqual(["employee-accommodation", "public-accessibility", "language-blocks"]);
    expect(SUPPORT_SOURCES.find(source => source.id === "recruitment")?.limitation).toContain("assigned HR contact");
    expect(SUPPORT_SOURCES.find(source => source.id === "employee-accommodation")?.sourceDate).toContain("2014");
  });
  it("preserves role-only limitations when an assigned staff contact is not public", () => {
    expect(supportSourcesFor("equity_specialist")).toEqual([]);
    const html = renderToStaticMarkup(createElement(SupportSourceLinks, { destination: "equity_specialist" }));
    expect(html).toContain("identify the specialist");
    expect(html).not.toContain("mailto:");
    expect(html).not.toContain("<a ");
  });
});
