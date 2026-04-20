import { ROLE_CONTENT } from "./roles";
import { LOCATION_CONTENT } from "./locations";

export interface RoleLocationContent {
  intro: string;
  roleContext: string;
  locationContext: string;
  salaryMin: number;
  salaryMax: number;
  salaryNote: string;
  registration: string;
  qualifications: string[];
  keyEmployers: string[];
  demandNote: string;
}

export function getRoleLocationContent(
  roleSlug: string,
  locationSlug: string
): RoleLocationContent | null {
  const role = ROLE_CONTENT[roleSlug];
  const location = LOCATION_CONTENT[locationSlug];
  if (!role || !location) return null;

  const intro = `${role.name} roles in ${location.name} sit within ${location.demandNote.charAt(0).toLowerCase()}${location.demandNote.slice(1)} ${role.name.toLowerCase()} positions are found across public health services, community organisations, and private practice in the region.`;

  return {
    intro,
    roleContext: role.about[0],
    locationContext: location.about[0],
    salaryMin: role.salaryMin,
    salaryMax: role.salaryMax,
    salaryNote: role.salaryNote,
    registration: role.registration,
    qualifications: role.qualifications,
    keyEmployers: location.keyEmployers,
    demandNote: location.demandNote,
  };
}
