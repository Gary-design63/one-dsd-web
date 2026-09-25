import type { CoursePack } from "../../source-types";

// Program intercultural development continuum, stage 6 of 6: Integration.
// The program's continuum draws on the five orientations the IDI measures (Hammer, M. R. (2011).
// The Intercultural Development Inventory. IDI, LLC.) plus Integration from Bennett, M. J. (1993).
// Developmental Model of Intercultural Sensitivity. A licensed IDI assessment does not measure Integration.
const pack: CoursePack = {
  course: {
    id: "idi-integration",
    indexNumber: 1142,
    seriesLabel: "Intercultural Development Continuum · Stage 6 of 6",
    title: "Integration: Moving Fluidly Between Cultural Frames",
    subtitle: "Integration is the far end of the continuum — more than one cultural frame has become part of how a person sees, so that moving between frames is no longer only a deliberate skill but part of their own identity.",
    scope: "For all DHS staff, whether or not they have taken the IDI. This module is based on the Intercultural Development Continuum concept, not the licensed IDI instrument, and it does not assess anyone: no orientation, result, or stage is ever inferred about, recorded for, or attached to any person. Integration is part of the direction this program moves in, alongside Acceptance and Adaptation. It is not set as an expected bar for every staff member, and it is not a status anyone claims for themselves or assigns to a colleague.",
    treatment: "Four short lessons with scenarios, personal reflection questions, suggestive practices, and knowledge checks",
    duration: "45–50 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-09.jpg",
    coverAlt: "A large group of colleagues seated around a conference table for a meeting.",
    introTranscript: "Integration is the far end of the intercultural development continuum. Where Adaptation is the practiced skill of deliberately shifting frames, Integration is when more than one cultural frame has become part of how a person sees and who they are, so the shift is no longer only a deliberate act. It is one honest point on a real continuum, not a badge. This program's direction runs toward Acceptance, Adaptation, and Integration together; most day-to-day practice lives in Acceptance and Adaptation, and Integration stays in view as where that practice can lead. No one is placed at this stage by a background, a colleague, a supervisor, or this program.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe Integration as more than one cultural frame becoming part of how a person sees, not a skill performed on demand and not a trait that comes with any particular background.",
        "Explain how this program holds Integration: part of its direction alongside Acceptance and Adaptation, never an expected bar for any individual and never a label placed on anyone.",
        "Recognize team habits that quietly assign a colleague a cultural role from their background, and replace them with practices that leave the choice with the colleague.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits this stage.",
        "One knowledge check on how the program holds Integration.",
      ],
      appliedNextStep: "Notice one situation this week where you read the same issue from two cultural frames at once, and write down, for yourself, what each frame made visible that the other did not — a note about your own practice, not a stage.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Hammer, M. R. (2011). The Intercultural Development Inventory. IDI, LLC.; Bennett, M. J. (1993). Developmental Model of Intercultural Sensitivity.",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Feedback that this module reads as setting Integration as a bar every staff member must clear, or as placing any person at a stage", "A revision to Bennett's published description of Integration or to the IDI's published orientation descriptions"],
      relatedDoor: "This module describes a general developmental orientation from published intercultural-development research. It never assigns any specific person to a stage, and it is not a substitute for a licensed IDI assessment and a qualified debrief.",
      toolkitQuestion: "Am I treating Integration as an honest description of a real point in the program's direction, or as a bar everyone must clear or a label to hand out?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "idi-integration-1",
        number: 1,
        title: "Integration",
        summary: "Moving Fluidly Between Cultural Frames. Integration is the far end of the continuum — more than one cultural frame has become part of how a person sees, so moving between frames is no longer only a deliberate skill",
        minutes: 20,
        learning: {
          objective: "Describe Integration accurately and explain how this program holds it: part of the direction, not a bar for any individual and not a label for anyone.",
          takeaways: [
            "More than one cultural frame genuinely part of how a person sees, not a skill performed on demand",
            "Different from Adaptation: this is identity, not only a deliberately applied skill",
            "Not tied to any background: no heritage, language, or life story places a person here, and no one is placed here by anyone else",
            "Part of this program's direction, alongside Acceptance and Adaptation, without being an expected bar for every staff member",
            "Most day-to-day practice lives in Acceptance and Adaptation; Integration stays in view as where that practice can lead",
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Notice one moment this week when you held two ways of reading the same situation at once, and write down, for yourself, what each way made visible.",
        },
        scenario: {
          context: "A DHS team is designing a year of learning for itself. One person says, \"Let's make Integration the bar for everyone on this team — that's what real intercultural competence looks like, and we should be able to tell who's there.\" Another asks, \"So we'd be deciding which of us has reached it and which of us hasn't?\"",
          prompt: "How should the team respond?",
          options: [
            { label: "Keep Integration as the bar for everyone, and agree to check in on who has reached it.", response: "This turns a description of where the continuum leads into a rating. Setting Integration as a bar every person must clear on a schedule is unrealistic, and deciding who has reached it places colleagues at a stage, which this program never does." },
            { label: "Drop any reference to the continuum, since it has created an awkward moment.", response: "This overcorrects. The continuum is the program's direction and still useful. The problem was turning one point into a bar and a sorting exercise, not the framework itself." },
            { label: "Keep the whole continuum, including Integration, as the direction the team is moving in; put the team's practice work in Acceptance and Adaptation; and agree that no one on the team will be placed at a stage by anyone.", response: "This holds the program's direction honestly. It keeps Integration in view as where the work can lead, puts the achievable practice where most of it lives, and keeps the continuum a description of practice rather than a rating of people.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Think about your own practice. Is there a situation you now read from more than one cultural frame at once, without deciding to? What would it look like to hold that honestly, without either claiming a stage or treating the rest of your practice as unfinished?",
          options: ["Why does setting Integration as a bar every staff member must clear work against the program's own direction?", "What is lost if a team treats Acceptance and Adaptation as the whole of the work and stops naming Integration as where that practice can lead?", "What would you say to a colleague who felt they had failed because their own practice has not led to Integration?"],
        },
        blocks: [
          { type: "text", heading: "Stage overview", body: "<p>Integration is the far end of the intercultural development continuum. Where Adaptation is the practiced skill of deliberately shifting frames, Integration is when more than one cultural frame has become part of how a person sees and who they are, so the shift is no longer only a deliberate act. It is one honest point on a real continuum, not a badge. No background, heritage, language, or life story places a person here, and no colleague, supervisor, or program places anyone here either. Only a licensed assessment with a qualified debrief speaks to any individual's orientation, and even that does not measure Integration.</p><p>This program's direction runs toward Acceptance, Adaptation, and Integration together. Most day-to-day practice lives in Acceptance and Adaptation, and Integration stays in view as where that practice can lead, without being set as an expected bar for every staff member.</p><p><strong>Where it sits:</strong> Stage 6 of 6 on the continuum this program uses: Denial → Polarization → Minimization → Acceptance → Adaptation → Integration. The program's continuum draws on the five orientations the Intercultural Development Inventory measures — Denial through Adaptation — plus Integration from Bennett's developmental model; a licensed IDI assessment does not measure Integration. No result, inferred orientation, or stage ever becomes a record, a score, or a label about any staff member.</p>" },
          { type: "list", heading: "Key markers of this stage", items: ["More than one cultural frame genuinely part of how a person sees, not a skill performed on demand", "Different from Adaptation: this is identity, not only a deliberately applied skill", "Not tied to any background: no heritage, language, or life story places a person here, and no one is placed here by anyone else", "Part of this program's direction, alongside Acceptance and Adaptation, without being an expected bar for every staff member", "Most day-to-day practice lives in Acceptance and Adaptation; Integration stays in view as where that practice can lead"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["Is there a situation in your own work that you now read from more than one cultural frame at once, without deciding to? What does each frame make visible that the other does not?", "Why does setting Integration as a bar every staff member must clear work against the program's own direction?", "What is lost if a team treats Acceptance and Adaptation as the whole of the work and stops naming Integration as where that practice can lead?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Hold Integration as direction, not a bar", back: "<p>The program moves toward Acceptance, Adaptation, and Integration together. Keeping Integration in view is different from expecting every person to arrive there, or checking who has.</p>" },
            { front: "Never read a stage off a background", back: "<p>A colleague's heritage, languages, or life story says nothing about where they are on this continuum, and no one is placed at a stage by anyone else. Treat the stages as descriptions of practice, not of people.</p>" },
            { front: "Put the daily practice where it lives", back: "<p>Genuinely respecting difference (Acceptance) and deliberately bridging it (Adaptation) are where most of the work happens, and where most staff will find their next step.</p>" },
            { front: "Keep the whole continuum visible", back: "<p>Naming Integration honestly, without demanding it or assigning it, keeps the model accurate and keeps the direction open for everyone.</p>" },
          ] },
          { type: "knowledgeCheck", id: "idi-integration-1-check", question: "How does this program hold Integration?", options: [{ text: "As the bar every staff member is expected to clear by the end of the program", correct: false }, { text: "As part of the direction the program moves in, alongside Acceptance and Adaptation, without setting it as an expected bar for any individual or placing anyone at it", correct: true }, { text: "As a stage that only staff from particular backgrounds can reach", correct: false }, { text: "As a stage the program measures and records for each staff member", correct: false }], feedbackCorrect: "Right. Integration is part of where the program's continuum leads, and the program keeps it in view alongside Acceptance and Adaptation. It is not an expected bar for any individual, it is not tied to any background, and no one is ever placed at it or recorded as being there.", feedbackIncorrect: "Look again at the stage overview — Integration is part of the program's direction, not a bar any individual must clear, not a trait that comes with a background, and never something measured or recorded about a person." },
        ],
      },
      {
        id: "idi-integration-2",
        number: 2,
        title: "When a team turns one colleague into its cultural reference point",
        summary: "Teams sometimes route every question about a community to the one colleague they connect with it. How to notice that habit as a team condition and change it, without guessing at anyone's orientation.",
        minutes: 9,
        learning: {
          objective: "Recognize when a team's habits treat one colleague's background as a stand-in for a whole community, and change the habit without placing anyone at a stage.",
          takeaways: [
            "A team habit of routing every community question to one colleague is a condition of the team, not a fact about that colleague's orientation on this continuum.",
            "A colleague's background says nothing about their stage, and the team does not need to know anyone's stage to fix the habit.",
            "Genuine interest in a colleague's experience is welcome; assuming they are available on demand to explain or vouch for a whole community is not.",
            "The respectful move is to ask, individually and privately, and to build other sources and direct community engagement alongside whatever the colleague chooses to offer.",
          ],
          evidence: "A workplace scenario decision about a team's habit of relying on one colleague, and a knowledge check on changing the habit without labeling anyone.",
          appliedNextStep: "Notice whether your team has an unspoken habit of turning to one colleague to explain or represent a whole community, and if so, raise it as a team habit and change it.",
        },
        scenario: {
          context: "A team is preparing outreach materials for a community that one colleague has family ties to. In planning meetings, the team increasingly directs every question about the community to that colleague: \"What would your community think of this,\" \"can you just check this is right,\" \"you'd know better than any of us.\"",
          prompt: "What is the most respectful next step for the team?",
          options: [
            { label: "Continue relying on the colleague, since their ties to the community make them the most informed person in the room.", response: "Family ties are not a job description, and they say nothing about where anyone is on this continuum. Being informed does not mean being available on demand to represent, validate, or speak for an entire community, especially without being asked whether they want that role." },
            { label: "Stop asking the colleague anything at all, to avoid burdening them.", response: "This avoids the burden by avoiding a valuable perspective entirely, which is its own kind of loss, and may itself feel like exclusion to the colleague." },
            { label: "Ask the colleague directly and privately whether they are willing to weigh in on this specific project, make clear it is optional, and pursue other community sources and direct engagement alongside their input.", response: "This respects the colleague's actual choice, treats the habit as the team's to fix, and still values their perspective when they choose to offer it.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Does your team have an unspoken habit of turning to one colleague to explain or represent a whole community? What would change if you treated that as a team habit to fix, and asked the colleague, privately, what role they actually want?",
          options: ["Describe the habit as a team practice, without a verdict about anyone's orientation", "Identify what other sources or direct engagement could reduce reliance on any one person", "Decide how you will ask the colleague, privately, what role they actually want"],
        },
        blocks: [
          { type: "text", heading: "Respect, not reliance", body: "<p>Some colleagues carry deep ties to more than one community, and what they choose to share can be valuable. It is also not a service they signed up to provide on demand, and it says nothing about where they are on this continuum. When a team quietly starts routing every question about a community to the one colleague it connects with that community, admiration has slid into extraction, even if everyone involved would describe their intentions as respectful.</p><p>The fix belongs to the team, and it does not require knowing anyone's stage. It shows up in small choices: asking privately instead of publicly nominating someone as the team's expert; making clear that weighing in is optional, not expected; and pursuing other sources and direct community engagement rather than treating one person's perspective as sufficient for the whole team's understanding.</p>" },
          { type: "list", heading: "Signs a team has slid from respect into extraction", items: ["Questions about a whole community are routinely directed to one colleague connected to it.", "The colleague is asked publicly, in a way that makes declining feel awkward.", "Their answer is treated as sufficient, replacing the need for other sources or direct engagement.", "No one has asked the colleague, privately, whether they actually want this role."] },
          { type: "flashcards", heading: "Practices that keep this respectful", cards: [
            { front: "Ask privately, not publicly", back: "<p>A private question leaves room for an honest no. A public one creates pressure to say yes.</p>" },
            { front: "Make it explicitly optional", back: "<p>Say plainly that the colleague's input is welcome but not required, and mean it if they decline.</p>" },
            { front: "Diversify the sources", back: "<p>One colleague's experience is one perspective, not a substitute for broader community engagement.</p>" },
            { front: "Don't read expertise or a stage off a background", back: "<p>A colleague's ties to a community do not make them an authority on every part of its history, politics, or current concerns, and they do not place the colleague anywhere on this continuum.</p>" },
          ] },
          { type: "leaderMove", heading: "Ask privately, keep it optional, diversify the sources", control: "You control whether your team's habit is to route every question to one colleague or to build broader, direct engagement.", failure: "Do not let admiration for a colleague's background become an unspoken expectation that they represent an entire community on demand, and do not read a stage off that background.", next: "The next time your team is tempted to rely on one colleague this way, ask them privately and pursue at least one other source alongside their input." },
          { type: "knowledgeCheck", id: "idi-integration-2-check", question: "A team routinely asks one colleague, in meetings, to confirm whether materials are acceptable to a community the colleague has ties to. What is the most respectful change?", options: [{ text: "Keep doing this, since the colleague's ties make them the best available source.", correct: false }, { text: "Stop asking the colleague anything, to avoid putting them on the spot.", correct: false }, { text: "Ask the colleague privately whether they are willing to weigh in on this specific project, make it clearly optional, and pursue other sources alongside their input.", correct: true }], feedbackCorrect: "Right. This respects the colleague's actual choice, avoids public pressure, treats the habit as the team's to fix, and does not treat one person as a substitute for broader community engagement.", feedbackIncorrect: "Consider what makes a request feel optional rather than expected, and what keeps the team from relying on a single person as its only source." },
        ],
      },
      {
        id: "idi-integration-3",
        number: 3,
        title: "Being honest about your own practice near the far end",
        summary: "A non-punitive look at the difference between a well-practiced skill and a frame that has become part of how you see, for your own reflection only, and why distance from Integration is not a deficiency.",
        minutes: 9,
        learning: {
          objective: "Describe your own practice honestly — what is a deliberately applied skill and what has become part of how you see — without claiming a stage or treating distance from Integration as a failure.",
          takeaways: [
            "For most staff, honest reflection describes practice grounded mostly in one cultural frame, with real skill at shifting; that is an accurate description, not a gap to feel ashamed of.",
            "Ease with a practiced shift is a sign of genuine Adaptation, not proof that more than one frame has become part of your identity; the honest check is what happens when you are not deciding to shift.",
            "This reflection is yours alone: the program never asks anyone to declare a stage, and nothing you notice here becomes a record, a score, or a label.",
            "The achievable question for most staff is not \"have I reached Integration\" but \"how well am I practicing Acceptance and Adaptation, and where do I already see from more than one frame without deciding to.\"",
          ],
          evidence: "A first-person reflection scenario and a knowledge check on the difference between honest self-description and overstatement.",
          appliedNextStep: "Write, for yourself, one honest sentence about your own practice: what you shift deliberately and what, if anything, you already see from more than one frame without deciding to. Keep it as a note on practice, not a stage.",
        },
        scenario: {
          context: "You have done real, sustained work at Adaptation: you deliberately and skillfully shift your communication style across several communities you work with regularly. In a reflection for yourself, you are tempted to write that you have reached Integration, since the shifting feels natural to you now.",
          prompt: "What is the more honest self-description?",
          options: [
            { label: "Write that you have reached Integration, since the frame-shifting no longer feels effortful.", response: "Ease of practice is a sign of skill, not evidence that more than one frame has become part of how you see when you are not deciding to shift. This overstates your practice, and it turns a reflection into a badge." },
            { label: "Write that you are still at Denial, to be safely modest.", response: "This is inaccurate in the other direction and does not reflect the real, sustained Adaptation skill you have actually built." },
            { label: "Describe your practice honestly: skilled, deliberate Adaptation, with a note about any situation where you already read from two frames without deciding to, and leave the stage names as descriptions rather than a claim.", response: "This is accurate: skillful, deliberate frame-shifting is real progress and is genuinely different from more than one frame shaping how you see. It keeps the reflection about practice and keeps it yours.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Where might you be tempted to describe your own practice as further along than your actual, sustained experience supports?",
          options: ["Name the specific area where you might overstate your practice", "Identify what distinguishes a deliberately applied skill from a frame you already see through in that specific area", "Write an honest, one-sentence description of your actual practice there, for yourself"],
        },
        blocks: [
          { type: "text", heading: "Honest distance is not a deficiency", body: "<p>Because Integration is described as the far end of the continuum, it is tempting to treat distance from it as an unfinished task, something a sufficiently good employee should eventually reach. For most staff, an honest description of their own practice is grounded mostly in one cultural frame, with real and growing skill at shifting. That is an accurate account, not a sign of insufficient effort, and it is exactly the practice the program's direction is built on.</p><p>The more common overstatement runs the other way: someone who has built real, admirable skill at Adaptation begins to describe that skill as an identity, because the shifting has become comfortable and natural through practice. Comfort with a practiced skill is not the same as more than one frame shaping how you see when you are not deciding to shift. Being honest about that difference keeps the distinction useful instead of turning it into a badge. This reflection is yours: the program never asks anyone to declare a stage, and nothing you notice here becomes a record, a score, or a label.</p>" },
          { type: "list", heading: "What an honest self-description near this stage looks like", items: ["A clear account of whether a shift is a deliberately applied skill or a way you already see, without deciding to.", "No pressure to describe yourself as further along than sustained, honest experience supports.", "No false modesty either — real Adaptation skill deserves accurate recognition as real skill.", "A focus on what is achievable and useful for you: continued practice of Acceptance and Adaptation, with Integration in view as where it can lead."] },
          { type: "quote", text: "I'd gotten so comfortable shifting between how I ran meetings with different teams that I started calling it just who I am. When I looked honestly at what happened when I wasn't deciding to shift, I could see it was a skill I'd built, and that was worth being accurate about.", cite: "Composite staff perspective, illustrative" },
          { type: "flashcards", heading: "Reframes that help this land honestly", cards: [
            { front: "Skill and identity are different things", back: "<p>A deliberately practiced shift, however skilled, is not the same as more than one frame shaping how you see without deciding to.</p>" },
            { front: "Not being at Integration is usually just accurate", back: "<p>For most staff, this is a true description of their practice, not a personal shortfall, and it is where the program's daily work lives.</p>" },
            { front: "Real skill still deserves recognition", back: "<p>Being honest about not being at Integration does not mean downplaying genuine, hard-won Adaptation skill.</p>" },
            { front: "This reflection stays yours", back: "<p>The program never asks anyone to declare a stage. Nothing you notice about your own practice becomes a record, a score, or a label.</p>" },
          ] },
          { type: "knowledgeCheck", id: "idi-integration-3-check", question: "A staff member has become very comfortable and skilled at deliberately shifting communication styles across cultures. Which self-description is most accurate?", options: [{ text: "\"I have reached Integration, since the shifting feels natural now.\"", correct: false }, { text: "\"I have built real, deliberate skill at Adaptation, which is different from more than one frame shaping how I see when I'm not deciding to shift.\"", correct: true }, { text: "\"I haven't made any real progress, since I'm still not at Integration.\"", correct: false }], feedbackCorrect: "Right. Comfort with a practiced skill is a sign of genuine Adaptation, not evidence that more than one cultural frame has become part of how someone sees. Both overstating and dismissing the progress miss the accurate description.", feedbackIncorrect: "Consider the difference between a skill that has become comfortable through practice and more than one cultural frame shaping how someone sees without deciding to." },
        ],
      },
      {
        id: "idi-integration-4",
        number: 4,
        title: "Team conditions that keep any colleague's experience a choice, not a job",
        summary: "Whatever a colleague's background or practice, using it well at work means neither hiding it nor being expected to perform it. A practical look at team conditions that leave that choice with the colleague.",
        minutes: 9,
        learning: {
          objective: "Describe team conditions that let a colleague choose when and how their own experience comes into the work, without the team assigning them a stage or a role.",
          takeaways: [
            "A colleague benefits from choosing when and how to draw on their own experience, rather than having it treated as an always-available resource.",
            "That choice includes the colleague's ordinary right to set it aside on a given day and simply do their job without representing anything.",
            "Teams support this well by valuing what a colleague chooses to share, without either ignoring it or demanding it, and without reading a stage off it.",
            "The healthiest outcome is a colleague whose experience is respected as their own, not conscripted into the team's convenience.",
          ],
          evidence: "A scenario decision about supporting a colleague in a sustainable way, and a knowledge check on what healthy team conditions look like.",
          appliedNextStep: "If a colleague on your team is often asked to explain or vouch for a community, check with them directly how they would like their perspective to be drawn on, and follow what they say rather than what would be most convenient for the team.",
        },
        scenario: {
          context: "A colleague has, at different times, offered valuable insight to the team about a community they are part of, and has also said clearly that some days they just want to do their job without being asked to explain anything. A new team member, unaware of this, begins routinely asking them cultural questions in meetings.",
          prompt: "What is the healthiest way for the team to support this colleague?",
          options: [
            { label: "Encourage the new team member to keep asking, since the colleague's insight has been valuable before.", response: "Past willingness to share does not mean standing consent to be asked at any time; this ignores what the colleague has already said about needing room to set it aside sometimes." },
            { label: "Tell the new team member to never bring up anything cultural with this colleague, to be safe.", response: "This overcorrects into avoidance and forecloses the colleague's own choice to share when they want to, which is its own form of disrespect." },
            { label: "Let the colleague know a new team member has joined, and ask the colleague directly how they would like to handle these questions going forward, then pass that preference on to the new team member.", response: "This keeps the choice with the colleague, respects what they have already said about needing room to set it aside, and still leaves the door open when they want to share.", recommended: true },
          ],
        },
        transfer: {
          prompt: "If a colleague on your team is often looked to for a community's perspective, how would you check, directly, what role they want that experience to play at work, rather than assuming?",
          options: ["Describe the team habit, if this applies to your team, without a verdict about anyone's orientation", "Identify one assumption your team may be making about the colleague's availability to share", "Decide how and when you will ask them directly what they prefer"],
        },
        blocks: [
          { type: "text", heading: "Sustaining this well", body: "<p>When a colleague's experience is genuinely valuable to a team, there is a real risk of quietly treating it as a permanent resource rather than a part of their own life that they get to decide how to use. Supporting a colleague well includes the ordinary right to set that experience aside on a given day and simply do the job in front of them, without being expected to represent, explain, or translate anything. None of this depends on knowing where the colleague is on this continuum, and the team should not try to work that out.</p><p>For a team, supporting this well means checking directly with the colleague about what role, if any, they want their experience to play at work, and revisiting that as circumstances or new teammates change, rather than assuming past willingness is a standing invitation.</p>" },
          { type: "list", heading: "What healthy support looks like", items: ["Asking the colleague directly, rather than assuming, what role they want their experience to play.", "Respecting a colleague's choice to set it aside on a given day without needing an explanation.", "Passing along preferences to new team members instead of leaving them to guess or over-ask.", "Valuing what a colleague chooses to share as a genuine gift, not an entitlement of the team."] },
          { type: "flashcards", heading: "Practices that keep this healthy", cards: [
            { front: "Ask, then revisit", back: "<p>A colleague's preference about sharing their experience can change over time or by context; check in again rather than assuming a past answer still holds.</p>" },
            { front: "Pass preferences along", back: "<p>Brief a new team member on what a colleague has already said, rather than letting them independently rediscover the same boundary through trial and error.</p>" },
            { front: "Protect the right to set it aside", back: "<p>A colleague should be able to simply do their job on a given day without being expected to represent anything.</p>" },
            { front: "Treat sharing as a gift, not a resource", back: "<p>What a colleague chooses to offer is valuable precisely because it is offered, not extracted.</p>" },
          ] },
          { type: "leaderMove", heading: "Check directly, and let the answer stand", control: "You control whether your team asks a colleague directly about their preferences, or simply assumes based on past willingness.", failure: "Do not treat one instance of a colleague sharing their experience as ongoing permission to ask whenever it is convenient for the team.", next: "If this applies on your team, ask the colleague directly this week how they would like their experience to be drawn on, and share that preference with the rest of the team." },
          { type: "knowledgeCheck", id: "idi-integration-4-check", question: "A colleague has previously shared valuable insight about a community they are part of, but a new team member does not know the colleague also needs room to set that role aside sometimes. What is the healthiest response?", options: [{ text: "Assume past willingness means the colleague is always available for these questions.", correct: false }, { text: "Tell the new team member to avoid the topic entirely and never ask anything.", correct: false }, { text: "Ask the colleague directly how they would like to handle these questions now, and pass that preference along to the new team member.", correct: true }], feedbackCorrect: "Right. Checking directly and passing the preference along respects the colleague's own choice and avoids both over-relying on them and shutting out a genuine, freely offered contribution.", feedbackIncorrect: "Consider what keeps the choice with the colleague themselves, rather than assuming based on the past or avoiding the topic altogether." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Integration: quick reference",
    subtitle: "A one-page reminder for understanding this stage honestly, as part of the program's direction and never as a bar or a label",
    quote: "Integration is where the continuum leads, and the program's direction runs toward Acceptance, Adaptation, and Integration together. Most daily practice lives in Acceptance and Adaptation, and no one is ever placed at a stage.",
    use: {
      purpose: "Keep this stage's honest framing ready when discussing program direction, your own practice, or a team habit.",
      remember: ["More than one cultural frame genuinely part of how a person sees, not a skill performed on demand", "Not tied to any background, and never assigned to anyone by a colleague, a supervisor, or this program", "Part of the program's direction, alongside Acceptance and Adaptation, without being an expected bar for every staff member", "Most day-to-day practice lives in Acceptance and Adaptation; Integration stays in view as where that practice can lead"],
      doNext: "Notice one situation this week where you read the same issue from two cultural frames at once, and write down, for yourself, what each frame made visible.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Hold Integration as direction, not a bar \— keeping it in view is different from expecting everyone to arrive there.", "Never read a stage off a background \— heritage, languages, and life story say nothing about where anyone is on this continuum.", "Put the daily practice where it lives \— Acceptance and Adaptation are where most of the work happens.", "Fix team habits as team habits \— ask a colleague privately what role they want, and build other sources alongside."] },
      { heading: "Before you assume", items: ["This describes a real point on a continuum, not a superior personal achievement to demand of anyone or a label to hand out.", "This program's continuum draws on the five orientations the IDI measures plus Integration from Bennett's developmental model; a licensed IDI assessment does not measure Integration.", "No result, inferred orientation, or stage ever becomes a record, a score, or a label about any staff member.", "When in doubt, a licensed IDI assessment with a qualified debrief — not this module — is the actual assessment tool."] },
    ],
  },
  sources: [
    { title: "Hammer, M. R. (2011). The Intercultural Development Inventory. IDI, LLC.", href: "https://www.idiinventory.com/", note: "Source for the five orientations a licensed IDI assessment measures — Denial, Polarization, Minimization, Acceptance, and Adaptation — which this program's continuum draws on. The IDI does not measure Integration." },
    { title: "Bennett, M. J. (1993). Towards Ethnorelativism: A Developmental Model of Intercultural Sensitivity.", href: "https://www.idrinstitute.org/resources/chapters-on-dmis/", note: "Source for Integration, the sixth stage of this program's continuum and this module's stage description; the developmental model the IDI grew from." },
  ],
};

export default pack;
