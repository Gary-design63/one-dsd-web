import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 11: Community mapping and belonging.
// Program-authored for staff who plan, coordinate or support a person's connection to the community beyond services.
const pack: CoursePack = {
  course: {
    id: "dsd-11-community-mapping-belonging",
    indexNumber: 1191,
    seriesLabel: "DSD Service System · Practice",
    title: "Community Mapping and Belonging",
    subtitle: "Why a person can live in the community for years and belong to nothing in it, what natural supports actually are, how to map the places and people that already exist, and how to build one connection that does not depend on a paid worker.",
    scope: "For care coordinators, case managers, direct support staff, community and day service staff, program and policy staff, and supervisors. Four short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Four short lessons with practice examples, a sort separating presence from belonging, scenarios, a community map you build for one person, and a connection plan with one step",
    duration: "45–50 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-community-mapping.jpg",
    coverAlt: "A man in his thirties with a hearing aid shelves donated books at a neighborhood library sale alongside two other volunteers.",
    introTranscript: "The service system succeeded in moving people out of institutions and into the community, and then discovered that living in the community and belonging to it are different things. Many people served by the Division have no one in their lives who is not paid to be there. This module covers the difference between presence and belonging, what natural supports are and why services tend to displace them, how to map the places and people that already exist in a person's world, and how to build one real connection that holds without a worker in the middle. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Distinguish presence in the community from belonging to it, and identify where a person's plan produces the first without the second.",
        "Explain what natural supports are, why services tend to displace them, and how to support one without professionalizing it.",
        "Build a community map for one person that records the places, people and roles that already exist in their life.",
        "Plan one connection that does not depend on a paid worker and take the first step.",
      ],
      evidence: [
        "A sort separating presence from belonging.",
        "Four scenario decisions and four knowledge checks with explanations.",
        "A completed community map and a connection plan with one step taken.",
      ],
      appliedNextStep: "For one person you support, count the people in their life who are not paid to be there; if the number is small, build the map.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in federal home and community-based settings requirements", "Change in the Division's planning tools", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific person's plan or services go to the responsible lead agency or program office; this course builds practice, it does not decide a case.",
      toolkitQuestion: "Who in this person's life is not paid to be there, and what did the service do to help that happen?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-community-mapping-1",
        number: 1,
        title: "Presence and belonging",
        summary: "See the difference between being in the community and being part of it, and where plans produce the first while recording the second.",
        minutes: 10,
        learning: {
          objective: "Distinguish presence from belonging using three tests, and identify one activity in a person's plan that produces presence only.",
          takeaways: [
            "Presence is being physically in a community setting. Belonging is being known there, having a role, and being missed when absent.",
            "Most community activities in service plans produce presence: a group outing to a store, a walk in the park with a worker, a visit to a library. They are recorded as community integration and they are not.",
            "The tests are simple: does anyone there know the person's name, does the person have a role, and would anyone notice if they stopped coming?",
          ],
          evidence: "A sort separating presence from belonging, a statement, a scenario decision and a knowledge check.",
          appliedNextStep: "Apply the three tests to every community activity in one person's plan.",
        },
        scenario: {
          context: "A woman in her forties has a plan with four community activities a week: a group trip to a shopping center, a walk in a park with her worker, a visit to the library, and a bowling outing with other people from her program. Her plan reviews describe her community integration as strong. She has no friends.",
          prompt: "What is the most accurate reading?",
          options: [
            { label: "Her integration is strong; four activities a week is more than many people manage.", response: "Four activities a week in which nobody knows her name, she has no role, and nobody would notice her absence. She is present in the community four times a week and belongs to none of it." },
            { label: "Every activity produces presence without belonging: no one in any of those settings knows her, she has no role, and none of them would miss her; the plan has recorded presence as integration.", response: "This applies the tests and names the gap. The activities are not bad; they are not what the plan says they are, and the plan has stopped looking for the thing it claims to have.", recommended: true },
            { label: "She should be encouraged to talk to people during the activities.", response: "Talking to strangers in a shopping center does not produce belonging either. What produces it is a place she returns to, a role there, and people who come to expect her." },
          ],
        },
        transfer: {
          prompt: "Which activity in one plan produces presence only?",
          options: ["List every community activity in the plan", "Apply the three tests to each: known by name, has a role, would be missed", "Mark the ones that fail all three"],
        },
        blocks: [
          { type: "text", heading: "In the community, not of it", body: "<p>Closing institutions and supporting people to live in ordinary neighborhoods was one of the great achievements of disability policy. It solved the problem of where people lived. It did not, by itself, solve the problem of whether anyone knew them. A person can live in an apartment on an ordinary street for twenty years, go to the shops, the park and the library every week, and have no one in their life who is not paid to be there. They are present in the community and belong to nothing in it.</p><p>Service plans tend to record presence as belonging because presence is what services can schedule. A trip to the store is a unit of service. Being a regular at the store, known by the staff, greeted by name, is not a unit of anything, and it is the thing that matters.</p>" },
          { type: "sorting", id: "dsd-community-mapping-1-sort", heading: "Presence or belonging?", categories: ["Presence", "Belonging"], items: [
            { text: "A weekly group trip to a shopping center with three other program participants and a worker.", category: "Presence" },
            { text: "Volunteering every Tuesday at the same food shelf, where the coordinator saves the sorting job for him.", category: "Belonging" },
            { text: "Attending a different community event each week chosen by staff.", category: "Presence" },
            { text: "Singing in a church choir for nine years; they called when she missed two Sundays.", category: "Belonging" },
            { text: "A walk in the park with a worker.", category: "Presence" },
            { text: "Being the person at the community garden who knows where every tool goes.", category: "Belonging" },
          ] },
          { type: "statement", body: "Three tests: does anyone there know the person's name, does the person have a role, and would anyone notice if they stopped coming." },
          { type: "leaderMove", heading: "Apply the tests to the plan", control: "You control what the plan records as community integration. Applying the three tests to every activity is how the record stops flattering itself.", failure: "Do not count outings as belonging. An outing is presence with a schedule.", next: "At the next plan review, ask the three questions of every community activity listed." },
          { type: "knowledgeCheck", id: "dsd-community-mapping-1-check", question: "A person goes bowling every week with a group from their day program. Which test of belonging does this most clearly fail?", options: [
            { text: "None; bowling is a community activity.", correct: false },
            { text: "The role and would-be-missed tests: the group is from the program, the person has no role at the bowling alley, and nobody outside the program would notice their absence.", correct: true },
            { text: "The known-by-name test only.", correct: false },
          ], feedbackCorrect: "Yes. Program groups moving through community settings produce presence. Belonging would look like the person joining a league.", feedbackIncorrect: "The activity is in the community; it produces no role, no membership, and no one who would miss the person." },
        ],
      },
      {
        id: "dsd-community-mapping-2",
        number: 2,
        title: "Natural supports, and how services displace them",
        summary: "Learn what natural supports are, why services tend to replace them, and how to support one without professionalizing it.",
        minutes: 12,
        learning: {
          objective: "Explain what natural supports are, describe two ways services displace them, and name one way to support a natural relationship without turning it into a service.",
          takeaways: [
            "Natural supports are relationships and help that exist because of who the person is and where they are, not because someone is paid: a neighbor, a coworker, a fellow member, a friend.",
            "Services displace them by doing what a neighbor would have done, by scheduling the person's life so there is no room for them, and by making every relationship go through a worker.",
            "Supporting a natural relationship means stepping back from it: making the introduction, solving the practical problem, and then getting out of the way.",
          ],
          evidence: "An accordion on displacement, a quote, a scenario decision and a knowledge check.",
          appliedNextStep: "Identify one natural relationship in a person's life and one thing the service does that gets in its way.",
        },
        scenario: {
          context: "A man in his fifties has a neighbor who, for years, gave him a lift to church on Sundays. When he began receiving services, his worker started driving him. The neighbor stopped offering. The worker's schedule changed and the man has now missed church for three months.",
          prompt: "What happened, and what should happen now?",
          options: [
            { label: "The worker should be replaced with one who can drive on Sundays.", response: "This repairs the service and leaves the displacement in place. The neighbor's lift was worth more than the worker's, because it came with a relationship and did not depend on a schedule." },
            { label: "The service displaced a natural support by doing what the neighbor was doing; the repair is to go back to the neighbor, acknowledge what happened, and ask whether the lift could resume, with the worker's role limited to whatever the neighbor cannot do.", response: "This names the mechanism and reverses it. It also requires the service to admit that its help made things worse, which is the part usually skipped.", recommended: true },
            { label: "Find a transport service for Sundays.", response: "A third kind of paid ride. The point is that an unpaid one existed and was pushed out." },
          ],
        },
        transfer: {
          prompt: "Which natural relationship in one person's life has the service displaced, or is about to?",
          options: ["List the people in the person's life who are not paid", "For each, note what they do and whether a service now does the same", "Decide one thing the service will stop doing so the relationship can resume"],
        },
        blocks: [
          { type: "text", heading: "Help that exists because of who the person is", body: "<p>A natural support is help that comes from a relationship rather than a contract. The neighbor who takes in a package. The coworker who explains the new system. The fellow choir member who notices when someone is missing. The friend who calls. These relationships are the substance of belonging, and they have properties services cannot replicate: they are reciprocal, they do not end when funding does, and they exist because the person is valued rather than assigned.</p><p>Services displace natural supports without intending to. A worker starts doing what the neighbor did, and the neighbor stops. A schedule fills the week with services, and there is no time left for anyone else. Every request goes through the worker, and the people who might have helped directly learn that they are not needed. Within a few years the person's life contains only paid relationships, and the plan calls this support.</p>" },
          { type: "accordion", heading: "Three ways services displace natural supports", items: [
            { title: "Doing what the neighbor did", body: "<p>The lift, the shopping, the check-in. Once a worker does it, the neighbor's offer has been declined by default, and it does not come back on its own.</p>" },
            { title: "Filling the week", body: "<p>A schedule of services leaves no unscheduled time in which a friendship can happen. Belonging is built in the gaps, and the plan closes them.</p>" },
            { title: "Making the worker the door", body: "<p>Family, neighbors and friends learn to call the worker rather than the person. The person becomes someone who is managed rather than someone who is known.</p>" },
          ] },
          { type: "quote", text: "Supporting a natural relationship means stepping back from it: make the introduction, solve the practical problem, and get out of the way." },
          { type: "leaderMove", heading: "Ask what the service could stop doing", control: "You control whether a plan review asks what more the service could do or what it could stop doing so that someone unpaid can. The second question is the one that builds belonging.", failure: "Do not turn a natural support into a service by paying the neighbor or scheduling the friend. The moment it becomes a service, it becomes something the person is assigned rather than something they have.", next: "At the next plan review, identify one thing the service does that someone in the person's life could do instead, and ask them." },
          { type: "knowledgeCheck", id: "dsd-community-mapping-2-check", question: "A worker proposes to formalize a friend's weekly visits as a paid respite arrangement so they are reliable. What is the likely effect?", options: [
            { text: "The visits become more reliable and the friendship is strengthened.", correct: false },
            { text: "The relationship becomes a service: the friend becomes staff, the visits become a shift, and what the person had — someone who came because they wanted to — is replaced by someone who comes because they are paid.", correct: true },
            { text: "No effect; the friend was coming anyway.", correct: false },
          ], feedbackCorrect: "Yes. Payment changes what the relationship is. Supporting it means solving whatever made it unreliable without turning it into a job.", feedbackIncorrect: "The reliability may improve and the relationship will change in kind. That is the displacement the lesson describes." },
        ],
      },
      {
        id: "dsd-community-mapping-3",
        number: 3,
        title: "Mapping what already exists",
        summary: "Build a community map for one person that records the places, people and roles already in their life.",
        minutes: 12,
        learning: {
          objective: "Build a community map for one person, recording places they go, people who know them, roles they hold, and interests that could connect them to a place where belonging is possible.",
          takeaways: [
            "A community map starts from what already exists, not from what the service offers: places the person already goes, people who already know them, roles they already hold, and interests nobody has followed up.",
            "The map is built with the person and the people who know them, and it usually reveals connections the file does not contain.",
            "The purpose of the map is to find one place where belonging is possible, not to inventory the community.",
          ],
          evidence: "A tabs walk through the map's four layers, an artifact, a scenario decision and a knowledge check.",
          appliedNextStep: "Build the map with one person this month.",
        },
        scenario: {
          context: "Building a map with a man in his thirties, you learn that he has gone to the same barber for twelve years, that he can name every bus driver on his route, that he grew up fishing with his uncle and has not fished since, and that the hardware store near his apartment has a notice about a fishing club. None of this is in his file.",
          prompt: "What has the map found?",
          options: [
            { label: "Some pleasant details about his life.", response: "It has found two places where he is already known by name, a role he could hold, and an interest with a specific door next to it. That is a connection plan, not a set of details." },
            { label: "Two places where he already belongs in a small way, an interest with history, and a door to a group built around it; the next step is to go with him to the hardware store and read the notice.", response: "This is what the map is for. It found something the service could never have offered, because it came from his life rather than from a menu.", recommended: true },
            { label: "That he should be referred to a recreation program with fishing outings.", response: "A program fishing outing is presence. The club at the hardware store is a place he could belong. The map found the second; do not trade it for the first." },
          ],
        },
        transfer: {
          prompt: "Who will you build the map with, and who else knows them well enough to help?",
          options: ["Name the person and one or two people who know them outside services", "Build the four layers: places, people, roles, interests", "Circle the one connection worth pursuing first"],
        },
        blocks: [
          { type: "text", heading: "Start from the person's world, not the service's menu", body: "<p>A service menu lists what the service can provide. A community map records what the person already has: the places they go and are known, the people who know them, the roles they hold or once held, and the interests that have never been followed. Built with the person and the people close to them, it almost always contains things the file does not. The barber of twelve years. The bus driver who waits. The uncle's fishing. The map turns these from details into doors.</p>" },
          { type: "tabs", heading: "The four layers", tabs: [
            { label: "Places", body: "<p>Where does the person already go, and where are they already known? The store, the barber, the bus, the clinic, the church, the park bench. For each: does anyone there know their name?</p>" },
            { label: "People", body: "<p>Who in the person's life is not paid? Family, neighbors, former teachers, people from a former job, someone from childhood. For each: when did they last speak, and what would it take to reconnect?</p>" },
            { label: "Roles", body: "<p>What has the person been responsible for, anywhere, ever? Feeding a pet, sorting the mail, holding the door, keeping the tools in order. Roles are how belonging starts.</p>" },
            { label: "Interests", body: "<p>What did they used to do, what do they watch, what do they talk about, what did a parent or relative share with them? For each: is there a place near them where people gather around it?</p>" },
          ] },
          { type: "artifact", kind: "plain-language-flyer", label: "Map record", title: "Community map", summary: "One page that records the places, people, roles and interests already in a person's life, and the one connection to pursue first.", fields: [
            { label: "Places, and who knows them there", value: "Named; known by name or not" },
            { label: "People who are not paid", value: "Named; last contact; what reconnecting would take" },
            { label: "Roles held, now or ever", value: "Specific responsibilities" },
            { label: "Interests, and a nearby door", value: "Each with a place where people gather around it" },
            { label: "The one connection to pursue first", value: "And the first step" },
          ], action: "Build it with one person and the people who know them, and circle one door." },
          { type: "leaderMove", heading: "Build it with people who know the person", control: "You control who is in the room when the map is built. A map built from the file contains the file. A map built with a sister, a former neighbor and the person contains their life.", failure: "Do not let the map become an inventory. Its purpose is to find one door, and once it has, the next step is to walk through it.", next: "Build one map this month with at least one unpaid person present." },
          { type: "knowledgeCheck", id: "dsd-community-mapping-3-check", question: "Why does the community map start from the person's existing places, people, roles and interests rather than from available community programs?", options: [
            { text: "Because community programs are usually full.", correct: false },
            { text: "Because belonging is built on what the person already has and is already known for, and programs offer presence that has to be scheduled; the map finds doors the service could not have offered.", correct: true },
            { text: "Because it is quicker to build.", correct: false },
          ], feedbackCorrect: "Yes. The map's value is that it comes from the person's life. A program list comes from the service.", feedbackIncorrect: "Speed and program capacity are beside the point. The starting place determines whether the result is presence or belonging." },
        ],
      },
      {
        id: "dsd-community-mapping-4",
        number: 4,
        title: "One connection that holds",
        summary: "Plan one connection that does not depend on a paid worker, take the first step, and know when to step back.",
        minutes: 12,
        learning: {
          objective: "Plan one connection from the community map, take the first step with the person, and identify the point at which the worker steps back.",
          takeaways: [
            "One connection pursued to the point where the person is known and has a role is worth more than a plan full of activities.",
            "The worker's role is to make the introduction, solve the practical problems — transport, timing, a first conversation — and then step back before the relationship becomes one that runs through them.",
            "The sign that it is holding is that the place or the people contact the person directly, and would notice if they stopped coming.",
          ],
          evidence: "A list of the plan's steps, a flashcard set on stepping back, a scenario decision and a knowledge check.",
          appliedNextStep: "Take the first step on one connection this month and set a date to check whether the person is known there.",
        },
        scenario: {
          context: "A woman in her twenties has joined a community choir, found through her map. Her worker drives her, sits in the back during rehearsal, and chats with the director afterwards about how she is doing. After two months, choir members greet the worker by name and the woman by nothing.",
          prompt: "What should change?",
          options: [
            { label: "Nothing; the worker's presence is making the choir feel safe and supported.", response: "The worker has become the door. The choir has learned that the relationship goes through the worker, and the woman has become someone who is accompanied rather than someone who is a member." },
            { label: "The worker steps back: drops her off, does not sit in, does not talk to the director about her, and, if transport is the problem, asks whether a choir member could give a lift; the test is whether the choir starts greeting her.", response: "This is the step back that natural connections require. It feels like withdrawing support and it is the support: the space in which she can become known.", recommended: true },
            { label: "The worker should introduce her to more members.", response: "Introductions through the worker reinforce the pattern. Members need to meet her, not be told about her." },
          ],
        },
        transfer: {
          prompt: "Which connection will you pursue, and when will you step back?",
          options: ["Choose one door from the map and name the first step", "Solve the practical problems: transport, timing, the first conversation", "Set the point at which the worker stops attending, and the date to check whether the person is known"],
        },
        blocks: [
          { type: "text", heading: "The introduction, the problem, and the step back", body: "<p>Building a connection that holds has three parts, and services are good at the first two and bad at the third. The introduction: going with the person the first time, making sure someone there knows who they are and why they have come. The practical problem: transport, timing, the first awkward conversation, whatever would otherwise stop the person going back. And the step back: leaving, so that the relationship forms between the person and the place rather than between the place and the worker.</p><p>The step back is the hard part because it feels like withdrawing support. It is the support. A worker who stays becomes the door, and the person never becomes a member. The test of whether the connection holds is whether the place contacts the person directly, and whether they would notice an absence.</p>" },
          { type: "list", heading: "The connection plan", ordered: true, items: ["Choose one door from the map: a place where the person has an interest and where people gather around it.", "Go with the person the first time. Make sure one person there knows their name and why they have come.", "Solve the practical problem that would stop them going back: transport, timing, cost, a first conversation.", "Step back. Set the date now. Drop off, do not sit in, do not report on the person to anyone there.", "Check at the date: does anyone there know their name, do they have a role, would they be missed? If not yet, what practical problem remains?"] },
          { type: "flashcards", heading: "Signs the worker has become the door", cards: [
            { front: "Members greet the worker by name", back: "<p>And the person by nothing. The relationship has formed with the wrong party.</p>" },
            { front: "The place calls the worker", back: "<p>About the person, rather than calling the person. The person has become someone who is managed there.</p>" },
            { front: "The worker reports on how it is going", back: "<p>To the director, the coordinator, the family. The person's membership has become a service outcome, discussed by others.</p>" },
            { front: "The person only goes when the worker is on shift", back: "<p>The connection depends on a schedule. It will end when the schedule changes.</p>" },
          ] },
          { type: "leaderMove", heading: "Set the step-back date before the first visit", control: "You control when the worker stops attending. Setting the date in advance prevents the drift in which staying feels safer every week.", failure: "Do not let a worker's presence become permanent because it feels supportive. Permanent presence is the mechanism of displacement.", next: "For one connection, write the step-back date into the plan before the first visit." },
          { type: "knowledgeCheck", id: "dsd-community-mapping-4-check", question: "What is the most reliable sign that a community connection is holding without the service?", options: [
            { text: "The person attends regularly.", correct: false },
            { text: "The place or its people contact the person directly, know their name, and would notice if they stopped coming.", correct: true },
            { text: "The worker reports that it is going well.", correct: false },
          ], feedbackCorrect: "Yes. Direct contact and being missed are the tests. Attendance and worker reports are presence and observation.", feedbackIncorrect: "Regular attendance can be presence. A worker's report means the worker is still the door. The tests are about the place's relationship with the person." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Belonging, not presence",
    subtitle: "A one-page reference for anyone who plans or supports a person's connection to community",
    quote: "Three tests: does anyone there know the person's name, does the person have a role, and would anyone notice if they stopped coming.",
    use: {
      purpose: "Stop recording presence as belonging, protect the natural supports the service tends to displace, and build one connection that holds without a worker in the middle.",
      remember: ["An outing is presence with a schedule.", "Services displace natural supports by doing what a neighbor did, filling the week, and becoming the door.", "The map starts from the person's life, not the service's menu.", "The step back is the support."],
      doNext: "Build the community map with one person and take the first step on one connection.",
    },
    sections: [
      { heading: "When you review a plan", items: ["Apply the three tests to every community activity.", "Count the people in the person's life who are not paid.", "Ask what the service could stop doing so that someone unpaid can."] },
      { heading: "When you build the map", items: ["Include at least one unpaid person who knows the person well.", "Four layers: places, people, roles, interests.", "For every interest, find a nearby place where people gather around it.", "Circle one door."] },
      { heading: "When you pursue a connection", items: ["Go the first time. Make sure someone knows the person's name.", "Solve the practical problem.", "Set the step-back date before the first visit.", "Check whether the place contacts the person directly."] },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, Disability Services Division", href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/", note: "State program information on services for Minnesotans with disabilities." },
    { title: "Minnesota Olmstead Plan", href: "https://mn.gov/dhs/general-public/about-dhs/olmstead/", note: "Minnesota's plan for supporting people with disabilities to live, learn, work and participate in the most integrated setting, including community engagement goals." },
    { title: "Medicaid home and community-based services settings requirements", href: "https://www.medicaid.gov/medicaid/home-community-based-services", note: "Federal requirements that home and community-based settings support full access to the greater community." },
    { title: "Asset-Based Community Development Institute, DePaul University", href: "https://resources.depaul.edu/abcd-institute/", note: "Resources on asset-based community development and community mapping." },
    { title: "Inclusion Press, person-centered planning tools", href: "https://inclusion.com/", note: "Tools and writing on building community and relationships with people with disabilities." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "State council offering guidance and technical assistance on disability access and policy in Minnesota." },
  ],
};

export default pack;
