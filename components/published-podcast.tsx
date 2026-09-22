import { EditableSurfaceRegion, type PreparedEditableSurface } from "./editable-surface";
import { PodcastPlayer } from "./podcast-player";
import type { Podcast } from "@/lib/content/podcasts";
import { stringValue } from "@/lib/content/staff-surface-registry";
import { PODCAST_SUPPLEMENTS } from "@/lib/content/podcast-supplements";

export function PublishedPodcast({ podcast, surface, headingLevel, ownPage }: { podcast: Podcast; surface: PreparedEditableSurface; headingLevel?: 1 | 2 | 3; ownPage?: boolean }) {
  const text = (key: string) => stringValue(surface.values, key);
  const support = PODCAST_SUPPLEMENTS[podcast.id];
  return <EditableSurfaceRegion surface={surface}>
    <PodcastPlayer headingLevel={headingLevel} ownPage={ownPage} id={podcast.id} src={podcast.src} title={text("title")} intro={text("intro")}
      downloadLabel={text("downloadLabel")} retryLabel={text("retryLabel")} errorMessage={text("errorMessage")} {...support} />
  </EditableSurfaceRegion>;
}
