# -*- coding: utf-8 -*-
"""Version B: the memorandum in short form. Warm, professional and supported
throughout; offered as a tool in service of Division, Administration and
Department goals, not as something to be approved or declined.

Ordered so that a reader who stops after five minutes has still met the ask.
The four requests and their date sit immediately under the opening, before
anything else: a Division Director reading at skim pace covers perhaps a
thousand words, and the ask used to arrive at word 2,200. Everything after it
exists to support saying yes to it.
"""
import json, pathlib

D = "../diagrams/"  # the figures, relative to build/

memo = {
 "subject": "The One DSD People, Access and Culture Program: what it is, where it stands, and the four things that would help most",
 "sections": [

  {"heading": "", "blocks": [
   {"type": "p", "text": "Let me begin with something I want said plainly. I have witnessed both of you earnestly engaging in equity work in this Division, and in my professional judgment that engagement is genuine. It is the reason I am glad to bring this to you now, at the point where your thinking will make it better."},
   {"type": "p", "text": "The Department has named the destination: **a multicultural, anti-racist organization, in practice and not only in commitment.** I should say what that phrase means in practice rather than leave it to be filled in. Multicultural: that when a decision is made here, more than one cultural perspective is available to the people making it, and the perspective of those the decision affects is among them. Anti-racist: that where a practice turns out to produce worse outcomes for people of color, we are able to see that and change it. This memorandum sets out what has been built to serve that end, where it honestly stands, and the four things that would help most."},
  ]},

  {"heading": "What would help most, by December 1", "blocks": [
   {"type": "p", "text": "**This is not a request for approval.** The Program is offered as a tool in service of the Division's goals, the Administration's six equity goals, and the Department's Equity Policy. What I am asking for is four things that would make it better. I have put them first rather than last so that they are not buried at the end of a long document."},
   {"type": "numbered", "items": [
     "**Your reading, by December 1 if you can manage it** — what is useful, what is thin, what is missing. Nothing more formal than notes in the margin. The date is only because December is when I would like to prepare how we introduce it to staff, before it opens.",
     "**Staff invited to work on this with me.** There is real appetite in the Division; more than once, staff have asked me, unprompted, for resources of exactly this kind. A program of this kind is built best close to the people it is for.",
     "**A line of sight into what is under way** — the Division's OneNote, or a regular note about an area. For awareness, not direction. What I can see, I can build for.",
     "**An inventory of the equity work already happening** across the Division, so nothing is built twice and good work is built around rather than past."
   ]},
   {"type": "p", "text": "The rest of this memorandum is what those four requests rest on. I am glad to take either of you through any part of it, at whatever length is useful, and I would welcome the conversation more than the reading. What you have in front of you, and what you can safely leave:"},
  ]},

  {"heading": "Why it was built", "blocks": [
   {"type": "p", "text": "Leadership asked the question itself. When Maria Pabon finished the all-staff series in 2024, the question in the room was: what do we do now with what we learned? Instruction ends; the work does not. What was missing was the structure that carries learning into practice once the trainer has gone."},
   {"type": "p", "text": "The Division had already said what that structure needed to be. Across 2023 I conducted 71 interviews, and with Sarah Shepherd's project management the inquiry grew into 23 sessions from program staff through directors, concluding that December with 172 findings and 131 recommendations. The finding that organizes everything since: **not a shortage of commitment, but a shortage of infrastructure.** People were doing the work alone, without shared tools or a shared method, and without any way to know whether it changed anything. The Program is the infrastructure that evidence called for."},
  ]},

  {"heading": "What it is", "blocks": [
   {"type": "p", "text": "A place a staff member goes when a real question arises in real work: courses and applied practice material, community briefs on the people this Division serves, job aids, and a way to ask a question and receive a substantiated answer with its sources attached. Nearly all of it can be downloaded, adapted for a unit, or handed to a colleague. For staff, help at the point of need. For supervisors, material ready to use with a team. For you, one place to see what the Division is doing on equity, and a record to point to when the Administration or the Department asks."},
   {"type": "p", "text": "**It holds 179 courses, all of them written for this Program** — among them a 38-module curriculum on intercultural practice, a 13-module curriculum on the Minnesota disability service system, and a series on program integrity — alongside the community briefs, the job aids and the practice material. It is built to meet a person where their responsibility sits, so that a policy analyst, a supervisor and a director each find material written for the work they actually hold rather than someone else's translated into it. None of it is open to staff yet, which is deliberate; the next section sets out what is built, what is not, and what the opening waits on."},
  ]},

  {"heading": "What is built, and what is not", "blocks": [
   {"type": "p", "text": "**Built.** The courses and curriculum, the practice material, the community briefs, the job aids, the downloadable resources. If no further work were done from today, there is enough in hand to operationalize equity with staff and leadership across the Division, and to sustain that for somewhere between one and five years."},
   {"type": "p", "text": "**Not yet built.** A way to show whether any of this changes conditions for people, which is the piece I most want your thinking on; a funded pathway for developing leaders, which needs a decision above my level; and the connection to state law and policy. An equity website, the formal front door for all staff, is still in development."},
   {"type": "p", "text": "**And not yet open.** No member of staff is using it today, and I would not want it opened before it is genuinely ready for them. Leigh Ann — the commitment stands: when it opens, **HCBS runs it first**, for an interval you set, before it goes anywhere else. Other units carry on exactly as they are. On measuring that pilot I should be straight about the limit I named a moment ago: structured observation, and your own read of your unit, are available now; measurement firmer than that is the piece still to be built, and it needs the data office rather than my say-so. My intention is to open across the Division in January 2027, following the November election."},
  ]},

  {"heading": "What the Department has set, and what is yours to decide", "blocks": [
   {"type": "p", "text": "The Department sets the course through its mandate and its Equity Policy, and my intention is to stay in alignment with both, working alongside the Aging and Disability Services Administration as part of the DHS equity ecosystem the Department contemplates. This Program is built to fit that rather than to run alongside it, and to stay alert to whatever Department policy directs next so that the work here does not become disjointed from it."},
   {"type": "figure", "file": D + "diagram-a-how-the-levels-connect.png", "pair": True,
    "caption": "The four levels, and the direction of authority."},
   {"type": "figure", "file": D + "diagram-b-fixed-and-flexible.png", "pair": True,
    "caption": "What is fixed, and what is genuinely open."},
   {"type": "p", "text": "Two things are fixed. **The DHS Equity Policy and the DEIA principles beneath it are non-negotiable.** And the Division is responsible for all six of the Administration's equity goals: Deqa Sayid was clear on that when we met, and equally clear that the Division holds real latitude in how. The Program is built to serve all six for that reason. **Everything else, within those principles, is genuinely open.** How the work divides across the Division, and who holds which piece, is yours to decide. I have drafted a worksheet for it; the owner column is blank because naming owners is yours to do, and I would be glad to work through it with you."},
  ]},

  {"heading": "How the work is done", "blocks": [
   {"type": "p", "text": "This is a guidance instrument. My part is to supply the knowledge, tools and resources so that staff can build equity into work they already own; staff do the work; leadership makes the decisions only leadership can make — who holds which piece, how a unit takes it up, how long a pilot runs. That is how the position was decomposed and agreed in early 2023, and the Equity Policy is explicit that responsibility is shared. Leaders, staff and consultant each carry a part, and the work goes furthest when each part is held."},
   {"type": "p", "text": "Two design choices are worth naming. The Program is offered rather than imposed: **nothing is compulsory, nothing is tracked against a person,** and everything can be reshaped for a unit. And because equity work, done quickly, can land badly on the very people it is meant to serve, it deserves a second set of eyes — mine as much as anyone's."},
   {"type": "p", "text": "Several duties in the agreed decomposition name their counterpart — hiring managers, subject matter experts, contract managers, the data team, FARM. Those parts of the work were designed to be done together, and they go faster and better that way. That is what the four requests come down to: collaboration, in the ordinary sense of the word."},
  ]},

  {"heading": "The destination", "blocks": [
   {"type": "p", "text": "Becoming a multicultural, anti-racist organization is the Department's stated goal, and this Division is entirely capable of reaching it. It is not work any one person does. It is work a division does together, and a division is the smallest unit large enough to do it. Staff, supervisors, managers and leadership each hold a part no one else can hold for them; my part is to ensure no one has to invent theirs from scratch."},
   {"type": "p", "text": "I will say where I stand plainly, because I would rather state it than have it surmised. My professional judgment is that what is here is sound, that it is ready, and that it is a substantial step toward where the Department has said we are going. **It is offered as a tool in service of the Division's goals, the Administration's, and the Department's, and how it is put to use is where your judgment matters most.** What I am asking for, in the end, is the chance to do this with you."},
   {"type": "p", "text": "Everything referred to here — the extended account, the evidence, the plans, the assessments — is in the accompanying file, one click away."},
  ]},
 ],
}

for _sec in memo["sections"]:
    _blocks = []
    for _b in _sec["blocks"]:
        if _b.get("type", "p") in (None, "p") and "\n\n" in _b.get("text", ""):
            for _part in _b["text"].split("\n\n"):
                if _part.strip(): _blocks.append({"type": "p", "text": _part.strip()})
        else:
            _blocks.append(_b)
    _sec["blocks"] = _blocks

out = pathlib.Path(__file__).parent / "final.json"
out.write_text(json.dumps(memo, ensure_ascii=False, indent=1), encoding="utf-8")
print("wrote", out)
