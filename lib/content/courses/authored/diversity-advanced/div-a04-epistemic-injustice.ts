import type { CoursePack } from "../../source-types";

const pack: CoursePack = {
  "course": {
    "id": "div-a04-epistemic-injustice",
    "indexNumber": 1324,
    "seriesLabel": "Diversity learning · Advanced",
    "title": "Epistemic Injustice: Whose Knowledge Counts?",
    "subtitle": "Examine credibility, silence, and the categories used to understand experience, then build a fairer route from knowledge to decisions.",
    "scope": "For staff, facilitators, supervisors, and leaders in One DHS and One DSD People, Access and Culture. Open to everyone; no prior course or assessment is required. Participation is voluntary. Use fictional examples if you prefer not to reflect on personal experiences. Do not place private reflections or inferred intercultural orientations in employee records. Completion does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    "treatment": "Four substantive lessons with fictional cases, reasoned feedback, concept cards, private reflection, applied practice, a reusable job aid, and source reading.",
    "duration": "About 56 minutes, plus optional practice",
    "author": "One DHS / One DSD — People, Access and Culture",
    "coverImage": "/images/covers/stock-people-10.jpg",
    "coverAlt": "Five colleagues seated around a white conference table in a glass-walled meeting room.",
    "introTranscript": "Examine credibility, silence, and the categories used to understand experience, then build a fairer route from knowledge to decisions.",
    "kind": "course",
    "contentType": "practice",
    "governance": {
      "contentOwner": "One DHS / One DSD People, Access and Culture",
      "reviewers": [],
      "evidenceDate": "2026-09-22",
      "lastReviewed": "2026-09-22",
      "nextReview": "2027-03-22",
      "updateTriggers": [
        "New evidence or a correction to a source",
        "Changes in the process used for the applied practice"
      ],
      "relatedDoor": "Learning",
      "toolkitQuestion": "What evidence supports the proposed change, and how will its effects be reviewed?",
      "status": "current"
    },
    "learning": {
      "objectives": [
        "Distinguish an evidence-based credibility question from an identity-based discount.",
        "Explain how a reporting category can hide a problem.",
        "Distinguish consultation from decision authority.",
        "Identify a repair for a dismissed account."
      ],
      "evidence": [
        "Explain the reasoning behind a response to each fictional case.",
        "Use the course job aid to propose an observable change and a way to review it."
      ],
      "appliedNextStep": "Write a repair plan naming the error, available correction, formal boundaries, owner, and review date."
    },
    "lessons": [
      {
        "id": "div-a04-epistemic-injustice-1",
        "number": 1,
        "title": "Recognize an unfair credibility discount",
        "summary": "Distinguish an evidence-based credibility question from an identity-based discount.",
        "minutes": 14,
        "learning": {
          "objective": "Distinguish an evidence-based credibility question from an identity-based discount.",
          "objectives": [
            "Distinguish an evidence-based credibility question from an identity-based discount.",
            "Identify how status affects whose account is heard.",
            "Propose a fair method for checking a claim."
          ],
          "takeaways": [
            "The concern deserves a consistent inquiry regardless of the speaker’s status.",
            "Fair listening includes evidence-based questions; injustice concerns the unfair standard, not the existence of scrutiny.",
            "Write the concern without a status label and specify how you would test it."
          ],
          "evidence": "A fictional case, an explanation of the available responses, private reflection, and an applied next step.",
          "appliedNextStep": "Write the concern without a status label and specify how you would test it."
        },
        "scenario": {
          "context": "Fictional learning case. A fictional resident reports that a notice is confusing. The team dismisses the account until a consultant repeats the same concern.",
          "prompt": "What is the most useful next step?",
          "options": [
            {
              "label": "Compare how the two accounts were handled and investigate the notice using the same evidence standard.",
              "response": "The concern deserves a consistent inquiry regardless of the speaker’s status.",
              "recommended": true
            },
            {
              "label": "Accept every account as correct because questioning it would be unjust.",
              "response": "Fair listening includes evidence-based questions; injustice concerns the unfair standard, not the existence of scrutiny."
            }
          ]
        },
        "transfer": {
          "prompt": "Write the concern without a status label and specify how you would test it.",
          "options": [
            "Use the fictional case to rehearse the action.",
            "Apply the action to an appropriate process within your responsibility, without recording personal learning responses.",
            "Discuss the fictional case with a willing colleague and compare the evidence each response would produce."
          ]
        },
        "blocks": [
          {
            "type": "text",
            "heading": "Recognize an unfair credibility discount",
            "body": "<p>Epistemic means related to knowledge. Epistemic injustice concerns wrongs people experience in their capacity to contribute knowledge. Miranda Fricker distinguishes testimonial injustice, in which prejudice unfairly lowers a speaker’s credibility, from hermeneutical injustice, in which unequal participation in shared understanding leaves some experiences difficult to explain. These concepts help examine how an organization hears and interprets information. They do not mean that every account must be accepted without questions or that expertise is irrelevant.</p><p>A credibility question is appropriate when it concerns the evidence: what the person observed, how they know it, what records support it, and which alternative explanations remain. An unfair discount occurs when a person’s identity or social position substitutes for that inquiry. A resident’s description of an inaccessible process might be dismissed as confusion while the same description from a consultant is treated as a finding. The relevant comparison is how the claim is tested, not whether both speakers have identical credentials.</p><p>Status can influence credibility without anyone announcing a rule. A confident tone, professional title, familiar vocabulary, or senior sponsor may make an account easier to hear. People with direct experience may use less familiar language or describe a pattern that the available categories do not capture. Their account can be valuable without being complete. The appropriate response is to ask clarifying questions and examine the process, not to demand that the person translate everything into the institution’s preferred style before the issue deserves attention.</p><p>Build a fair route for checking claims. Record the substantive concern separately from impressions of the speaker. Identify what evidence would support or challenge it. Ask whether a similarly specific account from a more powerful person would receive faster investigation. Do not infer that a colleague deliberately silenced someone merely because the first response was poor. Focus on the remedy: a consistent standard for taking information seriously and a way to correct an error. This approach preserves rigorous evaluation while resisting the tendency to confuse social confidence with knowledge. It also makes room for disagreement about facts without turning the speaker’s identity into the subject of judgment.</p>"
          },
          {
            "type": "statement",
            "body": "Private reflection: Whose confidence or title makes you less likely to ask for evidence?"
          },
          {
            "type": "knowledgeCheck",
            "id": "div-a04-epistemic-injustice-1-check",
            "question": "Which credibility question is most directly about evidence rather than the speaker’s social standing?",
            "options": [
              {
                "text": "What did the person observe, and what information could confirm or challenge the account?",
                "correct": true
              },
              {
                "text": "Does the person hold a title that makes the account institutionally important?",
                "correct": false
              },
              {
                "text": "Does the person use the vocabulary normally used by senior reviewers?",
                "correct": false
              }
            ],
            "feedbackCorrect": "The first question examines the claim itself. Titles and vocabulary can influence impressions without establishing accuracy.",
            "feedbackIncorrect": "Fair inquiry does not require accepting every statement. It requires applying relevant evidence standards without substituting status or familiar style for examination."
          },
          {
            "type": "flashcards",
            "heading": "Concepts to carry into practice",
            "cards": [
              {
                "front": "Testimonial injustice",
                "back": "An unfair credibility discount connected to prejudice about the speaker."
              },
              {
                "front": "Hermeneutical injustice",
                "back": "An unfair gap in shared understanding connected to unequal participation in making meaning."
              },
              {
                "front": "Silence",
                "back": "Ambiguous information; it does not reliably establish agreement or absence of harm."
              },
              {
                "front": "Response record",
                "back": "A visible account of how a contribution entered a decision and why an action was taken or declined."
              }
            ]
          },
          {
            "type": "leaderMove",
            "heading": "Put the learning to work",
            "control": "Compare how the two accounts were handled and investigate the notice using the same evidence standard.",
            "failure": "Fair listening includes evidence-based questions; injustice concerns the unfair standard, not the existence of scrutiny.",
            "next": "Write the concern without a status label and specify how you would test it."
          }
        ]
      },
      {
        "id": "div-a04-epistemic-injustice-2",
        "number": 2,
        "title": "When the available categories cannot describe the experience",
        "summary": "Explain how a reporting category can hide a problem.",
        "minutes": 14,
        "learning": {
          "objective": "Explain how a reporting category can hide a problem.",
          "objectives": [
            "Explain how a reporting category can hide a problem.",
            "Distinguish silence from agreement.",
            "Propose an additional route for describing an experience."
          ],
          "takeaways": [
            "The change gives the uncaptured mechanism a destination rather than blaming the person for not fitting the categories.",
            "A reporting structure can prevent concerns from appearing in the record; absence of reports is not proof of absence.",
            "Test a reporting form with a fictional mixed-cause case and document what information disappears."
          ],
          "evidence": "A fictional case, an explanation of the available responses, private reflection, and an applied next step.",
          "appliedNextStep": "Test a reporting form with a fictional mixed-cause case and document what information disappears."
        },
        "scenario": {
          "context": "Fictional learning case. A fictional form offers only staff error or customer error. Reports of confusing instructions are repeatedly returned as incomplete.",
          "prompt": "What is the most useful next step?",
          "options": [
            {
              "label": "Add an accountable route for describing process design problems and review how those reports are handled.",
              "response": "The change gives the uncaptured mechanism a destination rather than blaming the person for not fitting the categories.",
              "recommended": true
            },
            {
              "label": "Treat the lack of completed forms as proof that no problem exists.",
              "response": "A reporting structure can prevent concerns from appearing in the record; absence of reports is not proof of absence."
            }
          ]
        },
        "transfer": {
          "prompt": "Test a reporting form with a fictional mixed-cause case and document what information disappears.",
          "options": [
            "Use the fictional case to rehearse the action.",
            "Apply the action to an appropriate process within your responsibility, without recording personal learning responses.",
            "Discuss the fictional case with a willing colleague and compare the evidence each response would produce."
          ]
        },
        "blocks": [
          {
            "type": "text",
            "heading": "When the available categories cannot describe the experience",
            "body": "<p>An organization understands the world partly through categories: complaint type, service need, incident reason, eligibility condition, or performance measure. Categories make information manageable, but they also shape what becomes visible. A person may have a well-founded concern that does not fit the available form. If every report must be classified as either a technical problem or a conduct problem, an experience involving both may be repeatedly misrouted. The absence of a category can become the absence of an organizational response.</p><p>Fricker’s account of hermeneutical injustice directs attention to unequal participation in creating shared interpretive resources. Kristie Dotson’s work examines practices of silencing, including conditions under which speakers limit what they say because an audience is unlikely to understand it safely. These frameworks do not establish the reason for any particular silence. A person may be quiet because they agree, disagree, are tired, need time, or judge the setting unsuitable. The lesson is to avoid treating silence as reliable evidence of consent.</p><p>Examine the reporting route before asking for more disclosure. What categories are offered? Is there an understandable way to say that none fits? Can someone explain a sequence in their own words? Who reads that explanation, and what happens next? An open text box is not enough if nobody reviews it or if the person must repeatedly retell the account. A useful route gives the information an accountable destination and explains how it can affect a decision.</p><p>Invite people affected by the categories to help evaluate them without making participation compulsory. Use fictional examples to test whether the categories can distinguish important mechanisms. Preserve technical or legal definitions that serve a valid purpose, while adding a route for information they do not capture. Do not invent a new category and assume the problem is solved. Check whether staff understand it, whether it leads to an appropriate response, and whether it creates new risks of labeling people. Shared understanding improves when the organization can revise its own vocabulary in response to experience, rather than requiring every experience to fit the vocabulary already available.</p>"
          },
          {
            "type": "statement",
            "body": "Private reflection: Which category in your work might erase a sequence that does not fit neatly?"
          },
          {
            "type": "knowledgeCheck",
            "id": "div-a04-epistemic-injustice-2-check",
            "question": "Why might an empty reporting category fail to show that no problem exists?",
            "options": [
              {
                "text": "Every absence of reports demonstrates that people are being deliberately silenced.",
                "correct": false
              },
              {
                "text": "An open text box guarantees that all relevant experiences will reach decision makers.",
                "correct": false
              },
              {
                "text": "The available categories or reporting route may prevent the experience from being recorded.",
                "correct": true
              }
            ],
            "feedbackCorrect": "Reporting arrangements shape what becomes visible. Their design and actual handling need review before drawing a conclusion from absence.",
            "feedbackIncorrect": "Neither silence nor a text box has one guaranteed meaning. Check whether people can describe the concern and whether someone is accountable for responding."
          },
          {
            "type": "flashcards",
            "heading": "Concepts to carry into practice",
            "cards": [
              {
                "front": "Testimonial injustice",
                "back": "An unfair credibility discount connected to prejudice about the speaker."
              },
              {
                "front": "Hermeneutical injustice",
                "back": "An unfair gap in shared understanding connected to unequal participation in making meaning."
              },
              {
                "front": "Silence",
                "back": "Ambiguous information; it does not reliably establish agreement or absence of harm."
              },
              {
                "front": "Response record",
                "back": "A visible account of how a contribution entered a decision and why an action was taken or declined."
              }
            ]
          },
          {
            "type": "leaderMove",
            "heading": "Put the learning to work",
            "control": "Add an accountable route for describing process design problems and review how those reports are handled.",
            "failure": "A reporting structure can prevent concerns from appearing in the record; absence of reports is not proof of absence.",
            "next": "Test a reporting form with a fictional mixed-cause case and document what information disappears."
          }
        ]
      },
      {
        "id": "div-a04-epistemic-injustice-3",
        "number": 3,
        "title": "Design participation that changes the knowledge base",
        "summary": "Distinguish consultation from decision authority.",
        "minutes": 14,
        "learning": {
          "objective": "Distinguish consultation from decision authority.",
          "objectives": [
            "Distinguish consultation from decision authority.",
            "Identify a credibility barrier in an engagement plan.",
            "Draft a feedback loop that shows how input affected the work."
          ],
          "takeaways": [
            "A visible response connects participation to decisions without falsely promising shared authority.",
            "Attendance does not establish that participants influenced the design or held decision authority.",
            "Draft a response record with issue, evidence, decision, reason, and correction route."
          ],
          "evidence": "A fictional case, an explanation of the available responses, private reflection, and an applied next step.",
          "appliedNextStep": "Draft a response record with issue, evidence, decision, reason, and correction route."
        },
        "scenario": {
          "context": "Fictional learning case. A fictional advisory group is asked for input after a form has been finalized. Its comments are thanked but never answered.",
          "prompt": "What is the most useful next step?",
          "options": [
            {
              "label": "State what remains changeable and publish a response to each substantive issue, including reasons for deferral.",
              "response": "A visible response connects participation to decisions without falsely promising shared authority.",
              "recommended": true
            },
            {
              "label": "Describe the meeting as co-design because several participants attended.",
              "response": "Attendance does not establish that participants influenced the design or held decision authority."
            }
          ]
        },
        "transfer": {
          "prompt": "Draft a response record with issue, evidence, decision, reason, and correction route.",
          "options": [
            "Use the fictional case to rehearse the action.",
            "Apply the action to an appropriate process within your responsibility, without recording personal learning responses.",
            "Discuss the fictional case with a willing colleague and compare the evidence each response would produce."
          ]
        },
        "blocks": [
          {
            "type": "text",
            "heading": "Design participation that changes the knowledge base",
            "body": "<p>An invitation to speak does not by itself establish that knowledge will matter. Participants may attend a meeting, share detailed experience, and discover later that the decision was already fixed. That can convert engagement into extraction: the organization receives stories while retaining all control over their meaning and use. A fairer arrangement explains which questions are open, who decides, what evidence will be considered, and how participants can see what happened to their contribution.</p><p>Different kinds of knowledge answer different questions. A service user can explain what a process required in practice. An analyst can estimate patterns in authorized data. A specialist can interpret a technical requirement. A decision maker can explain constraints and authority. None of these roles makes every claim equally reliable, and no single role supplies the whole picture. The aim is to combine relevant knowledge while making disagreements and limitations visible, rather than ranking people once and allowing that rank to determine every conclusion.</p><p>Prepare a participation plan around an actual decision. Provide accessible background information and enough time to consider it. Offer ways to contribute that do not require public personal disclosure. Explain how notes will be used and what confidentiality can and cannot be promised. Where participation requires substantial work, consider appropriate compensation within authorization. Do not ask one person to represent an entire community or treat personal experience as a performance that must be emotionally compelling to count.</p><p>Close the loop through a response record. Summarize the issue raised, the evidence considered, the change made or declined, and the reason. Invite correction if the summary misrepresents what was said. If a suggestion cannot be adopted because of a verified requirement, explain that constraint specifically rather than invoking policy as a vague ending. This record does not require agreement with every recommendation. It demonstrates that the contribution entered the reasoning. Over time, review whose input regularly receives action and whose is repeatedly deferred. The objective is not merely more participation, but a more accountable relationship between what people know and what the organization decides.</p>"
          },
          {
            "type": "statement",
            "body": "Private reflection: When have you mistaken the opportunity to speak for the power to affect a decision?"
          },
          {
            "type": "knowledgeCheck",
            "id": "div-a04-epistemic-injustice-3-check",
            "question": "What makes a consultation response record useful even when a suggestion is declined?",
            "options": [
              {
                "text": "It transfers final authority to everyone who submitted a comment.",
                "correct": false
              },
              {
                "text": "It shows the issue considered, evidence, decision, reason, and a way to correct a misrepresentation.",
                "correct": true
              },
              {
                "text": "It demonstrates that participants agreed with the final decision.",
                "correct": false
              }
            ],
            "feedbackCorrect": "A response record makes reasoning accountable without promising agreement or authority that participants do not hold.",
            "feedbackIncorrect": "Consultation, consent, and decision authority are different. A clear explanation can respect a contribution while accurately stating a constraint or disagreement."
          },
          {
            "type": "flashcards",
            "heading": "Concepts to carry into practice",
            "cards": [
              {
                "front": "Testimonial injustice",
                "back": "An unfair credibility discount connected to prejudice about the speaker."
              },
              {
                "front": "Hermeneutical injustice",
                "back": "An unfair gap in shared understanding connected to unequal participation in making meaning."
              },
              {
                "front": "Silence",
                "back": "Ambiguous information; it does not reliably establish agreement or absence of harm."
              },
              {
                "front": "Response record",
                "back": "A visible account of how a contribution entered a decision and why an action was taken or declined."
              }
            ]
          },
          {
            "type": "leaderMove",
            "heading": "Put the learning to work",
            "control": "State what remains changeable and publish a response to each substantive issue, including reasons for deferral.",
            "failure": "Attendance does not establish that participants influenced the design or held decision authority.",
            "next": "Draft a response record with issue, evidence, decision, reason, and correction route."
          }
        ]
      },
      {
        "id": "div-a04-epistemic-injustice-4",
        "number": 4,
        "title": "Repair a knowledge failure without claiming perfect understanding",
        "summary": "Identify a repair for a dismissed account.",
        "minutes": 14,
        "learning": {
          "objective": "Identify a repair for a dismissed account.",
          "objectives": [
            "Identify a repair for a dismissed account.",
            "Describe what remains uncertain after an inquiry.",
            "Choose an organizational measure of improved listening."
          ],
          "takeaways": [
            "Repair should not depend on performing the experience for an audience or accepting an apology.",
            "The organization’s learning needs do not justify making repair conditional on personal disclosure.",
            "Write a repair plan naming the error, available correction, formal boundaries, owner, and review date."
          ],
          "evidence": "A fictional case, an explanation of the available responses, private reflection, and an applied next step.",
          "appliedNextStep": "Write a repair plan naming the error, available correction, formal boundaries, owner, and review date."
        },
        "scenario": {
          "context": "Fictional learning case. A fictional team discovers that a resident’s accurate concern was dismissed. It asks the resident to attend a public meeting before correcting the record.",
          "prompt": "What is the most useful next step?",
          "options": [
            {
              "label": "Correct the record through the appropriate route and offer, rather than require, further participation.",
              "response": "Repair should not depend on performing the experience for an audience or accepting an apology.",
              "recommended": true
            },
            {
              "label": "Require a public account so the team can learn a stronger lesson.",
              "response": "The organization’s learning needs do not justify making repair conditional on personal disclosure."
            }
          ]
        },
        "transfer": {
          "prompt": "Write a repair plan naming the error, available correction, formal boundaries, owner, and review date.",
          "options": [
            "Use the fictional case to rehearse the action.",
            "Apply the action to an appropriate process within your responsibility, without recording personal learning responses.",
            "Discuss the fictional case with a willing colleague and compare the evidence each response would produce."
          ]
        },
        "blocks": [
          {
            "type": "text",
            "heading": "Repair a knowledge failure without claiming perfect understanding",
            "body": "<p>Repair begins by acknowledging the specific knowledge failure. If a concern was dismissed because the speaker lacked status, explain that the account should have received a fair inquiry. If the available categories obscured the issue, revise the route and reconsider affected decisions where appropriate. Avoid a general statement about listening better when the problem involved a concrete lost opportunity. Also avoid claiming complete understanding after one conversation. Acknowledgment and inquiry can proceed together without requiring the person to prove their experience repeatedly.</p><p>Ask what repair is possible within your authority. It may involve correcting a record, reopening a review, changing a form, or providing a clearer explanation. A person should not have to accept an apology or join a group discussion to access that repair. Where the matter concerns discrimination, retaliation, privacy, or other formal responsibilities, preserve the appropriate process. Epistemic analysis can illuminate how information was mishandled, but it does not replace investigation or create authority to decide a complaint.</p><p>Measure the organizational route rather than the speaker’s willingness to trust again. Track whether concerns reach the right reviewer, whether the response addresses the substance, and whether an understandable reason is provided. Use authorized records and avoid gathering sensitive learning disclosures. A higher number of reports after a change may reflect improved access to reporting rather than more underlying problems. A lower number may reflect improvement, fatigue, or loss of trust. Interpret counts alongside the actual process and feedback rather than treating a trend as self-explanatory.</p><p>The program’s developmental framework supports moving from a universal assumption about how everyone experiences the organization toward attention to meaningful differences and responsive practice. That does not authorize an IDI label for an individual or require someone to share personal history. A defensible conclusion states what the inquiry established, what the organization changed, and what remains unknown. Repair is more credible when it includes a review date and an accessible correction route. The goal is a system in which relevant knowledge can challenge a decision before harm becomes entrenched, and in which people can see that the organization is capable of learning from accounts it once failed to hear.</p>"
          },
          {
            "type": "statement",
            "body": "Private reflection: What would repair look like if the person did not want another conversation?"
          },
          {
            "type": "knowledgeCheck",
            "id": "div-a04-epistemic-injustice-4-check",
            "question": "After improving a concern-reporting route, the number of reports rises. What can be concluded from that count alone?",
            "options": [
              {
                "text": "The reporting volume increased; the cause still requires examination.",
                "correct": true
              },
              {
                "text": "The underlying level of harmful conduct necessarily increased.",
                "correct": false
              },
              {
                "text": "The revised process necessarily failed to improve access.",
                "correct": false
              }
            ],
            "feedbackCorrect": "More reports can reflect access, trust, underlying conditions, or several factors. The count needs process evidence and appropriate feedback.",
            "feedbackIncorrect": "Do not treat reporting volume as self-explanatory. A better route can reveal concerns that were previously missing from the record."
          },
          {
            "type": "flashcards",
            "heading": "Concepts to carry into practice",
            "cards": [
              {
                "front": "Testimonial injustice",
                "back": "An unfair credibility discount connected to prejudice about the speaker."
              },
              {
                "front": "Hermeneutical injustice",
                "back": "An unfair gap in shared understanding connected to unequal participation in making meaning."
              },
              {
                "front": "Silence",
                "back": "Ambiguous information; it does not reliably establish agreement or absence of harm."
              },
              {
                "front": "Response record",
                "back": "A visible account of how a contribution entered a decision and why an action was taken or declined."
              }
            ]
          },
          {
            "type": "leaderMove",
            "heading": "Put the learning to work",
            "control": "Correct the record through the appropriate route and offer, rather than require, further participation.",
            "failure": "The organization’s learning needs do not justify making repair conditional on personal disclosure.",
            "next": "Write a repair plan naming the error, available correction, formal boundaries, owner, and review date."
          }
        ]
      }
    ]
  },
  "jobAid": {
    "title": "Epistemic Injustice: Whose Knowledge Counts? — practice guide",
    "subtitle": "A working aid for examining a decision, preparing a response, and checking what changed.",
    "use": {
      "purpose": "Examine credibility, silence, and the categories used to understand experience, then build a fairer route from knowledge to decisions.",
      "remember": [
        "Keep evidence, interpretation, and proposed action distinct.",
        "Use authorized work records only; keep private learning responses out of personnel records.",
        "A course exercise does not replace formal policy, complaint procedures, professional assessment, or decision authority."
      ],
      "doNext": "Write a repair plan naming the error, available correction, formal boundaries, owner, and review date."
    },
    "sections": [
      {
        "heading": "Hear the claim",
        "items": [
          "Separate the concern from impressions of the speaker.",
          "Ask what evidence would support or challenge it.",
          "Compare how a similar account from a higher-status person would be handled."
        ]
      },
      {
        "heading": "Examine the route",
        "items": [
          "Check whether categories capture the mechanism.",
          "Provide a route for a concern that fits no category.",
          "Explain who receives information and what happens next."
        ]
      },
      {
        "heading": "Return a response",
        "items": [
          "State the issue, evidence, decision, and reason.",
          "Invite correction of an inaccurate summary.",
          "Repair records or processes without requiring public disclosure.",
          "Review response quality and access, not private attitudes or trust scores."
        ]
      },
      {
        "heading": "Complete a practice record",
        "items": [
          "Decision or situation: describe one concrete example and the specific part within your responsibility.",
          "Evidence: record the observed sequence and identify what is still uncertain; do not include private course reflections or unnecessary personal details.",
          "Proposed action: Write a repair plan naming the error, available correction, formal boundaries, owner, and review date.",
          "Review: name the person responsible, an appropriate review date, and the evidence that would support continuing, revising, or stopping the change.",
          "Return the result: explain what changed and why to the people who need that information, using an appropriate authorized channel."
        ]
      }
    ]
  },
  "sources": [
    {
      "title": "Fricker (2007), Epistemic Injustice: Power and the Ethics of Knowing",
      "href": "https://academic.oup.com/book/32817",
      "note": "Primary philosophical framework. The distinction between testimonial and hermeneutical injustice informs the original workplace examples."
    },
    {
      "title": "Dotson (2011), Tracking Epistemic Violence, Tracking Practices of Silencing",
      "href": "https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1527-2001.2011.01177.x",
      "note": "Publisher record; full-text access may depend on the publisher or your library. Primary philosophical analysis of silencing. Silence in a particular workplace cannot be diagnosed from this framework alone."
    },
    {
      "title": "Fricker, Epistemic Injustice — author-posted introduction",
      "href": "https://www.mirandafricker.com/uploads/1/3/6/2/136236203/introduction.pdf",
      "note": "Open introduction posted by the author. It introduces the book’s concepts; the publisher link is a book record, not an assurance of free access to the complete book."
    }
  ]
};

export default pack;
