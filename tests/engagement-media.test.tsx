// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DsdAccessibleFormDemo, DsdServiceRouteExplorer } from "@/components/multimedia/dsd-access-demonstrations";
import { DsdInventoryMap } from "@/components/multimedia/dsd-inventory-map";
import { EngagementLearningScene, CommunityInfluenceMap } from "@/components/multimedia/engagement-learning-scenes";
import { EngagementToolkitRoute } from "@/components/multimedia/engagement-toolkit-route";
import { DsdLeadershipMedia } from "@/components/multimedia/dsd-leadership-media";
import { EngagementReferenceMap } from "@/components/multimedia/engagement-reference-map";
import { EngagementWorkedExample } from "@/components/multimedia/engagement-worked-examples";
import { DsdFirstContactAudio } from "@/components/multimedia/dsd-first-contact-audio";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const open = (text: string) => fireEvent.click(screen.getByText(text));

describe("working resource companions", () => {
  it("keeps complete first-contact transcripts available if playback fails", () => {
    const { container } = render(<DsdFirstContactAudio />);
    const players = container.querySelectorAll("audio"); expect(players).toHaveLength(2);
    for (const player of players) { expect(player.preload).toBe("none"); expect(player.autoplay).toBe(false); }
    fireEvent.error(players[0]); expect(screen.getByRole("status").textContent).toContain("complete transcript");
    const transcript = screen.getAllByText("Read the complete transcript"); transcript.forEach(item => fireEvent.click(item));
    expect(screen.getByText(/No translated greeting is performed/)).toBeTruthy();
  });
  it("explains an error, focuses the field, and previews a fictional confirmation without sending or saving", () => {
    const fetch = vi.spyOn(globalThis, "fetch"); const storage = vi.spyOn(Storage.prototype, "setItem");
    render(<DsdAccessibleFormDemo />); open("Try the repaired part of a fictional form");
    fireEvent.click(screen.getByRole("button", { name: "Preview example confirmation" }));
    const field = screen.getByRole("combobox", { name: "Choose a fictional meeting format" });
    expect(document.activeElement).toBe(field); expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toContain("Choose a meeting format");
    fireEvent.change(field, { target: { value: "phone" } });
    expect(field.getAttribute("aria-invalid")).toBe("false");
    fireEvent.click(screen.getByRole("button", { name: "Preview example confirmation" }));
    expect(screen.getByRole("status").textContent).toContain("your phone conversation choice");
    fireEvent.change(field, { target: { value: "video" } });
    expect(screen.getByRole("status").textContent).toBe("");
    expect(fetch).not.toHaveBeenCalled(); expect(storage).not.toHaveBeenCalled();
  });
  it("reveals each actual route and its distinct handoff risk", () => {
    render(<DsdServiceRouteExplorer />); open("Follow one contact route to the same next step");
    expect(screen.getByText("Find a labeled, usable form")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Phone" }));
    expect(screen.getByText(/A voicemail alone/)).toBeTruthy();
    expect(screen.queryByText("Find a labeled, usable form")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "With chosen support" }));
    expect(screen.getByText("Confirm the person's choice and who will follow up")).toBeTruthy();
    expect(screen.getByRole("button", { name: "With chosen support" }).getAttribute("aria-pressed")).toBe("true");
  });
  it("never adds a hidden profile to the published inventory", () => {
    render(<DsdInventoryMap programs={[{ id: "data-quality", title: "Data and quality" }]} />);
    open("Find a program through a work question");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link").getAttribute("href")).toBe("/one-dsd/programs/data-quality");
  });
  it.each(["foundations", "perspectives", "communication", "decisions", "reflection"])("provides a complete readable %s learning scene", focus => {
    render(<EngagementLearningScene focus={focus} />); open("Explore the example more closely");
    expect(screen.getAllByRole("rowheader")).toHaveLength(3);
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    if (focus === "perspectives") expect(screen.getByRole("img").getAttribute("alt")).toContain("write on response cards");
  });
  it("makes a process comparison without changing the original toolkit activity", () => {
    render(<EngagementToolkitRoute />); open("Compare two ways to examine a reminder");
    expect(screen.getByText("Count reminders sent")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Review the whole task" }));
    expect(screen.getByText("Ask whether people could act and what remains difficult")).toBeTruthy();
    expect(screen.queryByText("Count reminders sent")).toBeNull();
  });
  it("connects a barrier with influence, evidence and a return to contributors", () => {
    render(<CommunityInfluenceMap />); expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText(/Attendance cannot establish an employment outcome/)).toBeTruthy();
  });
  it.each(["recruit", "interview", "everyday", "develop", "advance", "retain", "succession"])("provides an actual %s leadership companion", stageId => {
    const { container } = render(<DsdLeadershipMedia stageId={stageId} />);
    expect(container.querySelector("details")).not.toBeNull();
    expect(container.textContent!.length).toBeGreaterThan(350);
  });
  it.each(["purpose", "structure", "dsd-placement", "county-tribal", "assessment", "person-centered", "employment", "licensing", "transitions", "language-access", "operations", "behavioral-health", "mhcp", "housing", "legislative"])("gives reference %s a readable relationship table", topicId => {
    render(<EngagementReferenceMap topicId={"ext-dhs-org-" + topicId} application="Keep the original source close." />);
    open("Explore the relationships in a work question");
    expect(screen.getAllByRole("rowheader").length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText("Keep the original source close.")).toBeTruthy();
  });
  it.each(["mentoring", "well-being", "co-leads", "materials", "lab", "idea", "borrow", "question", "window"])("renders the exact %s worked example", kind => {
    render(<EngagementWorkedExample kind={kind} />);
    expect(screen.getByText("A fictional example")).toBeTruthy();
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });
});
