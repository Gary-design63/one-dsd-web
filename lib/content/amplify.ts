import { AMPLIFY_EXTENDED_PAGES } from "./amplify-experiences";
import { defineEditableSurface, type EditableSurfaceFieldDefinition, type EditableSurfaceValues } from "./editable-surface-contract";

export const AMPLIFY_PAGES = [
  ...AMPLIFY_EXTENDED_PAGES,
  {
    id: "materials",
    title: "Make it your own",
    intro: "Starting points for a welcome, a conversation, and staying in touch. Adapt them to the people gathering with you.",
    sections: [
      ["An invitation", "You are welcome to join an Amplify Equity conversation. We will explore [topic] on [date and time], at [joining details]. Come to share, listen, or ask a question. Participation is voluntary, and no preparation is needed. Contact [co-lead] with questions or to discuss what would help you participate."],
      ["A simple opening", "Welcome. There is room to speak, listen, or pass. Please speak from your own experience and leave room for others. We can question ideas without making assumptions about one another. Please keep names and private stories about other people out of the conversation. Today we are exploring [question]."],
      ["A 45-minute conversation", ["First 5 minutes: welcome, ways to participate, and the opening question.", "Next 10 minutes: a quiet reflection, short reading, or everyday example. No personal disclosure is required.", "Next 20 minutes: explore what people notice and what they wonder about. Leave room for different interpretations.", "Last 10 minutes: share a takeaway and decide together whether anything needs follow-up. Ending with connection alone is welcome."]],
      ["A question to carry forward", ["The question we agreed to share: [wording].", "Why it matters for work, access, or people's experience: [brief explanation without identifying details].", "What we are asking for: [information, consideration, or a response].", "Where it is going and who has agreed to receive it: [person or group].", "Who will bring back an update, and when: [co-lead and agreed date].", "What we have permission to share: [agreed boundaries]."]],
      ["An update to the group", "Last time, we agreed to share [question]. [Person or group] has [responded / agreed to consider it / not yet responded]. What we know so far is [update]. The next agreed step is [step, if any]. We will check back [time]. There is no new assignment for participants unless someone chooses to help."],
      ["An optional check-in", ["What felt worthwhile?", "Was there a way to participate that suited you?", "What would you change or explore next?", "Is there something you would prefer to raise privately through an appropriate workplace contact?"]],
      ["Passing the lead", ["What participants want to continue or change.", "Upcoming arrangements that have actually been confirmed.", "Shared materials and where to find them.", "Questions awaiting a response, their agreed recipients, and the next check-in.", "What would make the role manageable for the next co-lead.", "Leave out participant profiles, private disclosures, and judgments about people's views."]],
      ["Before sharing an invitation", "Replace the bracketed details with confirmed information. Choose a contact and joining location that are appropriate for the group. The invitation does not need a long explanation of equity or a promise of outcomes; a clear welcome and an honest description are enough."],
    ],
  },
  {
    "id": "home",
    "title": "Amplify Equity",
    "intro": "Connect with colleagues, explore something new, or bring an idea that could make everyday work better. Find what interests you and take part in a way that fits.",
    "sections": [
      [
        "Come as you are",
        "You do not need an equity title or prior experience to take part. Bring a question, an idea, or simply your attention. Conversation, cultural celebration, and learning from one another all belong here."
      ],
      [
        "Room for different conversations",
        "Some gatherings begin with a workplace question. Others grow from a reading, a shared interest, or a cultural observance. Staff shape the conversation. There is no required sequence and no expectation that every gathering produces an assignment."
      ],
      [
        "What is on your mind?",
        [
          "What helps you feel heard at work?",
          "What would you like colleagues from another team to understand?",
          "What makes it easier to ask a question or try something unfamiliar?",
          "What is something worth celebrating or learning about together?"
        ]
      ],
      [
        "Staff led and connected",
        "One or two co-leads organize Amplify with staff input. Their connection with the One DSD Team provides a way to share agreed questions and bring back updates. Amplify remains a voluntary engagement space; the One DSD Team has a separate role in the division’s equity work."
      ],
      [
        "A conversation can be enough",
        "Sometimes connection is the outcome. Sometimes a conversation leads to a useful resource or a question that deserves attention elsewhere. Participants and co-leads can agree on what, if anything, to carry forward."
      ],
      [
        "Support when it would help",
        "Facilitation ideas and practical resources are available here. The Equity and Inclusion Operations Consultant can be invited to weigh in on a question or offer specialized support."
      ],
      [
        "Gatherings",
        "Dates and participation details will appear here when arrangements are confirmed."
      ]
    ]
  },
  {
    "id": "gatherings",
    "title": "Ideas for gathering",
    "intro": "Choose a starting point that fits the people and the moment. Leave room for the conversation to take its own shape.",
    "sections": [
      [
        "Open conversation",
        "Begin with a question people can answer from their own experience. Allow a quiet moment before inviting responses. People may speak, listen, or pass."
      ],
      [
        "Explore together",
        "A short reading, a video, or a question can open a conversation. Let people know the topic in advance. No one needs to have completed the reading to belong in the discussion."
      ],
      [
        "Connect and celebrate",
        "A shared interest, cultural observance, creative activity, or story can bring colleagues together. Invite contributions without expecting someone to represent a community or provide personal history."
      ],
      [
        "Ways of working together",
        [
          "What helps you think before you respond?",
          "When is written feedback more useful than a conversation?",
          "What makes a meeting easier to participate in?",
          "What might we change so more people can contribute?"
        ]
      ],
      [
        "Everyday access",
        "Consider a familiar meeting, message, or form. What makes it easy to use? What might someone experience differently? Discuss an example without including private information about a colleague or a person receiving services."
      ],
      [
        "Intent and experience",
        "Think about a practice that was meant to help but worked differently for someone else. What can we learn from both the intention and the experience? There is room to examine a practice without assuming someone’s motives."
      ],
      [
        "At the close",
        [
          "Keep it as a conversation, with no follow-up needed.",
          "Choose a resource or another discussion to explore together.",
          "Agree on a question the co-leads can carry forward."
        ]
      ]
    ]
  },
  {
    "id": "co-leads",
    "title": "For co-leads",
    "intro": "A little preparation gives people room to participate. You do not have to be the expert on every topic.",
    "sections": [
      [
        "Share the lead",
        "One or two co-leads organize the group with staff input. Share preparation, invite help, and make stepping back possible. The connection with the One DSD Team supports communication; it does not make co-leads responsible for solving every issue."
      ],
      [
        "Before a gathering",
        [
          "Choose a topic with participants rather than preparing a full lesson.",
          "Share the time, joining details, and an optional opening question.",
          "Consider access needs and offer more than one way to contribute.",
          "Agree who will welcome people and help the conversation stay respectful."
        ]
      ],
      [
        "Make room",
        "Invite different perspectives without requiring personal disclosure. Allow people to listen, pass, or step away. No one is expected to speak for an entire community. Questions and disagreement can belong alongside care for one another."
      ],
      [
        "When a conversation becomes difficult",
        "Pause if people are being targeted or the conversation needs care. Name the specific concern without judging a person’s character. Give people room to clarify or repair. Seek additional support when needed; hosting does not make you an investigator."
      ],
      [
        "Different perspectives",
        "A framework can help people notice something, and it can also be questioned. Ask what practice is being discussed, what supports an interpretation, and what other explanation deserves consideration. Agreement with a particular framework is not a condition of participation."
      ],
      [
        "Carry forward by agreement",
        "Ask whether participants want a question shared beyond the gathering. Agree on the wording and destination. Share only what is needed, without identifiable personal stories. A concern does not have to affect a majority to deserve attention."
      ],
      [
        "Close the loop",
        "Bring back an update when a question has been carried forward, including when a response is still pending. The appropriate person or group takes responsibility for any further work. Raising a concern does not make a participant responsible for resolving it."
      ],
      [
        "Care with information",
        "Do not promise absolute confidentiality. Avoid recording or transcribing gatherings as a routine practice. Explain any relevant limits before sensitive discussion. Keep identifiable workplace concerns and personal assessment results out of shared materials."
      ],
      [
        "Keep the group worthwhile",
        "Occasionally ask what people want more of, what feels unnecessary, and what would make participation easier. Change the format when it no longer fits. Attendance and agreement are not measures of someone’s commitment to equity."
      ],
      [
        "Support without dependence",
        "Use the program’s resources and colleagues’ expertise. Invite the Equity and Inclusion Operations Consultant when a particular question needs that support. Routine planning and hosting remain with the co-leads."
      ]
    ]
  }
] as const;

export const AMPLIFY_SURFACES = AMPLIFY_PAGES.map((page) => {
  const values: EditableSurfaceValues = {
    title: page.title, intro: page.intro, backLabel: "One DSD",
    navigation: [
      { label: "Amplify Equity", href: "/one-dsd/amplify" },
      { label: "Ideas for gathering", href: "/one-dsd/amplify/gatherings" },
      { label: "Mentoring and peers", href: "/one-dsd/amplify/mentoring" },
      { label: "Well-being", href: "/one-dsd/amplify/well-being" },
      { label: "Ideas into practice", href: "/one-dsd/amplify/ideas" },
      { label: "For co-leads", href: "/one-dsd/amplify/co-leads" },
      { label: "Make it your own", href: "/one-dsd/amplify/materials" },
    ],
    resourcesTitle: "Useful companions",
    resources: [
      { label: "Open the Amplify space", href: "https://teams.live.com/l/community/FAAzQ3B2126KM9zcQ" },
      { label: "Facilitation and learning together", href: "/learn?theme=facilitation" },
      { label: "Workplace culture and well-being", href: "/learn?theme=culture" },
      { label: "Intercultural practice", href: "/learn?theme=intercultural" },
    ],
  };
  const fields: EditableSurfaceFieldDefinition[] = [
    ...["title", "intro", "backLabel", "resourcesTitle"].map((key) => ({ key, label: key, kind: "long" as const, required: true, maxLength: 2000 })),
    { key: "navigation", label: "Page links", kind: "link-list", required: true },
    { key: "resources", label: "Related resources", kind: "link-list" },
  ];
  page.sections.forEach(([heading, body], index) => {
    const titleKey = `section${index}Title`, bodyKey = `section${index}Body`;
    values[titleKey] = heading;
    values[bodyKey] = typeof body === "string" ? body : [...body];
    fields.push({ key: titleKey, label: heading, kind: "short", required: true, maxLength: 200 });
    fields.push({ key: bodyKey, label: `${heading}: text`, kind: typeof body === "string" ? "long" : "string-list", required: true, maxLength: 4000, maxItems: 30 });
  });
  return defineEditableSurface({ surfaceId: `amplify.${page.id}`, route: page.id === "home" ? "/one-dsd/amplify" : `/one-dsd/amplify/${page.id}`, scopePolicy: "dsd", label: page.title, fields, approvedValues: values });
});
