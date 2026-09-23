import { TOOLKIT_CARDS, TOOLKIT_INSIGHT_CHROME, TOOLKIT_STEPS, TOOLKIT_WHY } from "@/lib/content/toolkit-studio";
import type { StaffProgramScope } from "@/lib/content/staff-publications";
import { bullets, callout, compactSections, numbered, paragraph, section, type ResourceDocument } from "../model";
import { kicker, programName } from "./shared";

export function toolkitStudioDocument(id: string, scope: StaffProgramScope): ResourceDocument | null {
  const attribution = programName(scope);
  const kick = kicker(scope, "Toolkit Studio");
  if (id === "insights-checklist") {
    return {
      kicker: kick,
      title: "Toolkit Studio insights checklist",
      subtitle: "What the toolkit is for — naming systems and disparity risk, not labeling people.",
      meta: [{ label: "Use", value: "Browse and download only. Fill this in offline." }],
      sections: compactSections([
        section("Insight vs checkbox", [
          paragraph("Insight = design change, involvement path, honest gap, or owner + revisit date. “We considered equity” is a checkbox."),
          bullets([...TOOLKIT_INSIGHT_CHROME]),
        ]),
        section("Official eight steps", [numbered(TOOLKIT_STEPS.map((step) => `${step.title}`))]),
        section("Scan-first", [paragraph(TOOLKIT_WHY.beats.find((beat) => beat.title === "Scan-first")!.body)]),
      ]),
      attribution,
    };
  }
  if (id === "one-pager") {
    return {
      kicker: kick,
      title: "Equity Analysis Toolkit — official eight steps and scan",
      subtitle: TOOLKIT_WHY.authority,
      meta: [],
      sections: compactSections([
        section("Before the eight steps", [paragraph("Name the work, owner, lock date, and whether this is a scan or a full analysis. Do not number this as Step 1.")]),
        section("Official steps", [
          numbered(TOOLKIT_STEPS.map((step) => step.title)),
          callout("Formal doors are a callout, not Step 8. Alignment is Step 7. Sustainability is Step 8."),
        ]),
        section("Equity scan", [paragraph("Use a scan when time is short — still written, still honest. File the enterprise toolkit on the official path.")]),
      ]),
      attribution,
    };
  }
  if (id === "blank-worksheet") {
    return {
      kicker: kick,
      title: "Toolkit Studio blank worksheet",
      subtitle: "Offline fields mapped to the official eight steps. Do not send this form to the program.",
      meta: [],
      sections: compactSections([
        section("Before the eight steps", [bullets(["Work name", "Owner", "Lock date", "Scan or full analysis"])]),
        section(
          "Steps 1–8",
          TOOLKIT_STEPS.map((step) => paragraph([{ text: `${step.number}. ${step.title}`, bold: true }, { text: " — write the walked answer offline." }])),
        ),
        section("Formal doors checked", [bullets(["Language access", "Disability communication access", "Equity Director / committee", "Tribal / Office of Indian Policy if Nation-impacted", "Equal Opportunity and Access if triggered", "Labor relations if required"])]),
        section("Sources", [paragraph("Label each source Official / Guidance / Outside source.")]),
      ]),
      attribution,
    };
  }
  if (id === "guardrails") {
    return {
      kicker: kick,
      title: "Toolkit Studio guardrails",
      subtitle: "Cross-cultural guardrails for walked decisions.",
      meta: [],
      sections: compactSections([
        section("Name the process", [bullets([...TOOLKIT_INSIGHT_CHROME])]),
        section("Featured work moments", [bullets(TOOLKIT_CARDS.map((card) => `${card.title}: ${card.downloadBlurb}`))]),
        section("Do not", [bullets(["Explain people by culture.", "Treat briefs as individual instructions.", "Replace Formal doors with Step 8.", "Submit typed notes to this program."])]),
      ]),
      attribution,
    };
  }
  return null;
}
