import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 5: Customized employment.
// Program-authored for staff who plan, fund, refer to or support employment for people with disabilities.
const pack: CoursePack = {
  course: {
    id: "dsd-05-customized-employment",
    indexNumber: 1185,
    seriesLabel: "DSD Service System · Foundations",
    title: "Customized and Competitive Integrated Employment",
    subtitle: "What competitive integrated employment means, why customized employment exists for people the usual hiring process screens out, and what staff can do so that work is the expectation rather than the exception.",
    scope: "For care coordinators, case managers, employment and day service staff, program and policy staff, and supervisors who set expectations about work. Five short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Five short lessons with Minnesota examples, a sort separating employment settings, scenarios, a walk through discovery, and an employment conversation you can hold with one person",
    duration: "50–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-customized-employment.jpg",
    coverAlt: "A young man in a hardware store apron sorts fasteners into bins while a coworker restocks the shelf beside him.",
    introTranscript: "Most adults work, and most people with disabilities want to. The gap between those two facts is not mainly about ability. It is about a hiring process built for people who can sell themselves in an interview, service systems that historically treated day programs as the destination, and a fear of losing benefits that is entirely rational until someone explains the rules. This module covers what competitive integrated employment means, how customized employment finds work for people the usual process screens out, what discovery is, how to talk about benefits without frightening anyone, and how to hold an employment conversation that starts from the expectation of work. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Define competitive integrated employment and distinguish it from other settings where people with disabilities have historically been placed.",
        "Explain what customized employment is, whom it is for, and how it differs from placing a person into an existing job description.",
        "Describe discovery as a process and explain why it starts with the person's life rather than with an application.",
        "Explain the most common benefits fears accurately and know where to send a person for individual benefits planning.",
        "Hold an employment conversation that starts from the expectation of work and ends with one next step.",
      ],
      evidence: [
        "A sort separating competitive integrated employment from other settings.",
        "Five scenario decisions and five knowledge checks with explanations.",
        "One employment conversation held and recorded with a next step.",
      ],
      appliedNextStep: "Ask one person you support who does not work whether anyone has asked them what work they would want, and what happened.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in Minnesota employment services or subminimum wage policy", "Change in federal work incentive rules", "Change in vocational rehabilitation eligibility or service structure", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific person's benefits, vocational rehabilitation eligibility or employment services go to a certified benefits planner, the vocational rehabilitation office or the responsible lead agency; this course builds practice, it does not decide a case.",
      toolkitQuestion: "When this person's plan was written, was work assumed, asked about, or left off?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-customized-employment-1",
        number: 1,
        title: "What competitive integrated employment means",
        summary: "Learn the definition, the settings it excludes, and why the distinction matters more than it looks.",
        minutes: 10,
        learning: {
          objective: "Define competitive integrated employment by its three tests and apply them to distinguish it from sheltered, enclave and volunteer arrangements.",
          takeaways: [
            "Competitive integrated employment has three tests: paid at least the same wage as others doing the same work, in a setting where the person works alongside people without disabilities, with the same opportunities for advancement.",
            "Sheltered work, enclaves and unpaid work experience fail at least one of the tests, however well run they are.",
            "Employment First is the policy position that competitive integrated employment is the expected outcome for working-age adults with disabilities, and other options are considered after it, not instead of it.",
          ],
          evidence: "A sort by setting, a flashcard set on terms, a scenario decision and a knowledge check.",
          appliedNextStep: "For one person you support who works, check the three tests against their actual job.",
        },
        scenario: {
          context: "A day program describes its work crew: participants clean a local office building three mornings a week, supervised by program staff, and are paid a stipend from the program. The provider describes this as employment and the plan records it as such.",
          prompt: "What is the accurate description?",
          options: [
            { label: "It is employment; they work and are paid.", response: "They work and are paid. They are paid by the program rather than the employer, supervised by program staff rather than a manager, and work as a group of people with disabilities. It fails all three tests." },
            { label: "It is a work crew or enclave, which can be a step toward employment for some people and is not competitive integrated employment; recording it as employment hides that the person has not yet reached it.", response: "This keeps the distinction honest without dismissing the arrangement. The record matters because a person recorded as employed will not be asked about employment.", recommended: true },
            { label: "It is volunteering, since the stipend is not a wage.", response: "Closer, and the useful point is not the label. It is that whatever this is, it is not the outcome Employment First expects, and the plan should say so." },
          ],
        },
        transfer: {
          prompt: "Apply the three tests to one arrangement described as employment in your area.",
          options: ["Name the arrangement and who pays, who supervises, and who the coworkers are", "Mark which of the three tests it passes", "If it fails one, check whether the person has been asked about work that would pass all three"],
        },
        blocks: [
          { type: "text", heading: "Three tests, and why they exist", body: "<p>Competitive integrated employment is a defined term with three parts. The person is paid at least the minimum wage and at least what others are paid for the same work. The person works in a setting where they interact with coworkers and customers who do not have disabilities, to the same extent as others in that job. And the person has the same opportunities for advancement as others. Each test was written to exclude a specific arrangement that had, for decades, been called work for people with disabilities: the sheltered workshop paying pennies an hour, the enclave of people with disabilities working together under program supervision, the unpaid placement that never became a job.</p><p>None of those arrangements was necessarily run badly. The point of the definition is that they are not employment in the sense that other adults mean it, and a service system that records them as employment has stopped asking the question.</p>" },
          { type: "sorting", id: "dsd-customized-employment-1-sort", heading: "Competitive integrated employment, or something else?", categories: ["Competitive integrated employment", "Something else"], items: [
            { text: "Stocking shelves at a grocery store, hired by the store, paid the same starting wage as other stockers, with a job coach who fades over time.", category: "Competitive integrated employment" },
            { text: "Assembling parts in a facility where all workers have disabilities, paid per piece.", category: "Something else" },
            { text: "Working reception at a dental office two afternoons a week, hired by the practice.", category: "Competitive integrated employment" },
            { text: "Cleaning a building as part of a program crew, supervised by program staff, paid a stipend.", category: "Something else" },
            { text: "An unpaid placement at a bakery arranged by a day program, with no plan for it to become a job.", category: "Something else" },
            { text: "A part-time custodial job at a school, hired by the district, with a customized schedule.", category: "Competitive integrated employment" },
          ] },
          { type: "flashcards", heading: "Terms worth keeping straight", cards: [
            { front: "Employment First", back: "<p>The policy position that competitive integrated employment is the expected outcome for working-age adults with disabilities. Other options are considered after work has been genuinely explored, not instead of it.</p>" },
            { front: "Sheltered work", back: "<p>Work in a segregated setting, often paid below minimum wage under a special certificate. Historically common; now widely recognized as an arrangement to move away from.</p>" },
            { front: "Enclave or work crew", back: "<p>A group of people with disabilities working together at a business or site under program supervision. In the community, and not integrated in the sense the definition requires.</p>" },
            { front: "Supported employment", back: "<p>Competitive integrated employment with ongoing support, such as a job coach, that fades as the person and the workplace adjust. The support is a means to the job, not a separate service.</p>" },
          ] },
          { type: "leaderMove", heading: "Record what it is", control: "You control what the plan calls an arrangement. A record that calls a work crew employment ends the conversation about employment for that person.", failure: "Do not let a well-run program stand in for a job. The program may be good, and it may also be where the expectation of work quietly stopped.", next: "Review the plans in your area recorded as employed and check the three tests against each." },
          { type: "knowledgeCheck", id: "dsd-customized-employment-1-check", question: "A person works twenty hours a week at a hotel laundry, hired by the hotel, paid the same as other laundry staff, with a coworker who checks in with them at the start of each shift. Which test, if any, does this fail?", options: [
            { text: "The integration test, because they receive extra support.", correct: false },
            { text: "None; support from a coworker does not make a job less integrated, and the wage, setting and hiring all meet the definition.", correct: true },
            { text: "The wage test, because twenty hours is part-time.", correct: false },
          ], feedbackCorrect: "Yes. Support and part-time hours are both compatible with competitive integrated employment. What matters is who hired, who pays, and who the coworkers are.", feedbackIncorrect: "Neither part-time hours nor natural support from a coworker fails a test. This is what competitive integrated employment often looks like." },
        ],
      },
      {
        id: "dsd-customized-employment-2",
        number: 2,
        title: "Why customized employment exists",
        summary: "Learn what customized employment is, whom it serves, and how it differs from fitting a person into an existing job description.",
        minutes: 10,
        learning: {
          objective: "Explain customized employment as a negotiated match between a person's contributions and an employer's unmet needs, and identify the people for whom the usual hiring process does not work.",
          takeaways: [
            "The usual hiring process asks a person to compete for a fixed job description. Customized employment builds the job around what the person can contribute and what the employer needs done.",
            "It exists because some people will never be the best applicant for a posted job and will be an excellent fit for a job that has not been posted.",
            "It is a negotiation with an employer, not a favor asked of one; the employer gets real work done that was not getting done.",
          ],
          evidence: "A tabs comparison, a statement, a scenario decision and a knowledge check.",
          appliedNextStep: "Think of one person you support who has been described as not job-ready, and list three things they reliably do well.",
        },
        scenario: {
          context: "A woman in her twenties with autism and limited speech has been in a day program for four years. Her file says she is not job-ready: she does not interview well, does not tolerate noise, and needs a consistent routine. Staff note that she sorts and organizes with unusual precision and notices errors others miss.",
          prompt: "What is the most useful reading?",
          options: [
            { label: "The file is right; she should build interview skills and noise tolerance before employment is considered.", response: "This asks her to become a different person before work is on the table. The traits described as barriers are barriers to the usual process, not to work." },
            { label: "The usual process screens her out and her strengths describe a real contribution; the task is to find an employer with an unmet need for precise sorting in a quiet setting and negotiate a role around it.", response: "This is customized employment. It starts from what she does well and looks for where it is needed, rather than starting from a posting and asking whether she can compete for it.", recommended: true },
            { label: "Refer her to vocational rehabilitation and let them decide.", response: "A referral may be right, and it is more useful when it arrives with a description of her contributions rather than a file that says she is not ready." },
          ],
        },
        transfer: {
          prompt: "Who do you support that the usual process screens out, and what do they reliably contribute?",
          options: ["Name one person described as not job-ready", "List three things they do well, in specific terms", "Think of one kind of employer that has an unmet need for those things"],
        },
        blocks: [
          { type: "text", heading: "Competing for a posting, or negotiating a role", body: "<p>The ordinary route to a job is a competition. A posting describes a fixed set of duties; applicants present themselves; the employer picks the best fit. It works well for people who can present themselves and who match a posting. It does not work at all for people who do neither, and a service system that only offers the ordinary route will conclude, file after file, that those people are not ready.</p><p>Customized employment reverses the direction. It starts with the person: what they reliably do, what conditions they need, what they want. It then looks for an employer with tasks that are not getting done, or getting done badly by people whose time is better spent elsewhere, and negotiates a role made of those tasks. The employer gains real productivity. The person gains a job that fits. Neither is doing the other a favor.</p>" },
          { type: "tabs", heading: "Two directions", tabs: [
            { label: "The usual process", body: "<p>Posting first. The person is measured against it. Interview, résumé and presentation matter a great deal. Support, if any, comes after hiring. Works for people who can compete; screens out people who cannot.</p>" },
            { label: "Customized employment", body: "<p>Person first. Their contributions and conditions are established through discovery. An employer with matching unmet needs is identified. A role is negotiated. The job description is written last, from the negotiation. Support is part of the design.</p>" },
            { label: "What the employer gets", body: "<p>Tasks done that were not being done, or that were pulling skilled staff away from skilled work. A reliable person in a role built to be reliable. Often, lower turnover than in the posted job the tasks were carved from.</p>" },
          ] },
          { type: "statement", body: "Not job-ready usually means not ready for the usual process. It says very little about whether the person can work." },
          { type: "leaderMove", heading: "Rewrite the barriers as conditions", control: "You control whether a file describes what a person cannot do or what conditions they work well under. The second is what an employer needs to hear.", failure: "Do not send a person to an employment service with a file that says not ready. Send a description of what they contribute and what they need.", next: "Take one file that says not job-ready and rewrite the barriers section as working conditions." },
          { type: "knowledgeCheck", id: "dsd-customized-employment-2-check", question: "In customized employment, when is the job description written?", options: [
            { text: "First, so the person can be matched to it.", correct: false },
            { text: "Last, after discovery has established what the person contributes and a role has been negotiated with an employer around unmet needs.", correct: true },
            { text: "It is not written; the arrangement is informal.", correct: false },
          ], feedbackCorrect: "Yes. The description records the negotiation rather than starting it. That is the reversal that makes the approach work for people the usual process screens out.", feedbackIncorrect: "A description written first is the usual process. Customized employment writes it from the negotiated role, and it is a real job with a real description." },
        ],
      },
      {
        id: "dsd-customized-employment-3",
        number: 3,
        title: "Discovery",
        summary: "Learn what discovery is, why it starts in the person's life rather than in an office, and what it produces.",
        minutes: 12,
        learning: {
          objective: "Describe the discovery process and its output, and explain why an assessment in an office cannot substitute for it.",
          takeaways: [
            "Discovery is time spent with the person in the places where they already function well — home, community, activities they choose — to learn what they contribute and under what conditions.",
            "It replaces the interview and the standardized assessment for people those tools screen out, and it produces a profile of contributions and conditions, not a score.",
            "Discovery takes weeks, not an afternoon, and the time is what makes the resulting match reliable.",
          ],
          evidence: "An accordion on discovery activities, a list of what it produces, a scenario decision and a knowledge check.",
          appliedNextStep: "Spend one hour with a person you support in a setting where they function well and write down what you saw that the file does not contain.",
        },
        scenario: {
          context: "An employment specialist proposes to begin discovery for a man in his forties with a developmental disability by spending time at his home, his church, and the community center where he volunteers. His coordinator asks why a vocational assessment in the office would not be faster.",
          prompt: "What is the most useful answer?",
          options: [
            { label: "It would be faster and should be tried first.", response: "It would be faster, and for this man it will measure how he performs in an unfamiliar office on tasks he did not choose, which is the situation he is least likely to show what he can do in." },
            { label: "An office assessment measures performance under the conditions the person is worst at; discovery watches him where he already succeeds, and that is where the information about what he can contribute actually is.", response: "This explains the reason rather than defending the method. The time is not overhead; it is where the reliable information comes from.", recommended: true },
            { label: "Both should be done, to be thorough.", response: "The office assessment adds little and risks producing a document that says he cannot do things he does every week somewhere else." },
          ],
        },
        transfer: {
          prompt: "Where does one person you support already function well, and what would you see there?",
          options: ["Name two settings where the person is at their most capable", "Spend an hour in one of them and record what you saw", "Compare it to what the file says the person can do"],
        },
        blocks: [
          { type: "text", heading: "Looking where the information is", body: "<p>An interview measures how well a person presents in an interview. A vocational assessment measures how they perform unfamiliar tasks in an unfamiliar room under time pressure. For many people these are fair proxies for work. For the people customized employment exists for, they are the worst possible conditions, and what they produce is a document describing someone who cannot do things they do every day somewhere else.</p><p>Discovery goes to where the person already functions well. Home, where routines are established. Places they choose to go. Activities they have done for years. It watches, asks the people who know them, and tries things. Over several weeks it builds a picture of what the person reliably contributes, what conditions they need, what they like, and what they want. That picture is the basis for the employer search. Nothing produced in an office can replace it, because the office is the one place the information is not.</p>" },
          { type: "accordion", heading: "What discovery involves", items: [
            { title: "Time at home", body: "<p>Watching routines, what the person does without prompting, what they organize, what they avoid, what they return to. Talking with the people who live with them about what they are good at.</p>" },
            { title: "Time in the community", body: "<p>Going where the person goes. The places they navigate confidently, the people who know them, the tasks they do there without being asked.</p>" },
            { title: "Conversations with people who know them", body: "<p>Family, friends, former teachers, neighbors, anyone who has seen the person contribute. Asking what they do well, not what their diagnosis is.</p>" },
            { title: "Trying things", body: "<p>Short experiences with real tasks in real settings, chosen from what has been learned, to test the picture. Not job trials in the sense of auditions; explorations.</p>" },
            { title: "The profile", body: "<p>A written description of contributions, conditions, interests and preferences, in specific terms an employer could act on. Not a score, not a readiness rating, not a list of deficits.</p>" },
          ] },
          { type: "list", heading: "What a profile says, in specific terms", items: ["Sorts, organizes and notices errors, sustained over hours, in a quiet setting.", "Works best with a written sequence and the same start time each day.", "Comfortable with a small number of familiar people; needs a warning before a change.", "Strong preference for tasks with a visible finish.", "Wants to work near home and in the morning.", "Has managed the supply closet at the community center for three years without being asked to."] },
          { type: "leaderMove", heading: "Protect the time", control: "You control whether discovery is funded and scheduled as a real process or squeezed into an afternoon. A profile built in an afternoon is an office assessment with a different name.", failure: "Do not let the pressure to place quickly produce a match that fails in the first month. A failed placement costs the person more than the wait did.", next: "Find out how discovery is funded and scheduled in your area, and what it actually takes." },
          { type: "knowledgeCheck", id: "dsd-customized-employment-3-check", question: "What does discovery produce?", options: [
            { text: "A readiness score that determines whether the person can be referred for employment.", correct: false },
            { text: "A specific description of what the person contributes, the conditions they need, and what they want, written so an employer could act on it.", correct: true },
            { text: "A list of jobs the person is qualified for.", correct: false },
          ], feedbackCorrect: "Yes. The profile is a description of contributions and conditions, and the employer search starts from it.", feedbackIncorrect: "Discovery does not produce a score or a qualification list. It produces a picture of the person that makes a negotiated match possible." },
        ],
      },
      {
        id: "dsd-customized-employment-4",
        number: 4,
        title: "Benefits, and the fear of losing them",
        summary: "Learn why the fear of losing benefits is rational, what the rules generally allow, and where to send a person for an answer about their own situation.",
        minutes: 10,
        learning: {
          objective: "Explain the most common benefits fears accurately, name the general work incentives that exist, and state where a person should go for individual benefits planning.",
          takeaways: [
            "The fear of losing health coverage or cash benefits by working is rational; the rules are complicated, and people have been hurt by getting them wrong.",
            "Work incentives exist that let many people earn and keep coverage, and the details depend on the person's benefits, earnings and state; the general reassurance is true and the specific answer requires a planner.",
            "Staff who are not certified benefits planners should not give individual advice; they should know that planning exists, that it is free, and how to reach it.",
          ],
          evidence: "A tabs walk through common fears, a flashcard set, a scenario decision and a knowledge check.",
          appliedNextStep: "Find out how a person in your area reaches a certified benefits planner, and how long it takes.",
        },
        scenario: {
          context: "A man in his thirties who receives disability benefits and medical assistance is offered a job at twenty-five hours a week. His mother tells the coordinator that he cannot take it because he will lose his health coverage. The coordinator is fairly sure that is not right but does not know the details.",
          prompt: "What is the most useful response?",
          options: [
            { label: "Reassure the family that he will not lose coverage and encourage him to take the job.", response: "The reassurance is probably right in general and the coordinator does not know his specific situation. A wrong answer here can cost him coverage, and he will not forgive the system for it." },
            { label: "Say that work incentives exist that let many people in his situation work and keep coverage, that the specific answer depends on his benefits and earnings, and connect him to a certified benefits planner before the start date.", response: "This is accurate, honest about its limits, and gives the family the thing they need: a real answer from someone qualified to give it.", recommended: true },
            { label: "Suggest he decline the job to be safe.", response: "This treats the fear as fact. He would lose a job he was offered on the basis of a belief that a planner could have corrected in an hour." },
          ],
        },
        transfer: {
          prompt: "How does a person in your area reach a benefits planner, and how quickly?",
          options: ["Find the referral path for certified benefits planning", "Find out the typical wait", "Add the referral to your standard employment conversation"],
        },
        blocks: [
          { type: "text", heading: "A rational fear", body: "<p>People who receive disability benefits and health coverage tied to them have often spent years establishing eligibility, and have heard of people who lost it by earning too much. The fear that a job will cost them their coverage is not ignorance. It is a reasonable response to a set of rules that are genuinely complicated and that have real consequences for getting wrong.</p><p>The general truth is that work incentives exist. Many people can earn, sometimes substantially, and keep coverage through provisions designed for exactly this. The specific truth for any one person depends on which benefits they receive, how much they will earn, and their state's rules, and it should come from a certified benefits planner rather than from anyone else. The job of staff who are not planners is to know that planning exists, that it is free, that it should happen before the start date, and how to reach it.</p>" },
          { type: "tabs", heading: "Common fears, and what to say", tabs: [
            { label: "\"I'll lose my health coverage.\"", body: "<p>Work incentives exist specifically so that this does not have to happen, and many people work and keep coverage. The details depend on your benefits and earnings. Let's get you a benefits planner before you start, so you know exactly what applies to you.</p>" },
            { label: "\"My check will stop.\"", body: "<p>Earnings affect cash benefits in ways that depend on the program and the amount. For many people, working leaves them better off in total. A planner can show you the numbers for your situation.</p>" },
            { label: "\"If it doesn't work out, I'll never get back on.\"", body: "<p>There are provisions for returning to benefits after a job ends. The rules have time limits and conditions, and a planner can explain what they are for you.</p>" },
            { label: "\"Nobody can explain it.\"", body: "<p>Certified benefits planners can, it is free, and it is their whole job. Here is how to reach one.</p>" },
          ] },
          { type: "flashcards", heading: "Terms worth recognizing", cards: [
            { front: "Work incentive", back: "<p>A provision in a benefits program that lets a person work without losing eligibility as fast as the base rules would imply. Several exist across programs; which apply depends on the person.</p>" },
            { front: "Benefits planning", back: "<p>Individual analysis of how earnings would affect a specific person's benefits and coverage, done by a certified planner. Free, and the only reliable answer to a specific question.</p>" },
            { front: "Medical assistance for employed people with disabilities", back: "<p>A Minnesota program that lets people with disabilities who work keep medical assistance coverage, with a premium based on income. One of the main answers to the coverage fear.</p>" },
            { front: "Certified benefits planner", back: "<p>A person trained and certified to give individual benefits advice. Staff who are not certified should refer, not advise.</p>" },
          ] },
          { type: "leaderMove", heading: "Refer, do not reassure", control: "You control whether a person gets a general reassurance from you or a specific answer from a planner. The first feels helpful and the second is.", failure: "Do not give individual benefits advice unless you are certified to. A wrong answer, given kindly, can cost someone their coverage.", next: "Put the planner referral into the standard sequence before any job start date." },
          { type: "knowledgeCheck", id: "dsd-customized-employment-4-check", question: "A coordinator is confident from experience that a person can work part-time without losing coverage. What should they do?", options: [
            { text: "Tell the person, since the coordinator's experience is a reliable guide.", correct: false },
            { text: "Say that work incentives generally allow this, and connect the person to a certified benefits planner for their specific situation before the job starts.", correct: true },
            { text: "Say nothing about benefits, since it is not the coordinator's role.", correct: false },
          ], feedbackCorrect: "Yes. The general statement is safe to make; the specific answer belongs to a planner. Both halves matter.", feedbackIncorrect: "Individual advice from someone not certified can be wrong in ways that cost coverage. Silence leaves the fear in place. The middle path is the right one." },
        ],
      },
      {
        id: "dsd-customized-employment-5",
        number: 5,
        title: "An employment conversation you can hold",
        summary: "Hold a conversation that starts from the expectation of work and ends with one next step.",
        minutes: 10,
        learning: {
          objective: "Hold an employment conversation that begins with the assumption of work, explores what the person wants and contributes, and ends with one concrete next step.",
          takeaways: [
            "The conversation starts from the expectation that the person will work, not from the question of whether they can.",
            "It asks what they want and what they do well before it asks about barriers, and it treats barriers as conditions to design for.",
            "It ends with one next step with a name and a date: a referral, a discovery hour, a benefits planning appointment, or an employer to approach.",
          ],
          evidence: "A list of the conversation's sequence, an artifact, a scenario decision and a knowledge check.",
          appliedNextStep: "Hold the conversation with one person this month and record the next step.",
        },
        scenario: {
          context: "You hold the conversation with a woman in her forties who has been in a day program for fifteen years. She says she used to want to work but stopped thinking about it. Her family is worried and her provider says she is settled.",
          prompt: "What is the most useful next step?",
          options: [
            { label: "Respect that she is settled and record that employment was discussed.", response: "She said she stopped thinking about it, which is not the same as not wanting it. Recording the conversation as complete closes a door she just cracked open." },
            { label: "Ask what she used to want, arrange one discovery hour in a setting she chooses, and address the family's worry with a benefits planning referral, so that the next conversation has something new in it.", response: "This takes her at her word without treating fifteen years of silence as a decision. Each step is small, and each one changes what the next conversation can be about.", recommended: true },
            { label: "Refer her for a job placement now, since she once wanted to work.", response: "Too fast. A placement without discovery, for a person who has not thought about work in fifteen years, is likely to fail and to confirm everyone's worry." },
          ],
        },
        transfer: {
          prompt: "Who will you hold the conversation with, and what will the next step be?",
          options: ["Name one person who does not currently work", "Hold the conversation using the sequence, starting from the expectation of work", "Record one next step with a name and a date"],
        },
        blocks: [
          { type: "text", heading: "Start from the expectation", body: "<p>Most employment conversations with people with disabilities begin with a question that other adults are never asked: whether they can work. The question is not neutral. It puts the burden on the person to prove readiness, and it invites the family, the provider and the file to list reasons they cannot. A conversation that begins instead from the assumption of work asks different questions: what kind, doing what, where, and what would need to be in place. Those questions produce information. The first one produces a verdict.</p>" },
          { type: "list", heading: "The sequence", ordered: true, items: ["Open with the assumption: when you work, what would you want to be doing? If the person has never been asked, wait.", "Ask what they do well and what they like, and listen for the specific: not \"helping people\" but \"I keep the supply closet in order and nobody asked me to.\"", "Ask what conditions they work best under: time of day, noise, number of people, routine, pace.", "Ask what worries them, and what worries the people around them. Treat every worry as something to design for or refer on.", "Agree on one next step with a name and a date."] },
          { type: "artifact", kind: "plain-language-flyer", label: "Conversation record", title: "Employment conversation", summary: "One page that records what the person wants and contributes, what conditions they need, and one next step.", fields: [
            { label: "What they want to be doing", value: "In their words" },
            { label: "What they do well, specifically", value: "Three things, with where you or others have seen them" },
            { label: "Conditions", value: "Time, setting, people, routine, pace" },
            { label: "Worries, and whose", value: "Each with a response: design for it, or refer" },
            { label: "One next step, one owner, one date", value: "Discovery hour, planner appointment, employer to approach, referral" },
          ], action: "Hold the conversation with one person and put the next step in the plan." },
          { type: "leaderMove", heading: "End with a step, not a verdict", control: "You control whether the conversation ends with a decision about the person or a step toward work. A step can be small and it moves; a verdict does not.", failure: "Do not let the conversation conclude that the person is or is not ready. That is the question the conversation exists to replace.", next: "Hold one conversation this month and put the next step, with a date, in the plan." },
          { type: "knowledgeCheck", id: "dsd-customized-employment-5-check", question: "What is the most important difference between asking \"can you work?\" and asking \"when you work, what would you want to be doing?\"", options: [
            { text: "The second is more polite.", correct: false },
            { text: "The first invites a verdict about readiness; the second assumes work and produces information about what kind, which is what a next step needs.", correct: true },
            { text: "There is no real difference; both lead to the same plan.", correct: false },
          ], feedbackCorrect: "Yes. The first question asks for proof; the second asks for a picture. Only the second leads somewhere.", feedbackIncorrect: "The difference is not tone. It is whether the conversation produces a judgment or a direction." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Employment as the expectation",
    subtitle: "A one-page reference for anyone who plans, refers or supports work for people with disabilities",
    quote: "Not job-ready usually means not ready for the usual process. It says very little about whether the person can work.",
    use: {
      purpose: "Make competitive integrated employment the expected outcome, find work for people the usual process screens out, and keep the fear of losing benefits from deciding the question.",
      remember: ["Three tests: same wage, integrated setting, same advancement.", "Customized employment starts from the person and negotiates a role; the job description is written last.", "Discovery happens where the person already functions well, and it takes weeks.", "Refer to a certified benefits planner; do not give individual advice."],
      doNext: "Hold one employment conversation that starts from the expectation of work and ends with a next step.",
    },
    sections: [
      { heading: "When you plan", items: ["Assume work. Ask what kind, not whether.", "Check the three tests against anything recorded as employment.", "Rewrite barriers as working conditions.", "Put the benefits planning referral before any start date."] },
      { heading: "When you refer", items: ["Send a description of contributions and conditions, not a file that says not ready.", "Ask what discovery will involve and how long it will take.", "Find out who will negotiate with the employer and what support is planned."] },
      { heading: "When a family is worried", items: ["Say that work incentives exist and that a planner can give the specific answer.", "Treat each worry as something to design for.", "Make the next step small enough that it can happen this month."] },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, employment for people with disabilities", href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/services/employment/", note: "State information on employment services and supports for Minnesotans with disabilities, including Employment First." },
    { title: "Minnesota Olmstead Plan", href: "https://mn.gov/dhs/general-public/about-dhs/olmstead/", note: "Minnesota's plan, including its goals for competitive integrated employment." },
    { title: "Office of Disability Employment Policy, customized employment", href: "https://www.dol.gov/agencies/odep/program-areas/customized-employment", note: "Federal description of customized employment and the discovery process." },
    { title: "Minnesota Vocational Rehabilitation Services", href: "https://mn.gov/deed/job-seekers/disabilities/", note: "State vocational rehabilitation services for people with disabilities, including supported and customized employment." },
    { title: "Disability Hub MN", href: "https://disabilityhubmn.org/", note: "Minnesota's free resource for people with disabilities, including benefits planning and work-related questions." },
    { title: "Social Security Administration, work incentives", href: "https://www.ssa.gov/work/", note: "Federal information on work incentives for people receiving disability benefits." },
  ],
};

export default pack;
