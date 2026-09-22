import type { CoursePack } from "../../source-types";

const pack: CoursePack = {
  "course": {
    "id": "div-a01-aversive-racism",
    "indexNumber": 1321,
    "seriesLabel": "Diversity learning · Advanced",
    "title": "Aversive Racism and Discrimination Under Ambiguity",
    "subtitle": "Examine how unequal judgments can persist alongside sincere commitments to fairness, and practice reducing the ambiguity that permits them.",
    "scope": "For staff, facilitators, supervisors, and leaders in One DHS and One DSD People, Access and Culture. Open to everyone; no prior course or assessment is required. Participation is voluntary. Use fictional examples if you prefer not to reflect on personal experiences. Do not place private reflections or inferred intercultural orientations in employee records. Completion does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    "treatment": "Four substantive lessons with fictional cases, reasoned feedback, concept cards, private reflection, applied practice, a reusable job aid, and source reading.",
    "duration": "About 56 minutes, plus optional practice",
    "author": "One DHS / One DSD — People, Access and Culture",
    "coverImage": "/images/covers/stock-people-10.jpg",
    "coverAlt": "Five colleagues seated around a white conference table in a glass-walled meeting room.",
    "introTranscript": "Examine how unequal judgments can persist alongside sincere commitments to fairness, and practice reducing the ambiguity that permits them.",
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
        "Distinguish an aversive-racism hypothesis from a judgment about a colleague.",
        "Map three points where discretion enters a service decision.",
        "Draft criteria before reviewing a fictional case.",
        "Select a process measure and an outcome measure."
      ],
      "evidence": [
        "Explain the reasoning behind a response to each fictional case.",
        "Use the course job aid to propose an observable change and a way to review it."
      ],
      "appliedNextStep": "Write a review note with process adherence, outcomes, alternative explanations, next decision, owner, and date."
    },
    "lessons": [
      {
        "id": "div-a01-aversive-racism-1",
        "number": 1,
        "title": "When values and decisions diverge",
        "summary": "Distinguish an aversive-racism hypothesis from a judgment about a colleague.",
        "minutes": 14,
        "learning": {
          "objective": "Distinguish an aversive-racism hypothesis from a judgment about a colleague.",
          "objectives": [
            "Distinguish an aversive-racism hypothesis from a judgment about a colleague.",
            "Identify an ambiguous criterion in a fictional decision.",
            "Separate evidence of unequal treatment from an interpretation about intent."
          ],
          "takeaways": [
            "An equivalent opportunity addresses the observable inconsistency without claiming to know anyone’s motives.",
            "A statement of values does not establish how missing evidence was handled for each candidate.",
            "Rewrite one ambiguous criterion as observable evidence and specify how missing information will be handled."
          ],
          "evidence": "A fictional case, an explanation of the available responses, private reflection, and an applied next step.",
          "appliedNextStep": "Rewrite one ambiguous criterion as observable evidence and specify how missing information will be handled."
        },
        "scenario": {
          "context": "Fictional learning case. Two fictional candidates have similarly incomplete work samples. A panel calls one a growth opportunity and the other a risk. No clarification rule was established.",
          "prompt": "What is the most useful next step?",
          "options": [
            {
              "label": "Compare the evidence and offer an equivalent clarification process where the selection rules permit it.",
              "response": "An equivalent opportunity addresses the observable inconsistency without claiming to know anyone’s motives.",
              "recommended": true
            },
            {
              "label": "Ask panelists whether they believe in equality and accept their reassurance.",
              "response": "A statement of values does not establish how missing evidence was handled for each candidate."
            }
          ]
        },
        "transfer": {
          "prompt": "Rewrite one ambiguous criterion as observable evidence and specify how missing information will be handled.",
          "options": [
            "Use the fictional case to rehearse the action.",
            "Apply the action to an appropriate process within your responsibility, without recording personal learning responses.",
            "Discuss the fictional case with a willing colleague and compare the evidence each response would produce."
          ]
        },
        "blocks": [
          {
            "type": "text",
            "heading": "When values and decisions diverge",
            "body": "<p>A person can sincerely endorse racial equality and still participate in a decision that disadvantages someone because of race. The aversive-racism framework investigates that tension. Its practical value is not a new label for colleagues. It directs attention toward decisions where the rules permit several plausible explanations. An evaluator may describe one applicant as promising and another as unproven despite comparable evidence. Neither description is necessarily wrong in isolation. The important question is whether the standard changes with the person being evaluated.</p><p>Dovidio and Gaertner examined simulated selection decisions in their selection study. Their work supports examining ambiguity rather than relying only on expressed attitudes. It does not establish that every discretionary decision is racially biased or that an individual can be classified from one encounter. A useful workplace inquiry therefore starts with the decision record: what was known, what counted, what was missing, and when the criteria were chosen. Statements of good intention belong in the conversation, but they cannot substitute for those questions.</p><p>Consider the difference between uncertainty and discretion. Uncertainty means the evidence is incomplete. Discretion means someone has authority to interpret evidence or choose among permissible options. Neither can be eliminated entirely in human services. The risk increases when uncertainty is resolved differently for different people and the difference is invisible to review. A familiar applicant receives another interview to clarify a weak example; an unfamiliar applicant is rejected for the same weakness. The extra opportunity, rather than the final score alone, becomes the relevant comparison.</p><p>Your task is to make that comparison possible without pretending to read minds. Write the criterion in behavior-based terms. Identify whose evidence was clarified and whose was not. Ask what would happen if the identities were changed while the evidence remained constant. This counterfactual is a reasoning exercise, not proof of discrimination. It can reveal where further examination is needed. Preserve legitimate contextual differences, including disability-related access needs, instead of insisting that fairness always means identical treatment. A stronger conclusion identifies a specific inconsistent practice and a defensible correction, while acknowledging what the available record cannot tell you.</p>"
          },
          {
            "type": "statement",
            "body": "Private reflection: When have you treated familiarity as evidence of ability? Use a fictional example if preferred."
          },
          {
            "type": "knowledgeCheck",
            "id": "div-a01-aversive-racism-1-check",
            "question": "What would most strengthen an inquiry into possible aversive racism in a discretionary decision?",
            "options": [
              {
                "text": "Compare how equivalent evidence and uncertainty were treated across relevant cases.",
                "correct": true
              },
              {
                "text": "Use the decision maker’s stated commitment to fairness as the principal measure.",
                "correct": false
              },
              {
                "text": "Treat any exercise of discretion as sufficient evidence of racial discrimination.",
                "correct": false
              }
            ],
            "feedbackCorrect": "Comparable decision evidence tests whether the standard shifted. Neither an assurance of fairness nor discretion alone answers that question.",
            "feedbackIncorrect": "The framework directs attention to how decisions operate under ambiguity. It does not diagnose people from their values or make all discretion discriminatory."
          },
          {
            "type": "flashcards",
            "heading": "Concepts to carry into practice",
            "cards": [
              {
                "front": "Aversive-racism framework",
                "back": "A framework for examining how egalitarian commitments can coexist with subtle racial discrimination; not a diagnosis of a colleague."
              },
              {
                "front": "Ambiguity",
                "back": "Room for multiple interpretations that may permit standards to shift."
              },
              {
                "front": "Counterfactual comparison",
                "back": "Ask whether the same evidence would receive the same interpretation if identities changed; a prompt for inquiry, not proof."
              },
              {
                "front": "Process evidence",
                "back": "Records of how a decision was reached, including clarification and exceptions."
              }
            ]
          },
          {
            "type": "leaderMove",
            "heading": "Put the learning to work",
            "control": "Compare the evidence and offer an equivalent clarification process where the selection rules permit it.",
            "failure": "A statement of values does not establish how missing evidence was handled for each candidate.",
            "next": "Rewrite one ambiguous criterion as observable evidence and specify how missing information will be handled."
          }
        ]
      },
      {
        "id": "div-a01-aversive-racism-2",
        "number": 2,
        "title": "Ambiguity in ordinary service decisions",
        "summary": "Map three points where discretion enters a service decision.",
        "minutes": 14,
        "learning": {
          "objective": "Map three points where discretion enters a service decision.",
          "objectives": [
            "Map three points where discretion enters a service decision.",
            "Compare alternative explanations for an uneven pattern.",
            "Propose a consistent method for documenting exceptions."
          ],
          "takeaways": [
            "The response examines access to discretion and makes the available options more consistent.",
            "The pattern needs explanation; attributing a motive to all reviewers exceeds the evidence and does not repair the route.",
            "Create a four-field exception record: requirement, evidence, authorized option, and reason."
          ],
          "evidence": "A fictional case, an explanation of the available responses, private reflection, and an applied next step.",
          "appliedNextStep": "Create a four-field exception record: requirement, evidence, authorized option, and reason."
        },
        "scenario": {
          "context": "Fictional learning case. A fictional team grants deadline extensions after telephone requests but rarely after written requests. Some callers receive suggestions about documents the written notice never mentions.",
          "prompt": "What is the most useful next step?",
          "options": [
            {
              "label": "Map the extension route and revise the notice and review process so the same authorized options are visible.",
              "response": "The response examines access to discretion and makes the available options more consistent.",
              "recommended": true
            },
            {
              "label": "Conclude that the disparity proves every telephone reviewer is biased.",
              "response": "The pattern needs explanation; attributing a motive to all reviewers exceeds the evidence and does not repair the route."
            }
          ]
        },
        "transfer": {
          "prompt": "Create a four-field exception record: requirement, evidence, authorized option, and reason.",
          "options": [
            "Use the fictional case to rehearse the action.",
            "Apply the action to an appropriate process within your responsibility, without recording personal learning responses.",
            "Discuss the fictional case with a willing colleague and compare the evidence each response would produce."
          ]
        },
        "blocks": [
          {
            "type": "text",
            "heading": "Ambiguity in ordinary service decisions",
            "body": "<p>Ambiguity often enters public service through ordinary words: reasonable, cooperative, ready, difficult, appropriate, or professional. These words can summarize meaningful evidence, but they can also conceal its absence. A reviewer who writes that a caller was uncooperative may mean that a required document was not supplied. Another reviewer may mean that the caller questioned the process. Those are different events with different implications. Replacing the label with the observable event creates an opportunity to respond proportionately rather than to a reputation.</p><p>Map a decision from intake to resolution. At each step, ask who can extend a deadline, seek clarification, accept alternative documentation, or refer a case for specialist review. Then ask how a person learns those options exist. An exception available only to confident callers is not equally available in practice. This course does not create authority to waive a requirement. It asks you to examine how existing authority is exercised and whether the published route matches the route people actually experience.</p><p>An uneven pattern is a reason to investigate, not a complete explanation. Differences may involve case complexity, communication access, timing, missing information, or unequal assumptions. Examine comparable cases and keep those alternatives visible. Avoid comparing broad group averages while ignoring important process differences. Also avoid using the existence of any possible alternative as a reason to stop examining the pattern. A careful review asks which explanation fits the documented sequence and what additional information would distinguish competing accounts.</p><p>Documentation should make reasoning reviewable without adding unnecessary sensitive details. Record the requirement, the relevant evidence, the permitted exception, and the reason it applied. Use the same fields across cases. Do not record speculative racial attitudes, inferred IDI orientations, or a staff member’s private learning response. If a concern involves discrimination or retaliation, preserve the appropriate formal route rather than converting the issue into an informal learning exercise. For everyday process improvement, examine whether comparable situations receive comparable opportunities to be understood. That question makes fairness concrete while leaving room for legitimate differences in need, evidence, and authorized service response.</p>"
          },
          {
            "type": "statement",
            "body": "Private reflection: Which reassuring label in your work would be more useful as a description of observable events?"
          },
          {
            "type": "knowledgeCheck",
            "id": "div-a01-aversive-racism-2-check",
            "question": "Two units have different exception rates. What is the most defensible initial interpretation?",
            "options": [
              {
                "text": "The lower rate is necessarily fairer because it shows stronger consistency.",
                "correct": false
              },
              {
                "text": "The higher rate is necessarily fairer because it shows greater flexibility.",
                "correct": false
              },
              {
                "text": "The difference warrants examination of comparable cases, access to options, and reasons for exceptions.",
                "correct": true
              }
            ],
            "feedbackCorrect": "A rate alone does not show whether exceptions were authorized, accessible, or applied consistently to relevant circumstances.",
            "feedbackIncorrect": "Both rigid refusal and inconsistent flexibility can create problems. Examine the route and evidence before treating a higher or lower number as the answer."
          },
          {
            "type": "flashcards",
            "heading": "Concepts to carry into practice",
            "cards": [
              {
                "front": "Aversive-racism framework",
                "back": "A framework for examining how egalitarian commitments can coexist with subtle racial discrimination; not a diagnosis of a colleague."
              },
              {
                "front": "Ambiguity",
                "back": "Room for multiple interpretations that may permit standards to shift."
              },
              {
                "front": "Counterfactual comparison",
                "back": "Ask whether the same evidence would receive the same interpretation if identities changed; a prompt for inquiry, not proof."
              },
              {
                "front": "Process evidence",
                "back": "Records of how a decision was reached, including clarification and exceptions."
              }
            ]
          },
          {
            "type": "leaderMove",
            "heading": "Put the learning to work",
            "control": "Map the extension route and revise the notice and review process so the same authorized options are visible.",
            "failure": "The pattern needs explanation; attributing a motive to all reviewers exceeds the evidence and does not repair the route.",
            "next": "Create a four-field exception record: requirement, evidence, authorized option, and reason."
          }
        ]
      },
      {
        "id": "div-a01-aversive-racism-3",
        "number": 3,
        "title": "Design a decision that can be checked",
        "summary": "Draft criteria before reviewing a fictional case.",
        "minutes": 14,
        "learning": {
          "objective": "Draft criteria before reviewing a fictional case.",
          "objectives": [
            "Draft criteria before reviewing a fictional case.",
            "Distinguish useful structure from a rigid rule that blocks access.",
            "Identify a review trigger for inconsistent judgments."
          ],
          "takeaways": [
            "The response prevents a preference formed around one person from becoming an unexplained standard for everyone.",
            "Numbers can preserve subjective assumptions; the evidence and meaning behind the scores still need examination.",
            "Draft a review trigger for an unexplained change in criteria and identify who can review it."
          ],
          "evidence": "A fictional case, an explanation of the available responses, private reflection, and an applied next step.",
          "appliedNextStep": "Draft a review trigger for an unexplained change in criteria and identify who can review it."
        },
        "scenario": {
          "context": "Fictional learning case. A fictional panel adds executive presence after meeting a favored applicant. Two members want to average their scores and proceed.",
          "prompt": "What is the most useful next step?",
          "options": [
            {
              "label": "Return to the preselected job-related criteria and document any justified change before applying it consistently.",
              "response": "The response prevents a preference formed around one person from becoming an unexplained standard for everyone.",
              "recommended": true
            },
            {
              "label": "Average the scores because numerical results are automatically objective.",
              "response": "Numbers can preserve subjective assumptions; the evidence and meaning behind the scores still need examination."
            }
          ]
        },
        "transfer": {
          "prompt": "Draft a review trigger for an unexplained change in criteria and identify who can review it.",
          "options": [
            "Use the fictional case to rehearse the action.",
            "Apply the action to an appropriate process within your responsibility, without recording personal learning responses.",
            "Discuss the fictional case with a willing colleague and compare the evidence each response would produce."
          ]
        },
        "blocks": [
          {
            "type": "text",
            "heading": "Design a decision that can be checked",
            "body": "<p>A structured decision process is useful when it makes relevant reasoning visible. Structure is less useful when it simply turns the same vague assumptions into boxes on a form. Requiring a numerical score for professionalism does not resolve what professionalism means. A stronger criterion identifies the behavior needed for the work, the evidence that could demonstrate it, and the range of acceptable ways a person might show that evidence. Clear written communication, for example, should not quietly become a preference for a familiar accent during an oral interview.</p><p>Choose criteria before looking at the people or cases being evaluated whenever practical. Otherwise, an appealing candidate or a difficult encounter can reshape what seems important. Specify the weight of each criterion and the method for handling missing information. If an exception is necessary, document it openly and consider whether comparable cases should receive the same opportunity. A process that can never admit new information may be consistent yet still unfair; consistency needs to serve the underlying purpose rather than replace it.</p><p>Independent initial judgments can help a group see where interpretations differ before a confident speaker establishes the answer. Ask reviewers to record evidence and uncertainty, then discuss the largest disagreements. Do not assume that averaging scores corrects bias. An average can conceal a systematic problem shared by every reviewer. Examine whether the disagreement concerns evidence, the meaning of a criterion, or an unsupported impression. Resolve those differences with reference to the work rather than seniority or persuasive style.</p><p>Build a review trigger into the process. A trigger might be repeated use of an undefined term, unequal opportunities to clarify, or a large difference between initial and final judgments without new evidence. The trigger invites examination; it is not a declaration of wrongdoing. Decide who can review a concern independently and how the people affected can challenge an error. Preserve authorized accommodation and complaint processes. Structure succeeds when it improves the quality and accessibility of the decision and gives people a usable way to question it. It is not a guarantee that bias has disappeared, and it cannot replace thoughtful attention to context.</p>"
          },
          {
            "type": "statement",
            "body": "Private reflection: Where might a form create the appearance of fairness without improving reasoning?"
          },
          {
            "type": "knowledgeCheck",
            "id": "div-a01-aversive-racism-3-check",
            "question": "Which design feature makes a scoring rubric more reviewable?",
            "options": [
              {
                "text": "A final average that removes the need to explain disagreement among reviewers.",
                "correct": false
              },
              {
                "text": "A description of the job-related evidence that supports each criterion and how uncertainty is handled.",
                "correct": true
              },
              {
                "text": "A larger numerical scale that permits finer distinctions between overall impressions.",
                "correct": false
              }
            ],
            "feedbackCorrect": "Reviewability comes from the relationship between evidence and judgment. More numbers or an average cannot supply missing reasons.",
            "feedbackIncorrect": "Precision in a score is different from clarity in the standard. Reviewers must be able to explain what the score represents and why relevant judgments differ."
          },
          {
            "type": "flashcards",
            "heading": "Concepts to carry into practice",
            "cards": [
              {
                "front": "Aversive-racism framework",
                "back": "A framework for examining how egalitarian commitments can coexist with subtle racial discrimination; not a diagnosis of a colleague."
              },
              {
                "front": "Ambiguity",
                "back": "Room for multiple interpretations that may permit standards to shift."
              },
              {
                "front": "Counterfactual comparison",
                "back": "Ask whether the same evidence would receive the same interpretation if identities changed; a prompt for inquiry, not proof."
              },
              {
                "front": "Process evidence",
                "back": "Records of how a decision was reached, including clarification and exceptions."
              }
            ]
          },
          {
            "type": "leaderMove",
            "heading": "Put the learning to work",
            "control": "Return to the preselected job-related criteria and document any justified change before applying it consistently.",
            "failure": "Numbers can preserve subjective assumptions; the evidence and meaning behind the scores still need examination.",
            "next": "Draft a review trigger for an unexplained change in criteria and identify who can review it."
          }
        ]
      },
      {
        "id": "div-a01-aversive-racism-4",
        "number": 4,
        "title": "Check whether the repair changed the pattern",
        "summary": "Select a process measure and an outcome measure.",
        "minutes": 14,
        "learning": {
          "objective": "Select a process measure and an outcome measure.",
          "objectives": [
            "Select a process measure and an outcome measure.",
            "Explain why a small before-and-after comparison cannot establish causation.",
            "Write a review statement that includes uncertainty."
          ],
          "takeaways": [
            "The record supports a process improvement while the small, changing sample limits causal claims.",
            "Neither twelve cases nor a narrower difference establishes elimination of bias or isolates the effect of training.",
            "Write a review note with process adherence, outcomes, alternative explanations, next decision, owner, and date."
          ],
          "evidence": "A fictional case, an explanation of the available responses, private reflection, and an applied next step.",
          "appliedNextStep": "Write a review note with process adherence, outcomes, alternative explanations, next decision, owner, and date."
        },
        "scenario": {
          "context": "Fictional learning case. A fictional team offered all candidates clarification this month. Selection differences narrowed, but only twelve applications were reviewed and job requirements changed.",
          "prompt": "What is the most useful next step?",
          "options": [
            {
              "label": "Report improved consistency in clarification and treat the outcome difference as preliminary.",
              "response": "The record supports a process improvement while the small, changing sample limits causal claims.",
              "recommended": true
            },
            {
              "label": "Announce that the training eliminated racial bias.",
              "response": "Neither twelve cases nor a narrower difference establishes elimination of bias or isolates the effect of training."
            }
          ]
        },
        "transfer": {
          "prompt": "Write a review note with process adherence, outcomes, alternative explanations, next decision, owner, and date.",
          "options": [
            "Use the fictional case to rehearse the action.",
            "Apply the action to an appropriate process within your responsibility, without recording personal learning responses.",
            "Discuss the fictional case with a willing colleague and compare the evidence each response would produce."
          ]
        },
        "blocks": [
          {
            "type": "text",
            "heading": "Check whether the repair changed the pattern",
            "body": "<p>A revised form is an implementation result. It is not yet evidence that decisions became fairer. After introducing a clarification rule, check whether people actually received clarification, whether the information helped decisions, and whether disparities changed. These are distinct questions. A process can be followed faithfully and still fail to address the original barrier. It can also improve an experience before a small sample provides a stable estimate of changes in final outcomes.</p><p>Select measures that correspond to the proposed mechanism. If the problem was unequal access to clarification, examine the proportion of comparable cases offered clarification and the time allowed to respond. If the concern was shifting criteria, examine how often criteria change and whether the reason is documented. An outcome measure might examine selection or completion patterns where collection and analysis are authorized. Do not collect personal identity information simply because it would make a chart more interesting. Use approved data, appropriate privacy protections, and specialist assistance when small groups could be identifiable.</p><p>Interpret results with the design in mind. A before-and-after improvement could reflect the revised process, a different mix of cases, staffing changes, or chance. A small pilot may reveal feasibility and obvious harms more readily than a reliable effect size. Record those limitations before celebrating success. Equally, a lack of measurable change does not establish that the underlying concern was imaginary. The intervention may have been weak, inconsistently used, aimed at the wrong step, or evaluated over too short a period.</p><p>Close the loop with the people responsible for the process. Report what changed, what was observed, what remains uncertain, and what happens next. Include a route for affected people to describe problems that the chosen measures miss. In the program’s developmental language, movement from Minimization toward Acceptance and Adaptation involves noticing meaningful differences and changing practice in response. It does not require labeling individual staff. A defensible review concludes with a decision to continue, revise, stop, or investigate further, along with an owner and a date. That makes accountability practical without overstating what a training course or a single pilot can prove.</p>"
          },
          {
            "type": "statement",
            "body": "Private reflection: What evidence would make you revise your preferred explanation of a decision pattern?"
          },
          {
            "type": "knowledgeCheck",
            "id": "div-a01-aversive-racism-4-check",
            "question": "A pilot shows that a clarification rule was followed reliably. Which conclusion does that finding directly support?",
            "options": [
              {
                "text": "The intended clarification process was implemented in the reviewed cases.",
                "correct": true
              },
              {
                "text": "The rule caused all observed changes in selection outcomes.",
                "correct": false
              },
              {
                "text": "The decision makers no longer hold implicit racial associations.",
                "correct": false
              }
            ],
            "feedbackCorrect": "Process adherence is an implementation finding. Causal outcome claims and claims about private associations require different evidence.",
            "feedbackIncorrect": "Match the conclusion to the measure. A record of completed clarification steps does not establish changes in motives, associations, or every subsequent outcome."
          },
          {
            "type": "flashcards",
            "heading": "Concepts to carry into practice",
            "cards": [
              {
                "front": "Aversive-racism framework",
                "back": "A framework for examining how egalitarian commitments can coexist with subtle racial discrimination; not a diagnosis of a colleague."
              },
              {
                "front": "Ambiguity",
                "back": "Room for multiple interpretations that may permit standards to shift."
              },
              {
                "front": "Counterfactual comparison",
                "back": "Ask whether the same evidence would receive the same interpretation if identities changed; a prompt for inquiry, not proof."
              },
              {
                "front": "Process evidence",
                "back": "Records of how a decision was reached, including clarification and exceptions."
              }
            ]
          },
          {
            "type": "leaderMove",
            "heading": "Put the learning to work",
            "control": "Report improved consistency in clarification and treat the outcome difference as preliminary.",
            "failure": "Neither twelve cases nor a narrower difference establishes elimination of bias or isolates the effect of training.",
            "next": "Write a review note with process adherence, outcomes, alternative explanations, next decision, owner, and date."
          }
        ]
      }
    ]
  },
  "jobAid": {
    "title": "Aversive Racism and Discrimination Under Ambiguity — practice guide",
    "subtitle": "A working aid for examining a decision, preparing a response, and checking what changed.",
    "use": {
      "purpose": "Examine how unequal judgments can persist alongside sincere commitments to fairness, and practice reducing the ambiguity that permits them.",
      "remember": [
        "Keep evidence, interpretation, and proposed action distinct.",
        "Use authorized work records only; keep private learning responses out of personnel records.",
        "A course exercise does not replace formal policy, complaint procedures, professional assessment, or decision authority."
      ],
      "doNext": "Write a review note with process adherence, outcomes, alternative explanations, next decision, owner, and date."
    },
    "sections": [
      {
        "heading": "Before the decision",
        "items": [
          "Name the decision and the authority responsible for it.",
          "Write the relevant criteria and acceptable evidence before examining identities.",
          "Specify clarification, accommodation, and exception routes."
        ]
      },
      {
        "heading": "During review",
        "items": [
          "Record evidence separately from impressions.",
          "Compare opportunities to provide missing information.",
          "Mark changes in criteria and require a documented reason.",
          "Escalate concerns through the appropriate formal route when needed."
        ]
      },
      {
        "heading": "After the decision",
        "items": [
          "Check process adherence and outcomes separately.",
          "List alternative explanations and data limitations.",
          "Assign an owner and date to continue, revise, or stop the change."
        ]
      },
      {
        "heading": "Complete a practice record",
        "items": [
          "Decision or situation: describe one concrete example and the specific part within your responsibility.",
          "Evidence: record the observed sequence and identify what is still uncertain; do not include private course reflections or unnecessary personal details.",
          "Proposed action: Write a review note with process adherence, outcomes, alternative explanations, next decision, owner, and date.",
          "Review: name the person responsible, an appropriate review date, and the evidence that would support continuing, revising, or stopping the change.",
          "Return the result: explain what changed and why to the people who need that information, using an appropriate authorized channel."
        ]
      }
    ]
  },
  "sources": [
    {
      "title": "Dovidio and Gaertner (2000), Aversive racism and selection decisions",
      "href": "https://pubmed.ncbi.nlm.nih.gov/11273391/",
      "note": "Abstract and citation record. Experimental selection research supports examining ambiguous decisions; simulated decisions do not diagnose individual staff."
    },
    {
      "title": "Dovidio, Kawakami, and Gaertner (2002), Implicit and explicit prejudice and interracial interaction",
      "href": "https://pubmed.ncbi.nlm.nih.gov/11811635/",
      "note": "Abstract and citation record. Primary interaction study. Measures and impressions are context-dependent; workplace exercises here are program-authored applications."
    },
    {
      "title": "Dovidio and Gaertner, full article",
      "href": "https://cpi.stanford.edu/_media/pdf/Reference%20Media/Dovidio_Gaertner_2000_Discrimination.pdf",
      "note": "University-hosted full primary article for optional examination of the study design and limits."
    }
  ]
};

export default pack;
