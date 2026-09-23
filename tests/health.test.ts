import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("health route", () => {
  it("reports a healthy service without exposing internal details", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ status: "ok" });
  });
});
