"use client";

/**
 * Browser-storage state for My View continuity (STAFF-06). Local-first, user-visible,
 * deletable. Implemented with useSyncExternalStore so server render and first client
 * render agree (no effects, no hydration mismatch).
 */
import { useCallback, useSyncExternalStore } from "react";
import { isPrivateBrowserStorageKey } from "@/lib/client/storage-keys";

export type Area = "local" | "session";

const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; value: unknown }>();
const unsaved = new Map<string, unknown>();
const failures = new Map<string, string>();
let storageNotice = "";

function recordWriteResult(key: string, ok: boolean, deleting: boolean) {
  if (ok) failures.delete(key);
  else failures.set(key, deleting
    ? "This browser could not delete saved information. It may still be on this device. Please try again."
    : "This browser could not save your latest changes. Keep this page open and copy any notes or request access keys you need before leaving.");
  storageNotice = [...new Set(failures.values())].join(" ");
}

export function useStorageNotice(): string {
  return useSyncExternalStore(subscribe, () => storageNotice, () => "");
}

function area(a: Area): Storage | null {
  try {
    return a === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function read<T>(a: Area, key: string, fallback: T): T {
  const cacheKey = `${a}:${key}`;
  if (unsaved.has(cacheKey)) return unsaved.get(cacheKey) as T;
  let raw: string | null = null;
  try {
    raw = area(a)?.getItem(key) ?? null;
  } catch {
    raw = null;
  }
  const hit = cache.get(cacheKey);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  cache.set(cacheKey, { raw, value });
  return value;
}

export function writeStored(a: Area, key: string, value: unknown | null): boolean {
  const cacheKey = `${a}:${key}`;
  const deleting = value === null || value === undefined;
  try {
    const s = area(a);
    if (!s) throw new Error("Browser storage is unavailable.");
    if (deleting) s.removeItem(key);
    else s.setItem(key, JSON.stringify(value));
    unsaved.delete(cacheKey);
    recordWriteResult(cacheKey, true, deleting);
  } catch {
    // Preserve a newly received answer or draft in memory, but never claim it
    // survived on the device. Failed deletion must not hide the stored record.
    if (!deleting) unsaved.set(cacheKey, value);
    recordWriteResult(cacheKey, false, deleting);
    emit();
    return false;
  }
  emit();
  return true;
}

export function readStored<T>(a: Area, key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  return read(a, key, fallback);
}

/** Subscribe to one stored value. `fallback` should be a module-level constant. */
export function useStored<T>(a: Area, key: string, fallback: T): [T, (value: T | null) => boolean] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(a, key, fallback),
    () => fallback,
  );
  const set = useCallback((v: T | null) => writeStored(a, key, v), [a, key]);
  return [value, set];
}

/** True after hydration; false during server render and the first client render. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

const allCache: { raw: string; value: Record<string, unknown> } = { raw: "\u0000", value: {} };
const EMPTY: Record<string, unknown> = {};

/** Snapshot of registered private keys in local and session storage (for My View). */
export function useStoredAll(): Record<string, unknown> {
  return useSyncExternalStore(
    subscribe,
    () => {
      const parts: string[] = [];
      const out: Record<string, unknown> = {};
      for (const a of ["local", "session"] as Area[]) {
        const s = area(a);
        if (!s) continue;
        try {
          for (let i = 0; i < s.length; i++) {
            const k = s.key(i);
            if (!k || !isPrivateBrowserStorageKey(a, k)) continue;
            const raw = s.getItem(k);
            parts.push(`${a}:${k}=${raw}`);
            try {
              out[`${a}:${k}`] = raw ? JSON.parse(raw) : null;
            } catch {
              out[`${a}:${k}`] = null;
            }
          }
        } catch {
          // A temporary read failure must not crash My Work or replace its
          // last readable records with a misleading empty inventory.
          return allCache.value;
        }
      }
      const raw = parts.sort().join("\n");
      if (raw === allCache.raw) return allCache.value;
      allCache.raw = raw;
      allCache.value = out;
      return out;
    },
    () => EMPTY,
  );
}

export function newId(prefix: string): string {
  const value = globalThis.crypto?.randomUUID?.();
  if (!value) throw new Error("Secure browser randomness is unavailable.");
  return `${prefix}-${value}`;
}
