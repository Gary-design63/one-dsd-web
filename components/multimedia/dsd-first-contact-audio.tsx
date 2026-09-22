"use client";
import { useState } from "react";

const clips = [
  { file: "first-contact-dead-end", title: "When support comes after the barrier", transcript: "Fictional example. An English-only voicemail says: Leave your name, phone number, and the reason for calling. We will call you back. The caller cannot understand this message. Language support is offered only after a return call. The first contact has already become a barrier." },
  { file: "first-contact-supported", title: "Connect support with the first contact", transcript: "Fictional example. A tested first-contact route helps the caller request their language and reach a staff member with qualified interpretation. No translated greeting is performed in this recording. In the supported conversation, the worker explains: I will keep responsibility for the next step. Let us confirm the language support you requested and the best way to contact you. What should we clarify before we continue? The intake owner checks that the route, staffing, and follow-up actually work." },
];

function Clip({ file, title, transcript }: typeof clips[number]) {
  const [failed, setFailed] = useState(false);
  return <figure className="m-0 rounded-xl border border-slate-300 bg-white p-5"><figcaption className="font-semibold">{title}</figcaption>
    <audio controls preload="none" aria-label={title} className="my-4 w-full" onError={() => setFailed(true)}><source src={"/audio/learning-examples/" + file + ".wav"} type="audio/wav" />Read the complete transcript below.</audio>
    {failed && <p role="status">This recording could not be played. The complete transcript is available below.</p>}
    <details><summary className="cursor-pointer font-semibold">Read the complete transcript</summary><p className="mt-3 leading-7">{transcript}</p></details>
  </figure>;
}

export function DsdFirstContactAudio() {
  return <section aria-labelledby="first-contact-listening-title" className="my-6 rounded-xl border border-slate-300 bg-[#f5f8fa] p-5"><h3 id="first-contact-listening-title" className="text-xl font-semibold">Listen for where the route breaks down</h3>
    <p className="my-4 leading-7">Two fictional examples, narrated with a synthetic voice. Both describe language-access arrangements in English; neither performs translation or interpretation.</p>
    <div className="grid gap-5 md:grid-cols-2">{clips.map(clip => <Clip key={clip.file} {...clip} />)}</div>
    <p className="mt-4 leading-7">Which arrangement must exist before a caller can use the first contact? Identify who would verify it and own the follow-up.</p>
  </section>;
}
