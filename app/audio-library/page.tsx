import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { countAudioLibraryEntries, listAudioLibraryShelves } from "@/lib/content/audio-library";
import { AudioLibraryPlayer } from "./audio-library-player";

export const metadata: Metadata = { title: "Audio library" };
// The list is read from the files on disk for every request, so it always matches what is served.
export const dynamic = "force-dynamic";

export default function AudioLibraryPage() {
  const shelves = listAudioLibraryShelves();
  const count = countAudioLibraryEntries(shelves);
  return (
    <>
      <PageIntro
        kicker="Learning and resources"
        title="Audio library"
        lede="Every recording available here, in one place. Play a recording, move through it, or download it to listen later. The complete spoken text is included wherever it is available."
      >
        <p className="mt-3 text-sm">{count === 1 ? "1 recording" : `${count} recordings`}</p>
      </PageIntro>
      <div className="wrap max-w-5xl py-10">
        {count > 0 ? <AudioLibraryPlayer shelves={shelves} /> : <p>No recordings are available right now.</p>}
      </div>
    </>
  );
}
