import type { CoursePack } from "../../source-types";

const pack: CoursePack = {
  "course": {
    "id": "div-a03-intersectional-discrimination",
    "indexNumber": 1323,
    "seriesLabel": "Diversity learning · Advanced",
    "title": "Intersectional Discrimination: Advanced Case Analysis",
    "subtitle": "Analyze interacting forms of exclusion through carefully bounded cases, avoiding both single-category explanations and assumptions based on identity.",
    "scope": "For staff, facilitators, supervisors, and leaders in One DHS and One DSD People, Access and Culture. Open to everyone; no prior course or assessment is required. Participation is voluntary. Use fictional examples if you prefer not to reflect on personal experiences. Do not place private reflections or inferred intercultural orientations in employee records. Completion does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    "treatment": "Four substantive lessons with fictional cases, reasoned feedback, concept cards, private reflection, applied practice, a reusable job aid, and source reading.",
    "duration": "About 56 minutes, plus optional practice",
    "author": "One DHS / One DSD — People, Access and Culture",
    "coverImage": "/images/covers/stock-people-10.jpg",
    "coverAlt": "Five colleagues seated around a white conference table in a glass-walled meeting room.",
    "introTranscript": "Analyze interacting forms of exclusion through carefully bounded cases, avoiding both single-category explanations and assumptions based on identity.",
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
        "Explain the limitation of a single-category comparison.",
        "Map a barrier across rules, resources, and interpretation.",
        "Compare a universal improvement with a targeted repair.",
        "Write a conclusion separating findings from hypotheses."
      ],
      "evidence": [
        "Explain the reasoning behind a response to each fictional case.",
        "Use the course job aid to propose an observable change and a way to review it."
      ],
      "appliedNextStep": "Write a six-part conclusion: question, evidence, interaction, remedy, uncertainty, and review responsibility."
    },
    "lessons": [
      {
        "id": "div-a03-intersectional-discrimination-1",
        "number": 1,
        "title": "Why separate categories can miss a combined barrier",
        "summary": "Explain the limitation of a single-category comparison.",
        "minutes": 14,
        "learning": {
          "objective": "Explain the limitation of a single-category comparison.",
          "objectives": [
            "Explain the limitation of a single-category comparison.",
            "Identify an interacting mechanism in a fictional case.",
            "Distinguish intersectional analysis from adding identity labels."
          ],
          "takeaways": [
            "Separate averages can miss interacting barriers, while a small subgroup still requires privacy and careful interpretation.",
            "Separate summaries do not test whether a combined group experiences a distinct mechanism.",
            "Draw a process map showing where two conditions combine to restrict an opportunity."
          ],
          "evidence": "A fictional case, an explanation of the available responses, private reflection, and an applied next step.",
          "appliedNextStep": "Draw a process map showing where two conditions combine to restrict an opportunity."
        },
        "scenario": {
          "context": "Fictional learning case. A fictional report finds no overall gender difference and no overall racial difference in access to assignments. A combined subgroup has repeatedly been left out, but the count is small.",
          "prompt": "What is the most useful next step?",
          "options": [
            {
              "label": "Examine the assignment process and consult authorized analysts about a privacy-preserving combined analysis.",
              "response": "Separate averages can miss interacting barriers, while a small subgroup still requires privacy and careful interpretation.",
              "recommended": true
            },
            {
              "label": "Conclude that the separate averages prove the process is equitable.",
              "response": "Separate summaries do not test whether a combined group experiences a distinct mechanism."
            }
          ]
        },
        "transfer": {
          "prompt": "Draw a process map showing where two conditions combine to restrict an opportunity.",
          "options": [
            "Use the fictional case to rehearse the action.",
            "Apply the action to an appropriate process within your responsibility, without recording personal learning responses.",
            "Discuss the fictional case with a willing colleague and compare the evidence each response would produce."
          ]
        },
        "blocks": [
          {
            "type": "text",
            "heading": "Why separate categories can miss a combined barrier",
            "body": "<p>Intersectionality is not an exercise in counting identities. It asks how social arrangements interact so that a person’s experience may not be explained adequately by examining one category at a time. Kimberlé Crenshaw’s foundational legal analysis showed how a framework organized around separate race and sex categories could fail to recognize the experiences of Black women. The analytical lesson is to examine the mechanism of exclusion rather than assume that each category operates independently or contributes an identical amount of disadvantage.</p><p>Imagine a fictional professional-development opportunity held after normal work hours. Childcare responsibilities, transportation, disability-related fatigue, and access to informal sponsorship may shape whether someone can participate. Listing these factors is only the beginning. An intersectional analysis asks how the arrangements combine. A staff member might have manageable transportation and manageable caregiving separately, yet find that the final bus leaves before the caregiver’s availability begins. The barrier emerges from the relationship between conditions, not from the number of identities assigned to the person.</p><p>Race and gender should not disappear into an undifferentiated list of personal circumstances. They can shape how responsibilities are distributed, how credibility is granted, and whose constraints receive accommodation. At the same time, an analyst cannot infer an individual’s circumstances from racial or gender identity. Ask what the case actually establishes. Distinguish an observed event, a plausible mechanism, and a question requiring more information. That distinction allows serious attention to structural patterns without turning a theoretical framework into a stereotype.</p><p>Use comparison carefully. If a report shows that women overall and Black staff overall participate at similar rates to others, that does not establish that Black women have comparable access. Broad averages can conceal a combined pattern. But a small subgroup count may also be unstable or identifying. Work with authorized data and appropriate analytic support rather than constructing personal identity profiles for a learning exercise. A good case analysis can begin with the process itself: the timing, eligibility rules, nomination route, and support available. It asks which combination creates a barrier and what change would address that combination without requiring a person to prove that one identity was the sole cause.</p>"
          },
          {
            "type": "statement",
            "body": "Private reflection: When has a category used in a report hidden an important difference within it?"
          },
          {
            "type": "knowledgeCheck",
            "id": "div-a03-intersectional-discrimination-1-check",
            "question": "What makes an analysis intersectional rather than simply a list of identities?",
            "options": [
              {
                "text": "It assumes everyone sharing the same combination of identities has the same experience.",
                "correct": false
              },
              {
                "text": "It explains how conditions and forms of power interact to produce a particular barrier.",
                "correct": true
              },
              {
                "text": "It assigns a separate disadvantage value to each identity and adds the values.",
                "correct": false
              }
            ],
            "feedbackCorrect": "Intersectional analysis explains a mechanism in context. It neither calculates identity totals nor treats group membership as a complete personal account.",
            "feedbackIncorrect": "Look for the relationship among rules, resources, and interpretations. Listing categories may identify questions, but it does not explain how the barrier occurred."
          },
          {
            "type": "flashcards",
            "heading": "Concepts to carry into practice",
            "cards": [
              {
                "front": "Intersectionality",
                "back": "Analysis of how social arrangements and forms of power interact, not a count of identities."
              },
              {
                "front": "Single-axis comparison",
                "back": "An analysis organized around one category that may miss a combined pattern."
              },
              {
                "front": "Interaction map",
                "back": "A sequence connecting rules, resources, interpretations, and consequences."
              },
              {
                "front": "Bounded conclusion",
                "back": "A finding stated at the level justified by the available evidence."
              }
            ]
          },
          {
            "type": "leaderMove",
            "heading": "Put the learning to work",
            "control": "Examine the assignment process and consult authorized analysts about a privacy-preserving combined analysis.",
            "failure": "Separate summaries do not test whether a combined group experiences a distinct mechanism.",
            "next": "Draw a process map showing where two conditions combine to restrict an opportunity."
          }
        ]
      },
      {
        "id": "div-a03-intersectional-discrimination-2",
        "number": 2,
        "title": "Build an interaction map rather than an identity inventory",
        "summary": "Map a barrier across rules, resources, and interpretation.",
        "minutes": 14,
        "learning": {
          "objective": "Map a barrier across rules, resources, and interpretation.",
          "objectives": [
            "Map a barrier across rules, resources, and interpretation.",
            "Identify a missing fact that could change a case explanation.",
            "Choose a comparison that tests a proposed mechanism."
          ],
          "takeaways": [
            "The interaction is lost when each process treats only one component; coordination can address the actual route to participation.",
            "The barrier may arise through interacting conditions, and forcing a single identity explanation misstates the analysis.",
            "Complete a rule-resource-interpretation map and name the person responsible for coordinating the response."
          ],
          "evidence": "A fictional case, an explanation of the available responses, private reflection, and an applied next step.",
          "appliedNextStep": "Complete a rule-resource-interpretation map and name the person responsible for coordinating the response."
        },
        "scenario": {
          "context": "Fictional learning case. A fictional employee is referred between an access coordinator and a development coordinator because each says the other owns the barrier to a training assignment.",
          "prompt": "What is the most useful next step?",
          "options": [
            {
              "label": "Map the combined barrier and arrange a coordinated response with clear responsibility.",
              "response": "The interaction is lost when each process treats only one component; coordination can address the actual route to participation.",
              "recommended": true
            },
            {
              "label": "Ask the employee to choose which identity caused the problem.",
              "response": "The barrier may arise through interacting conditions, and forcing a single identity explanation misstates the analysis."
            }
          ]
        },
        "transfer": {
          "prompt": "Complete a rule-resource-interpretation map and name the person responsible for coordinating the response.",
          "options": [
            "Use the fictional case to rehearse the action.",
            "Apply the action to an appropriate process within your responsibility, without recording personal learning responses.",
            "Discuss the fictional case with a willing colleague and compare the evidence each response would produce."
          ]
        },
        "blocks": [
          {
            "type": "text",
            "heading": "Build an interaction map rather than an identity inventory",
            "body": "<p>An interaction map connects a person’s route through a process to the conditions that shape it. Begin with the outcome to be explained: an opportunity missed, a service delayed, a concern dismissed, or an additional burden imposed. Then reconstruct the sequence. What did the person encounter first? What choices were actually available? What information did the organization request, and how did it interpret the response? This sequence prevents the analysis from becoming a collection of identity labels with no account of how anything happened.</p><p>Use three columns: rule, resource, and interpretation. A rule might require participation at a fixed time. A resource might be paid release time, accessible transport, or a contact who explains the process. An interpretation might treat a request for flexibility as lack of commitment. The interaction matters because the same written rule can have different consequences depending on available resources and how a request is received. Do not assume that a request was rejected because of bias; document the stated reason and examine comparable responses.</p><p>Seek evidence that could disconfirm the first explanation. Perhaps the opportunity was genuinely unavailable to everyone during a particular period. Perhaps the person was never informed of an existing alternative. Perhaps similar flexibility was routinely granted to people with stronger informal sponsorship. Each possibility suggests a different repair. An analyst who asks only for confirming examples can produce an emotionally compelling account that does not accurately explain the decision. Rigorous equity analysis welcomes information that changes the initial interpretation.</p><p>Choose comparisons that preserve the relevant context. Comparing every employee to every other employee may obscure differences in role, eligibility, and timing. Comparing only people who completed the process may exclude those blocked at its entrance. State why the selected comparison is useful and what it cannot establish. Crenshaw’s later work on structural and political intersectionality also reminds readers that institutional responses can leave people between categories of support. For this practice, identify which office or process owns the combined issue rather than sending the person repeatedly between separate channels. The map should make responsibility clearer, not create another demand for the person to narrate their identity or repeat painful experiences.</p>"
          },
          {
            "type": "statement",
            "body": "Private reflection: What missing fact would make you change your first explanation of this case?"
          },
          {
            "type": "knowledgeCheck",
            "id": "div-a03-intersectional-discrimination-2-check",
            "question": "A case supports two plausible explanations for a missed opportunity. What is the best next analytical step?",
            "options": [
              {
                "text": "Identify information that would distinguish the explanations, including evidence against the favored one.",
                "correct": true
              },
              {
                "text": "Select the explanation that contains the greatest number of identity categories.",
                "correct": false
              },
              {
                "text": "Keep only examples consistent with the explanation that initially seemed most persuasive.",
                "correct": false
              }
            ],
            "feedbackCorrect": "Testing alternatives makes the explanation more credible and helps identify the appropriate remedy.",
            "feedbackIncorrect": "A richer identity inventory or a collection of confirming examples does not replace testing the mechanism. A good analysis remains open to evidence that changes its conclusion."
          },
          {
            "type": "flashcards",
            "heading": "Concepts to carry into practice",
            "cards": [
              {
                "front": "Intersectionality",
                "back": "Analysis of how social arrangements and forms of power interact, not a count of identities."
              },
              {
                "front": "Single-axis comparison",
                "back": "An analysis organized around one category that may miss a combined pattern."
              },
              {
                "front": "Interaction map",
                "back": "A sequence connecting rules, resources, interpretations, and consequences."
              },
              {
                "front": "Bounded conclusion",
                "back": "A finding stated at the level justified by the available evidence."
              }
            ]
          },
          {
            "type": "leaderMove",
            "heading": "Put the learning to work",
            "control": "Map the combined barrier and arrange a coordinated response with clear responsibility.",
            "failure": "The barrier may arise through interacting conditions, and forcing a single identity explanation misstates the analysis.",
            "next": "Complete a rule-resource-interpretation map and name the person responsible for coordinating the response."
          }
        ]
      },
      {
        "id": "div-a03-intersectional-discrimination-3",
        "number": 3,
        "title": "Compare remedies for the combined problem",
        "summary": "Compare a universal improvement with a targeted repair.",
        "minutes": 14,
        "learning": {
          "objective": "Compare a universal improvement with a targeted repair.",
          "objectives": [
            "Compare a universal improvement with a targeted repair.",
            "Identify an unintended burden in a proposed remedy.",
            "Draft an explanation that preserves individual choice."
          ],
          "takeaways": [
            "Access to information is incomplete when the opportunity attached to it remains restricted to one format.",
            "The recording addresses one barrier but leaves the assignment pathway unequal.",
            "For each proposed remedy, state the barrier addressed, participant choice preserved, and remaining access gap."
          ],
          "evidence": "A fictional case, an explanation of the available responses, private reflection, and an applied next step.",
          "appliedNextStep": "For each proposed remedy, state the barrier addressed, participant choice preserved, and remaining access gap."
        },
        "scenario": {
          "context": "Fictional learning case. A fictional team offers an accessible recording instead of a live development session, but only live attendees can volunteer for follow-up assignments.",
          "prompt": "What is the most useful next step?",
          "options": [
            {
              "label": "Make assignment information and a comparable expression-of-interest route available to all participants.",
              "response": "Access to information is incomplete when the opportunity attached to it remains restricted to one format.",
              "recommended": true
            },
            {
              "label": "Count access to the recording as proof that the entire opportunity is equitable.",
              "response": "The recording addresses one barrier but leaves the assignment pathway unequal."
            }
          ]
        },
        "transfer": {
          "prompt": "For each proposed remedy, state the barrier addressed, participant choice preserved, and remaining access gap.",
          "options": [
            "Use the fictional case to rehearse the action.",
            "Apply the action to an appropriate process within your responsibility, without recording personal learning responses.",
            "Discuss the fictional case with a willing colleague and compare the evidence each response would produce."
          ]
        },
        "blocks": [
          {
            "type": "text",
            "heading": "Compare remedies for the combined problem",
            "body": "<p>A remedy should respond to the mechanism identified, not merely display awareness of multiple identities. If the problem is that training occurs only after hours, a general improvement might provide work-time options. If an inaccessible format also excludes some participants, changing the schedule alone will not solve the combined barrier. A targeted repair may still be needed alongside the general change. Universal and targeted approaches are not mutually exclusive; they answer different parts of the problem.</p><p>Test each proposed response against the full route. Who learns about the option? Who can request it without disclosing unnecessary information? Who approves it? Does choosing the alternative affect access to mentoring, visibility, or meaningful participation? A recorded session may provide information while excluding the informal discussion that leads to assignments. A separate route can unintentionally become a lower-value route. The question is whether people can obtain a substantially useful opportunity, not whether the organization can point to any alternative at all.</p><p>Preserve the person’s agency. Do not assume that a staff member wants an identity-specific program, a particular mentor, or public recognition of the barrier. Offer relevant options and explain consequences. Where a response involves disability accommodation, discrimination concerns, or other formal rights, use the authorized process and qualified support. This course develops analytical practice; it does not determine legal entitlement or replace professional advice. Avoid presenting an illustrative remedy as a new agency policy.</p><p>Evaluate unintended effects across different participants. A scheduling change may improve access for one group while creating a new conflict for another. That does not mean no change is possible. It means the design needs feedback, a clear purpose, and a way to revise. Document which barrier each component addresses and what evidence would indicate that it is working. In a small pilot, confidential individual feedback may reveal a problem that aggregate participation counts miss, but it must be collected through an appropriate route. Keep private course reflections separate. A strong remedy reduces the actual barrier, preserves meaningful participation, and avoids requiring people to become examples for everyone else’s learning.</p>"
          },
          {
            "type": "statement",
            "body": "Private reflection: Which apparently helpful alternative could become a lower-value route?"
          },
          {
            "type": "knowledgeCheck",
            "id": "div-a03-intersectional-discrimination-3-check",
            "question": "When might both a general improvement and a targeted repair be needed?",
            "options": [
              {
                "text": "Whenever an employee belongs to more than one social category.",
                "correct": false
              },
              {
                "text": "Only when the general improvement has already failed for every participant.",
                "correct": false
              },
              {
                "text": "When a common design change removes one barrier but a distinct access need remains.",
                "correct": true
              }
            ],
            "feedbackCorrect": "Remedies should match the actual interacting conditions. A broad improvement may be valuable while leaving a specific access barrier unresolved.",
            "feedbackIncorrect": "Identity count does not determine the remedy, and universal failure is not a prerequisite for a targeted response. Examine what each proposed component actually changes."
          },
          {
            "type": "flashcards",
            "heading": "Concepts to carry into practice",
            "cards": [
              {
                "front": "Intersectionality",
                "back": "Analysis of how social arrangements and forms of power interact, not a count of identities."
              },
              {
                "front": "Single-axis comparison",
                "back": "An analysis organized around one category that may miss a combined pattern."
              },
              {
                "front": "Interaction map",
                "back": "A sequence connecting rules, resources, interpretations, and consequences."
              },
              {
                "front": "Bounded conclusion",
                "back": "A finding stated at the level justified by the available evidence."
              }
            ]
          },
          {
            "type": "leaderMove",
            "heading": "Put the learning to work",
            "control": "Make assignment information and a comparable expression-of-interest route available to all participants.",
            "failure": "The recording addresses one barrier but leaves the assignment pathway unequal.",
            "next": "For each proposed remedy, state the barrier addressed, participant choice preserved, and remaining access gap."
          }
        ]
      },
      {
        "id": "div-a03-intersectional-discrimination-4",
        "number": 4,
        "title": "Write a bounded case conclusion",
        "summary": "Write a conclusion separating findings from hypotheses.",
        "minutes": 14,
        "learning": {
          "objective": "Write a conclusion separating findings from hypotheses.",
          "objectives": [
            "Write a conclusion separating findings from hypotheses.",
            "Specify what evidence would justify revising the remedy.",
            "Explain the limits of a fictional analysis."
          ],
          "takeaways": [
            "A bounded conclusion preserves the importance of the finding without generalizing beyond the case.",
            "Overstatement undermines the evidence and turns an important case into an unsupported claim about everyone.",
            "Write a six-part conclusion: question, evidence, interaction, remedy, uncertainty, and review responsibility."
          ],
          "evidence": "A fictional case, an explanation of the available responses, private reflection, and an applied next step.",
          "appliedNextStep": "Write a six-part conclusion: question, evidence, interaction, remedy, uncertainty, and review responsibility."
        },
        "scenario": {
          "context": "Fictional learning case. A fictional case review identifies interacting schedule and format barriers. The draft report says the process excludes every disabled woman of color.",
          "prompt": "What is the most useful next step?",
          "options": [
            {
              "label": "Limit the conclusion to the documented mechanisms and specify what broader evidence would be needed.",
              "response": "A bounded conclusion preserves the importance of the finding without generalizing beyond the case.",
              "recommended": true
            },
            {
              "label": "Keep the universal claim because stronger language will force action.",
              "response": "Overstatement undermines the evidence and turns an important case into an unsupported claim about everyone."
            }
          ]
        },
        "transfer": {
          "prompt": "Write a six-part conclusion: question, evidence, interaction, remedy, uncertainty, and review responsibility.",
          "options": [
            "Use the fictional case to rehearse the action.",
            "Apply the action to an appropriate process within your responsibility, without recording personal learning responses.",
            "Discuss the fictional case with a willing colleague and compare the evidence each response would produce."
          ]
        },
        "blocks": [
          {
            "type": "text",
            "heading": "Write a bounded case conclusion",
            "body": "<p>An advanced case conclusion should be precise enough to be questioned. Begin with the process examined and the evidence available. State the interaction you found, the alternatives you considered, and the information still missing. Avoid a dramatic conclusion that goes beyond the record, such as claiming that every member of a group experiences the same exclusion. Equally, avoid reducing a supported pattern to a personal misunderstanding simply because no single identity category explains it completely.</p><p>Use different language for different levels of certainty. An observed rule can be stated directly. A plausible explanation should be identified as a hypothesis. A proposed improvement should be described as something to test or implement within authority. For example, the requirement for after-hours attendance may be documented; its interaction with caregiving and transport may be established in the fictional case; the likely benefit of a new schedule remains a prediction until examined. This disciplined language makes a recommendation stronger because readers can see what supports it.</p><p>Name ownership and review. A combined barrier often persists because responsibility is divided among units. Assign a coordinating role without pretending that one person controls every component. Specify who can change the schedule, who controls the format, who communicates opportunities, and who checks the result. Agree on a review date and a way for participants to report an unintended problem. Do not require public disclosure of protected or personal information to demonstrate that the change helped.</p><p>The course’s fictional cases are tools for reasoning, not factual claims about DHS employees or communities. Applying the method to actual decisions requires appropriate authority, accurate records, and privacy safeguards. The developmental aim is to move beyond a one-size-fits-all explanation toward attention to how conditions interact. That is compatible with Acceptance and Adaptation in the program’s learning approach, but it does not establish an individual’s IDI orientation. End the analysis with an actionable, limited claim: which barrier will change, why that change is justified, what remains uncertain, and how the organization will know whether meaningful access improved. The result should help a person participate without asking them to simplify their life to fit the organization’s categories.</p>"
          },
          {
            "type": "statement",
            "body": "Private reflection: Where could a precise limitation make your recommendation more credible?"
          },
          {
            "type": "knowledgeCheck",
            "id": "div-a03-intersectional-discrimination-4-check",
            "question": "Which case conclusion is most carefully bounded?",
            "options": [
              {
                "text": "The barrier is unimportant because a single case cannot establish population prevalence.",
                "correct": false
              },
              {
                "text": "The documented combination restricted access in this case; broader prevalence remains unestablished.",
                "correct": true
              },
              {
                "text": "The case establishes the same experience for everyone in the combined group.",
                "correct": false
              }
            ],
            "feedbackCorrect": "A specific finding can be meaningful and actionable without supporting a universal claim.",
            "feedbackIncorrect": "Avoid both overgeneralization and dismissal. The scope of the claim should match the evidence, while the identified barrier still receives an appropriate response."
          },
          {
            "type": "flashcards",
            "heading": "Concepts to carry into practice",
            "cards": [
              {
                "front": "Intersectionality",
                "back": "Analysis of how social arrangements and forms of power interact, not a count of identities."
              },
              {
                "front": "Single-axis comparison",
                "back": "An analysis organized around one category that may miss a combined pattern."
              },
              {
                "front": "Interaction map",
                "back": "A sequence connecting rules, resources, interpretations, and consequences."
              },
              {
                "front": "Bounded conclusion",
                "back": "A finding stated at the level justified by the available evidence."
              }
            ]
          },
          {
            "type": "leaderMove",
            "heading": "Put the learning to work",
            "control": "Limit the conclusion to the documented mechanisms and specify what broader evidence would be needed.",
            "failure": "Overstatement undermines the evidence and turns an important case into an unsupported claim about everyone.",
            "next": "Write a six-part conclusion: question, evidence, interaction, remedy, uncertainty, and review responsibility."
          }
        ]
      }
    ]
  },
  "jobAid": {
    "title": "Intersectional Discrimination: Advanced Case Analysis — practice guide",
    "subtitle": "A working aid for examining a decision, preparing a response, and checking what changed.",
    "use": {
      "purpose": "Analyze interacting forms of exclusion through carefully bounded cases, avoiding both single-category explanations and assumptions based on identity.",
      "remember": [
        "Keep evidence, interpretation, and proposed action distinct.",
        "Use authorized work records only; keep private learning responses out of personnel records.",
        "A course exercise does not replace formal policy, complaint procedures, professional assessment, or decision authority."
      ],
      "doNext": "Write a six-part conclusion: question, evidence, interaction, remedy, uncertainty, and review responsibility."
    },
    "sections": [
      {
        "heading": "Map the case",
        "items": [
          "State the outcome and reconstruct the sequence.",
          "List rules, available resources, and interpretations at each step.",
          "Mark observed facts, hypotheses, and unknowns separately."
        ]
      },
      {
        "heading": "Test the explanation",
        "items": [
          "Ask what would disconfirm the proposed interaction.",
          "Choose a relevant comparison and explain its limitations.",
          "Use authorized data and protect small groups from identification."
        ]
      },
      {
        "heading": "Design the remedy",
        "items": [
          "Address each component of the combined barrier.",
          "Check whether an alternative offers meaningful opportunity.",
          "Preserve choice and avoid unnecessary identity disclosure.",
          "Name coordination, decision authority, and the review date."
        ]
      },
      {
        "heading": "Complete a practice record",
        "items": [
          "Decision or situation: describe one concrete example and the specific part within your responsibility.",
          "Evidence: record the observed sequence and identify what is still uncertain; do not include private course reflections or unnecessary personal details.",
          "Proposed action: Write a six-part conclusion: question, evidence, interaction, remedy, uncertainty, and review responsibility.",
          "Review: name the person responsible, an appropriate review date, and the evidence that would support continuing, revising, or stopping the change.",
          "Return the result: explain what changed and why to the people who need that information, using an appropriate authorized channel."
        ]
      }
    ]
  },
  "sources": [
    {
      "title": "Crenshaw (1989), Demarginalizing the Intersection of Race and Sex",
      "href": "https://chicagounbound.uchicago.edu/uclf/vol1989/iss1/8/",
      "note": "Foundational primary legal scholarship on the limits of separate race and sex categories. Cases here are original learning examples, not legal determinations."
    },
    {
      "title": "Crenshaw (1991), Mapping the Margins",
      "href": "https://evallab.unm.edu/restricted-materials/crenshaw-1991---intersectionality.pdf",
      "note": "University-hosted original article on structural and political intersectionality. Its specific context should not be flattened into a universal identity checklist."
    }
  ]
};

export default pack;
