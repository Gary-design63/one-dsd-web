import { WORK_AREAS } from "@/lib/product/work-areas";
import { describe, expect, it } from "vitest";
import { normalizeWorkOrigin, withWorkOrigin, workOriginForPath, workAreaStartingPoint } from "@/lib/product/work-origin";
import { normalizeLibraryFilters, libraryHref } from "@/lib/content/work-index";
import { getDomain } from "@/lib/domains";
import { getPath } from "@/lib/content/paths";
import { clarifyPracticePath } from "@/lib/content/practice-path-clarifications";
import { applyGraduationPathValues, getEditableSurfaceDefinition, graduationPathSurfaceId } from "@/lib/content/staff-surface-registry";
describe("work origin continuity",()=>{
  const originArea="fiscal_grants_procurement_contracts";
  const area="leadership-systems";
  const task=getDomain(area)!.tasks.find(task=>task.pathId==="gp-10")!;
  it("connects all nine entry areas to actual preserved tasks and resource packs",()=>{for(const area of WORK_AREAS){const start=workAreaStartingPoint(area.id)!;expect(start.origin.originArea).toBe(area.id);expect(getDomain(start.origin.area)?.tasks).toContainEqual(start.task);expect(start.task.contentIds.length).toBeGreaterThan(0);}expect(workAreaStartingPoint("fiscal_grants_procurement_contracts")?.task.pathId).toBe("gp-10");});
  it("keeps the nine-area origin distinct from the seven-domain filter",()=>{
    const origin=normalizeWorkOrigin({originArea,area,task:task.id});
    expect(origin).toEqual({originArea,area,task:task.id});
    const support=new URL(withWorkOrigin("/support/right-person?matter=procurement_or_contract",origin),"http://local");
    expect(support.searchParams.get("area")).toBe(originArea);expect(support.searchParams.get("domain")).toBe(area);expect(support.searchParams.get("task")).toBe(task.id);
  });
  it("rejects invalid origins, unrelated task IDs and mismatched shared domains",()=>{
    expect(normalizeWorkOrigin({originArea:"constructor",area,task:"wrong"})).toEqual({area});
    expect(normalizeWorkOrigin({originArea:"communications_public_information",area,task:task.id})).toEqual({area,task:task.id});
    expect(normalizeWorkOrigin({area:"https://example.org",task:task.id})).toEqual({});
  });
  it("does not invent a first-match area for a direct domain visit",()=>expect(normalizeWorkOrigin({},area)).toEqual({area}));
  it("carries a valid task into its path and drops an unrelated task",()=>{
    expect(workOriginForPath({originArea,area,task:task.id},"gp-10")).toMatchObject({originArea,area,task:task.id});
    expect(workOriginForPath({originArea,area,task:task.id},"gp-6")).toEqual({originArea});
  });
  it("keeps existing query and anchor values and leaves external links alone",()=>{
    const url=new URL(withWorkOrigin("/library/item?q=equity#steps",{originArea,area,task:task.id}),"http://local");
    expect(url.searchParams.get("q")).toBe("equity");expect(url.hash).toBe("#steps");expect(url.searchParams.get("task")).toBe(task.id);
    expect(withWorkOrigin("https://example.org/guide",{originArea,area})).toBe("https://example.org/guide");
    expect(withWorkOrigin("//example.org/guide",{originArea,area})).toBe("//example.org/guide");
  });
  it("retains coordinated optional facets and origin while removing invalid values",()=>{
    const input={originArea,area,task:task.id,role:"supervisor",topic:"access"};
    const filters=normalizeLibraryFilters(input);expect(filters).toMatchObject(input);
    const url=new URL(libraryHref(filters,"equity"),"http://local");
    for(const [key,value]of Object.entries(input))expect(url.searchParams.get(key)).toBe(value);
    expect(normalizeLibraryFilters({role:"a".repeat(101),topic:"a".repeat(101),freshness:"review_planned"})).toEqual({});
  });
});
describe("GP11 responsibility without identifying people",()=>{
  const original=getPath("gp-11")!;
  it("preserves source material while correcting the staff field and review prompts",()=>{
    expect(original.artifactFields.find(field=>field.id==="transitions")!.help).toContain("A named person for each.");
    const values=getEditableSurfaceDefinition(graduationPathSurfaceId("gp-11"))!.approvedValues;
    const displayed=applyGraduationPathValues(original,values);
    for(const id of ["transitions","involved","owners"]){const field=displayed.artifactFields.find(field=>field.id===id)!;expect(field.label+" "+field.help).toMatch(/role|office/i);expect(field.help).not.toContain("A named person");}
    expect(displayed.rubric.find(rule=>rule.key==="owners")!.failMessage).toBe("Identify the role or office responsible for each follow-up.");
    const shown=clarifyPracticePath(original);expect(displayed.steps).toEqual(shown.steps);expect(displayed.privacy).toBe(shown.privacy);expect(original.privacy).toContain("web browser you are using");
  });
  it("retains an owner's different wording and leaves other source paths untouched",()=>{
    const edited={...original,artifactFields:original.artifactFields.map(field=>field.id==="transitions"?{...field,help:"Use the shared transition office."}:field)};
    expect(clarifyPracticePath(edited).artifactFields.find(field=>field.id==="transitions")!.help).toBe("Use the shared transition office.");
    expect(clarifyPracticePath(getPath("gp-12")!)).toBe(getPath("gp-12"));const gp10=getPath("gp-10")!;expect(gp10.privacy).toContain("web browser you are using");expect(clarifyPracticePath(gp10).privacy).toContain("saved only on this computer");expect(clarifyPracticePath(gp10).artifactFields.map(field=>field.id)).toEqual(gp10.artifactFields.map(field=>field.id));
  });
});
