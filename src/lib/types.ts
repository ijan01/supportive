export interface User {
  id: number;
  email: string;
  name: string;
  role: "company" | "seeker";
  company_name: string | null;
  created_at: string;
}

export interface UserRow extends User {
  password_hash: string;
}

export interface Job {
  id: number;
  user_id: number;
  title: string;
  company: string;
  location: string;
  category: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  description: string;
  requirements: string;
  apply_url: string | null;
  is_featured: number;
  created_at: string;
  updated_at: string;
}

export interface JobWithApplicationCount extends Job {
  application_count: number;
}

export interface JobFilters {
  search?: string;
  location?: string;
  category?: string;
  job_type?: string;
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

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
}
