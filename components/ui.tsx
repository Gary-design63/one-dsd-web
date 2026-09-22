import Link from "next/link";
import { cloneElement, isValidElement } from "react";
import { AUTHORITY, type AuthorityLabel } from "@/lib/content/types";

export function PageIntro({ kicker, title, lede, children }: { kicker?: string; title: string; lede?: string; children?: React.ReactNode }) {
  return (
    <section className="page-intro">
      <div className="wrap py-10">
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h1 className="text-3xl font-extrabold md:text-4xl">{title}</h1>
        {lede ? <p className="mt-3 max-w-3xl text-lg">{lede}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function AuthorityPill({ authority }: { authority: AuthorityLabel }) {
  return (
    <span className={`label-pill ${authority === "under_review" || authority === "external_verify" ? "label-pill--draft" : "label-pill--authority"}`} title={AUTHORITY[authority].staffNote}>
      {AUTHORITY[authority].label}
      <span className="sr-only">. {AUTHORITY[authority].staffNote}</span>
    </span>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn" | "stop"; children: React.ReactNode }) {
  return (
    <div className={`notice ${tone === "warn" ? "notice--warn" : tone === "stop" ? "notice--stop" : ""}`} role={tone === "stop" ? "alert" : "note"}>
      {children}
    </div>
  );
}

export function ActionList({ actions, heading = "Next steps" }: { actions: Array<{ label: string; href: string }>; heading?: string }) {
  if (!actions.length) return null;
  return (
    <div>
      <h3 className="text-lg font-bold">{heading}</h3>
      <ul className="mt-2 list-disc pl-6">
        {actions.map((a) => (
          <li key={a.href + a.label}>
            <Link href={a.href}>{a.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Field({ id, label, help, error, children }: { id: string; label: string; help?: string; error?: string; children: React.ReactNode }) {
  type ControlProps = {
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "true" | "false";
  };
  const describedBy = [
    isValidElement<ControlProps>(children) ? children.props["aria-describedby"] : undefined,
    help ? `${id}-help` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ");
  const control = isValidElement<ControlProps>(children)
    ? cloneElement(children, {
        "aria-describedby": describedBy || undefined,
        "aria-invalid": error ? true : children.props["aria-invalid"],
      })
    : children;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {help ? (
        <p className="help m-0" id={`${id}-help`}>
          {help}
        </p>
      ) : null}
      {control}
      {error ? (
        <p className="error m-0" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
