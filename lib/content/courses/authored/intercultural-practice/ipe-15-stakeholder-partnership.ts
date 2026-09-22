import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Public-service practice · Module 15: Equitable stakeholder partnership.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-15-stakeholder-partnership",
    indexNumber: 1157,
    seriesLabel: "Intercultural Practice and Equity · Public-service practice",
    title: "Equitable Stakeholder Partnership",
    subtitle: "Consultation is not partnership. Four lessons on who is already at the table, what reciprocity actually costs, when partners are brought in, and how to map the relationships behind one real decision.",
    scope: "For internal DHS and DSD staff who convene, fund, support or depend on relationships outside the division: communications and training staff; contracts, fiscal, grants and procurement staff; administrative and support staff; policy, program and quality staff; data and engagement staff; and the supervisors and managers who set the terms. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, scenarios, sorting and flashcard practice, private reflection prompts, and a stakeholder-engagement map you can copy into your own work",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/stock-people-12.jpg",
    coverAlt: "Two colleagues exchange a printed handout at an outdoor community event.",
    introTranscript: "State agencies use the word partnership for almost every outside relationship they have, which means the word has stopped carrying much information. This module takes it apart. It looks at the five depths a relationship can have and how to name the one you actually hold; at what participation costs the person participating, and what reciprocity puts back on our side of the exchange; at the timing and authority that decide whether an invitation can change anything; and it ends with a stakeholder-engagement map you fill in for one real decision. Nothing here is scored, ranked or collected, and the reflection prompts are yours alone.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Tell the difference between informing, consulting, involving, collaborating and sharing a decision, and name which one a specific relationship in your own work actually is.",
        "Identify who is already in a program's stakeholder relationships, who is missing, and which absences are patterned rather than accidental.",
        "Plan the reciprocity a partnership requires — lead time, usable information, compensation, role clarity and a report-back — and name whose budget carries each line.",
        "State plainly what is open, what is constrained and what is already fixed before inviting partners into a decision, and match the depth of the invitation to the authority actually on offer.",
        "Complete a stakeholder-engagement map for one real decision, naming the depth, the owner, the cost and the next review point for every relationship in it.",
      ],
      evidence: [
        "Four worked scenarios drawn from program reporting, engagement budgeting, policy drafting and project planning, each with a recommended response and the reasoning behind it.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice that separates the depth of a relationship from its label, and what is genuinely open in a decision from what is already fixed.",
        "A completed stakeholder-engagement map for one real decision, kept with the project file rather than in a personal folder.",
      ],
      appliedNextStep: "Choose one decision you are working on now. Fill in the stakeholder-engagement map, start with the line for who is missing, name an owner and a review point for every relationship, and ask contracts or fiscal colleagues about the payment route before the first invitation goes out.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in DHS or DSD direction on community engagement, advisory body structure or stakeholder consultation",
        "A change in Minnesota grant and contract policy affecting how community advisors and partner organizations are compensated",
        "Feedback from paid community advisors, self-advocates or partner organizations that the practices described here do not match how the work actually goes",
      ],
      relatedDoor: "Formal decisions about an advisory body's charter, a grant or contract award, a payment to a community partner, or a required public comment process belong to the responsible DHS engagement, grants, contracting and legal offices; this module prepares the plan, it does not approve or fund it.",
      toolkitQuestion: "Whose expertise is missing from this decision, and what would have to change for them to shape it before it is nearly finished?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-15-1",
        number: 1,
        title: "Who is at the table, and on what terms",
        summary: "Five depths a relationship can have, why one word covers all of them in state government, and what a stakeholder list actually proves.",
        minutes: 11,
        learning: {
          objective: "Tell the difference between informing, consulting, involving, collaborating and sharing a decision, and name which one a specific relationship in your own work actually is.",
          takeaways: [
            "Relationships sit at different depths. Informing tells people what was decided. Consulting asks for reactions to something already shaped. Involving works with people through the decision. Collaborating shares the shaping. Sharing the decision shares the authority. All five are legitimate; calling one of them by the name of another is not.",
            "The word partnership is doing an enormous amount of work in state government. It is worth checking, relationship by relationship, whether what we hold is a partnership or a mailing list.",
            "Who is at the table is usually the result of accumulated convenience: the organizations that already had staff to send, already knew the abbreviations, and were already in our contacts. That is not the same as who is affected.",
            "Presence is not partnership. A seat on an advisory group proves nothing about whether the person could prepare, contribute in a way that worked for them, influence anything, or hear afterward what happened.",
          ],
          evidence: "A scenario about a program that lists twenty-two partners and hears from four, sorting practice that separates the depth of a relationship from its label, and a knowledge check on what a stakeholder list can and cannot show.",
          appliedNextStep: "Take one stakeholder list you work from and mark each relationship with its honest depth: informed, consulted, involved, collaborating or sharing the decision. Then mark the word we use for it in writing, and see where the two disagree.",
        },
        scenario: {
          context: "A DSD program area keeps a stakeholder list of twenty-two organizations. Everyone on it receives the quarterly update and every notice of a comment period. Four organizations respond regularly, and the same three people speak at every listening session. The program's annual summary describes it as having strong community partnerships across the state.",
          prompt: "A new supervisor asks whether that description is accurate. What is the most useful answer?",
          options: [
            {
              label: "It is accurate. Twenty-two organizations receive everything the program sends, and the comment process is open to every one of them.",
              response: "A distribution list is an informing relationship. It records who receives our material, not who can shape anything. Counting recipients and calling the result partnership is how a program stops noticing that eighteen of the twenty-two never answer.",
            },
            {
              label: "It is not yet accurate. Most of the twenty-two are being informed and four are being consulted. Before the description changes, the program needs to know why the other eighteen do not answer, and what depth it is actually willing to offer.",
              response: "This separates the label from the relationship, and it asks the more useful question. Silence from eighteen organizations is information about the program's design, not about their interest.",
              recommended: true,
            },
            {
              label: "It is close enough. The program should add a line saying it wants to hear from more organizations and encourage them to take part.",
              response: "Encouragement asks the organizations to solve a problem the program created. Nothing in the timing, the format, the material or the compensation changes, so next quarter will produce the same four answers.",
            },
          ],
        },
        transfer: {
          prompt: "Which relationship in your own work is described as a partnership but functions as a mailing list?",
          options: [
            "Name the relationship and the depth you can honestly defend for it",
            "Write down what the other side would have to be able to do for the deeper word to be true",
            "Decide whether the fix is to change the relationship or to change what we call it",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Five depths, and one word that covers all of them",
            body: "<p>State agencies use the word partnership for almost every outside relationship they have. It covers a quarterly newsletter, a standing advisory group, a contracted provider association, a listening session, a comment period and a genuinely shared decision. When one word stretches that far it stops carrying information, and it becomes possible for a program to believe it has partners when what it has is a distribution list.</p><p>A more useful question is how deep a relationship actually goes. Informing means we tell people what we decided or what is about to happen. Consulting means we ask for reactions to something we have already shaped. Involving means we work with people through the decision, and they can see their contribution in what comes out. Collaborating means we shape it together and part of the agenda is theirs. Sharing the decision means the authority itself is shared, and we do not quietly overrule the result.</p><p>All five are legitimate. No program can share authority over everything, and nobody expects it to. What causes damage is calling one of them by the name of another: describing a comment period as co-design, or an advisory group as a partnership when its advice has never changed an outcome. People on the other side notice. The relationship that follows is more guarded than the one before it, and the next invitation gets a slower answer.</p>",
          },
          {
            type: "list",
            heading: "What you can check without asking anyone",
            items: [
              "How each relationship started: did we seek this organization out, or did it find us?",
              "How long ago the list was built, and who has been added since.",
              "Whether the same three or four voices account for most of what we hear.",
              "What we sent last, how far ahead it arrived, and in what format.",
              "Whether anyone was paid for their time, and if so, who and through what route.",
              "The last time someone outside the division changed a decision, and whether we ever told them they had.",
            ],
          },
          {
            type: "tabs",
            heading: "Four relationships, four depths",
            tabs: [
              { label: "A quarterly update", body: "<p>Twenty-two organizations receive it. Nobody is asked for anything and almost nobody replies. This is informing, and informing well is worth doing. It becomes a problem only when the program counts twenty-two as the size of its partnership.</p>" },
              { label: "A public comment period", body: "<p>A draft is published with a thirty-day window. The responses come from organizations with staff who read state notices for a living. This is consulting, and it systematically over-represents whoever already has that capacity.</p>" },
              { label: "A standing advisory group", body: "<p>Members meet every other month. Whether this is consulting, involving or collaborating depends entirely on when they see the material, which part of the agenda is theirs, and whether anything has ever changed because of them.</p>" },
              { label: "A co-designed notice", body: "<p>Self-advocates, family members and a plain-language reviewer work on the wording with the program, and their changes stand unless there is a recorded reason. This is collaborating. It costs the most staff time of the four, and it produces the notice that works.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-15-1-sort",
            heading: "Informing, consulting, or something deeper?",
            categories: ["Informing", "Consulting", "Collaborating or sharing the decision"],
            items: [
              { text: "A quarterly bulletin goes to every organization on the contact list.", category: "Informing" },
              { text: "The program publishes a draft policy and invites written comment for thirty days.", category: "Consulting" },
              { text: "Self-advocates write the first draft of the family-facing notice, and the program edits it with them.", category: "Collaborating or sharing the decision" },
              { text: "Staff hold a listening session and take notes for the project file.", category: "Consulting" },
              { text: "A notice of a service change is mailed to everyone affected.", category: "Informing" },
              { text: "A paid advisory group sets two of the six agenda items itself, and its recommendations stand unless the division records a reason.", category: "Collaborating or sharing the decision" },
              { text: "Providers are surveyed about which of three options they prefer, after the three were chosen internally.", category: "Consulting" },
              { text: "Family members and county staff jointly choose which redesign option goes forward.", category: "Collaborating or sharing the decision" },
            ],
          },
          {
            type: "text",
            heading: "Where this sits in the program's map of change",
            body: "<p>This program uses a familiar map of intercultural development — Denial, Polarization, Minimization, Acceptance, Adaptation and Integration — to describe how organizations and the people in them change over time. It is a map for the work, not a label, a score or a record about any individual. Nothing you do in this module is assessed, ranked or kept.</p><p>Stakeholder relationships are a good place to watch Minimization at work. Minimization is the sincere belief that differences between people are mostly surface, that one open and evenhanded process serves everyone, and that fairness means offering the same thing to all. It produces a single comment period, a single meeting format, a single kind of invitation, and a real confidence that the door is open to anyone who wants to walk through it.</p><p>The door is open. It opens onto a process that rewards organizations with spare staff time, familiarity with state vocabulary, reliable transportation and the confidence that speaking up is worth the trouble. Acceptance is recognizing that those differences are real and that they decide who answers. Adaptation is changing the invitation, the timing, the format and the compensation so that the answers come from more than the same four organizations. None of that is abstract; it lives in the details of how an invitation is built.</p>",
          },
          {
            type: "leaderMove",
            heading: "Name the depth before you name the relationship",
            control: "You control what you call a relationship in a report, a charter, a grant narrative or a meeting summary.",
            failure: "Do not describe a comment period as co-design, or an advisory group as a partnership when its advice has never changed an outcome. The people described that way can tell, and the correction costs far more than the accuracy would have.",
            next: "In the next document you write about outside relationships, replace every use of the word partnership with the depth you can actually defend.",
          },
          {
            type: "quote",
            text: "We have been on that list for six years. We get the newsletter. Once we sent a four-page response to a draft and never heard anything back, so now when they ask, it goes to the bottom of the pile with everything else that is not going to matter.",
            cite: "Composite community organization perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-15-1-check",
            question: "A program area reports strong community partnership because its stakeholder list has grown by a third and every organization on it receives the quarterly update and all comment notices. What is the strongest assessment of that report?",
            options: [
              { text: "The report is sound. A larger list reaching more organizations is a real improvement in partnership.", correct: false },
              { text: "The list describes an informing relationship. It shows who receives material, not who could prepare, contribute, change anything or hear what happened, so it does not support a claim about partnership.", correct: true },
              { text: "The report is incomplete only because it does not say how many organizations opened the update.", correct: false },
            ],
            feedbackCorrect: "Yes. Reach is the easiest thing to count and the weakest evidence of partnership. The useful questions are who answered, what changed, and who was told about it.",
            feedbackIncorrect: "Ask what a distribution list can prove on its own. Then ask the harder questions: who could prepare, who could contribute, did anything change, and did anyone hear about it?",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you: think of one outside relationship you rely on. How do your role, your authority and the language you use in it shape what the other person feels able to say to you — and what would have to change for the honest version to reach you?",
          },
        ],
      },
      {
        id: "ipe-15-2",
        number: 2,
        title: "Reciprocity, and what participation costs",
        summary: "What a partner spends to be in our room, why unpaid expertise is a subsidy, and the report-back that decides whether anyone comes back.",
        minutes: 11,
        learning: {
          objective: "Plan the reciprocity a partnership requires — lead time, usable information, compensation, role clarity and a report-back — and name whose budget carries each line before the invitation goes out.",
          takeaways: [
            "Participation costs the participant: unpaid hours away from work or caregiving, travel, support arrangements, energy, and the effort of translating what they know into our vocabulary. None of it appears in our project budget unless somebody puts it there.",
            "Unpaid expertise is a subsidy paid to the state by people who usually have less than the state does. Paying advisors is not a courtesy; it is what separates an advisory relationship from an extraction.",
            "Lead time is part of what we owe. An invitation with three days' notice, or material that arrives the morning of a session, quietly restricts the relationship to organizations with staff to spare.",
            "Role clarity is part of it too. Someone who believes they are helping decide, and later learns they were being consulted, has been misled even when nobody meant to mislead them.",
            "The report-back is the most-skipped step and the one that decides whether anyone comes back. People need to hear what happened to what they said, including when the honest answer is that nothing changed, and why.",
          ],
          evidence: "A scenario in which fiscal and contracting colleagues are brought into an engagement plan, an accordion of what a partner is actually spending, flashcards on the five parts of reciprocity, and a knowledge check on what a thank-you does and does not settle.",
          appliedNextStep: "Before the next invitation you send, write four lines: what we are asking of people, what it will cost them, what we are paying and from whose budget, and when they will hear what happened.",
        },
        scenario: {
          context: "A DSD workgroup wants six family members and two adults who use the service to review a redesigned service description across four sessions. The program manager plans to invite them as volunteers, describing it as a chance to shape the work. Contracting colleagues have been asked only to help book the rooms. Three of the eight would need unpaid time away from hourly jobs, and two would need to arrange and pay for support in order to attend.",
          prompt: "Fiscal and contracting staff are brought into the conversation early. What is the most useful contribution they can make?",
          options: [
            {
              label: "Confirm that no contract action is needed, since volunteer participation creates no payment obligation for the division.",
              response: "Accurate as far as it goes, and it settles the wrong question. The absence of an obligation is exactly what makes the arrangement worth examining: the division would be advised for free by eight people who will pay out of pocket to attend.",
            },
            {
              label: "Raise the compensation question while the design is still open — what the eight are being asked for, what it will cost them, whether the division intends to pay, which route is available, and how long that route takes to set up.",
              response: "This is the contribution only fiscal and contracting colleagues can make, and it helps only if it happens now. Once the sessions are on the calendar, payment becomes an afterthought that usually fails for lack of lead time.",
              recommended: true,
            },
            {
              label: "Suggest offering gift cards at the end of the final session as a thank-you for everyone who attended.",
              response: "A thank-you at the end does not change who could afford to attend the first session. It also leaves the division deciding after the fact what someone's expertise was worth, which is not a position either side should be in.",
            },
          ],
        },
        transfer: {
          prompt: "Think about the next group you plan to bring together. What will it cost each person to be there, and what is going back to them?",
          options: [
            "Write the cost of attending for the person it costs the most, in real terms",
            "Name the budget line that would carry compensation, travel and support costs, and the colleague who can set it up",
            "Decide the date by which contributors will hear what happened, and put it in the invitation",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "What it costs to be in our room",
            body: "<p>When a division asks eight people to review a service description over four sessions, what the division gains is easy to see. What the eight are spending is harder to see, because none of it lands in our budget. A parent takes unpaid hours off a shift. An adult who uses the service arranges and pays for support to get to the building. A small culturally specific organization sends its only program director, which means nothing else moves that afternoon. Somebody spends the evening before turning what they know into the vocabulary we use, because our material does not use theirs.</p><p>That spending is real and it falls unevenly. The organizations that can absorb it are the ones with grant-funded staff whose job already includes state relationships. The people who cannot absorb it are often the people whose experience we most need to hear. So an unpaid, short-notice, weekday-daytime invitation is not a neutral offer made equally to everyone. It selects for a particular kind of partner, and then the pattern of who answers confirms that those are the partners who care.</p><p>Reciprocity is the practice of putting something back on our side of the exchange. It has five parts, and none of them is a thank-you: lead time, information people can actually use, compensation, a clear role, and a report-back that closes the loop.</p>",
          },
          {
            type: "accordion",
            heading: "Four things a partner is spending",
            items: [
              { title: "Time, at the hours we chose", body: "<p>Weekday daytime is our convenience. For someone in an hourly job it is unpaid leave. For a family caregiver it is a support arrangement that has to be made and paid for. For a small organization it is the only program director's afternoon. Evening and weekend options cost us something instead, which is the point: the cost has to sit somewhere, and right now it sits entirely on them.</p>" },
              { title: "Money that appears in no budget", body: "<p>Travel and parking, fuel for a long drive across a rural county, childcare, paid support staff, connection costs for a video session. These are ordinary costs of attending, and they stay invisible to us unless we ask about them and then cover them.</p>" },
              { title: "Energy, and the risk of saying it plainly", body: "<p>A person describing what went wrong in a service is not making a neutral contribution. They are telling a state agency something uncomfortable, often about a system they and their family still depend on. That takes energy, and it carries a risk they are weighing while they speak.</p>" },
              { title: "Translation into our vocabulary", body: "<p>We ask about service categories, rule numbers, waivers and program abbreviations. Partners arrive with knowledge organized around daily life instead. Converting one into the other is real work, and we hand it to them almost every time.</p>" },
            ],
          },
          {
            type: "flashcards",
            heading: "The five parts of reciprocity",
            cards: [
              { front: "Lead time", back: "<p>An invitation far enough ahead that arrangements are possible, and materials two or three weeks before the session as plain text — not slides shown for the first time on the day.</p>" },
              { front: "Usable information", back: "<p>What the decision is, what is open, what is fixed, who holds the final call, and what the program abbreviations mean. Without this, people can only react to the parts they happen to recognize.</p>" },
              { front: "Compensation", back: "<p>Payment for expertise, plus actual costs: travel, care, support, connection. Arranged before the first invitation, because the route takes time to set up and a late attempt usually fails.</p>" },
              { front: "Role clarity", back: "<p>Say which depth this is — informed, consulted, involved, collaborating, sharing the decision — and who decides. People can work with any honest answer. They cannot work with a vague one.</p>" },
              { front: "Report-back", back: "<p>What we heard, what changed because of it, and what did not change and why. In writing, by a stated date, to everyone who contributed — not only to the ones who agreed with us.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Price the participation while the design is still open",
            control: "You control whether compensation, travel and support costs are part of the plan or an afterthought, and when you ask contracting and fiscal colleagues that question.",
            failure: "Do not schedule the sessions first and look for a payment route afterward. The route needs lead time, and by then the only remaining option is a thank-you nobody can put toward the day they took off work.",
            next: "On the next engagement you plan, put the payment question into the same conversation as the date and the room, and name the budget before the invitation is drafted.",
          },
          {
            type: "quote",
            text: "I told them the same thing in three different sessions over two years. The third time, a new staff member wrote it down like it was the first she had heard of it. Nobody ever told me what happened to the first two.",
            cite: "Composite family advisor perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-15-2-check",
            question: "A program plans four unpaid advisory sessions and offers a gift card at the end of the final session as a thank-you. Which assessment is best supported?",
            options: [
              { text: "The thank-you resolves the compensation question, since everyone who took part receives something of value.", correct: false },
              { text: "A thank-you at the end does not change who could afford the first session, and it leaves the program deciding after the fact what someone's expertise was worth. Compensation and cost coverage belong in the plan before the first invitation goes out.", correct: true },
              { text: "No compensation is needed, because advisory participation is voluntary and creates no obligation for the program.", correct: false },
            ],
            feedbackCorrect: "Yes. The question is not whether an obligation exists. It is who can afford to be in the room, and that is settled before the first session rather than after the last one.",
            feedbackIncorrect: "Ask when the cost is paid, and by whom. Anything offered at the end arrives after the people who could not afford the first session have already been filtered out.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you: think about the last group you invited into a decision. Who was helped by the way that invitation was built, who was burdened by it, and who never saw it at all?",
          },
        ],
      },
      {
        id: "ipe-15-3",
        number: 3,
        title: "Timing, authority and what is actually open",
        summary: "Why late invitations produce guarded answers, how to say plainly what is fixed, and why counties, providers, advocates, families and self-advocates are not interchangeable.",
        minutes: 11,
        learning: {
          objective: "State plainly what is open, what is constrained and what is already fixed before inviting partners into a decision, and match the depth of the invitation to the authority actually on offer.",
          takeaways: [
            "The strongest single determinant of whether partnership is real is when people are brought in. Everything settled before the invitation was settled by whoever happened to be in the room at the time.",
            "Saying what is fixed is a gift, not a retreat. A partner who knows the eligibility criteria are set in rule can spend their effort on the parts that are genuinely open, instead of discovering the constraint after they have spent it.",
            "Partners are not interchangeable. A county holds an operational stake, a provider association a business one, an advocacy organization its mission, a family the daily consequences, and an adult using the service their own life. Hearing from one is not hearing from all.",
            "Engagement debt is real. Each round of asking without a report-back makes the next round harder, and the cost is usually paid by the next staff member who tries.",
            "Where the work touches Tribal Nations, tribal governments or Native American communities, this program defers to the Office of Indian Affairs and to the Department of Human Services offices that handle tribal matters. That is a standing deference, not a gap this module is waiting to fill.",
          ],
          evidence: "A scenario about a comment period on a nearly finished draft, tabs on five different stakes in the same change, sorting practice that separates what is open from what is fixed, and a knowledge check on the honest way to describe a constrained decision.",
          appliedNextStep: "Take a decision you are working on now and write three short lists: what is genuinely open, what is constrained and by what, and what is already fixed. Put all three into the invitation.",
        },
        scenario: {
          context: "A DSD program has spent five months drafting changes to a service standard. The draft is complete, the budget assumption is set, and the date for issuing it is committed. A thirty-day public comment period opens next week. A manager asks the team to describe that comment period in the project record as community co-design, since families and provider organizations will all have the chance to respond.",
          prompt: "You are on the team. What is the most useful response?",
          options: [
            {
              label: "Agree. The comment period is genuinely open to everyone affected, and in a public process that is what co-design means in practice.",
              response: "Open to respond is not the same as open to shape. By the time a draft is complete and its date is committed, the decisions that mattered were made months earlier by whoever was in the room then. Recording that as co-design puts something in the file the people who commented would not recognize.",
            },
            {
              label: "Record it accurately as a public comment period, say in the notice what is still open and what is fixed, and add a line to the project record about bringing families and self-advocates in before drafting next time.",
              response: "This does three honest things at once. It names the depth correctly, it lets people spend their effort where it can matter, and it turns the gap into a specific change for the next cycle rather than a regret.",
              recommended: true,
            },
            {
              label: "Extend the comment period to sixty days so that more organizations have a meaningful chance to take part.",
              response: "More time on a finished draft produces more comments on a finished draft. It is a reasonable courtesy and it changes nothing about what is open. That same month spent before drafting would have changed the result.",
            },
          ],
        },
        transfer: {
          prompt: "Which decision in your own work is nearly finished, and what would have had to happen three months earlier for the people most affected to shape it?",
          options: [
            "Name the decision and the point at which its shape was actually set",
            "Write down who would have had to be in the room at that point, and what it would have cost to have them there",
            "Name one thing you can still open, and say so plainly to the people you are about to ask",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The invitation arrives after the decision",
            body: "<p>Ask a group of community partners what makes a state engagement worth their time and the answer is almost never about the meeting itself. It is about when the meeting happened. A decision has a shape by the time it is written down, and that shape was set during the months of quiet work before anyone outside was invited. Everything after that is commentary on a draft.</p><p>This is not a failure of intention. Programs invite people once the work is presentable, which is a reasonable instinct and exactly the wrong one. The work is presentable because the choices have been made. Earlier is messier: the problem is not yet framed, the options are not yet narrowed to three, and running that kind of conversation is harder staff work. It is also the only point at which a partner can change anything.</p><p>There is a second, quieter issue. Most decisions are not fully open. Statute, federal requirements, a budget already set, a commitment the state has made, or a date that cannot move all constrain what is possible. Naming those constraints in the invitation is not an admission of weakness. It is what lets a partner put their effort where it can matter, instead of spending it on the one part of the decision that was never available.</p>",
          },
          {
            type: "tabs",
            heading: "One change, five different stakes",
            tabs: [
              { label: "A county lead worker", body: "<p>Her stake is operational: how the change lands in a caseload, what the transition looks like on a Monday morning, what she will have to explain to fifty households. She can tell you what will break in practice, and she is not a substitute for the households.</p>" },
              { label: "A provider association", body: "<p>Its stake includes the viability of its members: rates, staffing, administrative burden. That is a legitimate interest and a real source of knowledge. It is also an organizational interest, and it is not the same as the interest of the people those members support.</p>" },
              { label: "An advocacy organization", body: "<p>Its stake is its mission and the people it represents. It often knows the policy landscape better than we expect and may hold a position before we ask. That does not make it less useful. It makes it a different kind of partner from an individual.</p>" },
              { label: "A family member", body: "<p>Her stake is the daily consequence: who arrives in the morning, what happens when a schedule changes, what the notice means at the kitchen table. She may have no interest in our policy vocabulary and complete authority on the effect.</p>" },
              { label: "An adult who uses the service", body: "<p>His stake is his own life, and he is the only one of the five who cannot be represented by any of the others. Nothing about us without us began as a claim about exactly this: the person affected is in the room rather than described in it.</p>" },
            ],
          },
          {
            type: "accordion",
            heading: "Three things worth being straight about",
            items: [
              { title: "Say what is fixed, in the invitation", body: "<p>Write three short lists and put them where people will actually read them: what is genuinely open, what is constrained and by what, and what is already decided. Partners consistently name this as the most useful thing an agency can do for them, and it costs a paragraph.</p>" },
              { title: "Engagement debt", body: "<p>Every round of asking without a report-back makes the next round harder. The organization that sent four pages and heard nothing answers more slowly next time, and the staff member who inherits that relationship pays for a decision they did not make. Repair is possible, and it starts by saying what happened to the earlier contribution, even long afterward.</p>" },
              { title: "A standing deference on tribal matters", body: "<p>Where this work touches Tribal Nations, tribal governments or Native American communities in Minnesota, this program defers to the Office of Indian Affairs and to the Department of Human Services offices that handle tribal matters. Government-to-government consultation is their responsibility and follows its own requirements. This is a standing deference rather than a gap this module is waiting to fill, and the right first step is to contact those offices rather than to build an approach here.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-15-3-sort",
            heading: "Open, constrained, or already fixed?",
            categories: ["Genuinely open", "Open but constrained — name the constraint", "Already fixed — say so"],
            items: [
              { text: "The wording, reading level and format of the notice families will receive.", category: "Genuinely open" },
              { text: "The eligibility criteria, which are set in rule.", category: "Already fixed — say so" },
              { text: "Which groups review the notice before it goes out, and how early they see it.", category: "Genuinely open" },
              { text: "The date the change must be issued, which is committed.", category: "Already fixed — say so" },
              { text: "How questions will be answered after the change takes effect, within the staffing the program has.", category: "Open but constrained — name the constraint" },
              { text: "The total funding available, set in the current budget.", category: "Already fixed — say so" },
              { text: "How the available funding is distributed across the options, subject to federal requirements.", category: "Open but constrained — name the constraint" },
              { text: "Which languages the notice appears in first, subject to what translation and review can be completed in time.", category: "Open but constrained — name the constraint" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Move the first outside conversation one stage earlier",
            control: "You control when partners are brought into the work you lead, and how honestly the invitation describes what is open.",
            failure: "Do not invite people to comment on something already finished and then record the result as shared design. The record outlives the project, and the people who commented will read it.",
            next: "On your next piece of work, move the first outside conversation to before the drafting starts, and write the three lists — open, constrained, fixed — into the invitation itself.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-15-3-check",
            question: "A program is redesigning a notice. The wording, reading level and format are open; the eligibility criteria are set in rule; the issue date is committed. What is the most useful thing to tell the families and self-advocates invited to review it?",
            options: [
              { text: "Keep the invitation open and general, and let people raise whatever matters to them; narrowing it in advance risks steering their contribution.", correct: false },
              { text: "Tell them plainly which parts are open, which are constrained and by what, and which are already fixed, so their effort goes where it can change something.", correct: true },
              { text: "Describe only the parts that are open, since naming the fixed constraints may discourage people from taking part at all.", correct: false },
            ],
            feedbackCorrect: "Yes. Naming what is fixed is not a retreat. It is the difference between effort that can change something and effort spent on the one part that was never available.",
            feedbackIncorrect: "Think about what happens when someone spends their best argument on a criterion set in rule and learns that afterward. The next invitation gets a slower answer, and the one after that may get none.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you: think of a decision in your work that is nearly final. How could the people most affected have shaped it earlier — and if something in the current version will land badly for someone, what would accountability and repair actually require of you?",
          },
        ],
      },
      {
        id: "ipe-15-4",
        number: 4,
        title: "Your stakeholder-engagement map",
        summary: "Turn a list of names into a set of relationships with a depth, an owner, a cost and a date, for one decision you are working on now.",
        minutes: 11,
        learning: {
          objective: "Complete a stakeholder-engagement map for one real decision, naming for every relationship its depth, its owner, the reciprocity it requires, and when it will be reviewed.",
          takeaways: [
            "Map a decision, not a division. A map of everyone the division knows is a directory. A map of one decision tells you who should be in it, at what depth, and by when.",
            "The most useful column is the one for who is missing. Absences are patterned: the people furthest from our vocabulary, our hours, our buildings and our languages fall off the map most often, and they are usually the ones the decision affects most.",
            "Every line needs a named owner and a date, or the map becomes a description of good intentions.",
            "Keep the map with the project file rather than in a personal folder. The next person to hold this work inherits the relationships either way; the map decides whether they inherit the understanding too.",
          ],
          evidence: "A scenario about a map that lists everyone and commits to nothing, a completed stakeholder-engagement map you can copy into your own work, flashcards on the five columns, and a knowledge check on what makes a map line usable.",
          appliedNextStep: "Fill the map in for one decision you are working on now, start with the missing-groups line, and keep it with the project file rather than in your own notes.",
        },
        scenario: {
          context: "A program manager builds a stakeholder-engagement map for a service redesign. It lists thirty-one organizations and individuals across five categories, with contact details and a short note on each. There is no column for what each relationship is for, no name appears beside any line, and no dates are set. The manager asks you to look it over before it goes into the project file.",
          prompt: "What is the most useful thing to say?",
          options: [
            {
              label: "It is thorough. Suggest adding the two or three organizations missing from the list, then put it in the file.",
              response: "Adding names to a directory produces a longer directory. Nothing in it yet says what any relationship is for, who holds it, or when anything happens, so nothing in it can be acted on or reviewed later.",
            },
            {
              label: "Ask what each relationship is for, at what depth, who owns it, what it costs and when it is reviewed — and add a line for who is missing and why. Then cut the map down to the decision actually in front of you.",
              response: "This turns a directory into a plan. The depth makes the promise honest, the owner makes it real, the cost makes it possible, the date makes it reviewable, and the missing-groups line is where the most important work usually is.",
              recommended: true,
            },
            {
              label: "Recommend sorting the thirty-one entries by category and priority so the program knows which relationships matter most.",
              response: "Ranking relationships without naming what each one is for tends to promote whoever is easiest to reach. The people hardest to include move down the list precisely because including them takes more work.",
            },
          ],
        },
        transfer: {
          prompt: "Which decision will you map first, and who will ask you what the missing-groups line said?",
          options: [
            "Name the decision and the day you will fill the map in",
            "Name the colleague or supervisor who will ask you what you found",
            "Write down now who you expect the missing-groups line to name, then check whether you were right",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Map the decision, not the division",
            body: "<p>Most stakeholder maps are directories. They list the organizations a division knows, sorted by type, with contact details and a note about who spoke to them last. A directory is useful for finding a phone number and useless for planning a decision, because it says nothing about what any relationship is for.</p><p>A map that helps is built around one decision. It asks who this decision affects, who is missing from the conversation, how deep each relationship should be, who holds it, what it costs, and when it gets reviewed. Built that way it is short. Most decisions have five or six relationships that genuinely matter, and a map with six honest lines is worth more than a list of thirty-one names.</p><p>The hardest column is the one for who is missing, and it is the reason to do this at all. Absences are patterned. The groups that fall off our maps are the ones furthest from our vocabulary, our hours, our buildings and our languages: families in counties a long drive from any meeting, people who use interpreters, people who left the service and therefore stopped appearing on any list we keep, organizations with nobody paid to read state notices. They are also, routinely, the people the decision affects most.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A stakeholder-engagement map for one decision",
            summary: "One page that turns a list of names into a set of relationships somebody owns.",
            fields: [
              { label: "The decision and what is genuinely open", value: "Redesign of the service description and the notice families receive. Open: wording, reading level, format, what is explained first, how questions get answered. Constrained: which languages come first, subject to what translation and review can be finished in time. Fixed: eligibility criteria set in rule, and the date the notice must be issued." },
              { label: "Who is affected and who is missing", value: "Affected: families using the service; adults using it directly; county lead workers; two provider associations; one culturally specific organization in the metro. Missing: families in the northwest of the state, anyone who left the service in the past twelve months, and everyone who uses an interpreter." },
              { label: "Depth of partnership and who holds the final call", value: "Self-advocates and family advisors: collaborating on the wording, with the program manager holding the final call. Counties and provider associations: consulted. Plain-language and interpreter reviewers: involved, with their changes accepted unless there is a recorded reason not to." },
              { label: "Reciprocity: lead time, cost and compensation", value: "Materials three weeks ahead as plain text. Sessions offered in two formats and at two times. Advisors paid at the rate the division uses, arranged by contracting colleagues before the first invitation. Travel, care and support costs covered. Budget line named: program redesign, community review." },
              { label: "Report-back, owner and the next review point", value: "Every contribution answered with what changed or why it did not, in writing within one month. Owner: program manager, with the administrative specialist holding the schedule. Map reviewed with the advisors at the agreed point, starting with the missing groups." },
            ],
            action: "Copy the five fields, fill them in for one decision you are working on now, and keep the completed map with the project file rather than in your own notes.",
          },
          {
            type: "list",
            heading: "Lines people forget",
            items: [
              "People who left the service. They are on no current list, and they know something nobody still enrolled can tell you.",
              "Anyone who uses an interpreter, who is filtered out by every arrangement that assumes English and speed.",
              "Direct support professionals and county lead workers, who see the daily consequence of a policy written two levels above them.",
              "Administrative and support staff inside our own division, who hold the lists and see every commitment that quietly disappears between meetings.",
              "Small culturally specific organizations with nobody assigned to state relationships. Reaching them takes a phone call, not a notice.",
              "The organization that sent a long response last time and never heard back. Start there, and start by saying what happened to it.",
            ],
          },
          {
            type: "flashcards",
            heading: "The five columns",
            cards: [
              { front: "What is this decision, and what is open?", back: "<p>Name the decision in one sentence, then write three short lists: genuinely open, constrained and by what, already fixed. Everything else in the map depends on this part being honest.</p>" },
              { front: "Who is affected, and who is missing?", back: "<p>List the groups the decision lands on, then the ones you cannot currently reach through any list you hold. The second list is the one that matters.</p>" },
              { front: "What depth, and who decides?", back: "<p>Informed, consulted, involved, collaborating, or sharing the decision — one of those per relationship, plus the name of the person who holds the final call.</p>" },
              { front: "What does reciprocity require?", back: "<p>Lead time, materials people can use, compensation and cost coverage with a named budget, a clear role, and a stated date for the report-back.</p>" },
              { front: "Who owns it, and when is it reviewed?", back: "<p>A named person for each line and a review point. A line missing either one is a good intention, and it will read as one to whoever inherits the file.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Keep the map where the work is",
            control: "You control whether the map lives with the project file or in your own notes, and whether the people named in it ever see the lines about them.",
            failure: "Do not build the map, use it once and leave it in a personal folder. The relationships outlast the project, and the next staff member inherits them without any of the understanding behind them.",
            next: "Put the completed map in the project file, share the relevant lines with the partners named in them, and set the review point before you close the document.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-15-4-check",
            question: "Which line from a stakeholder-engagement map can actually be acted on?",
            options: [
              { text: "Family members: important stakeholders, engage throughout the project.", correct: false },
              { text: "Families using the service: collaborating on the notice wording, with the program manager holding the final call. Materials three weeks ahead as plain text; advisors paid through the route contracting colleagues set up before the first invitation; written report-back within one month. Owner: program manager. Reviewed at the agreed point.", correct: true },
              { text: "Families and self-advocates: consult as needed, subject to time and available resources.", correct: false },
            ],
            feedbackCorrect: "Yes. Depth, decision-maker, lead time, compensation, report-back, owner and review point. Every part of that line is something a person can do or be asked about.",
            feedbackIncorrect: "Read each line and ask who does what, by when, and how the partner will know what happened. A line that survives those three questions is a plan; the others are intentions.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you: read your finished map as someone who has never worked inside this agency. Does the decision, the ask and the reason for it make sense without already knowing how DHS is organized — and if not, which line would you rewrite first?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Equitable stakeholder partnership",
    subtitle: "One page for anyone who convenes, funds or depends on a relationship outside the division",
    quote: "A distribution list tells you who receives your material. It tells you nothing about who can change it.",
    use: {
      purpose: "Keep the five depths, the five parts of reciprocity and the map's five columns in view while you plan an engagement, write an invitation, set up an advisory group, or prepare a decision that lands on people outside the division.",
      remember: [
        "Name the depth honestly: informing, consulting, involving, collaborating, or sharing the decision. All five are legitimate; using the wrong name for one of them is not.",
        "Who is at the table is usually the result of accumulated convenience rather than of who is affected.",
        "Participation costs the participant. Price lead time, travel, care, support and compensation while the design is still open, and name whose budget carries each line.",
        "Ask contracting and fiscal colleagues about the payment route in the same conversation as the date and the room. That route needs lead time.",
        "Say what is genuinely open, what is constrained and by what, and what is already fixed — in the invitation, not afterward.",
        "Report back what happened to every contribution, including the ones that changed nothing, and say why.",
        "Partners are not interchangeable. A county, a provider association, an advocacy organization, a family member and an adult using the service hold five different stakes.",
        "Where the work touches Tribal Nations or Native American communities, contact the Office of Indian Affairs and the DHS offices that handle tribal matters first.",
      ],
      doNext: "Fill the stakeholder-engagement map in for one decision you are working on now, start with the missing-groups line, and keep it with the project file.",
    },
    sections: [
      {
        heading: "The stakeholder-engagement map, in short",
        items: [
          "The decision, in one sentence, with three lists: what is genuinely open, what is constrained and by what, what is already fixed.",
          "Who is affected, and — the line that matters most — who is missing and why.",
          "The depth of each relationship, and the name of the person who holds the final call.",
          "Reciprocity for each relationship: lead time, usable materials, compensation and cost coverage, with a named budget.",
          "A named owner for every line, the date contributors will hear what happened, and the next review point.",
        ],
      },
      {
        heading: "Before the invitation goes out",
        items: [
          "Decide the depth you can honestly offer, and write it in the invitation.",
          "Arrange compensation and cost coverage first; the route takes longer to set up than the meeting does.",
          "Send materials two or three weeks ahead as plain text, and say what every program abbreviation means.",
          "Offer more than one time and more than one format, including at least one that is not a weekday daytime meeting.",
          "Start the list of who is missing before you start the list of who is invited.",
        ],
      },
      {
        heading: "After people have contributed",
        items: [
          "Answer every contribution with what changed, or what did not change and why.",
          "Send the report-back to everyone who took part, not only to the people who agreed with you.",
          "If a past contribution was never answered, say so and answer it now, however late.",
          "Record the depth accurately in the project file; the record outlives the project.",
          "Ask the advisors what should be different next time, and put their answer in the map.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Communications and training staff, who write the invitations, run the sessions and own the templates everyone else reuses — a good place to go deeper.",
          "Contracts, fiscal, grants and procurement staff, who hold the payment routes that decide who can afford to be in the room — a useful place to start.",
          "Administrative and support staff, who hold the lists, book the rooms, send the materials and see every commitment that quietly disappears — a good place to go deeper.",
          "Policy, program, quality, data and engagement staff, and the supervisors who set the terms, whose decisions are where partnership either starts early or does not happen at all.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Inclusive meetings and engagement",
          "Accessible public communications",
          "Program and service design",
          "Responding to concerns and feedback",
          "Cross-division coordination",
        ],
      },
    ],
  },
  sources: [
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas", note: "National standards for culturally and linguistically appropriate services, including the standards on community partnership, engagement and shared governance with the communities a program serves." },
    { title: "W3C Web Accessibility Initiative, Involving users in web projects for better, easier accessibility", href: "https://www.w3.org/WAI/planning/involving-users/", note: "Why involving disabled people early produces better results than reviewing at the end, and how to plan, recruit and pay for that involvement." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's advisory council on disability policy, access and rights, including guidance for state agencies working with disabled Minnesotans and disability organizations." },
    { title: "Minnesota Governor's Council on Developmental Disabilities", href: "https://mn.gov/mnddc/", note: "Minnesota's council on developmental disabilities, with materials on self-advocacy, community partnership and the history of disability-led change in the state." },
    { title: "Minnesota Olmstead Implementation Office", href: "https://mn.gov/olmstead/", note: "Minnesota's Olmstead Plan work toward integrated, self-determined lives, including how people with disabilities and their families take part in the planning and reporting." },
    { title: "Minnesota Office of Grants Management, policies, statutes and forms", href: "https://mn.gov/admin/government/grants/policies-statutes-forms/", note: "The state policies, statutes and forms governing grants and payments, useful when arranging compensation for community advisors and partner organizations." },
    { title: "ADA.gov, Effective communication", href: "https://www.ada.gov/resources/effective-communication/", note: "U.S. Department of Justice guidance on the Title II effective-communication obligation, auxiliary aids and services, and primary consideration of the person's expressed preference." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials and accessible instruction." },
  ],
};

export default pack;
