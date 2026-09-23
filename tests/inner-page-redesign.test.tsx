import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { renderToReadableStream } from "react-dom/server";
import { WORK_AREAS } from "@/lib/product/work-areas";
import { WORK_AREA_PHOTOS } from "@/lib/product/work-area-presentation";
import { WORK_AREA_DOMAINS } from "@/lib/domains/surfaces";
import { getEditableSurfaceDefinition, areaFieldKey, stringListValue, stringValue } from "@/lib/content/staff-surface-registry";
import { RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import { courseContentItem } from "@/lib/content/courses/published";

vi.mock("next/navigation", () => ({useRouter:()=>({replace:vi.fn()}),notFound:()=>{throw new Error("not found");}}));
vi.mock("@/components/program-context", () => ({ProgramContextNote:()=>null}));
vi.mock("@/lib/product/request-context", () => ({requestedContentScope:async()=>"one-dhs",requestedProductContext:async()=>"one_dhs"}));
import AreasPage from "@/app/areas/page";
import { WorkAreaDetail } from "@/components/work-area-detail";

async function html(node: React.ReactNode) {const stream=await renderToReadableStream(node);await stream.allReady;return new Response(stream).text();}
describe("Nine focused work areas",()=>{
  it("offers nine distinct pages and unique local photographs from a concise overview",async()=>{
    const markup=await html(await AreasPage());
    expect(WORK_AREAS).toHaveLength(9);
    expect(new Set(Object.values(WORK_AREA_PHOTOS).map(photo=>photo.src)).size).toBe(9);
    const photoHashes=Object.values(WORK_AREA_PHOTOS).map(photo=>createHash("sha256").update(readFileSync(path.join(process.cwd(),"public",photo.src))).digest("hex"));
    expect(new Set(photoHashes).size).toBe(9);
    const toolkitHash=createHash("sha256").update(readFileSync(path.join(process.cwd(),"public/images/covers/equity-analysis-toolkit.jpg"))).digest("hex");
    expect(photoHashes).not.toContain(toolkitHash);
    for(const area of WORK_AREAS){
      expect(markup).toContain(`href="/areas/work/${area.id}"`);
      expect(WORK_AREA_PHOTOS[area.id].alt.length).toBeGreaterThan(20);
      expect(existsSync(path.join(process.cwd(),"public",WORK_AREA_PHOTOS[area.id].src))).toBe(true);
    }
    expect(markup).not.toContain("Work this area can support");
  });
  for(const area of WORK_AREAS) it(`preserves purpose, tasks and onward navigation: ${area.id}`,async()=>{
    const markup=await html(await WorkAreaDetail({areaId:area.id}));
    const values=getEditableSurfaceDefinition("areas.page")!.approvedValues;
    const escape=(s:string)=>s.replaceAll("&","&amp;").replaceAll("'","&#x27;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;");
    expect(markup).toContain(escape(stringValue(values,areaFieldKey(area.id,"summary"))));
    for(const task of stringListValue(values,areaFieldKey(area.id,"tasks")))expect(markup).toContain(escape(task));
    for(const domain of WORK_AREA_DOMAINS[area.id])expect(markup).toContain(`/areas/${domain}?`);
    expect(markup).toContain('href="/areas"');
    for(const key of ["askLabel","libraryLabel","practiceLabel","supportLabel"])expect(markup).toContain(escape(stringValue(values,key)));
    expect(markup.match(/Work this area can support/g)).toHaveLength(1);
  });
  it("preserves legacy area bookmarks without changing existing domain routes",()=>{
    const redirect=readFileSync(path.join(process.cwd(),"components/area-bookmark-redirect.tsx"),"utf8");
    expect(redirect).toContain('window.location.hash');
    expect(redirect).toContain('areaIds.includes(id)');
    expect(existsSync(path.join(process.cwd(),"app/areas/[id]/page.tsx"))).toBe(true);
  });
  it("keeps complete text available to search while allowing lightweight catalog cards",()=>{
    const pack=RECOVERED_COURSES[0];
    const complete=courseContentItem(pack);
    const card=courseContentItem(pack,{includeLessonBody:false});
    expect(complete.body).toHaveLength(pack.course.lessons.length);
    expect(complete.body.join(" ").length).toBeGreaterThan(1000);
    expect({...card,body:complete.body}).toEqual(complete);
  });
});
