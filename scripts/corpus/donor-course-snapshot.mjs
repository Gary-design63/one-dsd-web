import { fileURLToPath } from "node:url";

import { loadPinnedGitTypescriptModule } from "./git-typescript-snapshot-lib.mjs";
import {
  assert,
  compactText,
  removeEmptySections,
  section,
  snapshotRecord,
  validateSnapshotRecords,
  writeSnapshotFile,
} from "./donor-snapshot-lib.mjs";

export const COURSE_BASE_COMMIT = "3aed64676b90a91983bd7eee4e511f1f333e0784";
export const COURSE_RELEASE_COMMIT = "fac88a203c6323b61a687132bae65c05247c5474";
export const COURSE_DONOR_REPOSITORY = "alphaequity123-afk/one-dhs-equity-resource";
export const AUTHORED_COURSE_COUNT = 45;
export const GENERATED_CURRICULUM_COUNT = 41;
export const COURSE_CANDIDATE_COUNT = 86;

const COURSE_ENTRY_PATH = "src/lib/course/registry.ts";

function blockParagraphs(block) {
  switch (block.type) {
    case "image":
      return compactText([block.alt, block.caption]);
    case "video":
      return compactText([block.transcript]);
    case "audio":
      return compactText([block.label, block.transcript]);
    case "text":
      return compactText([block.heading, block.body]);
    case "list":
      return compactText([block.heading, block.items]);
    case "statement":
      return compactText([block.body]);
    case "quote":
      return compactText([block.text, block.cite]);
    case "leaderMove":
      return compactText([
        block.heading,
        `What you control: ${block.control}`,
        `What can go wrong: ${block.failure}`,
        `What to do next: ${block.next}`,
      ]);
    case "artifact":
      return compactText([
        block.label,
        block.title,
        block.summary,
        (block.fields ?? []).map((field) => `${field.label}: ${field.value}`),
        block.action,
      ]);
    case "flashcards":
      return compactText([
        block.heading,
        (block.cards ?? []).map((card) => `${card.front}: ${card.back}`),
      ]);
    case "accordion":
      return compactText([
        block.heading,
        (block.items ?? []).map((item) => `${item.title}: ${item.body}`),
      ]);
    case "tabs":
      return compactText([
        block.heading,
        (block.tabs ?? []).map((tab) => `${tab.label}: ${tab.body}`),
      ]);
    case "timeline":
      return compactText([
        block.heading,
        (block.events ?? []).map((event) => `${event.year} — ${event.title}: ${event.body}`),
      ]);
    case "knowledgeCheck":
      return compactText([
        block.question,
        (block.options ?? []).map((option) => option.text),
        block.feedbackCorrect,
        block.feedbackIncorrect,
      ]);
    case "sorting":
      return compactText([
        block.heading,
        (block.items ?? []).map((item) => `${item.text}: ${item.category}`),
      ]);
    default:
      throw new Error(`Course block type ${block.type} has no plain adaptation.`);
  }
}

function lessonParagraphs(lesson) {
  return compactText([
    lesson.summary,
    lesson.learning?.objective,
    lesson.learning?.takeaways,
    lesson.learning?.evidence,
    lesson.learning?.appliedNextStep,
    lesson.scenario?.context,
    lesson.scenario?.prompt,
    (lesson.scenario?.options ?? []).map((option) => `${option.label}: ${option.response}`),
    lesson.transfer?.prompt,
    lesson.transfer?.options,
    (lesson.blocks ?? []).flatMap(blockParagraphs),
  ]);
}

function courseRenderable(pack) {
  const course = pack.course;
  return {
    schemaVersion: "1.0.0",
    presentation: "plain_resource",
    title: course.title,
    summary: compactText([course.subtitle, course.scope]).join(" "),
    sections: removeEmptySections([
      section("About this course", [
        course.seriesLabel,
        course.subtitle,
        course.scope,
        course.treatment,
        course.duration,
        course.learning?.objectives,
        course.learning?.evidence,
        course.learning?.appliedNextStep,
      ]),
      ...(course.lessons ?? []).map((lesson) => section(lesson.title, lessonParagraphs(lesson))),
      section("Use what you learned", [
        pack.jobAid?.subtitle,
        pack.jobAid?.quote,
        pack.jobAid?.use?.purpose,
        pack.jobAid?.use?.remember,
        pack.jobAid?.use?.doNext,
      ]),
      ...(pack.jobAid?.sections ?? []).map((jobAidSection) =>
        section(jobAidSection.heading, jobAidSection.items),
      ),
      section(
        "Sources and further reading",
        (pack.sources ?? []).map((source) => compactText([source.title, source.note, source.href]).join(" — ")),
      ),
    ]),
    appliesTo: "agencywide",
    resourceType: course.kind ?? "course",
  };
}

export function recoverCourseCandidates() {
  const baseModule = loadPinnedGitTypescriptModule({
    commit: COURSE_BASE_COMMIT,
    entryPath: COURSE_ENTRY_PATH,
    roots: ["src/lib/course"],
  });
  const releaseModule = loadPinnedGitTypescriptModule({
    commit: COURSE_RELEASE_COMMIT,
    entryPath: COURSE_ENTRY_PATH,
    roots: ["src/lib/course", "src/lib/community/ci"],
  });
  const basePacks = baseModule.COURSE_PACKS;
  const releasePacks = releaseModule.COURSE_PACKS;
  assert(Array.isArray(basePacks) && basePacks.length === AUTHORED_COURSE_COUNT, `Pinned base registry contains ${basePacks?.length ?? 0}, not ${AUTHORED_COURSE_COUNT}, authored courses.`);
  assert(Array.isArray(releasePacks) && releasePacks.length === COURSE_CANDIDATE_COUNT, `Pinned release registry contains ${releasePacks?.length ?? 0}, not ${COURSE_CANDIDATE_COUNT}, total courses.`);
  const baseById = new Map(basePacks.map((pack) => [pack.course.id, pack]));
  assert(baseById.size === AUTHORED_COURSE_COUNT, "Pinned base course registry contains duplicate IDs.");
  assert(new Set(releasePacks.map((pack) => pack.course.id)).size === COURSE_CANDIDATE_COUNT, "Pinned release course registry contains duplicate IDs.");
  assert([...baseById.keys()].every((id) => releasePacks.some((pack) => pack.course.id === id)), "A base-authored course is absent from the release registry.");

  const records = releasePacks.map((pack, ordinal) => {
    const course = pack.course;
    const basePack = baseById.get(course.id) ?? null;
    const sourceClass = basePack ? "authored" : "generated_curriculum";
    return snapshotRecord({
      assetKind: "course",
      assetId: course.id,
      contentItemId: `course-${course.id}`,
      contentKind: "course",
      title: course.title,
      sourceClass,
      donor: {
        repository: COURSE_DONOR_REPOSITORY,
        commit: COURSE_RELEASE_COMMIT,
        priorCommit: basePack ? COURSE_BASE_COMMIT : null,
        entryPaths: [COURSE_ENTRY_PATH],
        registryOrdinal: ordinal,
        capturedFrom: "pinned_git_tree",
      },
      richOriginal: {
        sourceClass,
        baseAuthoredPack: basePack,
        releasePack: pack,
      },
      renderable: courseRenderable(pack),
    });
  });

  const validated = validateSnapshotRecords(records, { count: COURSE_CANDIDATE_COUNT });
  assert(validated.filter((record) => record.sourceClass === "authored").length === AUTHORED_COURSE_COUNT, "Authored course accounting changed.");
  assert(validated.filter((record) => record.sourceClass === "generated_curriculum").length === GENERATED_CURRICULUM_COUNT, "Generated curriculum accounting changed.");
  return validated;
}

export function writeCourseSnapshot() {
  return writeSnapshotFile(recoverCourseCandidates(), "course-candidates.jsonl");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const receipt = writeCourseSnapshot();
  console.log(JSON.stringify(receipt, null, 2));
}
