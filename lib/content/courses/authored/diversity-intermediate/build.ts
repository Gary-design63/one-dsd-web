import type { CoursePack, Source } from "../../source-types";

export type StudyLesson = {
  title: string; objectives: string[]; teaching: string[]; case: string;
  question: string; options: [string, string, string]; reasons: [string, string, string];
  check: string; answer: string; distractors: [string, string]; explanation: string;
  reflection: string; practice: string;
};
export function intermediatePack(input: {
  id: string; number: number; title: string; subtitle: string; sources: Source[];
  lessons: StudyLesson[]; aid: { title: string; sections: { heading: string; items: string[] }[] };
}): CoursePack {
  return {
    course: {
      id: input.id, indexNumber: 1310 + input.number,
      seriesLabel: "Diversity learning · Intermediate", title: input.title,
      subtitle: input.subtitle,
      scope: "For One DHS and One DSD staff who want to examine difference, practice a response, and reflect on its effects. Participation is voluntary, and every lesson is open without prerequisites. Use fictional examples for private reflection; no personal disclosure or group identity assessment is requested. Completion does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
      treatment: "Four lessons with original fictional cases, response practice, knowledge checks, reflection, and a reusable job aid.",
      duration: "About 48 minutes, plus optional practice", author: "One DHS / One DSD — People, Access and Culture",
      coverImage: "/images/covers/stock-people-10.jpg", coverAlt: "Five colleagues seated around a conference table with notebooks and laptops.",
      kind: "course", contentType: "practice",
      governance: { contentOwner: "One DHS / One DSD — People, Access and Culture", reviewers: [], evidenceDate: "2026-09-22", lastReviewed: "2026-09-22", nextReview: "2027-03-22", updateTriggers: ["New research changes a source interpretation", "Staff identify an unclear or misleading example"], relatedDoor: "/learn", toolkitQuestion: "What assumptions shape this decision, and what evidence could change it?", status: "current" },
      learning: { objectives: input.lessons.map(l => l.objectives[0]), evidence: ["Explain a response to each fictional case.", "Use the job aid to prepare one proportionate action.", "Distinguish an intended improvement from evidence that it occurred."], appliedNextStep: input.lessons[3].practice },
      lessons: input.lessons.map((l, i) => ({
        id: `${input.id}-lesson-${i + 1}`, number: i + 1, title: l.title, summary: l.objectives[0], minutes: 12,
        learning: { objective: l.objectives[0], objectives: l.objectives, takeaways: [l.explanation, l.reasons[1], l.practice], evidence: l.explanation, appliedNextStep: l.practice },
        scenario: { context: l.case, prompt: l.question, options: l.options.map((label, j) => ({ label, response: l.reasons[j], recommended: j === 1 })) },
        transfer: { prompt: l.practice, options: ["Rehearse with the fictional case.", "Adapt the practice to a situation within my responsibility.", "Return to this practice when it is useful."] },
        blocks: [
          ...l.teaching.map((body, j) => ({ type: "text" as const, ...(j === 0 ? { heading: l.title } : {}), body })),
          { type: "text", heading: "A fictional practice case", body: l.case },
          { type: "knowledgeCheck", id: `${input.id}-check-${i + 1}`, question: l.check,
            options: [{ text: l.distractors[0], correct: false }, { text: l.answer, correct: true }, { text: l.distractors[1], correct: false }],
            feedbackCorrect: l.explanation, feedbackIncorrect: l.explanation },
          { type: "text", heading: "Private reflection", body: l.reflection },
          { type: "text", heading: "Applied practice", body: l.practice },
          ...(i === 3 ? [{ type: "flashcards" as const, heading: "Keep the distinctions clear", cards: input.aid.sections.map(s => ({ front: s.heading, back: s.items[0] })) }] : []),
        ],
      })),
    },
    jobAid: { title: input.aid.title, subtitle: "A personal practice aid for voluntary learning; use fictional or nonidentifying details.",
      use: { purpose: input.subtitle, remember: ["Attend to observable actions and effects.", "Do not infer another person's identity, motive, or IDI orientation.", "Use established workplace support channels when a concern needs a formal response."], doNext: input.lessons[3].practice }, sections: [...input.aid.sections, { heading: "Complete a private practice note", items: ["Situation: describe the fictional case or a nonidentifying work process in two sentences. Separate what was observed from what remains uncertain. Do not include a colleague's private history or guess at an identity.", "Response: write the actual words or process change you would use, identify the role that can act, and explain why the response fits the stated purpose.", "Review: choose an ordinary observation that could show improvement, a point to reconsider the approach, and one possible unintended effect. A completed note shows preparation; only later evidence can show whether the action helped."] }] },
    sources: input.sources,
  };
}
