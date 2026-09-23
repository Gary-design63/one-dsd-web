"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
/** Retain old /areas#area bookmarks while each area gains its own readable page. */
export function AreaBookmarkRedirect({areaIds}:{areaIds:string[]}) {
  const router=useRouter();
  useEffect(()=>{
    const followBookmark=()=>{const id=window.location.hash.slice(1);if(areaIds.includes(id))router.replace("/areas/work/"+encodeURIComponent(id));};
    followBookmark(); window.addEventListener("hashchange",followBookmark);
    return ()=>window.removeEventListener("hashchange",followBookmark);
  },[areaIds,router]);
  return null;
}
