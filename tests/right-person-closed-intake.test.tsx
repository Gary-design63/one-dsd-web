// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { RightPersonClient } from "@/components/right-person-client";

vi.mock("@/components/program-context", () => ({ useProgramContext: () => ({ context: "one_dsd" }) }));
afterEach(cleanup);

describe("staff support while consultation intake is closed", () => {
  it("returns responsible contacts without offering the closed request form", () => {
    const copy = getEditableSurfaceDefinition("support.right-person")!.approvedValues;
    const view = render(<RightPersonClient copy={copy} />);

    fireEvent.change(screen.getByRole("combobox", { name: "Your role in this work" }), { target: { value: "staff_member" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Area of work" }), { target: { value: "workforce_equity" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Timing" }), { target: { value: "exploratory" } });
    fireEvent.click(screen.getByRole("radio", { name: /This work is within the Disability Services Division/ }));
    fireEvent.click(screen.getByRole("button", { name: "Show who can help" }));

    expect(screen.getByRole("heading", { name: "Find support for DSD work" })).toBeTruthy();
    expect(screen.getByText(/Staff consultation request forms are closed/)).toBeTruthy();
    expect(view.container.querySelector('a[href^="/support/request"]')).toBeNull();
    expect(screen.getByRole("link", { name: "DHS offices and guidance" })).toBeTruthy();
  });
});
