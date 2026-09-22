# Implementation prompt: integrate all 86 recovered courses

Implement the complete recovered course collection in C:\Users\garyb\Projects\one-dhs-pac-repair for One DHS People, Access and Culture and its One DSD pilot. The live application is https://one-dhs-pac.vercel.app/. Preserve the current homepage, branding, existing resources, 11 practice paths, 12 DSD program areas, and 13 DSD scenarios.

The purpose is to give staff the original, substantive learning experiences, connected to relevant tools, communities, practice, and ASK. This is implementation work, not a new PRD, an outline, or a replacement curriculum. Read AGENTS.md, docs/OWNER-DIRECTIVE-2026-09-07.md, docs/WORKING-AGREEMENT.md, and docs/STAFF-VOICE-STANDARD.md. Apply Gary's latest instructions where historical requirements conflict. Communicate findings and failures promptly.

## 1. Establish and preserve the complete baseline

Use data/source-snapshots/donor-library/course-candidates.jsonl and its adjacent manifest.json and schema.json. The verified source contains 86 unique course packs: 45 authored and 41 generated-curriculum provenance records, totaling 780 lessons and 5,334 blocks. Its 11,746,545 bytes have SHA-256:

42727EFCA0734202F0136F3E2861258B660B3167EAC4549104F08B96780299CE

Read and account for every record, lesson, block, interaction, source, job aid, and media reference. Produce a machine-readable inventory with stable identifiers, counts, hashes, and route mappings. Preserve richOriginal.releasePack and every available richOriginal.baseAuthoredPack. Do not build the courses from the flattened renderable.sections adaptation: it loses interactive structure.

Retain original wording, titles, order, attribution, and source history. Separate authored improvements from source bytes. The recovery procedure is scripts/corpus/donor-course-snapshot.mjs, pinned to authored baseline 3aed64676b90a91983bd7eee4e511f1f333e0784 and release fac88a203c6323b61a687132bae65c05247c5474. Ship committed snapshots and integrity fixtures; runtime and deployment tests must not depend on those Git objects or a moving HEAD.

## 2. Implement the complete learning experience

Create a validated course, lesson, and block contract and real course/lesson routes. Preserve course learning information, introduction, transcript, scope, duration, lesson navigation, scenarios and their responses, transfer exercises, job aids, references, and further reading.

Implement every observed block type: text (1,650), leaderMove (1,463), flashcards (577), quote (558), list (200), image (185), knowledgeCheck (175), artifact (164), statement (111), accordion (90), tabs (75), sorting (69), and timeline (17). Every interactive instance must work: reveal and collapse, select, submit, receive original feedback, retry, and reset as appropriate. Keep correct-answer data and feedback faithful to the source. Preserve artifact fields and their usable actions. Unknown blocks must produce an explicit integration error, never silently disappear.

Provide direct links, previous/next navigation, reliable return navigation, and understandable progress. Verify save, reload, resume, edit, reset, and storage-failure behavior. Retain the established private-learning boundary; do not introduce staff ranking or supervisory learning profiles.

Each lesson currently supplies one objective string. Preserve it and add three to five meaningful, observable objectives per lesson where required, grounded in that lesson's actual content. Keep the original recoverable and record additions separately. Teach before asking staff to apply learning; course completion must not gate access to resources.

## 3. Recover media and preserve presentation quality

All 86 courses reference 50 unique covers; 185 image blocks reference 122 unique images. Those files exist locally when query strings are removed for filesystem checks. Reuse suitable existing photographs and original titles in every introductory tile. Verify dimensions, alt text, visibility, loading, and cropping. Do not label 1792 × 1008 images as 4K.

There are 44 nonempty introductory-audio references with no matching local file. Recover the actual authorized recordings from preserved sources, verify playback and transcripts, and account for each result. Do not invent recordings, display dead play controls, or call the audio work complete while files remain missing.

## 4. Connect the collection throughout the program

Extend the current Learning presentation in app/learn/page.tsx and lib/content/learning-catalog.ts so all 86 courses have introductory tiles opening complete resources. Preserve the page's established large two-column treatment and avoid green panels or highlights. Keep the staff guide, learning stages, practice paths, podcasts, and courses distinct.

Use lib/content/learning-hub.ts and editable learn.hub membership for many-to-many themes. Keep one canonical course with multiple relevant memberships. Wire search, filters, counts, clear controls, empty states, community connections, domain tasks, and practice links in both scopes.

Resolve every legacy course, community, and support link, including /c/* and /ci/*, to a verified destination. Preserve useful query strings and anchors. Maintain /library and /resources compatibility; no disconnected cards, orphan lessons, duplicate resources, or invented destinations.

## 5. Publish through the existing owner workflow

Integrate course storage and editing with the existing scoped publication, editable-surface, and source-history contracts. A bundled definition alone is not database publication. Use additive migrations, explicit source/revision records, safe backups, transactional saves, stale-write protection, withdrawal, restore, and repeatable imports.

Gary has already approved the supplied content. Record that standing authority against exact revisions; do not reimpose the manifest's historical publicationAuthorization:none or require another content-approval chain. Do not fabricate factual or accessibility review passes.

Gary, the Chief of Staff, and authorized agents author and manage content. Staff learn, use resources, and ask questions. Keep management controls owner-authenticated. DIGITAL MING coordinates and delegates through actual completion. The 90–95% agent-driven goal remains a measured target, not an achievement inferred from settings.

## 6. Wire ASK, records, and research spending

Before extending course coverage, close the two production answer-quality failures recorded in evidence/local-audit-2026-09-07/production-ask-release.json. The question "How can I make a team meeting more accessible? Give three brief practical steps and point me to the relevant program resource." received an unrelated, limited community fallback. Trace the failed answer and fallback selection, then verify relevant practical guidance and a working resource link. A current-WCAG research response cited source [1] for a WCAG 2.2 statement, but that source was WCAG 2.1; the WCAG 2.2 page was source 16. Correct source-to-citation matching and verify the cited pages actually support each claim. Preserve the original failed receipts and confirm both repaired answers and their exact durable records through bounded live checks. Successful HTTP responses and saved records alone did not establish answer quality.

ASK must reason and answer across topics, not operate solely as a course-retrieval system. Index and route every eligible course, lesson, job aid, source, and related destination. Preserve full context, useful follow-ups, multilingual/paraphrased discovery, direct links, accurate citations, and scoped withdrawals. Cite only material actually used; do not invent DHS policy or claim unavailable research succeeded.

Extend existing ASK and operational observability with durable, owner-inspectable records identifying the actual question/task, complete response/result, course/lesson references, timestamp, trace, and success, failure, or degraded outcome. Reuse lib/intelligence/observability/ask-records.ts appropriately. Preserve access, deletion, and retention contracts; expose save failures truthfully without unnecessarily preventing answers.

Gary's authorized external-research budget is $200 per month across research providers. Implement and verify durable aggregate accounting, concurrent spending reservations, reconciliation, owner-visible usage, and a hard monthly ceiling. Continue useful program/general answers when research is unavailable or capped. Sonar is excluded, including presets, fallbacks, and substitutions. Keep secrets server-side.

## 7. Prove completion and release honestly

Write staff copy in a warm, human, professional, helpful voice. Put procedural instructions in the user guide and only essential action guidance on the page. Keep builder discussions and agent machinery out of staff-facing explanations.

Require full content-parity receipts for all 86 courses, 780 lessons, and 5,334 blocks; complete media/link accounting; and functional checks for every interaction. Verify real scoped database publication and author/staff access, owner save/reload/withdraw/restore, ASK coverage, durable records, budget concurrency, keyboard operation, focus, mobile layout, captions/transcripts, and accessible alternatives to dragging. Stress test search, lesson navigation, publication, and concurrent ASK; report measured latency, errors, load, and limits.

Use synthetic providers for bulk tests and bounded authorized real calls for connection proof. Save actual commands, results, screenshots, database receipts, and unresolved defects. Pass applicable tests, lint, type checks, and build.

Gary has authorized deployment after repairs and verification. Respect any later pause. Deploy the verified commit to the existing application, then verify the live workflows and database state. Done means complete preserved content, working interactions and routing, inspectable receipts, and a verified live release. An attempted deployment, passing mock, summary page, or percentage estimate is not completion.
