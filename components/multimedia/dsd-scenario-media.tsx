import { DsdDataQualityExample } from "./dsd-data-quality-example";
import { DsdPolicyBurdenMap } from "./dsd-policy-burden-map";
import { DsdWorkExample, DSD_SCENARIO_EXAMPLES } from "./dsd-work-examples";
import { DsdAccessibleFormDemo, DsdServiceRouteExplorer } from "./dsd-access-demonstrations";
import { DsdFirstContactAudio } from "./dsd-first-contact-audio";

export function DsdScenarioMedia({ scenarioId }: { scenarioId: string }) {
  if (scenarioId === "dsd-small-group-data") return <DsdDataQualityExample privacyFocus />;
  if (scenarioId === "dsd-policy-change") return <DsdPolicyBurdenMap />;
  const example = DSD_SCENARIO_EXAMPLES[scenarioId];
  return example ? <><DsdWorkExample example={example} id="dsd-scenario-example" />{scenarioId === "dsd-accessible-form" && <DsdAccessibleFormDemo />}{scenarioId === "dsd-service-redesign" && <DsdServiceRouteExplorer />}{scenarioId === "dsd-interpreter-first-contact" && <DsdFirstContactAudio />}</> : null;
}
