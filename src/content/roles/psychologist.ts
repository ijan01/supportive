import { RoleContent } from "./types";

const content: RoleContent = {
  slug: "psychologist",
  name: "Psychologist",
  summary: "Psychologists assess and treat mental health conditions using evidence-based therapies. They work across public health, community, and private practice settings throughout Australia.",
  about: [
    "Psychologists in Australia work across a wide range of settings — from public mental health services and hospitals to private practice, schools, and community organisations. They provide psychological assessment, diagnosis, and treatment using evidence-based approaches such as cognitive behavioural therapy (CBT), acceptance and commitment therapy (ACT), and trauma-informed care.",
    "In the Australian context, General Psychologists complete a four-year undergraduate degree plus a two-year supervised postgraduate qualification (the '4+2' pathway). Clinical, Forensic, and other specialist endorsements require additional training. All practising psychologists must hold current AHPRA registration.",
    "Demand for psychologists has grown significantly following the expansion of the Better Access initiative, which provides Medicare-rebated sessions. Private practice roles are abundant in major cities, while public sector and community health roles are concentrated in areas of high need.",
  ],
  salaryMin: 85000,
  salaryMax: 130000,
  salaryNote: "Private practice and specialist endorsements attract higher rates. Medicare provider numbers increase earning potential significantly.",
  registration: "AHPRA registration as a Psychologist is required. A Medicare provider number is needed for private practice billing.",
  qualifications: [
    "Four-year APAC-accredited undergraduate psychology degree",
    "Two-year supervised practice (4+2 pathway) or accredited postgraduate degree",
    "Current AHPRA registration",
    "Specialist endorsement (Clinical, Forensic, Health etc.) for senior roles",
  ],
  careerPathway: "Most psychologists begin in supervised practice or junior community health roles, progressing to senior clinician positions within three to five years. Specialist endorsement opens pathways into clinical leadership, forensic, neuropsychology, or private practice. Some move into research, policy, or academic roles.",
};

export default content;
