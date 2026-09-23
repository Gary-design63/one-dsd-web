import { PlainLanguageComparison } from "@/components/multimedia/plain-language-comparison";
import { DsdDataQualityExample } from "./dsd-data-quality-example";
import { DsdWorkExample, DSD_PROGRAM_EXAMPLES } from "./dsd-work-examples";

export function DsdProgramMedia({ programId }: { programId: string }) {
  if (programId === "data-quality") return <DsdDataQualityExample />;
  if (programId === "communications-training") return <PlainLanguageComparison />;
  const example = DSD_PROGRAM_EXAMPLES[programId];
  return example ? <DsdWorkExample example={example} id="dsd-program-example" /> : null;
}
