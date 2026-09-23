"""Verify published diversity pages without authentication or personal data."""
import concurrent.futures
import datetime
import html
import json
import pathlib
import re
import sys
import urllib.request

origin, export_path, receipt_path = sys.argv[1:4]
if origin not in ("https://one-dhs-dsd-web-production.up.railway.app", "http://127.0.0.1:3101"):
    raise SystemExit("Use the known application or local preview origin.")
packs = json.loads(pathlib.Path(export_path).read_text(encoding="utf-8-sig"))
if len(packs) != 30:
    raise SystemExit("The complete thirty-course export is required.")
targets = []
for scope in ("one_dhs", "one_dsd"):
    targets.append((scope, "/learn/diversity", "Diversity: understanding and practice", "index"))
    for pack in packs:
        course = pack["course"]
        route = "/courses/" + course["id"]
        targets.append((scope, route, course["title"], "course"))
        for lesson in course["lessons"]:
            targets.append((scope, route + "/" + lesson["id"], lesson["title"], "lesson"))
        if scope == "one_dhs":
            targets.append((scope, "/share" + route, course["title"], "share"))


def check(target):
    scope, route, expected, kind = target
    row = {"scope": scope, "route": route, "kind": kind}
    headers = {"User-Agent": "One-DSD-course-verification/1.0"}
    if scope == "one_dsd":
        headers["Cookie"] = "pac_context=one_dsd"  # View preference only; no authentication.
    try:
        with urllib.request.urlopen(urllib.request.Request(origin + route, headers=headers), timeout=60) as response:
            body = response.read().decode("utf-8")
            heading = re.search(r"<h1[^>]*>(.*?)</h1>", body, re.S)
            title = html.unescape(re.sub(r"<[^>]+>", "", heading.group(1))) if heading else ""
            row.update(status=response.status, title=title, expected=expected, titleMatches=title == expected)
            row["editingControls"] = bool(re.search(r"<[^>]+\bdata-pac-editor(?:=|\s|>)", body))
            row["ok"] = response.status == 200 and title == expected and not row["editingControls"]
            if kind == "index":
                row["tiles"] = len(re.findall(r"data-learning-id=", body))
                row["ok"] = row["ok"] and row["tiles"] == 30
            elif kind in ("course", "share"):
                row["hasJobAid"] = 'id="job-aid"' in body
                row["hasSources"] = 'id="sources"' in body
                row["ok"] = row["ok"] and row["hasJobAid"] and row["hasSources"]
            elif kind == "lesson":
                row["hasPractice"] = "Consider your choice" in body and "Check answer" in body
                row["ok"] = row["ok"] and row["hasPractice"]
    except Exception as error:
        row.update(ok=False, error=str(error))
    return row


with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(check, targets))
receipt = {"checkedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(), "origin": origin,
           "authentication": "none; One DSD requests use only the public view-preference cookie",
           "total": len(results), "passed": sum(row["ok"] for row in results), "results": results}
pathlib.Path(receipt_path).write_text(json.dumps(receipt, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps({key: value for key, value in receipt.items() if key != "results"}))
for row in results:
    if not row["ok"]:
        print(json.dumps(row, ensure_ascii=False))
raise SystemExit(0 if receipt["passed"] == receipt["total"] else 1)
