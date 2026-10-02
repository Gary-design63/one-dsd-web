"use client";

import Link from "next/link";
import styles from "@/components/workspace-presentation.module.css";
import { useProgramContext } from "@/components/program-context";
import { ROUTES } from "@/lib/constants";
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
      <h2 id="dsd-consult-title" className="text-xl font-extrabold">Ask the consultant</h2>
      <p>For help applying equity to your work, ask the consultant through One DSD Consult. You will hear back within two business days, and you can see where your request stands at any time. Using it is voluntary. You can also browse published answers, the Library, and Find the right person.</p>
      <div className="flex flex-wrap gap-3 mt-4">
        <Link href={ROUTES.consult.href} className="btn btn--primary">Open One DSD Consult</Link>
        <Link href="/ask" className="btn btn--light">Browse common questions</Link>
        <Link href="/support/right-person" className="btn btn--light">Find the right person</Link>
      </div>
    </section>
  );
}

function textValue(values: EditableSurfaceValues, key: string): string {
  return typeof values[key] === "string" ? values[key] as string : "";
}
