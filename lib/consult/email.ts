import "server-only";

import type { ConsultStore } from "./store";

export type DeliveryResult = { attempted: number; sent: number; failed: number; configured: boolean };

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.CONSULT_FROM_EMAIL?.trim());
}

const FONT = "Aptos,'Segoe UI',Calibri,Arial,sans-serif";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buttonLabel(url: string): string {
  if (url.includes("/consult/requests/")) return "Open your request";
  if (url.includes("/consult/team/")) return "Open your private page";
  if (url.includes("/consultant/consult/")) return "Open the request";
  return "Open the link";
}

/**
 * The saved message, dressed in the program's navy, green and white for email programs that
 * show formatting. The plain text is always sent too, so nothing depends on the styling.
 */
export function renderNoticeHtml(subject: string, body: string): string {
  const blocks = body.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const content = blocks.map((block) => {
    if (/^https?:\/\/\S+$/.test(block)) {
      const href = escapeHtml(block);
      return `<p style="margin:24px 0 24px"><a href="${href}" style="display:inline-block;background:#176B65;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:6px">${buttonLabel(block)}</a></p>`;
    }
    return `<p style="margin:0 0 16px">${escapeHtml(block).replace(/\n/g, "<br>")}</p>`;
  }).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>`
    + `<body style="margin:0;padding:0;background:#f7f5f0">`
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0"><tr><td align="center" style="padding:24px 12px">`
    + `<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #d4d9dc">`
    + `<tr><td style="background:#003865;border-bottom:5px solid #78be21;padding:20px 28px;font-family:${FONT};color:#ffffff"><div style="font-size:19px;font-weight:600;line-height:1.3">One DSD People, Access and Culture</div><div style="font-size:14px;line-height:1.5;margin-top:2px">Disability Services Division</div></td></tr>`
    + `<tr><td style="padding:28px 28px 12px;font-family:${FONT};color:#182c3a;font-size:16px;line-height:1.7"><h1 style="margin:0 0 18px;font-size:22px;line-height:1.3;font-weight:600;color:#183247">${escapeHtml(subject)}</h1>${content}</td></tr>`
    + `<tr><td style="background:#f7f5f0;border-top:1px solid #d4d9dc;padding:16px 28px;font-family:${FONT};font-size:13px;line-height:1.6;color:#4c606d">This message is from One DSD Consult. Using it is voluntary, and asking for help is never used to evaluate anyone.</td></tr>`
    + `</table></td></tr></table></body></html>`;
}

/** Send waiting notices through Resend. Without a key, notices stay saved and visible in the consultant dashboard. */
export async function sendWaitingNotices(store: ConsultStore, limit = 25): Promise<DeliveryResult> {
  const configured = emailConfigured();
  const pending = await store.listUnsentNotices(limit);
  if (!configured) return { attempted: 0, sent: 0, failed: 0, configured };
  const key = process.env.RESEND_API_KEY!.trim();
  const from = process.env.CONSULT_FROM_EMAIL!.trim();
  const replyTo = process.env.CONSULT_NOTIFY_EMAIL?.trim();
  let sent = 0;
  let failed = 0;
  for (const notice of pending) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({
          from,
          to: [notice.toEmail],
          subject: notice.subject,
          text: notice.body,
          html: renderNoticeHtml(notice.subject, notice.body),
          ...(replyTo ? { reply_to: replyTo } : {}),
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (response.ok) {
        await store.markNotice(notice.id, { sent: true });
        sent += 1;
      } else {
        await store.markNotice(notice.id, { sent: false, error: `Email service answered ${response.status}` });
        failed += 1;
      }
    } catch (error) {
      await store.markNotice(notice.id, { sent: false, error: error instanceof Error ? error.name : "Send failed" });
      failed += 1;
    }
  }
  return { attempted: pending.length, sent, failed, configured };
}
