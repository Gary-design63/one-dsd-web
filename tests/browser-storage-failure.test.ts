import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("react", async (original) => ({
  ...await original<typeof import("react")>(),
  useSyncExternalStore: (_subscribe: unknown, snapshot: () => unknown) => snapshot(),
}));
afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });
async function setup() {
  const values = new Map<string, string>();
  const storage = { getItem: vi.fn((key: string) => values.get(key) ?? null), setItem: vi.fn((key: string, value: string) => { values.set(key, value); }), removeItem: vi.fn((key: string) => { values.delete(key); }) };
  vi.stubGlobal("window", { localStorage: storage, sessionStorage: storage });
  return { storage, values, module: await import("@/lib/client/storage") };
}
describe("browser storage failure reporting", () => {
  it("retains a new answer in memory when storage is full and clears the warning only after a successful retry", async () => {
    const { storage, module } = await setup();
    storage.setItem.mockImplementationOnce(() => { throw new Error("QuotaExceededError"); });
    const answer = { text: "Accessible meeting notes" };
    expect(module.writeStored("session", "answer", answer)).toBe(false);
    expect(module.readStored("session", "answer", null)).toEqual(answer);
    expect(module.useStorageNotice()).toContain("could not save");
    expect(module.writeStored("session", "unrelated", "ok")).toBe(true);
    expect(module.useStorageNotice()).not.toBe("");
    expect(module.writeStored("session", "answer", answer)).toBe(true);
    expect(module.useStorageNotice()).toBe("");
  });
  it("does not hide a record or claim deletion when removal fails", async () => {
    const { storage, module } = await setup();
    module.writeStored("local", "notes", "original");
    storage.removeItem.mockImplementationOnce(() => { throw new Error("SecurityError"); });
    expect(module.writeStored("local", "notes", null)).toBe(false);
    expect(module.readStored("local", "notes", "")).toBe("original");
    expect(module.useStorageNotice()).toContain("could not delete");
    expect(module.writeStored("local", "notes", null)).toBe(true);
    expect(module.readStored("local", "notes", "")).toBe("");
  });
  it("reports browser storage access being blocked", async () => {
    const { module } = await setup();
    Object.defineProperty(window, "localStorage", { get() { throw new Error("SecurityError"); } });
    expect(module.writeStored("local", "notes", "keep this")).toBe(false);
    expect(module.readStored("local", "notes", "")).toBe("keep this");
    expect(module.useStorageNotice()).toContain("Keep this page open");
  });
});
