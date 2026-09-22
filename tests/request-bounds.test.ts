import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { readBoundedFormUrlEncoded, readBoundedJson } from "@/lib/http/request";
import { consumeRequestLimit } from "@/lib/security/rate-limit";
import { NextRequest } from "next/server";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";

describe("bounded request readers", () => {
  it("does not use the unbounded Request.json reader in an API route", () => {
    const apiRoot = path.resolve(import.meta.dirname, "..", "app", "api");
    const routeFiles = (directory: string): string[] => readdirSync(directory, { withFileTypes: true })
      .flatMap((entry) => entry.isDirectory()
        ? routeFiles(path.join(directory, entry.name))
        : entry.name === "route.ts" ? [path.join(directory, entry.name)] : []);

    const unbounded = routeFiles(apiRoot).filter((file) => /\brequest\.json\s*\(/.test(readFileSync(file, "utf8")));
    expect(unbounded).toEqual([]);
  });

  it("accepts small JSON and rejects the wrong media type", async () => {
    await expect(readBoundedJson(new Request("https://program.example/api", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: true }),
    }), 1_024)).resolves.toEqual({ ok: true, value: { ok: true } });

    await expect(readBoundedJson(new Request("https://program.example/api", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "{}",
    }), 1_024)).resolves.toMatchObject({ ok: false, status: 415 });
  });

  it("enforces both declared and actual byte ceilings", async () => {
    await expect(readBoundedJson(new Request("https://program.example/api", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "9000" },
      body: "{}",
    }), 128)).resolves.toMatchObject({ ok: false, status: 413 });

    await expect(readBoundedJson(new Request("https://program.example/api", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "2" },
      body: JSON.stringify({ payload: "x".repeat(200) }),
    }), 128)).resolves.toMatchObject({ ok: false, status: 413 });
  });

  it("stops a no-Content-Length stream as soon as its byte ceiling is crossed", async () => {
    let pulls = 0;
    let cancelled = false;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls += 1;
        controller.enqueue(new TextEncoder().encode("0123456789"));
        if (pulls >= 100) controller.close();
      },
      cancel() {
        cancelled = true;
      },
    });
    const request = new Request("https://program.example/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      duplex: "half",
    } as RequestInit & { duplex: "half" });

    await expect(readBoundedJson(request, 25)).resolves.toMatchObject({ ok: false, status: 413 });
    expect(cancelled).toBe(true);
    expect(pulls).toBeLessThan(100);
  });

  it("parses only bounded URL-encoded sign-in data", async () => {
    const accepted = await readBoundedFormUrlEncoded(new Request("https://program.example/login", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ key: "secret", returnTo: "/consultant" }),
    }), 256);
    expect(accepted.ok && accepted.value.get("returnTo")).toBe("/consultant");

    await expect(readBoundedFormUrlEncoded(new Request("https://program.example/login", {
      method: "POST",
      headers: { "content-type": "multipart/form-data; boundary=unsafe" },
      body: "--unsafe--",
    }), 256)).resolves.toMatchObject({ ok: false, status: 415 });
  });

  it("fails closed on a short deployed request-limit secret", async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousSecret = process.env.PAC_RATE_LIMIT_SECRET;
    try {
      resetStoreForTests();
      (process.env as Record<string, string>).NODE_ENV = "production";
      process.env.PAC_RATE_LIMIT_SECRET = "too-short";
      await expect(consumeRequestLimit(new NextRequest("https://program.example/api/ask"), {
        scope: "staff-ask",
        limit: 1,
        windowSeconds: 60,
      })).rejects.toThrow(/at least 32 bytes/i);
    } finally {
      if (previousNodeEnv === undefined) delete (process.env as Record<string, string | undefined>).NODE_ENV;
      else (process.env as Record<string, string>).NODE_ENV = previousNodeEnv;
      if (previousSecret === undefined) delete process.env.PAC_RATE_LIMIT_SECRET;
      else process.env.PAC_RATE_LIMIT_SECRET = previousSecret;
    }
  });
});
