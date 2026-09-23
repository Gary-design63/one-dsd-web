# American English sweep — September 18, 2026

A forensic pass over the Program's authored content and repository documentation,
correcting British spellings in prose that staff read.

## Result

94 genuine findings across 24 files. 88 were corrected; 6 were deliberately left in place
(see below). A re-run of the scan over authored content reports zero.

| Form corrected | Count |
| --- | --- |
| cancelled / cancelling | 25 |
| acknowledgement | 18 |
| organisation / organisations / organise / organised | 22 |
| labelled | 8 |
| behaviour | 6 |
| centre | 5 |
| judgement | 4 |
| favour | 4 |
| travelled / travelling | 6 |
| recognise | 3 |
| licence | 3 |
| honour | 2 |
| neighbour, colour, programme | 3 |

## What was deliberately left alone

- **`lib/content/courses/recovered.json`** — six instances (*Honour*, *cancelled*,
  *Cancelling*) remain. This file is snapshot-bound: `tests/recovered-courses.test.ts`
  asserts that it matches `data/source-snapshots/donor-library/course-candidates.jsonl`
  exactly, which is how the repository proves nothing was lost or flattened when the
  courses were recovered. Correcting the prose here would either break that guarantee or
  require editing the donor snapshot, and the guarantee is worth more than the spelling.
  If this content is ever re-authored away from the snapshot, correct it then.
- **`data/source-snapshots/`** — captured copies of external source documents, including
  document titles such as "One DHS Equity Resource Centre". Cited source material is
  flagged, never rewritten.
- **`data/source-register/`** and **`evidence/`** — registers and evidence records. These
  record what was reviewed and when; altering them would falsify a record.
- **`models/bge-small-en-v1.5/vocab.txt`** — the embedding model's vocabulary. It contains
  British tokens by design; changing them would corrupt the model.
- **Code identifiers** — `let cancelled = false`, `const [dialogue, setDialogue]` and
  similar are program symbols, not prose, and were excluded by scanning only string
  literals of more than fourteen characters containing a space.
- **Words that are not errors** — `analyses` is the correct American plural of *analysis*;
  `toward`/`towards`, `catalogue` and `dialogue` are all acceptable American usage.

## Reproducing

The scanner is prose-aware: it reads Markdown whole, and in TypeScript and JavaScript it
examines only string literals, so identifiers and import paths cannot produce false
positives. Proper nouns carrying British spellings — "Penumbra Theatre" among them — are
excluded by an explicit allow list.

Verification after the change: `npx tsc --noEmit` passes, `recovered.json` parses, and
`npm run lint` reports no new problems.
