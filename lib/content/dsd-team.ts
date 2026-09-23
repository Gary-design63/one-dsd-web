import { defineEditableSurface } from "./editable-surface-contract";

export const TEAM_SECTIONS = [
  ["Different experience, shared work", "The One DSD Team brings colleagues' knowledge of policy, programs, eligibility, and everyday operations into the division's equity work. Members work with the Equity and Inclusion Operations Consultant to identify barriers, examine practices, and develop useful improvements."],
  ["Begin with a real question", "Choose a decision or practice that matters to staff or people receiving services. Describe what happens now, who experiences it differently, and what the team needs to understand. Use an example without private or identifying information."],
  ["Contribute where your experience helps", "Members can explain a process, review a resource, question an assumption, try an improvement, or connect the work with colleagues who need to be involved. Agree on a manageable contribution rather than expecting every member to do every task."],
  ["Learn, examine, try, and return", "Use relevant learning and evidence to examine the question. Develop a small improvement with the responsible people, agree what would indicate progress, and return to what happened. Keep useful changes and revise what did not work. A meeting is part of the work, not its final result."],
  ["Know who can decide", "The team develops advice and practical contributions. The person responsible for a policy, budget, service, or staffing decision retains that authority. Agree who will receive a recommendation and who can authorize a trial before promising a change."],
  ["Meetings and open hours", "A monthly rhythm is planned from January 2027, once the program is ready, alternating practical team work with Learning Labs or open hours. The consultant or members can bring a topic. Participation is voluntary, with room to listen, ask questions, and explore more deeply when helpful. Confirmed arrangements belong in the team's collaboration space."],
  ["Stay connected with Amplify Equity", "Amplify offers voluntary conversation, connection, and shared learning. Its co-leads can bring forward questions participants agree to share and return updates. The One DSD Team considers the work that needs further attention without directing Amplify's everyday conversations."],
  ["Make resources fit the work", "When reviewing a resource, ask whose work it supports, which task it helps with, what is missing, and whether the example reflects practice. A policy analyst, a supervisor, and an eligibility worker may need different ways into the same subject."],
  ["A useful work note", "Record the question, the practice being examined, relevant evidence, the proposed improvement, and the person responsible for the next decision. Include the next agreed check-in and what changed. Keep personal disclosures and individual case details out of shared notes."],
  ["Keep the work manageable", "Choose a small number of shared priorities. Make room to decline or renegotiate a contribution. Periodically ask whether the work is useful, whose perspective is missing, and what support members need. Preserve unfinished questions when membership or responsibilities change."],
] as const;

export const DSD_TEAM_SURFACE = defineEditableSurface({
  surfaceId: "dsd-team.home", route: "/one-dsd/team", scopePolicy: "dsd", label: "One DSD Team",
  fields: [
    ...["title", "intro", "backLabel", "linksTitle"].map(key => ({ key, label: key, kind: "long" as const, required: true })),
    { key: "links", label: "Related work", kind: "link-list", required: true },
    ...TEAM_SECTIONS.flatMap(([heading], i) => [
      { key: `heading${i}`, label: heading, kind: "short" as const, required: true },
      { key: `body${i}`, label: `${heading}: text`, kind: "long" as const, required: true },
    ]),
  ],
  approvedValues: {
    title: "One DSD Team", intro: "Colleagues working together to make equity part of everyday decisions, programs, and services.", backLabel: "One DSD", linksTitle: "Connected work",
    links: [{ label: "Open the team space", href: "https://teams.live.com/l/community/FAAZGnsBn1D-N8ExQ" }, { label: "Learning for your work", href: "/my-work/explore" }, { label: "Learning and resources", href: "/learn" }, { label: "Amplify Equity", href: "/one-dsd/amplify" }, { label: "Practical tools", href: "/practice" }],
    ...Object.fromEntries(TEAM_SECTIONS.flatMap(([heading, body], i) => [[`heading${i}`, heading], [`body${i}`, body]])),
  },
});
