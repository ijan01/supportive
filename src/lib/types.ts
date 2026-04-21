export type UserRole = "company" | "seeker" | "admin";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  company_name: string | null;
  created_at: string;
}

export interface UserRow extends User {
  password_hash: string;
}

export type JobSource = "adzuna" | "direct" | "manual";
export type JobStatus = "active" | "expired" | "review_queue" | "rejected";
export type EmploymentType = "full_time" | "part_time" | "contract" | "casual" | "internship" | "volunteer";

export interface Job {
  id: number;
  user_id: number | null;
  title: string;
  company: string;
  location: string;
  category: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  description: string;
  requirements: string | null;
  apply_url: string | null;
  is_featured: number;
  created_at: string;
  updated_at: string;
  // Feed integration fields
  external_id: string | null;
  source: JobSource;
  role_slug: string | null;
  role_confidence: number | null;
  employer_name: string | null;
  employer_slug: string | null;
  location_city: string | null;
  location_state: string | null;
  is_remote: boolean;
  is_hybrid: boolean;
  employment_type: EmploymentType | null;
  salary_is_predicted: boolean;
  posted_date: string | null;
  valid_through: string | null;
  status: JobStatus;
  raw_payload: unknown | null;
}

export interface JobWithApplicationCount extends Job {
  application_count: number;
}

export interface JobFilters {
  search?: string;
  location?: string;
  category?: string;
  job_type?: string;
  page?: number;
  limit?: number;
}

export interface CreateJobInput {
  title: string;
  company: string;
  location: string;
  category: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements: string;
  apply_url?: string;
}

export interface Application {
  id: number;
  job_id: number;
  user_id: number;
  name: string;
  email: string;
  resume_url: string | null;
  cover_letter: string | null;
  status: "pending" | "reviewed" | "rejected" | "accepted";
  created_at: string;
}

export interface ApplicationWithJob extends Application {
  job_title: string;
  job_company: string;
}

export interface SavedJob {
  id: number;
  user_id: number;
  job_id: number;
  created_at: string;
}

export interface FeedRun {
  id: number;
  started_at: string;
  finished_at: string | null;
  status: "running" | "completed" | "failed";
  total_fetched: number;
  total_deduped: number;
  total_filtered: number;
  total_classified: number;
  total_published: number;
  total_queued: number;
  total_rejected: number;
  error: string | null;
  metadata: unknown | null;
}

export interface SavedSearch {
  id: number;
  user_id: number;
  name: string;
  search: string | null;
  location: string | null;
  category: string | null;
  job_type: string | null;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  cover_image: string | null;
  primary_keyword: string | null;
  secondary_keywords: string | null;
  published_at: string | null;
  created_at: string;
}
