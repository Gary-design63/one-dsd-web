// Keep the recovered source unchanged; these editorial replacements remove
// repeated or unsuitable imagery from published lesson pages.
export const lessonImageOverrides: Record<string, { src: string; alt: string; caption?: string }> = {
  "/images/course-61/cover-huddle.jpg": {
    src: "/images/lessons/change-management-intro.webp",
    alt: "Four colleagues review a process timeline together at a table.",
  },
  "/images/course-61/repair-huddle.jpg": {
    src: "/images/lessons/change-management-repair.webp",
    alt: "Three colleagues mark up a one-page change brief together.",
  },
  "/images/course-9/cover-meeting.jpg": {
    src: "/images/lessons/accessibility-leadership-meeting.webp",
    alt: "Colleagues hold an accessible meeting with a wheelchair user and caption display.",
    caption: "Access is visible in who can enter, hear, speak, and participate as an equal colleague.",
  },
  "/images/course-el/cover-lead.jpg": {
    src: "/images/lessons/equity-leadership-systems.webp",
    alt: "Three leaders consider a process map together in an office.",
    caption: "Leadership is the next decision: what will this group change in the process?",
  },
  "/images/course-el/huddle.jpg": {
    src: "/images/lessons/equity-leadership-huddle.webp",
    alt: "A process map and notes are spread across a working table.",
    caption: "Coaching is work, not a stage or a verdict on a person.",
  },
  "/images/course-hw/cover-kitchen.jpg?v=2": {
    src: "/images/lessons/health-wellness-kitchen.webp",
    alt: "An adult wheelchair user prepares a meal while a support worker stands nearby.",
    caption: "Wellness looks like a person doing a real thing with support nearby. Safety is not a locked door.",
  },
  "/images/course-hw/listening.jpg": {
    src: "/images/lessons/health-wellness-listening.webp",
    alt: "A support worker listens as a man with a walker describes what he wants.",
  },
  "/images/course-la/cover-counter.jpg": {
    src: "/images/lessons/language-access-counter.webp",
    alt: "A visitor and staff member use a remote interpretation tablet at a service counter.",
  },
  "/images/course-min/front-desk.jpg": {
    src: "/images/lessons/data-minimization-counter.webp",
    alt: "An accessible reception counter offers standard and large-print forms.",
  },
  "/images/course-rec/huddle.jpg": {
    src: "/images/lessons/the-record-packet.webp",
    alt: "Two colleagues review a case packet and checklist together.",
  },
  "/images/course-so/cover-outreach.jpg": {
    src: "/images/lessons/sourcing-outreach.webp",
    alt: "Community outreach staff speak with an older visitor at a resource table.",
  },
  "/images/course-vs/cover-survey.jpg": {
    src: "/images/lessons/viewpoint-surveys.webp",
    alt: "A tablet, paper survey cards, and a feedback box sit on a table.",
  },
};
