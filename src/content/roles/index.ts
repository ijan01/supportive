import { RoleContent } from "./types";
import psychologist from "./psychologist";
import clinicalPsychologist from "./clinical-psychologist";
import psychiatrist from "./psychiatrist";
import mentalHealthNurse from "./mental-health-nurse";
import mentalHealthOT from "./mental-health-occupational-therapist";
import mentalHealthSocialWorker from "./mental-health-social-worker";
import counsellor from "./counsellor";
import psychotherapist from "./psychotherapist";
import creativeTherapist from "./creative-therapist";
import eatingDisorderDietitian from "./eating-disorder-dietitian";
import peerSupportWorker from "./peer-support-worker";
import livedExperienceWorker from "./lived-experience-worker";
import mentalHealthSupportWorker from "./mental-health-support-worker";
import aodWorker from "./aod-worker";
import youthMentalHealthWorker from "./youth-mental-health-worker";
import caseManager from "./case-manager";
import clinicalLead from "./clinical-lead";
import mentalHealthEducator from "./mental-health-educator";

const ALL_ROLE_CONTENT: RoleContent[] = [
  psychologist,
  clinicalPsychologist,
  psychiatrist,
  mentalHealthNurse,
  mentalHealthOT,
  mentalHealthSocialWorker,
  counsellor,
  psychotherapist,
  creativeTherapist,
  eatingDisorderDietitian,
  peerSupportWorker,
  livedExperienceWorker,
  mentalHealthSupportWorker,
  aodWorker,
  youthMentalHealthWorker,
  caseManager,
  clinicalLead,
  mentalHealthEducator,
];

export const ROLE_CONTENT: Record<string, RoleContent> = Object.fromEntries(
  ALL_ROLE_CONTENT.map((r) => [r.slug, r])
);

export type { RoleContent };
