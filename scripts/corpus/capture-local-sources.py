#!/usr/bin/env python3
"""Create privacy-safe, content-addressed snapshots of owner-supplied local files.

The source resolver is deliberately ignored by Git because it contains absolute
paths. Generated snapshots retain source IDs, hashes, extracted content, and
review state without retaining those private paths.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import zipfile
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

from docx import Document
from pptx import Presentation


TEXT_ZIP_EXTENSIONS = {".md", ".txt", ".json", ".jsonl", ".csv", ".tsv", ".xml"}
LOCAL_SOURCE_TYPES = {
    "docx",
    "pptx",
    "mp3",
    "html_interactive_course",
    "pasted_text",
    "zip_package",
}
PRIVATE_USER_PATH = re.compile(r"c:[\\/]+users[\\/]+garyb", re.IGNORECASE)


def sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest().upper()


def sha256_text(payload: str) -> str:
    return sha256_bytes(payload.encode("utf-8"))


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def sanitize_snapshot_value(value: Any) -> Any:
    """Remove the private Windows user-folder prefix from committed snapshots."""
    if isinstance(value, str):
        return PRIVATE_USER_PATH.sub("[local user folder]", value)
    if isinstance(value, list):
        return [sanitize_snapshot_value(item) for item in value]
    if isinstance(value, dict):
        return {key: sanitize_snapshot_value(item) for key, item in value.items()}
    return value


def extract_docx(path: Path) -> dict[str, Any]:
    document = Document(path)
    blocks: list[dict[str, Any]] = []
    text_parts: list[str] = []
    for paragraph in document.paragraphs:
        text = paragraph.text.strip()
        if not text:
            continue
        blocks.append(
            {
                "kind": "paragraph",
                "style": paragraph.style.name if paragraph.style else None,
                "text": text,
            }
        )
        text_parts.append(text)
    for table_index, table in enumerate(document.tables, start=1):
        rows: list[list[str]] = []
        for row in table.rows:
            cells = [cell.text.strip() for cell in row.cells]
            rows.append(cells)
            text_parts.append(" | ".join(cells))
        blocks.append({"kind": "table", "tableNumber": table_index, "rows": rows})
    properties = document.core_properties
    return {
        "format": "docx",
        "documentProperties": {
            "title": properties.title or None,
            "subject": properties.subject or None,
            "author": properties.author or None,
            "lastModifiedBy": properties.last_modified_by or None,
            "created": properties.created.isoformat() if properties.created else None,
            "modified": properties.modified.isoformat() if properties.modified else None,
        },
        "paragraphCount": sum(1 for block in blocks if block["kind"] == "paragraph"),
        "tableCount": len(document.tables),
        "blocks": blocks,
        "text": "\n\n".join(text_parts),
    }


def extract_pptx(path: Path) -> dict[str, Any]:
    presentation = Presentation(path)
    slides: list[dict[str, Any]] = []
    all_text: list[str] = []
    for index, slide in enumerate(presentation.slides, start=1):
        fragments: list[str] = []
        title: str | None = None
        if slide.shapes.title is not None and slide.shapes.title.has_text_frame:
            title = slide.shapes.title.text.strip() or None
        for shape in slide.shapes:
            if not getattr(shape, "has_text_frame", False):
                continue
            text = shape.text.strip()
            if text and text not in fragments:
                fragments.append(text)
        notes = None
        try:
            note_text = slide.notes_slide.notes_text_frame.text.strip()
            notes = note_text or None
        except (AttributeError, KeyError, ValueError):
            notes = None
        slide_text = "\n".join(fragments)
        if slide_text:
            all_text.append(f"Slide {index}\n{slide_text}")
        if notes:
            all_text.append(f"Slide {index} notes\n{notes}")
        slides.append(
            {
                "slideNumber": index,
                "title": title,
                "text": slide_text,
                "notes": notes,
            }
        )
    properties = presentation.core_properties
    return {
        "format": "pptx",
        "presentationProperties": {
            "title": properties.title or None,
            "subject": properties.subject or None,
            "author": properties.author or None,
            "lastModifiedBy": properties.last_modified_by or None,
            "created": properties.created.isoformat() if properties.created else None,
            "modified": properties.modified.isoformat() if properties.modified else None,
        },
        "slideCount": len(slides),
        "slides": slides,
        "text": "\n\n".join(all_text),
    }


class VisibleTextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.parts: list[str] = []
        self.tag_counts: Counter[str] = Counter()
        self.external_urls: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        lowered = tag.lower()
        self.tag_counts[lowered] += 1
        if lowered in {"script", "style", "noscript", "svg", "template"}:
            self.skip_depth += 1
        for name, value in attrs:
            if name.lower() in {"href", "src", "action"} and value:
                if value.startswith(("http://", "https://")):
                    self.external_urls.add(value)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() in {"script", "style", "noscript", "svg", "template"}:
            self.skip_depth = max(0, self.skip_depth - 1)

    def handle_data(self, data: str) -> None:
        if self.skip_depth:
            return
        cleaned = re.sub(r"\s+", " ", data).strip()
        if cleaned:
            self.parts.append(cleaned)


def extract_html(path: Path) -> dict[str, Any]:
    raw = path.read_text(encoding="utf-8", errors="replace")
    parser = VisibleTextExtractor()
    parser.feed(raw)
    text = "\n".join(parser.parts)
    return {
        "format": "html",
        "safetyHandling": "Text extracted without executing scripts or submitting forms.",
        "tagCounts": dict(sorted(parser.tag_counts.items())),
        "externalUrls": sorted(parser.external_urls),
        "replacementCharacterCount": raw.count("\ufffd"),
        "text": text,
    }


def extract_audio(path: Path) -> dict[str, Any]:
    command = [
        "ffprobe",
        "-v",
        "error",
        "-show_entries",
        "format=duration,bit_rate,format_name:format_tags",
        "-of",
        "json",
        str(path),
    ]
    result = subprocess.run(command, check=True, capture_output=True, text=True)
    metadata = json.loads(result.stdout)
    return {
        "format": "mp3",
        "metadata": metadata,
        "text": "",
        "transcriptStatus": "transcript_required_before_staff_release",
    }


def extract_plain_text(path: Path) -> dict[str, Any]:
    return {
        "format": "plain_text",
        "text": path.read_text(encoding="utf-8", errors="replace"),
    }


def extract_zip(path: Path) -> dict[str, Any]:
    members: list[dict[str, Any]] = []
    with zipfile.ZipFile(path) as archive:
        for info in sorted(archive.infolist(), key=lambda item: item.filename.casefold()):
            if info.is_dir():
                continue
            payload = archive.read(info)
            extension = Path(info.filename).suffix.lower()
            member: dict[str, Any] = {
                "name": info.filename,
                "bytes": len(payload),
                "crc32": f"{info.CRC:08X}",
                "sha256": sha256_bytes(payload),
                "contentIncluded": extension in TEXT_ZIP_EXTENSIONS,
            }
            if member["contentIncluded"]:
                member["text"] = payload.decode("utf-8", errors="replace")
            members.append(member)
    aggregate = "\n".join(f'{item["name"]}\t{item["sha256"]}' for item in members)
    return {
        "format": "zip",
        "entryCount": len(members),
        "aggregateMemberDigest": sha256_text(aggregate),
        "members": members,
        "text": "\n\n".join(
            f'{item["name"]}\n{item.get("text", "")}'
            for item in members
            if item["contentIncluded"]
        ),
    }


def capture(path: Path, source_type: str) -> dict[str, Any]:
    if source_type == "docx":
        return extract_docx(path)
    if source_type == "pptx":
        return extract_pptx(path)
    if source_type == "html_interactive_course":
        return extract_html(path)
    if source_type == "mp3":
        return extract_audio(path)
    if source_type == "pasted_text":
        return extract_plain_text(path)
    if source_type == "zip_package":
        return extract_zip(path)
    raise ValueError(f"Unsupported local source type: {source_type}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ledger", default="data/source-ledger/owner-supplied-inputs.json")
    parser.add_argument("--resolver", default="data/source-ledger/local-resolver.local.json")
    parser.add_argument("--output", default="data/source-snapshots/local")
    args = parser.parse_args()

    ledger = json.loads(Path(args.ledger).read_text(encoding="utf-8"))
    resolver = json.loads(Path(args.resolver).read_text(encoding="utf-8"))
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    local_paths = {**resolver.get("paths", {}), **resolver.get("attachments", {})}
    source_by_id = {source["sourceId"]: source for source in ledger["sources"]}

    entries: list[dict[str, Any]] = []
    for source_id in sorted(local_paths):
        source = source_by_id.get(source_id)
        if not source or source.get("sourceType") not in LOCAL_SOURCE_TYPES:
            continue
        raw_path = local_paths[source_id]
        if isinstance(raw_path, list):
            continue
        path = Path(raw_path)
        if not path.is_file():
            raise FileNotFoundError(f"Registered source is unavailable: {source_id}")
        raw = path.read_bytes()
        extracted = sanitize_snapshot_value(capture(path, source["sourceType"]))
        duplicate_receipt_only = source_id == "prd-package-export-zip"
        if duplicate_receipt_only:
            for member in extracted.get("members", []):
                member.pop("text", None)
                member["contentIncluded"] = False
            extracted["text"] = ""
            extracted["duplicatePayloadOf"] = "prd-package-named-zip"
            extracted["handling"] = (
                "The file receipt and every member hash are retained here. "
                "Text payloads are stored once in the named package snapshot."
            )
        text = extracted.get("text", "")
        snapshot_path = output / f"{source_id}.json"
        snapshot = {
            "schemaVersion": "1.0.0",
            "capturedOn": "2026-09-04",
            "sourceId": source_id,
            "title": source["title"],
            "sourceType": source["sourceType"],
            "sourceFileName": path.name,
            "sourceBytes": len(raw),
            "sourceSha256": sha256_bytes(raw),
            "ownerApproval": "owner_approved_for_ingestion",
            "staffRelease": "not_staff_released",
            "snapshotSanitization": "Private Windows user-folder prefixes are removed; the original file hash remains unchanged.",
            "extraction": extracted,
            "extractedTextCharacters": len(text),
            "extractedTextSha256": sha256_text(text),
        }
        write_json(snapshot_path, snapshot)
        status = "captured"
        if source["sourceType"] == "mp3":
            status = "captured_transcript_required"
        elif source["sourceType"] == "html_interactive_course":
            status = "captured_quarantined_never_execute"
        elif duplicate_receipt_only:
            status = "captured_duplicate_receipt_only"
        entries.append(
            {
                "sourceId": source_id,
                "snapshotPath": snapshot_path.as_posix(),
                "status": status,
                "ownerApproval": "owner_approved_for_ingestion",
                "staffRelease": "not_staff_released",
                "sourceBytes": len(raw),
                "sourceSha256": snapshot["sourceSha256"],
                "extractedTextCharacters": len(text),
                "extractedTextSha256": snapshot["extractedTextSha256"],
            }
        )

    manifest = {
        "schemaVersion": "1.0.0",
        "capturedOn": "2026-09-04",
        "purpose": (
            "Privacy-safe snapshots of owner-supplied local files and thread attachments. "
            "Capture and owner approval allow import; neither is a staff-release decision."
        ),
        "counts": {
            "captured": len(entries),
            "expected": 22,
            "transcriptRequired": sum(
                entry["status"] == "captured_transcript_required" for entry in entries
            ),
            "quarantinedNeverExecute": sum(
                entry["status"] == "captured_quarantined_never_execute"
                for entry in entries
            ),
        },
        "entries": entries,
    }
    if len(entries) != 22:
        raise RuntimeError(f"Expected 22 local sources, captured {len(entries)}")
    write_json(output / "manifest.json", manifest)
    print(json.dumps(manifest["counts"], indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

