import { expect, it } from "vitest";
import { classifyIntent } from "@/lib/intelligence/agents/ask";
import { searchDocs, type Doc } from "@/lib/intelligence/retrieval/search";

it.each(["accessible", "accessibility", "captions", "disabilities", "translation"])("recognizes access needs: %s", word => {
  expect(classifyIntent(`Help with ${word} in a team meeting`).all).toContain("access_barriers");
});

it("ranks focused meeting guidance ahead of incidental words in a long community document", () => {
  const common = { kind: "content", authority: "guidance", type: "guide", status: "published", reviewDate: "2026-09-07", scope: "agencywide", summary: "", tags: [], intents: [] } as const;
  const docs: Doc[] = [
    { ...common, tags: [], intents: [], id: "community", title: "African American and Black Minnesotans", href: "/minnesota-communities/african-american", text: "program resource relevant practical steps brief give point make team " + "A community history and a program decision. ".repeat(900) + "An accessible meeting can support participation." },
    { ...common, tags: [], intents: [], id: "meeting", title: "Accessible meetings", href: "/practice/gp-8", text: "Share the agenda ahead of time. Offer captions and written participation." },
  ];
  const hits = searchDocs("How can I make a team meeting more accessible? Give three brief practical steps and point me to the relevant program resource.", docs);
  expect(hits[0].id).toBe("meeting");
});
