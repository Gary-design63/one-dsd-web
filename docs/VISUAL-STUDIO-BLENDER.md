# Visual Studio: Blender authoring reference

> RETIRED INTEGRATION. The owner excludes Blender altogether. This document preserves historical prototype instructions only; no active capability is advertised or available. Legacy endpoints return 410, the page is unavailable, and local flags cannot restore discovery or rendering. Historical scene files and receipts remain recoverable on disk.

Internal reference for Gary Banks and the program's Chief of Staff. September 9, 2026.

## Current working model

Visual Studio is an owner-only authoring space in the local One DHS / One DSD program at `/consultant/studio`. It uses the installed Windows Blender application to produce a real editable `.blend` project and a still preview. The program owner can create directly or delegate the same brief to the Chief of Staff. Staff and contributor sessions do not receive these controls.

This first connection provides three scene foundations: a team meeting, an interview, and a service conversation. Each uses a fixed, editable composition with three abstract figures. The selected setting changes the scene geometry. The title, learning purpose and dialogue are saved with the project and remain editable. Free-form dialogue does not yet animate characters, create a spoken performance or redesign the room automatically. The Chief of Staff executes the registered scene-authoring tool; this step does not call an answer-generation model.

The separate Common Ground office demonstration is substantially larger: 24 fictional adult figures, 3,558 objects, 63 materials, three cameras and two completed rendered views. It was built as an independent Blender experiment and is not a staff-facing program asset. Its stylized people do not meet the user's requested photorealistic standard; the office demonstration needs a visual-quality revision even though the render and editable project work.

## How the owner uses it

1. Open the local Consultant Workspace and choose Visual Studio.
2. Choose a conversation starter or edit the brief. Select the setting and who should carry out the creation.
3. Create the scene. The page reports progress, a ready result or a visible failure; it does not equate submitting a request with finishing a render.
4. Inspect the preview and dialogue. Open the editable project in Blender or download its project and receipt.
5. Use Blender to refine staging, objects, camera and lighting. Preserve an original and save a new version for substantive changes.

The desktop editor opens separately. A process-launch receipt means the open request was accepted; checking the actual Blender window establishes that the intended project loaded. A downloadable receipt describes its recorded render. Later manual edits do not automatically regenerate the web preview or change that earlier render receipt.

## Chief of Staff authoring practice

Start with the practical learning question and the visible action that matters. Distinguish what a person actually does or says from an interpretation of motives. Use fictional situations and avoid encoding personality, competence, cultural behavior or an IDI orientation in a character's appearance, posture or voice.

Prefer a reusable scene set and stable camera views. A room-layout comparison is well suited to Blender; a changing organizational chart, policy sequence or scoring rubric usually belongs in accessible text and a two-dimensional diagram. Use original structured content as the learning foundation. Preserve the learning brief and source project so another pass can reproduce or revise the media.

For a more complex future scene, the authoring workflow should identify participants, stated circumstances, props, required camera views, sequence or dialogue, meaningful visual details, and the existing program destination. Test a small draft before spending time on final resolution. Keep the reason for each shot connected to what the learner should notice or try.

## Blender capability study

- **Modeling:** editable meshes, materials and collections support rooms, furniture, props and figures. The office experiment demonstrates these locally.
- **Cameras and lighting:** several views can explain sightlines and participation arrangements without requiring a staff member to navigate a 3D viewer.
- **Python automation:** Blender can construct scenes and render through its Python API. Both the standalone demonstration and local program connection have exercised that capability.
- **Rendering:** Cycles produced the verified local stills. The initial program renderer uses a small CPU render for responsiveness; the separate office uses larger final images.
- **Animation and rigging:** Blender supports movement, character rigging and rendered sequences. These features are available in Blender, but animated characters, voice synchronization and video delivery are not implemented by this first program connection.
- **Publishing:** a `.blend` file is the authoring source. A web image, video or interactive model is a separate deliverable with a suitable player or viewer, readable alternatives and its own verification.

Primary references: [Blender features](https://www.blender.org/features/), [modeling](https://www.blender.org/features/modeling/), [animation and rigging](https://www.blender.org/features/animation/), [rendering](https://www.blender.org/features/rendering/). Findings about this installation come from the executable, generated files and inspected windows rather than a claim to have tested every Blender feature.

## Local connection and records

The web application and Blender must run on the same Windows computer. Vercel does not run this desktop executable and is not connected to the computer by this feature. A future live-to-local bridge would be a separately implemented service with explicit device connection and observable jobs. This local work is not a deployment of that bridge.

Projects are stored beneath `.data/visual-studio`, in a separate unique folder per attempt. Each includes the input brief, project manifest, receipt and any successfully produced files. File size and content fingerprints are recorded for the original outputs. Chief of Staff execution also receives a durable, trace-linked local activity event; it does not require changing the live database's list of allowed activity types. A failure to persist the required record must remain visible.

Only the trusted application renderer is executed; brief fields are data. The service permits one render at a time, limits its duration, preserves valid output after a later failure and does not silently retry. If termination cannot be confirmed, it retains the busy state for local recovery. The browser cannot supply arbitrary commands or filesystem paths. Existing owner pause controls continue to apply to delegated agent work.

## Preparing a staff learning asset later

A scene becomes a learning experience when it is accompanied by useful questions, options, feedback and the next practical action. Add the full dialogue and meaningful action descriptions. For video, include accurate captions, needed visual description and usable playback controls. Review the text route and media route together so each supports the same learning. [W3C accessible media guidance](https://www.w3.org/WAI/media/av/).

The program owner already approves the curated content. Technical completion means the actual media plays, the intended resource opens, the saved record is truthful and the staff experience supports access. Authoring operations belong in the consultant workspace. Participation does not establish DHS-required training credit unless the appropriate leadership grants an exception.

## Verification references

- `tests/visual-studio-renderer.test.ts`: local rendering, output validation, files, lock and failure behavior.
- `tests/visual-studio-api.test.ts`: owner access, local addresses, request boundaries, Chief of Staff execution, pauses and recording.
- `evidence/visual-studio-2026-09-09/local-verification.json`: verified real local sign-in, successful Chief of Staff scene creation, matching activity record, and protected file retrieval.
- `docs/MULTIMEDIA-PROGRAM-MAP-2026-09-09.md`: proposed placements across the program.

The first failed activity-record attempt remains distinguishable from the final verified attempt. Completed source files were preserved rather than presented as a completed overall transaction.
