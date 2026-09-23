import "server-only";

export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413 | 415; message: string };

export type FormBodyResult =
  | { ok: true; value: URLSearchParams }
  | { ok: false; status: 400 | 413 | 415; message: string };

async function readBoundedText(
  request: Request,
  maxBytes: number,
  acceptedContentType: string,
): Promise<{ ok: true; value: string } | { ok: false; status: 400 | 413 | 415; message: string }> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (contentType !== acceptedContentType) {
    return { ok: false, status: 415, message: `Send this request as ${acceptedContentType}.` };
  }

  const declared = request.headers.get("content-length");
  if (declared !== null) {
    if (!/^\d+$/.test(declared)) return { ok: false, status: 400, message: "The request size could not be verified." };
    const declaredBytes = Number(declared);
    if (!Number.isSafeInteger(declaredBytes)) return { ok: false, status: 400, message: "The request size could not be verified." };
    if (declaredBytes > maxBytes) return { ok: false, status: 413, message: "That request is too large." };
  }

  const reader = request.body?.getReader();
  if (!reader) return { ok: true, value: "" };
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let receivedBytes = 0;
  let text = "";
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      receivedBytes += next.value.byteLength;
      if (receivedBytes > maxBytes) {
        await reader.cancel("request body exceeds configured byte limit").catch(() => undefined);
        return { ok: false, status: 413, message: "That request is too large." };
      }
      text += decoder.decode(next.value, { stream: true });
    }
    text += decoder.decode();
    return { ok: true, value: text };
  } catch {
    await reader.cancel("request body could not be read").catch(() => undefined);
    return { ok: false, status: 400, message: "We couldn't read that request." };
  } finally {
    reader.releaseLock();
  }
}

/**
 * Read JSON only after cheap content-type and declared-size checks, then enforce
 * the same byte ceiling while streaming the body. Route handlers choose a
 * ceiling that matches their schema instead of buffering an unbounded request.
 */
export async function readBoundedJson(request: Request, maxBytes: number): Promise<JsonBodyResult> {
  const body = await readBoundedText(request, maxBytes, "application/json");
  if (!body.ok) {
    return body.status === 415
      ? { ...body, message: "Send this request as JSON." }
      : body;
  }

  try {
    return { ok: true, value: JSON.parse(body.value) as unknown };
  } catch {
    return { ok: false, status: 400, message: "We couldn't read that request." };
  }
}

export async function readBoundedFormUrlEncoded(request: Request, maxBytes: number): Promise<FormBodyResult> {
  const body = await readBoundedText(request, maxBytes, "application/x-www-form-urlencoded");
  if (!body.ok) return body;
  try {
    return { ok: true, value: new URLSearchParams(body.value) };
  } catch {
    return { ok: false, status: 400, message: "We couldn't read that request." };
  }
}
