"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Universal inline editing. Applies saved wording and image changes to every
 * page for every reader, and gives the consultant an "Edit this page" mode in
 * which any visible text can be changed in place and any image replaced.
 */
type Override = { key: string; original: string; text: string };
type ImageOverride = { key: string; mediaId: string; alt: string };
type LoadState = "loading" | "ready" | "failed";
type Dialog = {
  text: string;
  input?: { label: string; value: string };
  confirmLabel: string;
  cancelLabel: string;
};

// Controls (buttons, form labels and legends, <summary>, <option>) and navigation links are not
// editable in place: they are controls, not page wording. The header wordmark and navigation are
// edited through the header's own editor.
const TEXT_TAGS = "p,h1,h2,h3,h4,h5,h6,li,a,span,td,th,dt,dd,figcaption,blockquote,strong,em,small,cite,time,caption";
const BLOCK_CHILD = "p,div,ul,ol,li,table,section,article,header,footer,nav,h1,h2,h3,h4,h5,h6,form,figure,details,blockquote,dl";
const ROOTS = "main, footer";
const LOAD_FAILED = "Saved wording could not be loaded — showing the original page.";

function hash(text: string): string {
  let value = 5381;
  for (let index = 0; index < text.length; index += 1) value = ((value << 5) + value + text.charCodeAt(index)) >>> 0;
  return value.toString(36);
}

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function candidates(): HTMLElement[] {
  const roots = Array.from(document.querySelectorAll<HTMLElement>(ROOTS));
  const found: HTMLElement[] = [];
  const seen = new Set<HTMLElement>();
  for (const root of roots) {
    for (const element of Array.from(root.querySelectorAll<HTMLElement>(TEXT_TAGS))) {
      if (seen.has(element) || element.closest("[data-pac-editor]")) continue;
      if (element.querySelector(BLOCK_CHILD)) continue;
      if (element.closest("[contenteditable]:not([data-pac-editable])")) continue;
      if (element.closest("nav, button, label, legend, summary, select")) continue;
      if (!normalize(element.textContent ?? "")) continue;
      const parent = element.parentElement;
      if (parent && parent.matches(TEXT_TAGS) && !parent.querySelector(BLOCK_CHILD) && parent.closest(ROOTS)) {
        if (/^(span|strong|em|small|cite|time|a)$/i.test(element.tagName) && !/^(li|td|th|dd|dt|p|h[1-6])$/i.test(parent.tagName)) continue;
        if (/^(span|strong|em|small|cite|time)$/i.test(element.tagName)) continue;
      }
      seen.add(element);
      found.push(element);
    }
  }
  return found;
}

/**
 * Put new wording into an element without destroying nested markup (icons, images, emphasis).
 * Plain elements get their text replaced outright; elements with children keep those children and
 * receive the wording in their longest text node.
 */
function setText(element: HTMLElement, text: string) {
  if (!element.firstElementChild) {
    element.textContent = text;
    return;
  }
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node: Node | null = walker.nextNode();
  while (node) {
    textNodes.push(node as Text);
    node = walker.nextNode();
  }
  if (textNodes.length === 0) {
    element.appendChild(document.createTextNode(text));
    return;
  }
  const target = textNodes.reduce((best, current) => (current.data.trim().length > best.data.trim().length ? current : best));
  for (const other of textNodes) if (other !== target && other.data.trim()) other.data = "";
  target.data = text;
}

function keyFor(element: HTMLElement, index: number, original: string): string {
  return `${element.tagName.toLowerCase()}:${index}:${hash(original)}`;
}

/** The element identity part of a saved key (tag and position), without the wording hash. */
function keyPosition(key: string): string {
  const parts = key.split(":");
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : key;
}

/**
 * Match saved wording to page elements. Each saved entry is used at most once, and only for the
 * element it was saved from: the same tag at the same position, currently showing either the
 * original wording or the saved replacement. An entry whose position no longer lines up is used
 * only when its wording appears on exactly one element of that tag, so repeated phrases
 * ("Explore", "Open") are never rewritten wholesale.
 */
function matchOverrides(list: HTMLElement[], overrides: Override[]): Map<HTMLElement, Override> {
  const matches = new Map<HTMLElement, Override>();
  const claimed = new Set<Override>();
  const byPosition = new Map<string, Override[]>();
  for (const item of overrides) {
    const position = keyPosition(item.key);
    byPosition.set(position, [...(byPosition.get(position) ?? []), item]);
  }
  list.forEach((element, position) => {
    const current = normalize(element.textContent ?? "");
    const here = byPosition.get(`${element.tagName.toLowerCase()}:${position}`) ?? [];
    const match = here.find((item) => !claimed.has(item) && (item.key === keyFor(element, position, current) || normalize(item.text) === current));
    if (match) {
      matches.set(element, match);
      claimed.add(match);
    }
  });
  if (claimed.size === overrides.length) return matches;
  const byTagText = new Map<string, HTMLElement[]>();
  for (const element of list) {
    if (matches.has(element)) continue;
    const id = `${element.tagName.toLowerCase()}\n${normalize(element.textContent ?? "")}`;
    byTagText.set(id, [...(byTagText.get(id) ?? []), element]);
  }
  for (const item of overrides) {
    if (claimed.has(item)) continue;
    const tag = item.key.split(":")[0];
    for (const wording of [normalize(item.original), normalize(item.text)]) {
      const found = byTagText.get(`${tag}\n${wording}`);
      if (found && found.length === 1 && !matches.has(found[0])) {
        matches.set(found[0], item);
        claimed.add(item);
        break;
      }
    }
  }
  return matches;
}

function imageCandidates(): HTMLImageElement[] {
  return Array.from(document.querySelectorAll<HTMLImageElement>("header img, main img, footer img")).filter((img) => !img.closest("[data-pac-editor]"));
}

/** A stable name for an image: its original address, before any replacement. */
function imageKey(img: HTMLImageElement): string {
  if (img.dataset.pacImageKey) return img.dataset.pacImageKey;
  let src = img.getAttribute("src") ?? "";
  try {
    const url = new URL(src, window.location.origin);
    if (url.pathname === "/_next/image" && url.searchParams.get("url")) src = url.searchParams.get("url") ?? src;
    else if (url.origin === window.location.origin) src = url.pathname + url.search;
  } catch {
    // keep src as written
  }
  // Tiles often share one stock picture. Name the image by its tile as well, so each can be replaced on its own.
  const holder = img.closest<HTMLElement>("[data-learning-id], [data-hub-resource]");
  const holderId = holder?.dataset.learningId ?? holder?.dataset.hubResource ?? "";
  const key = (holderId ? `${holderId}|` : "") + (src || `img:${hash(img.alt || "")}`);
  img.dataset.pacImageKey = key;
  img.dataset.pacOriginalSrc = img.getAttribute("src") ?? "";
  img.dataset.pacOriginalSrcset = img.getAttribute("srcset") ?? "";
  img.dataset.pacOriginalAlt = img.getAttribute("alt") ?? "";
  return key;
}

function showReplacement(img: HTMLImageElement, mediaId: string, alt: string) {
  img.removeAttribute("srcset");
  img.removeAttribute("sizes");
  img.src = `/api/media/${mediaId}`;
  if (alt) img.alt = alt;
}

function restoreOriginal(img: HTMLImageElement) {
  if (img.dataset.pacOriginalSrc !== undefined) img.setAttribute("src", img.dataset.pacOriginalSrc);
  if (img.dataset.pacOriginalSrcset) img.setAttribute("srcset", img.dataset.pacOriginalSrcset);
  if (img.dataset.pacOriginalAlt !== undefined) img.setAttribute("alt", img.dataset.pacOriginalAlt);
}

/** The server's error wording when a request fails, with a plain fallback for non-JSON responses. */
async function failureText(response: Response, fallback: string): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object" && typeof (body as { error?: unknown }).error === "string" && (body as { error: string }).error) {
      return (body as { error: string }).error;
    }
  } catch {
    // not JSON (for example a gateway error page)
  }
  return `${fallback} (error ${response.status})`;
}

export function UniversalEditor({ owner }: { owner: boolean }) {
  const pathname = usePathname();
  return <PageEditor owner={owner} pathname={pathname} />;
}

function PageEditor({ owner, pathname }: { owner: boolean; pathname: string }) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [hasSaved, setHasSaved] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [dialogValue, setDialogValue] = useState("");
  const [seenPathname, setSeenPathname] = useState(pathname);
  const originals = useRef(new Map<HTMLElement, { key: string; original: string; shown: string; html: string }>());
  const elements = useRef<HTMLElement[]>([]);
  const images = useRef(new Map<string, ImageOverride>());
  const textOverrides = useRef<Override[]>([]);
  const imagesChanged = useRef(false);
  const pendingImage = useRef<HTMLImageElement | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const dialogResolve = useRef<((value: string | null) => void) | null>(null);
  const dialogBox = useRef<HTMLDivElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const historyGuard = useRef(false);
  const skipNextPop = useRef(false);

  // Moving to another page is not a remount: editing state is reset here, visibly, and the
  // saved wording for the new page is loaded by the effect below.
  if (seenPathname !== pathname) {
    setSeenPathname(pathname);
    setLoadState("loading");
    setHasSaved(false);
    setDialog(null);
    if (editing) {
      setEditing(false);
      setMessage("Editing stopped because you moved to another page. Changes that were not saved are gone.");
    } else {
      setMessage("");
    }
  }

  const index = useCallback((overrides: Override[], imageOverrides: ImageOverride[]) => {
    const usable = overrides.filter((item) => normalize(item.text) && normalize(item.original));
    const list = candidates();
    const matches = matchOverrides(list, usable);
    const map = new Map<HTMLElement, { key: string; original: string; shown: string; html: string }>();
    list.forEach((element, position) => {
      const current = normalize(element.textContent ?? "");
      const match = matches.get(element);
      if (match && normalize(match.text) !== current) setText(element, match.text);
      map.set(element, {
        key: match ? match.key : keyFor(element, position, current),
        original: match ? match.original : current,
        shown: normalize(element.textContent ?? ""),
        html: element.innerHTML,
      });
    });
    originals.current = map;
    elements.current = list;
    textOverrides.current = usable;

    const imageMap = new Map(imageOverrides.map((item) => [item.key, item]));
    for (const img of imageCandidates()) {
      const key = imageKey(img);
      const match = imageMap.get(key);
      if (match) showReplacement(img, match.mediaId, match.alt);
      else if (img.dataset.pacReplaced) restoreOriginal(img);
      img.dataset.pacReplaced = match ? "true" : "";
    }
    images.current = imageMap;
    imagesChanged.current = false;
    setHasSaved(usable.length > 0 || imageOverrides.length > 0);
  }, []);

  /** Load the saved changes for this page. A failure or a degraded store is reported, never applied as "nothing saved". */
  const loadOverrides = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`/api/page-text?route=${encodeURIComponent(pathname)}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.json();
      if (!body || body.ok !== true || body.degraded === true) throw new Error("degraded");
      index(Array.isArray(body.entries) ? body.entries : [], Array.isArray(body.images) ? body.images : []);
      setLoadState("ready");
      return true;
    } catch {
      setHasSaved(false);
      setLoadState("failed");
      return false;
    }
  }, [pathname, index]);

  useEffect(() => {
    let cancelled = false;
    // Elements indexed for a previous page are stale once the page changes.
    for (const element of elements.current) {
      element.removeAttribute("contenteditable");
      element.removeAttribute("data-pac-editable");
      element.removeAttribute("spellcheck");
    }
    elements.current = [];
    originals.current = new Map();
    historyGuard.current = false;
    const load = async () => {
      try {
        const response = await fetch(`/api/page-text?route=${encodeURIComponent(pathname)}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const body = await response.json();
        if (!body || body.ok !== true || body.degraded === true) throw new Error("degraded");
        if (cancelled) return;
        index(Array.isArray(body.entries) ? body.entries : [], Array.isArray(body.images) ? body.images : []);
        setLoadState("ready");
      } catch {
        if (cancelled) return;
        setHasSaved(false);
        setLoadState("failed");
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [pathname, index]);

  const retryLoad = () => {
    setLoadState("loading");
    void loadOverrides();
  };

  /** Ask a question in the panel. Resolves with the confirmed value ("ok" or the typed text), or null when dismissed. */
  const ask = (options: Dialog): Promise<string | null> => new Promise((resolve) => {
    dialogResolve.current?.(null);
    dialogResolve.current = resolve;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDialogValue(options.input?.value ?? "");
    setDialog(options);
  });

  const closeDialog = (value: string | null) => {
    const resolve = dialogResolve.current;
    dialogResolve.current = null;
    setDialog(null);
    resolve?.(value);
  };

  useEffect(() => {
    if (dialog) {
      const box = dialogBox.current;
      const target = box?.querySelector<HTMLElement>("input, button");
      target?.focus();
      return;
    }
    const previous = returnFocus.current;
    returnFocus.current = null;
    if (previous && previous.isConnected) previous.focus();
  }, [dialog]);

  const isDirty = () => {
    if (imagesChanged.current) return true;
    for (const [element, info] of originals.current) {
      if (normalize(element.textContent ?? "") !== info.shown) return true;
    }
    return false;
  };

  // While editing, an extra history entry stands in front of the page so that Back can be
  // answered with a question instead of silently discarding the edits.
  const armHistoryGuard = () => {
    if (historyGuard.current) return;
    window.history.pushState({ ...(window.history.state ?? {}), pacEditorGuard: true }, "", window.location.href);
    historyGuard.current = true;
  };

  const disarmHistoryGuard = () => {
    if (!historyGuard.current) return;
    historyGuard.current = false;
    skipNextPop.current = true;
    window.history.back();
  };

  const start = () => {
    // Re-index against the saved changes so earlier edits keep their true originals.
    index(textOverrides.current, Array.from(images.current.values()));
    for (const element of elements.current) {
      element.setAttribute("data-pac-editable", "true");
      element.setAttribute("contenteditable", "true");
      element.setAttribute("spellcheck", "true");
    }
    for (const img of imageCandidates()) img.setAttribute("data-pac-image", "true");
    armHistoryGuard();
    setEditing(true);
    setMessage("Click any text to change it. Click any image to replace it. Links and buttons will not open while you are editing.");
  };

  const stop = () => {
    for (const element of elements.current) {
      element.removeAttribute("contenteditable");
      element.removeAttribute("data-pac-editable");
      element.removeAttribute("spellcheck");
    }
    for (const img of imageCandidates()) img.removeAttribute("data-pac-image");
    imagesChanged.current = false;
    disarmHistoryGuard();
    setEditing(false);
  };

  /** Put every element back to the markup it had when editing began. Untouched elements are left alone. */
  const restoreMarkup = () => {
    for (const [element, info] of originals.current) {
      // This writes to the live DOM node's own innerHTML, not to React state or the ref's
      // Map itself; the lint rule's static analysis cannot tell the two apart here.
      // eslint-disable-next-line react-hooks/immutability
      if (element.innerHTML !== info.html) element.innerHTML = info.html;
    }
  };

  const cancel = () => {
    restoreMarkup();
    stop();
    setMessage("");
    void loadOverrides();
  };

  const currentImages = (): ImageOverride[] => Array.from(images.current.values());

  const save = async () => {
    setBusy(true);
    const entries: Override[] = [];
    let restored = 0;
    for (const [element, info] of originals.current) {
      const text = normalize(element.textContent ?? "");
      if (!text) {
        // A blanked element goes back to its original wording; empty wording is never saved.
        setText(element, info.original);
        restored += 1;
        continue;
      }
      if (text !== normalize(info.original)) entries.push({ key: info.key, original: info.original, text });
    }
    const imageEntries = currentImages();
    try {
      const response = await fetch("/api/page-text", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ route: pathname, entries, images: imageEntries }),
      });
      if (!response.ok) throw new Error(await failureText(response, "The change could not be saved."));
      stop();
      const count = entries.length + imageEntries.length;
      const restoredNote = restored ? ` ${restored} blank ${restored === 1 ? "item was" : "items were"} put back to the original wording.` : "";
      setMessage((count === 0 ? "This page is back to its original wording and images." : `Saved. ${count} change${count === 1 ? "" : "s"} now show for everyone in this view.`) + restoredNote);
      if (!(await loadOverrides())) setMessage((current) => `${current} ${LOAD_FAILED}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The change could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  /** A save never destroys what it replaces — every prior state is archived first. This brings
   * the most recently archived wording back, for when a save (including an accidental empty one)
   * was a mistake rather than an intended change. */
  const restoreLastSave = async () => {
    const answer = await ask({ text: "Bring back the wording this page had before its most recent save?", confirmLabel: "Bring back earlier wording", cancelLabel: "Keep current wording" });
    if (answer === null) return;
    setBusy(true);
    try {
      const response = await fetch("/api/page-text", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ route: pathname }),
      });
      if (!response.ok) throw new Error(await failureText(response, "Earlier wording could not be restored."));
      const body = (await response.json()) as { restored?: number };
      setMessage((body.restored ?? 0) > 0 ? "Earlier wording is back for everyone in this view." : "There was no earlier saved wording to bring back for this page.");
      if (!(await loadOverrides())) setMessage((current) => `${current} ${LOAD_FAILED}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Earlier wording could not be restored.");
    } finally {
      setBusy(false);
    }
  };

  const revertAll = async () => {
    const answer = await ask({ text: "Put this page back to its original wording and images in this view?", confirmLabel: "Revert page", cancelLabel: "Keep changes" });
    if (answer === null) return;
    setBusy(true);
    try {
      const response = await fetch("/api/page-text", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ route: pathname, entries: [], images: [] }),
      });
      if (!response.ok) throw new Error(await failureText(response, "The page could not be reverted."));
      restoreMarkup();
      const saved = new Set(textOverrides.current.map((item) => item.key));
      for (const [element, info] of originals.current) {
        if (saved.has(info.key) && normalize(element.textContent ?? "") !== normalize(info.original)) setText(element, info.original);
      }
      for (const img of imageCandidates()) if (img.dataset.pacReplaced) restoreOriginal(img);
      stop();
      setMessage("This page is back to its original wording and images.");
      if (!(await loadOverrides())) setMessage((current) => `${current} ${LOAD_FAILED}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The page could not be reverted.");
    } finally {
      setBusy(false);
    }
  };

  const chooseFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const img = pendingImage.current;
    event.target.value = "";
    if (!file || !img) return;
    if (file.size > 4 * 1024 * 1024) {
      setMessage("Images can be up to 4 MB. Please choose a smaller file.");
      pendingImage.current = null;
      return;
    }
    const answer = await ask({
      text: "Describe this image in a few words for people using screen readers.",
      input: { label: "Image description", value: img.alt || "" },
      confirmLabel: "Use this description",
      cancelLabel: "Keep the current description",
    });
    const alt = answer ?? img.alt;
    setBusy(true);
    setMessage("Uploading the image…");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", alt);
      const response = await fetch("/api/media", { method: "POST", body: form });
      if (!response.ok) throw new Error(await failureText(response, "The image could not be uploaded."));
      const body = await response.json();
      if (typeof body?.id !== "string" || !body.id) throw new Error("The image could not be uploaded.");
      const key = imageKey(img);
      showReplacement(img, body.id, alt);
      img.dataset.pacReplaced = "true";
      images.current.set(key, { key, mediaId: body.id, alt });
      imagesChanged.current = true;
      setMessage("Image replaced. Press Save changes to keep it.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The image could not be uploaded.");
    } finally {
      setBusy(false);
      pendingImage.current = null;
    }
  };

  useEffect(() => {
    if (!editing) return;
    const block = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-pac-editor]")) return;
      const img = target instanceof HTMLImageElement ? target : target?.querySelector?.("img[data-pac-image]") instanceof HTMLImageElement && target.matches("a, picture, figure") ? (target.querySelector("img[data-pac-image]") as HTMLImageElement) : null;
      if (img && img.dataset.pacImage) {
        event.preventDefault();
        event.stopPropagation();
        pendingImage.current = img;
        fileInput.current?.click();
        return;
      }
      if (target?.closest("a, button, summary, label, input[type=submit]")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    // Enter inside an editable link would insert a line break into the link; keep links on one line.
    const keepLinksSingleLine = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === "Enter" && target?.closest("a[data-pac-editable]")) event.preventDefault();
    };
    document.addEventListener("click", block, true);
    document.addEventListener("keydown", keepLinksSingleLine, true);
    return () => {
      document.removeEventListener("click", block, true);
      document.removeEventListener("keydown", keepLinksSingleLine, true);
    };
  }, [editing]);

  // Unsaved edits: warn before the tab closes or reloads, and ask before Back leaves the page.
  useEffect(() => {
    if (!editing) return;
    const warn = (event: BeforeUnloadEvent) => {
      if (!isDirty()) return;
      event.preventDefault();
    };
    const onPopState = () => {
      if (skipNextPop.current) {
        skipNextPop.current = false;
        return;
      }
      if (!historyGuard.current) return;
      historyGuard.current = false;
      if (!isDirty()) {
        stop();
        window.history.back();
        return;
      }
      void ask({ text: "You have unsaved changes. Leave this page without saving them?", confirmLabel: "Leave page", cancelLabel: "Stay and keep editing" }).then((answer) => {
        if (answer === null) {
          armHistoryGuard();
          return;
        }
        restoreMarkup();
        stop();
        window.history.back();
      });
    };
    window.addEventListener("beforeunload", warn);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("beforeunload", warn);
      window.removeEventListener("popstate", onPopState);
    };
    // The handlers read refs and call stable helpers; re-binding on every render is not needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  if (!owner) return null;

  const loaded = loadState === "ready";

  return (
    <div data-pac-editor="true" style={{ position: "fixed", right: 16, bottom: 16, zIndex: 1000, maxWidth: 360, fontFamily: "inherit" }}>
      <style>{`
        [data-pac-editable] { outline: 2px dashed #1f6f8b; outline-offset: 2px; cursor: text; min-width: 1ch; }
        [data-pac-editable]:focus { outline: 3px solid #123f60; background: #fffbe6; }
        img[data-pac-image] { outline: 3px dashed #b42318; outline-offset: 3px; cursor: pointer; }
      `}</style>
      <input ref={fileInput} type="file" accept="image/*" hidden onChange={(event) => void chooseFile(event)} />
      {loadState === "failed" ? (
        <div role="alert" style={{ background: "#7a271a", color: "#fff", padding: "10px 14px", borderRadius: 10, margin: "0 0 8px", fontSize: 14, lineHeight: 1.4 }}>
          <p style={{ margin: "0 0 8px" }}>{LOAD_FAILED}</p>
          <button type="button" className="btn" onClick={retryLoad} disabled={busy}>Try again</button>
        </div>
      ) : null}
      {message ? <p role="status" style={{ background: "#123f60", color: "#fff", padding: "10px 14px", borderRadius: 10, margin: "0 0 8px", fontSize: 14, lineHeight: 1.4 }}>{message}</p> : null}
      {dialog ? (
        <div
          ref={dialogBox}
          role="dialog"
          aria-labelledby="pac-editor-dialog-text"
          onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); closeDialog(null); } }}
          style={{ background: "#fff", color: "#111", border: "2px solid #123f60", padding: "12px 14px", borderRadius: 10, margin: "0 0 8px", fontSize: 14, lineHeight: 1.4, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
        >
          <p id="pac-editor-dialog-text" style={{ margin: "0 0 8px" }}>{dialog.text}</p>
          {dialog.input ? (
            <label style={{ display: "block", margin: "0 0 8px" }}>
              <span style={{ display: "block", marginBottom: 4 }}>{dialog.input.label}</span>
              <input
                type="text"
                value={dialogValue}
                onChange={(event) => setDialogValue(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); closeDialog(dialogValue); } }}
                maxLength={2000}
                style={{ width: "100%", boxSizing: "border-box", padding: "6px 8px", border: "1px solid #555", borderRadius: 6, fontSize: 14 }}
              />
            </label>
          ) : null}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button type="button" className="btn btn--primary" onClick={() => closeDialog(dialog.input ? dialogValue : "ok")}>{dialog.confirmLabel}</button>
            <button type="button" className="btn" onClick={() => closeDialog(null)}>{dialog.cancelLabel}</button>
          </div>
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
        {editing ? (
          <>
            <button type="button" className="btn btn--primary" onClick={() => void save()} disabled={busy || dialog !== null}>{busy ? "Saving…" : "Save changes"}</button>
            <button type="button" className="btn" onClick={cancel} disabled={busy || dialog !== null}>Cancel</button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn--primary" onClick={start} disabled={!loaded || busy || dialog !== null} aria-disabled={!loaded || undefined}>
              {loadState === "loading" ? "Loading saved wording…" : "Edit this page"}
            </button>
            {loaded && hasSaved ? <button type="button" className="btn" onClick={() => void revertAll()} disabled={busy || dialog !== null}>Revert page</button> : null}
            {loaded ? <button type="button" className="btn" onClick={() => void restoreLastSave()} disabled={busy || dialog !== null}>Bring back earlier wording</button> : null}
          </>
        )}
      </div>
    </div>
  );
}
