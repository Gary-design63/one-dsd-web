// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes } from "react";
import { SiteHeader } from "@/components/site-header";
import type { PreparedEditableSurface } from "@/components/editable-surface";
import type { EditableSurfaceLink } from "@/lib/content/editable-surface-contract";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";

const location = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => location.pathname }));
// Keep native link semantics and bubbling. Browser checks cover actual Next
// navigation and responsive visibility; this suite exercises header behavior.
vi.mock("next/link", () => ({
  default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} onClick={event => event.preventDefault()} />,
}));
vi.mock("@/components/program-context", () => ({ ContextSwitcher: () => <button type="button">Choose the program view</button> }));
vi.mock("@/components/editable-surface-editor", () => ({ EditableSurfaceEditor: () => null }));

function surface(id: string, overrides: Partial<PreparedEditableSurface> = {}): PreparedEditableSurface {
  const definition = getEditableSurfaceDefinition(id);
  if (!definition) throw new Error("Missing surface: " + id);
  return { definition, values: definition.approvedValues, scope: "one-dhs", published: null, available: true, canEdit: false, ...overrides };
}
function showHeader(headerSurface = surface("site.header"), contextSurface = surface("site.context")) {
  return render(<SiteHeader headerSurface={headerSurface} contextSurface={contextSurface} />);
}

beforeEach(() => { location.pathname = "/"; });
afterEach(() => { cleanup(); });

describe("SiteHeader interaction and published navigation", () => {
  it("opens and closes its named navigation using the menu button", async () => {
    const user = userEvent.setup();
    showHeader();
    const menu = screen.getByRole("button", { name: "Menu" });
    const navigation = screen.getByRole("navigation", { name: "Primary" });
    expect(menu.getAttribute("aria-controls")).toBe(navigation.id);
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    expect(navigation.classList.contains("is-open")).toBe(false);
    menu.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Close menu" })).toBe(menu);
    expect(menu.getAttribute("aria-expanded")).toBe("true");
    expect(navigation.classList.contains("is-open")).toBe(true);
    await user.click(menu);
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    expect(navigation.classList.contains("is-open")).toBe(false);
  });

  it("closes on Escape from a navigation link and returns focus to the menu button", async () => {
    const user = userEvent.setup();
    showHeader();
    const menu = screen.getByRole("button", { name: "Menu" });
    await user.click(menu);
    screen.getByRole("link", { name: "Practice" }).focus();
    await user.keyboard("{Escape}");
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByRole("navigation", { name: "Primary" }).classList.contains("is-open")).toBe(false);
    expect(document.activeElement).toBe(menu);
  });

  it("does not steal focus when Escape is pressed while the menu is closed", () => {
    showHeader();
    const switcher = screen.getByRole("button", { name: "Choose the program view" });
    switcher.focus();
    fireEvent.keyDown(switcher, { key: "Escape" });
    expect(document.activeElement).toBe(switcher);
  });

  it("closes the open menu after a navigation link is activated", async () => {
    const user = userEvent.setup();
    showHeader();
    const menu = screen.getByRole("button", { name: "Menu" });
    await user.click(menu);
    await user.click(screen.getByRole("link", { name: "My Work" }));
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByRole("navigation", { name: "Primary" }).classList.contains("is-open")).toBe(false);
  });

  it.each(["/courses/intercultural-communication/lessons/1", "/resources/equity-analysis-toolkit", "/library", "/learn/intercultural"])("marks Learning as the single current section at %s", pathname => {
    location.pathname = pathname;
    showHeader();
    const navigation = screen.getByRole("navigation", { name: "Primary" });
    const current = within(navigation).getAllByRole("link", { current: "page" });
    expect(current).toHaveLength(1);
    expect(current[0].textContent).toBe("Learning and resources");
    expect(current[0].getAttribute("href")).toBe("/learn");
  });

  it("marks My Work current on a nested workspace route without marking Home current", () => {
    location.pathname = "/my-work/explore";
    showHeader();
    const navigation = screen.getByRole("navigation", { name: "Primary" });
    expect(within(navigation).getAllByRole("link", { current: "page" }).map(link => link.getAttribute("href"))).toEqual(["/my-work"]);
    expect(within(navigation).getByRole("link", { name: "Home" }).hasAttribute("aria-current")).toBe(false);
  });

  it("does not mark a section current merely because its path is a prefix", () => {
    location.pathname = "/start-something-else";
    showHeader();
    expect(within(screen.getByRole("navigation", { name: "Primary" })).queryAllByRole("link", { current: "page" })).toHaveLength(0);
  });

  it("retains every supplied published link, label, order, and destination", () => {
    const header = surface("site.header");
    showHeader(header);
    const expected = [...header.values.primaryNavigation as EditableSurfaceLink[], ...header.values.personalNavigation as EditableSurfaceLink[]];
    expect(within(screen.getByRole("navigation", { name: "Primary" })).getAllByRole("link").map(link => ({ label: link.textContent, href: link.getAttribute("href") }))).toEqual(expected);
    expect(screen.getByRole("img", { name: "Minnesota Department of Human Services" })).toBeTruthy();
  });

  it("uses published navigation edits without restoring absent default destinations", () => {
    const header = surface("site.header");
    const values = { ...header.values, primaryNavigation: [{ label: "Our learning pathway", href: "/learn/intercultural" }], personalNavigation: [{ label: "My saved work", href: "/my-work" }] };
    showHeader({ ...header, values });
    const links = within(screen.getByRole("navigation", { name: "Primary" })).getAllByRole("link");
    expect(links.map(link => [link.textContent, link.getAttribute("href")])).toEqual([["Our learning pathway", "/learn/intercultural"], ["My saved work", "/my-work"]]);
    expect(screen.queryByRole("link", { name: "Practice" })).toBeNull();
  });

  it("withholds navigation and its toggle when the header surface is unavailable", () => {
    // Unavailable surfaces can carry approved fallback values internally.
    // They must not leak into staff navigation.
    showHeader(surface("site.header", { available: false }));
    expect(screen.queryByRole("navigation", { name: "Primary" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Menu" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Learning and resources" })).toBeNull();
    expect(screen.getByRole("button", { name: "Choose the program view" })).toBeTruthy();
  });

  it("withholds the view switcher independently when its own surface is unavailable", () => {
    showHeader(surface("site.header"), surface("site.context", { available: false }));
    expect(screen.queryByRole("button", { name: "Choose the program view" })).toBeNull();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeTruthy();
  });

  it.each(["/", "/resources/equity-analysis-toolkit", "/learn/intercultural", "/one-dsd/scenarios/dsd-hiring-panel", "/courses", "/courses/intercultural-communication", "/courses/intercultural-communication/lessons/1"])("keeps the page share control for everyone at %s", pathname => {
    location.pathname = pathname;
    showHeader();
    expect(screen.getByRole("button", { name: "Share" })).toBeTruthy();
  });
});
