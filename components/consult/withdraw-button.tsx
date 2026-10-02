"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import consult from "@/components/consult/consult.module.css";

export function WithdrawButton({ token }: { token: string }) {
  const router = useRouter();
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function withdraw() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/consult/requests/${encodeURIComponent(token)}/withdraw`, { method: "POST" });
      const body = await response.json().catch(() => ({}));
      if (response.ok) {
        router.refresh();
      } else {
        setMessage(body.message ?? "Your request could not be withdrawn just now. Please try again in a moment.");
        setAsking(false);
      }
    } catch {
      setMessage("Your request could not be withdrawn just now. Please check your connection and try again.");
      setAsking(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={consult.withdrawBox}>
      <h3>No longer need help?</h3>
      {asking ? (
        <>
          <p>Withdrawing closes your request, and nothing more will happen unless you send a new one. Would you like to go ahead?</p>
          <div className={consult.row}>
            <button type="button" className="btn btn--primary" disabled={busy} onClick={() => void withdraw()}>{busy ? "Withdrawing…" : "Yes, withdraw my request"}</button>
            <button type="button" className="btn btn--light" disabled={busy} onClick={() => setAsking(false)}>Keep my request</button>
          </div>
        </>
      ) : (
        <>
          <p>You can withdraw your request at any time.</p>
          <button type="button" className="btn btn--light" onClick={() => setAsking(true)}>Withdraw this request</button>
        </>
      )}
      {message ? <p role="status" className="mt-3 mb-0">{message}</p> : null}
    </div>
  );
}
