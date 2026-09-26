import { DevelopmentResourceGuide } from "./development-resource-guide";
import Link from "next/link";
import { prepareEditableSurface } from "./editable-surface";
import { getLearningJourney, journeyText, LEARNING_JOURNEY_HREF } from "@/lib/content/learning-journey";
import type { StaffProgramScope } from "@/lib/content/staff-publications";

export async function LearningJourneyLink({scope, resourceId, compact=false}: {scope?:StaffProgramScope;resourceId?:string;compact?:boolean}) {
  if (resourceId) return <DevelopmentResourceGuide scope={scope} resourceId={resourceId} />;
  const surface=await prepareEditableSurface("learn.intercultural",{scope,includeOwner:false});
  if(!surface.available) return null;
  const matches=resourceId ? getLearningJourney(surface.values).filter(stop=>stop.resourceIds.includes(resourceId)) : [];
  if(resourceId&&!matches.length) return null;
  if(compact || resourceId) return <aside className="my-6 border-y border-line py-5">
    <p className="mb-2 font-semibold">{resourceId ? "Connect this learning with your work" : journeyText(surface.values,"previewTitle")}</p>
    <div className="flex flex-wrap gap-x-6 gap-y-3">{matches.length ? matches.map(stop=><Link className="underline" key={stop.id} href={LEARNING_JOURNEY_HREF+"#"+stop.id}>{stop.title}</Link>) : <Link className="underline" href={LEARNING_JOURNEY_HREF}>{journeyText(surface.values,"previewLink")}</Link>}</div>
  </aside>;
  return <aside className="my-6 rounded-xl border border-[#d5c8b4] bg-[#faf7f0] p-6" aria-label="A path through learning">
    <h2 className="text-2xl font-semibold"><Link href={LEARNING_JOURNEY_HREF}>{journeyText(surface.values,"previewTitle")}</Link></h2>
    <p className="mt-3 max-w-3xl leading-7">{journeyText(surface.values,"previewBody")}</p>
    <Link className="mt-2 inline-block font-semibold underline" href={LEARNING_JOURNEY_HREF}>{journeyText(surface.values,"previewLink")} →</Link>
  </aside>;
}

