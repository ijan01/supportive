// Content Plan types (defined in content-plan.ts but referenced here for completeness)
export interface ContentPlanItem {
  id: number;
  article_number: number;
  title: string;
  slug: string | null;
  content_type: "PILLAR" | "CLUSTER" | "CONVERSION";
  target_keyword: string | null;
  secondary_keywords: string | null;
  target_role: string | null;
  pillar_parent_id: number | null;
  status: "Planned" | "Brief Ready" | "Draft" | "In Review" | "Published";
  target_word_count_min: number | null;
  target_word_count_max: number | null;
  target_publish_date: string | null;
  published_url: string | null;
  published_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Blog Post types
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

// Extended type for admin listing (joined with content_plan)
export interface BlogPostAdminRow extends BlogPost {
  content_type: string | null;
  target_keyword: string | null;
  target_role: string | null;
  article_number: number | null;
  cp_status: string | null;
}
