export type DevelopmentEntry = {
  id: string;
  title: string;
  invitation: string;
  teaching: string[];
  objectives: string[];
  example: string;
  steps: { title: string; body: string; href: string; link: string }[];
};
export const DEVELOPMENT_ENTRIES: DevelopmentEntry[] = [
  {
    id: "exploring", title: "I want to explore leadership",
    invitation: "Your own curiosity is enough to begin. Explore what leadership could mean for you, with or without a future management role.",
    teaching: [
      "Leadership can begin in how you listen, explain a decision, or make room for another person's contribution. Through a DEIA lens, the question is also whose experience informs the work and who can access the opportunity to shape it.",
      "You may already bring relevant experience from community work, professional practice, caregiving, or collaboration. Connect that experience with a specific capability and test it in a manageable situation. Feedback helps you see both your contribution and what you want to develop next."
    ],
    objectives: ["Separate an observation from an assumption about another person.", "Invite perspectives through more than one way of participating.", "Explain a recommendation with evidence and revise it after feedback."],
    example: "Map a confusing onboarding handoff in DSD. Ask what information colleagues needed, draft a clearer welcome map, and invite someone new to review it.",
    steps: [
      {title:"Find your context",body:"See how your experience connects with the wider program and the people around your work.",href:"/orientation",link:"Explore program orientation"},
      {title:"Choose one contribution",body:"Begin with a welcome, a conversation, or a process you can help make clearer.",href:"/one-dsd/leadership?stage=onboard#life-cycle",link:"Explore welcoming and orientation"},
      {title:"Learn with someone",body:"Bring a question to a Learning Lab or find a peer conversation that helps you reflect.",href:"/one-dsd/team/learning-lab",link:"Visit the Learning Lab"}
    ]
  },
  {
    id:"encouraged",title:"Someone has encouraged me",
    invitation:"An invitation can open a possibility. You decide whether it fits your interests and what you would like to explore.",
    teaching:[
      "Being encouraged can help you recognize a strength you had not named. It is also a chance to ask what the person noticed: which contribution, capability, or example led to the invitation? Specific feedback is more useful than an unexplained label of potential.",
      "A meaningful opportunity includes preparation, time, access, and feedback. A mentor can help you think; a sponsor can help you access work where you can develop. Agree on support before the opportunity becomes another responsibility, and keep space to change direction."
    ],
    objectives:["Describe your own development interest and the evidence behind the invitation.","Agree on a manageable opportunity with time, access, and feedback.","Practice a DEIA skill and explain what you learned from the experience."],
    example:"Co-facilitate a DSD Learning Lab on access to development opportunities. Offer spoken and written ways to contribute, then revise an invitation using what participants tell you.",
    steps:[
      {title:"Make the invitation useful",body:"Ask what the person noticed, what opportunity they have in mind, and what support they can offer.",href:"/one-dsd/amplify/mentoring",link:"Prepare a mentoring conversation"},
      {title:"Practice with support",body:"Choose a specific skill to develop and agree how you will receive feedback.",href:"/one-dsd/leadership?stage=develop#life-cycle",link:"Explore development and sponsorship"},
      {title:"Keep opportunity open",body:"Notice how others can express interest and what would make the same opportunity accessible to them.",href:"/resources/pn-accessible-leadership-pathways",link:"Explore accessible pathways"}
    ]
  },
  {
    id:"practicing",title:"I want to strengthen my leadership",
    invitation:"Bring a decision, a recurring challenge, or a skill you want to refresh. Use your experience as a starting point for deeper DEIA practice.",
    teaching:[
      "Experience can make decisions quicker, while familiar patterns can make some assumptions harder to notice. Revisit the criteria behind a recurring decision: what counts as a strong contribution, who receives visible work, and whose perspective changes the options?",
      "When responsibilities broaden, the equity question broadens too. A supervisor may improve a team's practice; a manager or director may need to align opportunities, resources, and expectations across teams. Both benefit from evidence of what people actually experience after a change.",
      "Leadership growth includes your own relationship to cultural difference, not only the decisions you make about others. Staff and DHS as an organization sit somewhere on a continuum from treating sameness as fairness toward genuinely valuing, adapting to, and integrating real difference. Naming honestly where you and your team actually are is leadership work, not a detour from it."
    ],
    objectives:["Examine a recurring decision against explicit, relevant criteria.","Identify whose access or contribution may be overlooked.","Try a supported process change and compare intended with experienced effects.","Use the learning to improve development opportunities or continuity."],
    example:"Review how DSD cross-team assignments are offered. Make the capabilities and available support clear, try an open invitation, and ask who could actually participate and what made it possible.",
    steps:[
      {title:"Choose a decision to examine",body:"Look at hiring, feedback, assignments, recognition, or development through the employee life cycle.",href:"/one-dsd/leadership?stage=everyday#life-cycle",link:"Explore everyday contribution"},
      {title:"Learn across perspectives",body:"Invite specific feedback on the practice and the working conditions around it.",href:"/one-dsd/leadership?stage=retain#life-cycle",link:"Explore listening and retention"},
      {title:"Prepare for broader responsibility",body:"Connect actual role requirements with evidence, supported practice, and knowledge transfer.",href:"/one-dsd/leadership?stage=advance#life-cycle",link:"Explore advancement and readiness"}
    ]
  }
];
export const DEVELOPMENT_CAPABILITIES = [
 {id:"evidence",title:"Examine assumptions and use evidence",practice:"Review a practice example and separate observations, interpretations, and job-related evidence.",feedback:"Which conclusion is supported, and which needs more information?",evidence:"An explanation revised after considering evidence or another perspective."},
 {id:"communication",title:"Communicate and facilitate across difference",practice:"Facilitate a conversation with several ways to contribute and check what people understood.",feedback:"Whose perspective influenced the discussion, and what would make participation easier?",evidence:"A revised meeting or communication approach informed by participants."},
 {id:"access",title:"Build inclusion and accessibility into work",practice:"Examine a handoff, meeting, or development opportunity for avoidable access barriers.",feedback:"What helped you participate, and where did you have to work around the process?",evidence:"A changed process and feedback about whether it became more usable."},
 {id:"opportunity",title:"Develop and sponsor others equitably",practice:"Make one learning or stretch opportunity visible, with clear criteria and support.",feedback:"Who could express interest and take part, and what support was missing?",evidence:"An opportunity plan revised to make participation more accessible."},
 {id:"decisions",title:"Connect equity with workforce decisions",practice:"Prepare options for a workforce issue, including affected perspectives, tradeoffs, and a way to learn from the decision.",feedback:"Which perspective or consequence is missing from these options?",evidence:"A decision brief that explains evidence, tradeoffs, and follow-through."},
 {id:"continuity",title:"Share knowledge and build future capability",practice:"Document a critical handoff and invite a colleague to try it with supported preparation.",feedback:"What knowledge remained implicit, and what would help someone else carry the work?",evidence:"A tested handover and a development opportunity connected to the capability gap."},
 {id:"self-examination",title:"Examine your own cultural default",practice:"Notice one moment this month where you treated your own norm as neutral or universal, in a meeting, a decision, or a piece of feedback.",feedback:"Whose norm was actually being applied, and who had to adapt to it without being asked?",evidence:"A specific example of your own default named honestly, not a general statement about valuing diversity."}
] as const;
export const DEVELOPMENT_MAP_FIELDS = [
 {key:"goal",label:"What would you like to develop?",required:true},
 {key:"experience",label:"What experience or feedback are you starting with?",required:false},
 {key:"practice",label:"What opportunity will help you practice?",required:true},
 {key:"support",label:"What time, access, mentoring, or sponsorship would help?",required:false},
 {key:"feedback",label:"Whose feedback would be useful, and what will you ask?",required:false},
 {key:"evidence",label:"What would show useful growth?",required:true},
 {key:"return",label:"When or after what event will you return to this?",required:false}
] as const;
export type DevelopmentMapValues = Partial<Record<typeof DEVELOPMENT_MAP_FIELDS[number]["key"] | "happened" | "learned" | "next",string>>;
export function buildDevelopmentMap(entryId:string, capabilityId:string, values:DevelopmentMapValues){
 const entry=DEVELOPMENT_ENTRIES.find(e=>e.id===entryId);
 const capability=DEVELOPMENT_CAPABILITIES.find(c=>c.id===capabilityId);
 if(!entry||!capability||DEVELOPMENT_MAP_FIELDS.some(f=>f.required&&!values[f.key]?.trim()))return null;
 const reflection=values.happened?.trim()||values.learned?.trim()||values.next?.trim();
 return `My DSD leadership development map

Starting point
${entry.title}

DEIA capability
${capability.title}

${DEVELOPMENT_MAP_FIELDS.map(f=>`${f.label}
${values[f.key]?.trim()||"To explore and agree."}`).join("\n\n")}${reflection?`

Returning to the experience

What happened?
${values.happened?.trim()||"Not yet recorded."}

What changed in my understanding?
${values.learned?.trim()||"Still reflecting."}

What will I keep, change, or try next?
${values.next?.trim()||"To consider after feedback."}`:""}

This is a development plan. Opportunities, support, and next steps are proposals until agreed with the people involved.`;
}
