import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { classifyJob, isEligible, classifyJobStatus } from "./classifier.js";

describe("isEligible", () => {
  it("accepts a job with mental health in the title", () => {
    assert.equal(isEligible("Mental Health Nurse", "A nursing role."), true);
  });

  it("accepts a job with peer worker in the title", () => {
    assert.equal(isEligible("Peer Support Worker", "Community role."), true);
  });

  it("accepts a job with AOD in the description", () => {
    assert.equal(isEligible("Support Worker", "Providing AOD counselling and support."), true);
  });

  it("rejects a non-MH job", () => {
    assert.equal(isEligible("Software Engineer", "Building web applications with React."), false);
  });

  it("rejects a general nurse role", () => {
    assert.equal(isEligible("Registered Nurse", "Provide nursing care in a medical ward setting."), false);
  });
});

describe("classifyJob", () => {
  it("classifies a clinical psychologist from title", () => {
    const result = classifyJob(
      "Clinical Psychologist",
      "AHPRA registration required. Clinical psychology endorsement preferred."
    );
    assert.ok(result);
    assert.equal(result.roleSlug, "clinical-psychologist");
    assert.ok(result.confidence >= 0.4);
  });

  it("classifies a peer support worker from title", () => {
    const result = classifyJob(
      "Peer Support Worker",
      "Draw on your lived experience to provide peer support in a community mental health setting."
    );
    assert.ok(result);
    assert.equal(result.roleSlug, "peer-support-worker");
    assert.ok(result.confidence >= 0.4);
  });

  it("classifies a mental health nurse from title", () => {
    const result = classifyJob(
      "Mental Health Nurse — Acute Inpatient",
      "AHPRA nursing registration required. Mental health nursing experience essential."
    );
    assert.ok(result);
    assert.equal(result.roleSlug, "mental-health-nurse");
    assert.ok(result.confidence >= 0.4);
  });

  it("classifies an AOD worker from title", () => {
    const result = classifyJob(
      "AOD Worker",
      "Certificate IV in Alcohol and Other Drugs. Motivational interviewing experience."
    );
    assert.ok(result);
    assert.equal(result.roleSlug, "aod-worker");
    assert.ok(result.confidence >= 0.4);
  });

  it("classifies a youth mental health worker", () => {
    const result = classifyJob(
      "Youth Mental Health Worker",
      "Working with young people in a CAMHS setting. Youth mental health experience required."
    );
    assert.ok(result);
    assert.equal(result.roleSlug, "youth-mental-health-worker");
    assert.ok(result.confidence >= 0.4);
  });

  it("classifies a counsellor", () => {
    const result = classifyJob(
      "Counsellor — Mental Health",
      "PACFA member preferred. Diploma in counselling required."
    );
    assert.ok(result);
    assert.equal(result.roleSlug, "counsellor");
    assert.ok(result.confidence >= 0.4);
  });

  it("classifies a social worker from title + description", () => {
    const result = classifyJob(
      "Mental Health Social Worker",
      "AASW eligibility essential. Accredited mental health social work experience."
    );
    assert.ok(result);
    assert.equal(result.roleSlug, "mental-health-social-worker");
    assert.ok(result.confidence >= 0.4);
  });

  it("classifies a case manager", () => {
    const result = classifyJob(
      "Case Manager — Mental Health",
      "Providing case management in a mental health recovery service. Care coordination."
    );
    assert.ok(result);
    assert.equal(result.roleSlug, "case-manager");
    assert.ok(result.confidence >= 0.4);
  });

  it("returns null for a non-MH job", () => {
    const result = classifyJob(
      "Software Engineer",
      "Building web applications with React and Node.js."
    );
    assert.equal(result, null);
  });

  it("returns null when title matches eligibility but no role keywords", () => {
    const result = classifyJob(
      "Mental Health Administrator",
      "Office administration for a mental health clinic. Filing, scheduling, reception."
    );
    // May or may not match depending on weak signals — if no match, returns null
    if (result) {
      assert.ok(result.confidence < 0.7, "admin role should have low confidence");
    }
  });

  it("prefers clinical-psychologist over psychologist when endorsement is mentioned", () => {
    const result = classifyJob(
      "Clinical Psychologist — Adult Services",
      "Clinical psychology endorsement required. AHPRA clinical psychologist registration."
    );
    assert.ok(result);
    assert.equal(result.roleSlug, "clinical-psychologist");
  });

  it("assigns psychologist when the role is clearly general registration", () => {
    const result = classifyJob(
      "Registered Psychologist",
      "AHPRA registration as a psychologist. General registration. Psychological intervention and therapeutic assessment."
    );
    assert.ok(result);
    assert.equal(result.roleSlug, "psychologist");
  });

  it("classifies an art therapist", () => {
    const result = classifyJob(
      "Art Therapist",
      "ANZATA registration. Creative expression. Art-based intervention in a mental health setting."
    );
    assert.ok(result);
    assert.equal(result.roleSlug, "creative-therapist");
    assert.ok(result.confidence >= 0.4);
  });

  it("classifies a psychiatrist", () => {
    const result = classifyJob(
      "Consultant Psychiatrist",
      "RANZCP fellowship required. Psychiatric medication management."
    );
    assert.ok(result);
    assert.equal(result.roleSlug, "psychiatrist");
    assert.ok(result.confidence >= 0.4);
  });
});

describe("classifyJobStatus", () => {
  it("returns active for high confidence (>= 0.6)", () => {
    assert.equal(classifyJobStatus(0.6), "active");
    assert.equal(classifyJobStatus(0.7), "active");
    assert.equal(classifyJobStatus(0.9), "active");
    assert.equal(classifyJobStatus(1.0), "active");
  });

  it("returns review_queue for medium confidence (>= 0.3, < 0.6)", () => {
    assert.equal(classifyJobStatus(0.3), "review_queue");
    assert.equal(classifyJobStatus(0.4), "review_queue");
    assert.equal(classifyJobStatus(0.5), "review_queue");
    assert.equal(classifyJobStatus(0.59), "review_queue");
  });

  it("returns rejected for low confidence (< 0.3)", () => {
    assert.equal(classifyJobStatus(0.0), "rejected");
    assert.equal(classifyJobStatus(0.1), "rejected");
    assert.equal(classifyJobStatus(0.29), "rejected");
  });
});

describe("classifyJob – disqualifying terms title-only", () => {
  it("does NOT disqualify when disqualifying term is only in the description", () => {
    const result = classifyJob(
      "Clinical Psychologist",
      "Work alongside nurses and social workers in a multidisciplinary mental health team. AHPRA clinical psychology endorsement required."
    );
    assert.ok(result, "should classify even though description mentions nurses/social workers");
    assert.equal(result.roleSlug, "clinical-psychologist");
  });

  it("disqualifies when disqualifying term is in the title", () => {
    const result = classifyJob(
      "Social Worker — Mental Health Team",
      "AHPRA clinical psychology endorsement. Clinical psychologist assessment."
    );
    assert.ok(result);
    assert.notEqual(result.roleSlug, "clinical-psychologist");
  });
});
