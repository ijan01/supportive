import { sql } from "./index";

let initialized = false;

export async function initSchema(): Promise<void> {
  if (initialized) return;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('company', 'seeker', 'admin')),
      company_name TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      category TEXT NOT NULL,
      job_type TEXT NOT NULL,
      salary_min INTEGER,
      salary_max INTEGER,
      description TEXT NOT NULL,
      requirements TEXT,
      apply_url TEXT,
      is_featured INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      external_id TEXT,
      source TEXT NOT NULL DEFAULT 'manual',
      role_slug TEXT,
      role_confidence REAL,
      employer_name TEXT,
      employer_slug TEXT,
      location_city TEXT,
      location_state TEXT,
      is_remote BOOLEAN NOT NULL DEFAULT FALSE,
      is_hybrid BOOLEAN NOT NULL DEFAULT FALSE,
      employment_type TEXT,
      salary_is_predicted BOOLEAN NOT NULL DEFAULT FALSE,
      posted_date TIMESTAMPTZ,
      valid_through TIMESTAMPTZ,
      status TEXT NOT NULL DEFAULT 'active',
      raw_payload JSONB
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      resume_url TEXT,
      cover_letter TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'rejected', 'accepted')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS saved_jobs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, job_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      author TEXT NOT NULL,
      cover_image TEXT,
      primary_keyword TEXT,
      secondary_keywords TEXT,
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS feed_runs (
      id SERIAL PRIMARY KEY,
      started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      finished_at TIMESTAMPTZ,
      status TEXT NOT NULL DEFAULT 'running',
      total_fetched INTEGER NOT NULL DEFAULT 0,
      total_deduped INTEGER NOT NULL DEFAULT 0,
      total_filtered INTEGER NOT NULL DEFAULT 0,
      total_classified INTEGER NOT NULL DEFAULT 0,
      total_published INTEGER NOT NULL DEFAULT 0,
      total_queued INTEGER NOT NULL DEFAULT 0,
      total_rejected INTEGER NOT NULL DEFAULT 0,
      error TEXT,
      metadata JSONB
    )
  `;

  // Migrate role constraint to include admin
  await sql`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check`.catch(() => {});
  await sql`ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('company', 'seeker', 'admin'))`.catch(() => {});

  // Migrate existing tables that predate the feed columns
  await addFeedColumns();

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_role_slug ON jobs(role_slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_location_state ON jobs(location_state)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug)`;

  await sql`
    CREATE TABLE IF NOT EXISTS saved_searches (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      search TEXT,
      location TEXT,
      category TEXT,
      job_type TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS content_plan (
      id SERIAL PRIMARY KEY,
      article_number INTEGER UNIQUE NOT NULL,
      title TEXT NOT NULL,
      slug TEXT,
      content_type TEXT NOT NULL CHECK (content_type IN ('PILLAR', 'CLUSTER', 'CONVERSION')),
      target_keyword TEXT,
      secondary_keywords TEXT,
      target_role TEXT,
      pillar_parent_id INTEGER,
      status TEXT NOT NULL DEFAULT 'Planned' CHECK (status IN ('Planned', 'Brief Ready', 'Draft', 'In Review', 'Published')),
      target_word_count_min INTEGER,
      target_word_count_max INTEGER,
      target_publish_date DATE,
      published_url TEXT,
      published_at TIMESTAMPTZ,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  // Migrate existing blog_posts tables that predate keyword columns
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS primary_keyword TEXT`.catch(() => {});
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS secondary_keywords TEXT`.catch(() => {});

  await sql`CREATE INDEX IF NOT EXISTS idx_content_plan_status ON content_plan(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_content_plan_content_type ON content_plan(content_type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_content_plan_target_role ON content_plan(target_role)`;

  initialized = true;
}

async function addFeedColumns(): Promise<void> {
  // For existing DBs created before feed integration: relax constraints
  await sql`ALTER TABLE jobs ALTER COLUMN user_id DROP NOT NULL`.catch(() => {});
  await sql`ALTER TABLE jobs ALTER COLUMN requirements DROP NOT NULL`.catch(() => {});

  // Add feed-related columns (idempotent for existing DBs)
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS external_id TEXT`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual'`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS role_slug TEXT`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS role_confidence REAL`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employer_name TEXT`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employer_slug TEXT`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location_city TEXT`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location_state TEXT`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_remote BOOLEAN NOT NULL DEFAULT FALSE`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_hybrid BOOLEAN NOT NULL DEFAULT FALSE`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employment_type TEXT`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_is_predicted BOOLEAN NOT NULL DEFAULT FALSE`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS posted_date TIMESTAMPTZ`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS valid_through TIMESTAMPTZ`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS raw_payload JSONB`;

  // Unique index on (source, external_id)
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_jobs_source_external_id ON jobs(source, external_id) WHERE external_id IS NOT NULL`;

  // Backfill existing rows with structured fields
  await sql`
    UPDATE jobs SET
      employer_name = company,
      posted_date = created_at,
      valid_through = created_at + INTERVAL '30 days'
    WHERE employer_name IS NULL
  `;
}
