import { emptyPractice, PRACTICE_STORAGE_KEY } from "@/lib/content/learning-practice";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ParticipationNotice } from "@/components/participation-notice";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import {
  PARTICIPATION_CONTRACTS,
  PARTICIPATION_SURFACES,
  participationContractProblems,
} from "@/lib/participation/contracts";
import {
  CONSULTATION_PARTICIPATION_NOTICE_CONTRACT_VERSION,
  CONSULTATION_PARTICIPATION_NOTICE_ID,
  CONSULTATION_PARTICIPATION_NOTICE_VERSION,
} from "@/lib/participation/consultation-notice";
import {
  CONSULTATION_PARTICIPATION_NOTICE_ID as SCHEMA_NOTICE_ID,
  CONSULTATION_PARTICIPATION_NOTICE_VERSION as SCHEMA_NOTICE_VERSION,
} from "@/lib/intelligence/consult/schema";
import {
  BROWSER_STORAGE_KEYS,
  PRIVATE_BROWSER_STORAGE_KEYS,
  clearRegisteredPrivateBrowserData,
} from "@/lib/client/storage-keys";

const REQUIRED_FACT_LABELS = [
  "Participation",
  "Privacy and recording",
  "Purpose and requirements",
  "Who can see it",
  "What this creates",
  "Official record",
  "How long it stays",
] as const;

describe("staff participation contracts", () => {
  it("uses one canonical identity for the active consultation participation notice", () => {
    const submission = PARTICIPATION_CONTRACTS.consultation_submission;

    expect(submission.id).toBe(CONSULTATION_PARTICIPATION_NOTICE_ID);
    expect(submission.version).toBe(CONSULTATION_PARTICIPATION_NOTICE_CONTRACT_VERSION);
    expect(SCHEMA_NOTICE_ID).toBe(CONSULTATION_PARTICIPATION_NOTICE_ID);
    expect(SCHEMA_NOTICE_VERSION).toBe(CONSULTATION_PARTICIPATION_NOTICE_VERSION);
    expect(CONSULTATION_PARTICIPATION_NOTICE_VERSION)
      .toBe(`${CONSULTATION_PARTICIPATION_NOTICE_CONTRACT_VERSION}.0.0`);
  });

  it("has one complete, internally consistent contract for every registered surface", () => {
    expect(participationContractProblems()).toEqual([]);
    expect(Object.keys(PARTICIPATION_CONTRACTS).sort()).toEqual([...PARTICIPATION_SURFACES].sort());

    for (const surface of PARTICIPATION_SURFACES) {
      const contract = PARTICIPATION_CONTRACTS[surface];
      expect(["voluntary", "required"]).toContain(contract.requirement);
      expect(contract.officialRecord).toBe(false);
      expect(Object.values(contract.disclosure).every((value) => value.trim().length > 0)).toBe(true);
    }
  });

  it("keeps private learning, practice, and consultation preview out of supervisor and owner views", () => {
    for (const surface of ["learning", "path_practice", "my_work", "consultation_preview"] as const) {
      const contract = PARTICIPATION_CONTRACTS[surface];
      expect(contract.participationClass).toBe("voluntary_private");
      expect(contract.handling).toBe("private");
      expect(contract.viewers).not.toContain("supervisor");
      expect(contract.viewers).not.toContain("program_owner");
      expect(contract.viewers).not.toContain("authorized_consultant_workspace_user");
    }
  });

  it("discloses owner-readable ASK records and the difference between browser clearing and record deletion", () => {
    const contract = PARTICIPATION_CONTRACTS.ask;
    expect(contract).toMatchObject({ id: "staff-ask-recorded-v3", version: 3, handling: "recorded", participationClass: "voluntary_shared" });
    expect(contract.viewers).toContain("program_owner");
    expect(contract.viewers).not.toContain("supervisor");
    expect(contract.creates).toContain("ask_response_record");
    expect(contract.disclosure.retention).toContain("until the program owner deletes");
    const html = renderToStaticMarkup(createElement(ParticipationNotice, { surface: "ask" }));
    expect(html).toContain("questions and the answers are kept so the program owner can review them");
    expect(html).toContain("the program owner’s copy stays");
    expect(html).not.toContain("not kept as a conversation record");
    expect(PARTICIPATION_CONTRACTS.my_work.disclosure.retention).toContain("does not delete the separate ASK response records");
  });

  it.each(["consultant_sign_in", "consultant_workspace", "one_dsd_team"] as const)("renders the full operating disclosure for %s", (surface) => {
    const html = renderToStaticMarkup(createElement(ParticipationNotice, { surface }));

    expect(html).toContain(`data-participation-class="${PARTICIPATION_CONTRACTS[surface].participationClass}"`);
    for (const label of REQUIRED_FACT_LABELS) expect(html).toContain(label);
    expect(html).toMatch(/Voluntary|Sign-in is required/i);
    expect(PARTICIPATION_CONTRACTS[surface].disclosure.officialRecord).toMatch(/record/i);
    expect(html).toMatch(/until you (?:clear|delete)|exact approved period|after \d+ (?:minutes|days|hours)|life of this program|expires after/i);
  });

  it.each(PARTICIPATION_SURFACES.filter((surface) => !["consultant_sign_in", "consultant_workspace", "one_dsd_team"].includes(surface)))("keeps the %s staff notice useful without internal operating details", (surface) => {
    const html = renderToStaticMarkup(createElement(ParticipationNotice, { surface }));
    expect(html).toContain('aria-label="Your privacy and participation"');
    expect(html).toContain(`data-participation-class="${PARTICIPATION_CONTRACTS[surface].participationClass}"`);
    expect(html).not.toMatch(/HMAC|S3|runtime|server|latency|query hash|operational event/i);
    expect(html).not.toContain("Purpose and requirements");
  });

  it("keeps staff privacy choices and sharing boundaries visible", () => {
    const render = (surface: Parameters<typeof ParticipationNotice>[0]["surface"]) => renderToStaticMarkup(createElement(ParticipationNotice, { surface }));
    expect(render("ask")).toContain("service receives the question you type");
    expect(render("learning")).toContain("not shared with supervisors");
    expect(render("consultation_preview")).toContain("does not save or send");
    expect(render("my_work")).toContain("does not withdraw or delete");
    expect(render("consultation_submission")).toContain("Only authorized consultants");
  });

  it("gives nested consultant and One DSD Team notices distinct landmark names", () => {
    const consultant = renderToStaticMarkup(
      createElement(ParticipationNotice, { surface: "consultant_workspace" }),
    );
    const team = renderToStaticMarkup(
      createElement(ParticipationNotice, { surface: "one_dsd_team" }),
    );

    expect(consultant).toContain("How the Consultant Workspace works");
    expect(team).toContain("How the One DSD Team space works");
  });

  it("states the no-surveillance and learning-versus-compliance boundary in staff language", () => {
    for (const surface of ["learning", "path_practice", "my_work"] as const) {
      const text = Object.values(PARTICIPATION_CONTRACTS[surface].disclosure).join(" ");
      expect(text).toMatch(/not required training or compliance/i);
      expect(text).toMatch(/supervisor/i);
      expect(text).toMatch(/not (?:sent|receive|used)/i);
    }
  });

  it("wires the correct disclosure into every assigned staff entry point", () => {
    const root = path.resolve(__dirname, "..");
    const entries = [
      [path.join("app", "ask", "page.tsx"), 'surface="ask"'],
      [path.join("app", "learn", "page.tsx"), 'surface="learning"'],
      [path.join("app", "paths", "page.tsx"), 'surface="learning"'],
      [path.join("app", "paths", "[id]", "page.tsx"), 'surface="path_practice"'],
      [path.join("app", "my-view", "page.tsx"), 'surface="my_work"'],
    ] as const;

    for (const [file, expectedContract] of entries) {
      const source = readFileSync(path.join(root, file), "utf8");
      expect(source).toContain("<ParticipationNotice");
      expect(source).toContain(expectedContract);
    }
  });

  it("defines and wires the DSD consultation preview, submission, and tracking boundaries", () => {
    const preview = PARTICIPATION_CONTRACTS.consultation_preview;
    expect(preview.participationClass).toBe("voluntary_private");
    expect(preview.disclosure.privacy).toMatch(/does not create a consultation request/i);
    expect(preview.disclosure.creates).toMatch(/no request, queue item, reference ID, access key, meeting/i);

    const submission = PARTICIPATION_CONTRACTS.consultation_submission;
    expect(submission).toMatchObject({
      id: "dsd_consultation_request",
      participationClass: "voluntary_shared",
      handling: "recorded",
      sensitivityClass: "S3",
      activeQueueAdmission: "confirmed_dsd_only",
    });
    expect(submission.viewers).toContain("authorized_consultant_workspace_user");
    expect(submission.disclosure.privacy).toMatch(/S3 confidential operational request/i);
    expect(submission.disclosure.creates).toMatch(/Only confirmed DSD requests enter the active consultation queue/i);
    expect(submission.disclosure.purpose).toMatch(/not required training or a compliance activity/i);
    expect(submission.disclosure.retention).toMatch(/Deleting (?:that|either) browser copy does not withdraw or delete/i);

    const tracking = PARTICIPATION_CONTRACTS.consultation_tracking;
    expect(tracking).toMatchObject({
      participationClass: "voluntary_shared",
      handling: "recorded",
      sensitivityClass: "S3",
    });
    expect(tracking.disclosure.privacy).toMatch(/Treat the access key as private/i);
    expect(tracking.disclosure.creates).toMatch(/does not add Ask or learning activity/i);
    expect(tracking.creates).toContain("consultation_correction_update");
    expect(tracking.disclosure.participation).toMatch(/correct its general work information/i);
    expect(tracking.disclosure.creates).toMatch(/allowed general work fields/i);
    expect(tracking.disclosure.creates).toMatch(/cannot change eligibility, status, schedule, or private consultant notes/i);
    expect(tracking.disclosure.retention).toMatch(/correction or withdrawal does not restart the retention period/i);
    expect(tracking.disclosure.retention).toMatch(/Deleting (?:a|the) browser copy does not withdraw or delete/i);

    const root = path.resolve(__dirname, "..");
    const requestPage = readFileSync(path.join(root, "app", "support", "request", "page.tsx"), "utf8");
    const trackPage = readFileSync(path.join(root, "app", "support", "track", "page.tsx"), "utf8");
    const intakeClient = readFileSync(path.join(root, "components", "intake-client.tsx"), "utf8");
    const trackClient = readFileSync(path.join(root, "components", "track-client.tsx"), "utf8");

    // The request page reads activation server-side and renders a closed state (no form)
    // until intake is ready; the form only ever carries the submission surface.
    expect(requestPage).toContain("Consultation requests are not accepted from staff");
    expect(requestPage).not.toContain("<IntakeClient");
    expect(requestPage).not.toContain("consultation_preview");
    expect(trackPage).toContain("consultationTrackingActivationStatus");
    expect(trackPage).not.toContain("consultationIntakeEnabled");
    expect(trackPage).toContain('surface="consultation_tracking"');
    expect(intakeClient).toContain('participationContract("consultation_submission")');
    expect(intakeClient).toContain("participation_notice_id: SUBMISSION_CONTRACT.id");
    expect(intakeClient).toContain("BROWSER_STORAGE_KEYS.savedConsultationReferences");
    expect(trackClient).toContain("BROWSER_STORAGE_KEYS.savedConsultationReferences");
  });

  it("shows exact consultation retention and correction readiness at the point of use", () => {
    const submission = renderToStaticMarkup(createElement(ParticipationNotice, {
      surface: "consultation_submission",
      consultationRetentionDays: 120,
    }));
    const tracking = renderToStaticMarkup(createElement(ParticipationNotice, {
      surface: "consultation_tracking",
      consultationRetentionDays: 120,
      correctionEnabled: false,
    }));

    expect(submission).toContain("120 calendar days from submission");
    expect(tracking).toContain("120 calendar days from submission");
    expect(tracking).toContain("Corrections are temporarily unavailable");
  });

  it("wires sign-in, consultant operations, and One DSD Team to complete contracts", () => {
    const root = path.resolve(__dirname, "..");
    const practiceLayout = readFileSync(path.join(root, "app", "consultant", "layout.tsx"), "utf8");
    // The One DSD Team space now lives on the public side of the program; its
    // /consultant/one-dsd-team leaf just redirects there.
    const teamPage = readFileSync(path.join(root, "app", "one-dsd", "team", "workspace", "page.tsx"), "utf8");

    expect(practiceLayout).toContain('surface="consultant_sign_in"');
    expect(practiceLayout).toContain('surface="consultant_workspace"');
    expect(teamPage).not.toContain('surface="consultant_sign_in"');
    expect(teamPage).toContain('surface="one_dsd_team"');
    expect(PARTICIPATION_CONTRACTS.consultant_sign_in.requirement).toBe("required");
    expect(PARTICIPATION_CONTRACTS.consultant_workspace.disclosure.creates).toMatch(/publication decisions/i);
    expect(PARTICIPATION_CONTRACTS.one_dsd_team.disclosure.creates).toMatch(/Durable working posts/i);
  });
});

describe("private browser storage registry", () => {
  it("registers every Ask, prefill, request-reference, learning-note, path-note, and path-progress key exactly once", () => {
    const identities = PRIVATE_BROWSER_STORAGE_KEYS.map((entry) => `${entry.area}:${entry.key}`);
    expect(new Set(identities).size).toBe(identities.length);
    expect(identities).toContain(`session:${BROWSER_STORAGE_KEYS.askSession}`);
    expect(identities).toContain(`session:${BROWSER_STORAGE_KEYS.consultationPrefill}`);
    expect(identities).toContain(`session:${BROWSER_STORAGE_KEYS.recentConsultationReferences}`);
    expect(identities).toContain(`local:${BROWSER_STORAGE_KEYS.savedConsultationReferences}`);
    expect(identities).toContain(`local:${PRACTICE_STORAGE_KEY}`);
    expect(identities).not.toContain("session:pac_ask_session");

    for (const learningPath of GRADUATION_PATHS) {
      expect(identities).toContain(`local:${BROWSER_STORAGE_KEYS.pathArtifact(learningPath.id)}`);
      expect(identities).toContain(`local:${BROWSER_STORAGE_KEYS.pathProgress(learningPath.id)}`);
    }
  });

  it("clears every registered private key through the same operation My View uses", () => {
    const clear = vi.fn();
    clearRegisteredPrivateBrowserData(clear);

    expect(clear).toHaveBeenCalledTimes(PRIVATE_BROWSER_STORAGE_KEYS.length);
    expect(clear.mock.calls).toEqual(
      PRIVATE_BROWSER_STORAGE_KEYS.map((entry) => [entry.area, entry.key, null]),
    );
  });

  it("removes saved intercultural practice notes through My View's clear-private-data operation", () => {
    const saved = JSON.stringify({ version: 1, notes: { foundations: { ...emptyPractice(), situation: "Review a meeting format", action: "Invite written contributions" } } });
    const local = new Map([[PRACTICE_STORAGE_KEY, saved], ["another-app-preference", "keep"]]);
    clearRegisteredPrivateBrowserData((area, key) => {
      if (area === "local") local.delete(key);
    });
    expect(BROWSER_STORAGE_KEYS.learningPracticeNotes).toBe(PRACTICE_STORAGE_KEY);
    expect(local.has(PRACTICE_STORAGE_KEY)).toBe(false);
    expect(local.get("another-app-preference")).toBe("keep");
  });

  it("uses the current Ask key in My View and removes the ambiguous Required badge", () => {
    const root = path.resolve(__dirname, "..");
    const myView = readFileSync(path.join(root, "components", "my-view-client.tsx"), "utf8");
    const pathPage = readFileSync(path.join(root, "app", "paths", "[id]", "page.tsx"), "utf8");

    expect(BROWSER_STORAGE_KEYS.askSession).toBe("pac_ask_session_v2");
    expect(myView).toContain("BROWSER_STORAGE_KEYS.askSession");
    expect(myView).toContain("clearRegisteredPrivateBrowserData(writeStored)");
    expect(myView).not.toContain('"pac_ask_session"');
    expect(pathPage).toContain('stringValue(shell, "requiredLabel")');
    expect(getEditableSurfaceDefinition("practice.path-shell")?.approvedValues.requiredLabel).toBe("Needed for this optional worksheet");
    expect(pathPage).not.toMatch(/>Required</);
  });
});
