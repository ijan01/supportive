import { RoleContent } from "./types";

const content: RoleContent = {
  slug: "psychiatrist",
  name: "Psychiatrist",
  summary: "Psychiatrists are medical doctors who specialise in diagnosing and treating mental illness. They are the only mental health professionals who can prescribe medication in Australia.",
  about: [
    "Psychiatrists complete a medical degree (MBBS) followed by basic physician training and then a five-year specialist training program through the Royal Australian and New Zealand College of Psychiatrists (RANZCP). After completing their Fellowship (FRANZCP), they may subspecialise in areas such as child and adolescent psychiatry, forensic psychiatry, or consultation-liaison.",
    "They work in public hospitals, community mental health centres, private consulting rooms, correctional facilities, and research institutions. Psychiatrists lead multidisciplinary mental health teams, provide complex diagnostic assessments, manage medication, and undertake medico-legal work.",
    "Australia faces a significant shortage of psychiatrists, particularly in rural and regional areas. Public sector demand is strong, and private practice billings under Medicare are substantial.",
  ],
  salaryMin: 220000,
  salaryMax: 450000,
  salaryNote: "Public sector VMO and staff specialist roles vary by state award. Private practice income can significantly exceed salaried positions.",
  registration: "AHPRA registration as a Medical Practitioner (Specialist) and FRANZCP fellowship required.",
  qualifications: [
    "Medical degree (MBBS or equivalent)",
    "Completion of RANZCP Fellowship training program",
    "FRANZCP or equivalent specialist qualification",
    "AHPRA specialist registration",
  ],
  careerPathway: "Psychiatric trainees progress through basic and advanced training before Fellowship. Post-Fellowship pathways include subspecialisation, academic psychiatry, clinical directorship, or private practice. Rural generalist psychiatry and telehealth roles are a growing pathway addressing workforce shortages.",
};

export default content;
