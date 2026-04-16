export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Remote",
  "Internship",
] as const;

export const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Product",
  "Data Science",
  "DevOps",
  "Customer Support",
  "Finance",
  "Human Resources",
] as const;

export const LOCATIONS = [
  "Remote",
  "New York, NY",
  "San Francisco, CA",
  "Austin, TX",
  "Seattle, WA",
  "Chicago, IL",
  "Los Angeles, CA",
  "Boston, MA",
  "Denver, CO",
  "Miami, FL",
] as const;

export const JOB_TYPE_COLORS: Record<string, string> = {
  "Full-time": "bg-violet-100 text-violet-700",
  "Part-time": "bg-emerald-100 text-emerald-700",
  "Contract": "bg-amber-100 text-amber-700",
  "Remote": "bg-cyan-100 text-cyan-700",
  "Internship": "bg-pink-100 text-pink-700",
};

export const APPLICATION_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  accepted: "bg-green-100 text-green-700",
};
