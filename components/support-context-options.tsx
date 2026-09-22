"use client";

import Link from "next/link";
import styles from "@/components/workspace-presentation.module.css";
import { useProgramContext } from "@/components/program-context";
import type { EditableSurfaceValues } from "@/lib/content/editable-surface-contract";

export function SupportContextOptions({ copy }: { intakeEnabled?: boolean; copy: EditableSurfaceValues }) {
  const { context } = useProgramContext();

  if (context !== "one_dsd") {
    return (
      <section className={styles.supportOption} aria-labelledby="consult-boundary-title">
        <p className="kicker">{textValue(copy, "oneDhsKicker")}</p>
        <h2 id="consult-boundary-title" className="text-xl font-extrabold">{textValue(copy, "oneDhsTitle")}</h2>
        <p>{textValue(copy, "oneDhsBody")}</p>
        <Link href="/support/right-person" className="btn btn--primary">{textValue(copy, "oneDhsLink")}</Link>
      </section>
    );
  }

  return (
    <section className={styles.supportOption} aria-labelledby="dsd-consult-title">
      <p className="kicker">{textValue(copy, "oneDsdKicker")}</p>
      <h2 id="dsd-consult-title" className="text-xl font-extrabold">Browse published DSD material</h2>
      <p>Staff consultation request forms are closed. Use published answers, the Library, and Find the right person. Typed consultant tools stay on authenticated consultant surfaces.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/ask" className="btn btn--secondary">Browse common questions</Link>
        <Link href="/support/right-person" className="btn btn--light">Find the right person</Link>
      </div>
    </section>
  );
}

function textValue(values: EditableSurfaceValues, key: string): string {
  return typeof values[key] === "string" ? values[key] as string : "";
}
