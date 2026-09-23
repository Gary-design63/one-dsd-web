import type { Metadata } from "next";
import { WorkAreaDetail } from "@/components/work-area-detail";
import { WORK_AREAS } from "@/lib/product";
import { prepareEditableSurface } from "@/components/editable-surface";
import { areaFieldKey, stringValue } from "@/lib/content/staff-surface-registry";
export const dynamic = "force-dynamic";
export async function generateMetadata({params}:{params:Promise<{areaId:string}>}):Promise<Metadata> {
  const {areaId}=await params;
  const area=WORK_AREAS.find(item=>item.id===areaId);
  if(!area)return {title:"Areas of work"};
  const surface=await prepareEditableSurface("areas.page",{includeOwner:false});
  return {title:stringValue(surface.values,areaFieldKey(area.id,"label"))};
}
export default async function Page({params}:{params:Promise<{areaId:string}>}) {
  return <WorkAreaDetail areaId={(await params).areaId}/>;
}
