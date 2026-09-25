import { getPath } from "@/lib/content/paths";
import { getPublishedStaffContent, type StaffProgramScope } from "@/lib/content/staff-publications";
import { AUTHORITY, CONTENT_TYPE_LABEL, LAYER_LABEL } from "@/lib/content/types";
import { bullets, callout, compactSections, paragraph, section, type ResourceDocument } from "../model";
import { kicker, linkList, programName } from "./shared";

export async function libraryDocument(id: string, scope: StaffProgramScope): Promise<ResourceDocument | null> {
  const item = await getPublishedStaffContent(id, { scope });
  if (!item || item.status !== "approved") return null;
  const paths = (item.pathIds ?? []).map((pathId) => getPath(pathId)).filter((path) => path !== undefined);
  const isList = item.type === "checklist" || item.type === "question_bank";
  const authority = AUTHORITY[item.authority];

  return {
    kicker: kicker(scope, `${CONTENT_TYPE_LABEL[item.type]} · ${LAYER_LABEL[item.layer]}`),
    title: item.title,
    subtitle: item.summary,
    meta: [
      { label: "Prepared by", value: item.owner },
      { label: "Standing", value: authority.label },
      { label: "For", value: item.scope === "dsd" ? programName("dsd") : programName("one-dhs") },
    ],
    sections: compactSections([
      section(undefined, [
        item.whyItMatters ? callout(item.whyItMatters, "Why it matters") : null,
        item.authority === "external_verify"
          ? callout(
              item.href
                ? `${authority.staffNote} Source: ${item.sourceName ?? "source website"} — ${item.href}`
                : `${authority.staffNote} The original lives on the DHS intranet; open it there before relying on it.`,
              "Outside source",
            )
          : null,
      ]),
      section("Content", isList ? [bullets(item.body, true)] : item.body.map((text) => paragraph(text))),
      section("Next steps", [linkList(item.nextActions)]),
      section("Practice paths this supports", [paths.length ? bullets(paths.map((path) => path.title)) : null]),
      section("Where this fits", [
        paragraph(`${authority.staffNote} Tags: ${item.tags.join(", ")}.`),
      ]),
    ]),
    sources: item.href ? [{ title: item.sourceName ?? item.title, href: item.href, note: "The original source for this resource." }] : undefined,
    attribution: programName(scope),
  };
}
