# Verified website deployment target — September 23, 2026

This local binding correction does not deploy anything. Production publication remains on hold pending the separate deployment review.

## Verified target

- Account: alphaequity123@gmail.com
- Workspace: alphaequity123-afk's Projects (`7df96344-05af-4cb4-b652-86d5de88731d`)
- Project: one-dhs-dsd-pac (`93b7e865-8bf8-4d6c-b6ed-77f3fea181ad`)
- Environment: production (`398aa9dd-6d6b-4a83-b7f6-69db7dace348`)
- Website service: one-dhs-dsd-web (`f27ac922-7e01-44f3-8d72-5ccca1910831`)
- Domain: https://one-dhs-dsd-web-production.up.railway.app
- Connected source: Gary-design63/one-dsd-web, main; builder: Railpack.
- Observed successful deployment: `091bd31f-e5c2-4624-8bf3-893bf86be626`, commit `ebb9fe630ac42f799621c97c7d63ea77e0f88581`.

The current working source is `work/source-date-fix-deploy`. Its local Railway link was established using the exact project/environment/service IDs above and independently checked with `railway status`.
The earlier `production-one-dhs-dsd-d5b69d1` folder remains linked to `pac-daily-orchestrator` (`38e24847-22ad-49a0-9e19-d2b1aea77ac9`); that scheduled service and its local link were preserved. Never infer the website target from that folder's default.

## Release method after separate approval

The website is connected to GitHub main. A reviewed source commit can be released through that connection, or an approved local upload can explicitly name all targets:

```powershell
railway up --project 93b7e865-8bf8-4d6c-b6ed-77f3fea181ad --environment 398aa9dd-6d6b-4a83-b7f6-69db7dace348 --service f27ac922-7e01-44f3-8d72-5ccca1910831
```

This command was documented, not executed. Review the exact source changes and untracked assets before either route; this workspace contains earlier user changes in addition to the inner-page pass. Do not publish backups, logs, caches or credentials. Verify the live Areas/photo, learning search, course/lesson and resource links after release, and record the new deployment ID.

The September 9 Vercel facts in DEPLOY.md are historical and do not identify this verified Railway website. No database migrations or remote configuration changes are part of this visual update.
