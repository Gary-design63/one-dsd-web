export type Flashcard = {
  front: string;
  back: string;
};

export type LeaderMove = {
  heading?: string;
  control: string;
  failure: string;
  next: string;
};

export type ArtifactKind =
  "invitation" | "tagged-document" | "captioned-video" | "plain-language-flyer";

export type ArtifactField = {
  label: string;
  value: string;
};

export type LessonScenarioOption = {
  label: string;
  response: string;
  recommended?: boolean;
};

export type LessonScenario = {
  context: string;
  prompt: string;
  options: LessonScenarioOption[];
};

export type LessonTransfer = {
  prompt: string;
  options: string[];
};

export type ProgramContentType =
  "foundation" | "practice" | "community-context" | "formal-support" | "shared-method";

export type ResourceStatus = "draft" | "reviewed" | "current" | "archived";

export type ResourceGovernance = {
  contentOwner: string;
  reviewers: string[];
  evidenceDate: string;
  lastReviewed: string;
  nextReview: string;
  updateTriggers: string[];
  relatedDoor: string;
  toolkitQuestion: string;
  status: ResourceStatus;
};

export type CourseLearningDesign = {
  objectives: string[];
  evidence: string[];
  appliedNextStep: string;
};

export type LessonLearningDesign = {
  objective: string;
  objectives?: string[];
  takeaways: string[];
  evidence: string;
  appliedNextStep: string;
};

export type JobAidUse = {
  purpose: string;
  remember: string[];
  doNext: string;
};

export type AccordionItem = {
  title: string;
  body: string;
};

export type TabItem = {
  label: string;
  body: string;
};

export type TimelineEvent = {
  year: string;
  title: string;
  body: string;
};

export type CheckOption = {
  text: string;
  correct: boolean;
};

export type SortItem = {
  text: string;
  category: string;
};

export type Block =
  | { type: "image"; src: string; alt: string; caption?: string }
  | {
      type: "video";
      src: string;
      poster?: string;
      captions?: string;
      transcript?: string;
    }
  | { type: "audio"; src: string; transcript: string; label?: string }
  | { type: "text"; heading?: string; body: string }
  | { type: "list"; heading?: string; ordered?: boolean; items: string[] }
  | { type: "statement"; body: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "leaderMove"; heading?: string; control: string; failure: string; next: string }
  | {
      type: "artifact";
      kind: ArtifactKind;
      label: string;
      title: string;
      summary: string;
      fields: ArtifactField[];
      action: string;
    }
  | { type: "flashcards"; heading?: string; cards: Flashcard[] }
  | { type: "accordion"; heading?: string; items: AccordionItem[] }
  | { type: "tabs"; heading?: string; tabs: TabItem[] }
  | { type: "timeline"; heading?: string; events: TimelineEvent[] }
  | {
      type: "knowledgeCheck";
      id: string;
      question: string;
      options: CheckOption[];
      feedbackCorrect: string;
      feedbackIncorrect: string;
    }
  | {
      type: "sorting";
      id: string;
      heading?: string;
      categories: string[];
      items: SortItem[];
    };

export type Lesson = {
  id: string;
  number: number;
  title: string;
  summary: string;
  minutes: number;
  learning?: LessonLearningDesign;
  scenario?: LessonScenario;
  transfer?: LessonTransfer;
  blocks: Block[];
};

export type JobAid = {
  title: string;
  subtitle: string;
  quote?: string;
  use?: JobAidUse;
  sections: { heading: string; items: string[] }[];
};

export type Source = {
  title: string;
  href: string;
  note: string;
};

export type Course = {
  id: string;
  indexNumber: number;
  seriesLabel: string;
  title: string;
  subtitle: string;
  scope: string;
  treatment: string;
  duration: string;
  author: string;
  coverImage: string;
  coverAlt: string;
  coverVideo?: string;
  coverCaptions?: string;
  introAudio?: string;
  introTranscript?: string;
  hubFile?: string;
  kind?: "course" | "tutorial";
  contentType?: ProgramContentType;
  learning?: CourseLearningDesign;
  governance?: ResourceGovernance;
  lessons: Lesson[];
};

export type CoursePack = {
  course: Course;
  jobAid: JobAid;
  sources: Source[];
};
