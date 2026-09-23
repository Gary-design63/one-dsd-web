// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ResourceMediaPreview, mediaResourceIdFromHref } from "@/components/multimedia/resource-media-preview";
afterEach(cleanup);
it.each([
  ["/learn/equity-toolkit#podcast-equity-toolkit", "podcast-equity-toolkit"],
  ["/learn#podcast-anti-racism-public-service", "podcast-anti-racism-public-service"],
])("links exact cited podcast %s to its recording and reading companion", (href, id) => {
  expect(mediaResourceIdFromHref(href)).toBe(id); render(<ResourceMediaPreview resourceId={id} />);
  expect(screen.getByRole("link").getAttribute("href")).toBe(href);
  expect(screen.getByText(/transcript as a draft/)).toBeTruthy();
});
it("does not infer a particular podcast from the catalog or toolkit route alone", () => {
  for (const href of ["/learn", "/learn/equity-toolkit", "/learn#unrelated", "https://example.org/learn#podcast-anti-racism-public-service"]) expect(mediaResourceIdFromHref(href)).toBeNull();
  const { container } = render(<ResourceMediaPreview resourceId="unknown" />); expect(container.textContent).toBe("");
});
