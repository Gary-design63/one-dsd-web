import type { EditableSurfaceValues } from "./editable-surface-contract";

export type LearningTilePresentation = {
  imageSrc: string;
  imageAlt: string;
  summary: string;
};

export const LEARNING_TILE_DEFAULTS = {
  "lm-workplace-climate": {
    imageSrc: "/images/covers/culture-without-theater.jpg",
    imageAlt: "A woman working at a desk in an office.",
    summary: "Explore how meetings, supervision, and recognition shape participation and fair opportunities.",
  },
  "lm-facilitation-application": {
    imageSrc: "/images/covers/facilitators-guide.jpg",
    imageAlt: "A facilitator speaking with a small group beside a whiteboard.",
    summary: "Plan accessible sessions that give participants time to practice and apply what they learn.",
  },
  "lm-interpreter": {
    imageSrc: "/images/covers/working-with-interpreter.jpg",
    imageAlt: "Three people in conversation around a table.",
    summary: "Prepare for conversations with a qualified interpreter and support clear, respectful communication.",
  },
} as const satisfies Record<string, LearningTilePresentation>;

const TILE_FIELD_PREFIXES = {
  "lm-workplace-climate": "climate",
  "lm-facilitation-application": "facilitation",
  "lm-interpreter": "interpreter",
} as const;

function isSafeLocalImage(value: string): boolean {
  return !/\s/.test(value) && /^\/images\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:jpe?g|png|webp|avif)$/i.test(value);
}

/** Only supplied, released values may determine a tile; defaults are registration input. */
export function getLearningTilePresentation(
  id: string,
  values: EditableSurfaceValues,
): LearningTilePresentation | undefined {
  if (!Object.hasOwn(TILE_FIELD_PREFIXES, id)) return undefined;
  const prefix = TILE_FIELD_PREFIXES[id as keyof typeof TILE_FIELD_PREFIXES];
  const imageSrc = values[`${prefix}Image`];
  const imageAlt = values[`${prefix}ImageAlt`];
  const summary = values[`${prefix}Summary`];
  if (
    typeof imageSrc !== "string" || (imageSrc !== "" && !isSafeLocalImage(imageSrc))
    || typeof imageAlt !== "string" || typeof summary !== "string"
  ) return undefined;
  return { imageSrc, imageAlt, summary };
}
