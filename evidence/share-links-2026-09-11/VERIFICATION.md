# Share links: one page or resource only, September 11, 2026

Request: make any page or resource in the One DHS and One DSD People, Access and Culture Program shareable by a link that opens that specific page or resource only.

Done: `lib/product/share-link.ts` defines the one rule for a share link (path; `?view=one_dsd` when the One DSD view is in use; the filters that define a Learning or Library list page; an in-page anchor; nothing else). `components/share-page.tsx` copies it, with an email option, and reads the view from the address or the saved preference so it works on every page. Placed in the footer of every page, on course pages, library resources, each published podcast player (`/learn#podcast-<id>`) and each audio library recording (`/audio-library#recording-<id>`). Course and lesson pages gained titles and descriptions for link previews. My Work stays browser-local and is never part of a link.

Checks: `tests/share-link.test.ts`; typecheck, lint, brand and voice, presentation, navigation and boundary suites pass. Local browser pass: footer share on a filtered Learning page kept `theme` and `q` and dropped `originArea`; an area page dropped origin, area and task; Ask dropped the typed question; the One DSD view carried `?view=one_dsd` on every page; course, library resource, podcast and recording links resolved to their own addresses; no horizontal scroll at 400 px.

Deployment: pull request #8 merged into `pac/one-dhs-pac-app` as c8455297d529cc37e47e43a32cd36e035b1be7e7; `Vercel – one-dhs-pac success` at 2026-09-11T11:45:48Z (deployment DxdTFsa2wtCfeEMtk8roS1L5aiDT). Live checks (workflow run 34595654870, job 103250685125): all four steps passed, home, library, equity pages, and all 24 course pages returning 200.

Limit: the live-check workflow confirms pages, not the presence of the share control itself; the control is part of the server-rendered footer on every page.
