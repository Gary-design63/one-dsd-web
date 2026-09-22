"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DEFAULT_PRODUCT_CONTEXT,
  PRODUCT_CONTEXT_COOKIE,
  PRODUCT_CONTEXTS,
  resolveProductContext,
  type ProductContextId,
} from "@/lib/product/federation";
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import type { EditableSurfaceValues } from "@/lib/content/editable-surface-contract";
import { useStorageNotice } from "@/lib/client/storage";

const CONTEXT_CHANGE_EVENT = "one-dhs-pac-context-change";

type ProgramContextValue = {
  context: ProductContextId;
  chooseContext: (context: ProductContextId) => void;
  copy: EditableSurfaceValues;
  copyAvailable: boolean;
};

const ProgramContext = createContext<ProgramContextValue | null>(null);

function subscribeToContext(onChange: () => void): () => void {
  window.addEventListener(CONTEXT_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener(CONTEXT_CHANGE_EVENT, onChange);
  };
}

/** Query parameter a shared link can carry to select the view (mirrors lib/product/request-context.ts). */
const CONTEXT_QUERY = "view";

function parseContextView(value: string | null): ProductContextId | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase().replace(/-/g, "_");
  if (normalized === "one_dsd" || normalized === "dsd") return "one_dsd";
  if (normalized === "one_dhs" || normalized === "dhs") return "one_dhs";
  return undefined;
}

function readContextPreference(): ProductContextId {
  try {
    const cookieValue = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${PRODUCT_CONTEXT_COOKIE}=`))
      ?.slice(PRODUCT_CONTEXT_COOKIE.length + 1);
    return resolveProductContext(cookieValue);
  } catch {
    return DEFAULT_PRODUCT_CONTEXT;
  }
}

export function ProgramContextProvider({
  children,
  initialContext = DEFAULT_PRODUCT_CONTEXT,
  copy,
  copyAvailable,
}: {
  children: React.ReactNode;
  initialContext?: ProductContextId;
  copy: EditableSurfaceValues;
  copyAvailable: boolean;
}) {
  const router = useRouter();
  const storageNotice = useStorageNotice();
  const context = useSyncExternalStore(
    subscribeToContext,
    readContextPreference,
    () => initialContext,
  );
  const chooseContext = useCallback((next: ProductContextId) => {
    const resolved = resolveProductContext(next);
    try {
      document.cookie = `${PRODUCT_CONTEXT_COOKIE}=${resolved}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {
      // The preference is optional; the page remains on the server-confirmed default.
    }
    window.dispatchEvent(new Event(CONTEXT_CHANGE_EVENT));
    router.refresh();
  }, [router]);

  // A shared link can carry `?view=one_dsd` (or `one_dhs`). Honor it once on arrival: store the
  // preference, drop the parameter from the address bar, and re-render with the chosen view.
  useEffect(() => {
    let requested: ProductContextId | undefined;
    let url: URL | undefined;
    try {
      url = new URL(window.location.href);
      requested = parseContextView(url.searchParams.get(CONTEXT_QUERY));
    } catch {
      return;
    }
    if (!requested || !url) return;
    url.searchParams.delete(CONTEXT_QUERY);
    try {
      window.history.replaceState(window.history.state, "", url.toString());
    } catch {
      // Leaving the parameter in place is harmless; the view is still applied below.
    }
    if (requested !== readContextPreference()) chooseContext(requested);
  }, [chooseContext]);

  const value = useMemo<ProgramContextValue>(() => ({
    context,
    chooseContext,
    copy,
    copyAvailable,
  }), [chooseContext, context, copy, copyAvailable]);

  return <ProgramContext.Provider value={value}>
    {storageNotice ? <div role="alert" className="wrap my-3 border border-line p-4">{storageNotice}</div> : null}
    {children}
  </ProgramContext.Provider>;
}

export function useProgramContext(): ProgramContextValue {
  const value = useContext(ProgramContext);
  if (!value) throw new Error("Program context must be used within its provider.");
  return value;
}

export function ContextSwitcher() {
  const { context, chooseContext, copy, copyAvailable } = useProgramContext();
  if (!copyAvailable) return null;
  const contextDescription = context === "one_dsd"
    ? textValue(copy, "oneDsdDescription")
    : textValue(copy, "oneDhsDescription");

  return (
    <div className="context-switcher">
      <span className="context-switcher__label">{textValue(copy, "switcherLabel")}</span>
      <div className="context-switcher__choices" role="group" aria-label={textValue(copy, "switcherAriaLabel")}>
        {PRODUCT_CONTEXTS.map((option) => (
          // Each choice is a real link carrying `?view=` so the address can be copied or followed
          // without scripting; with scripting the choice is applied in place instead.
          <a
            key={option.id}
            href={`?${CONTEXT_QUERY}=${option.id}`}
            className={option.id === context ? "context-switcher__button context-switcher__button--active" : "context-switcher__button"}
            aria-current={option.id === context ? "true" : undefined}
            style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
            onClick={(event) => {
              if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
              event.preventDefault();
              chooseContext(option.id);
            }}
            title={option.id === "one_dsd" ? textValue(copy, "oneDsdDescription") : textValue(copy, "oneDhsDescription")}
          >
            {option.id === "one_dsd" ? textValue(copy, "oneDsdLabel") : textValue(copy, "oneDhsLabel")}
          </a>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">
        {contextDescription} {textValue(copy, "choiceAccessNote")}
      </span>
    </div>
  );
}

export function ProgramContextNote() {
  const { context, copy, copyAvailable } = useProgramContext();
  if (!copyAvailable) return null;
  const label = context === "one_dsd" ? textValue(copy, "oneDsdLabel") : textValue(copy, "oneDhsLabel");
  const description = context === "one_dsd" ? textValue(copy, "oneDsdDescription") : textValue(copy, "oneDhsDescription");

  return (
    <aside className="scope-note" aria-label="Current program view">
      <details>
        <summary>{label}</summary>
        <p>{description} {context === "one_dsd" ? textValue(copy, "oneDsdViewNote") : textValue(copy, "oneDhsViewNote")}</p>
      </details>
      {context === "one_dhs" ? <Link href="/one-dsd">{textValue(copy, "oneDhsLinkLabel")}</Link> : <Link href="/one-dsd">{textValue(copy, "oneDsdLinkLabel")}</Link>}
    </aside>
  );
}

export function OneDsdContextPanel() {
  const { context, chooseContext, copy, copyAvailable } = useProgramContext();
  if (!copyAvailable) return null;

  if (context === "one_dsd") {
    return (
      <div className="notice" role="status">
        <strong>One DSD view is active. </strong>
        {textValue(copy, "oneDsdActiveNote")}
      </div>
    );
  }

  return (
    <div className="panel">
      <p className="kicker">{textValue(copy, "optionalViewKicker")}</p>
      <h2 className="text-xl font-extrabold">{textValue(copy, "optionalViewTitle")}</h2>
      <p>
        {textValue(copy, "optionalViewBody")}
      </p>
      <button type="button" className="btn btn--primary" onClick={() => chooseContext("one_dsd")}>
        {textValue(copy, "optionalViewButton")}
      </button>
    </div>
  );
}

function textValue(values: EditableSurfaceValues, key: string): string {
  return typeof values[key] === "string" ? values[key] as string : "";
}
