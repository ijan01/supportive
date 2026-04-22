-- Content Plan table
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
);

CREATE INDEX IF NOT EXISTS idx_content_plan_status ON content_plan(status);
CREATE INDEX IF NOT EXISTS idx_content_plan_content_type ON content_plan(content_type);
CREATE INDEX IF NOT EXISTS idx_content_plan_target_role ON content_plan(target_role);

-- Blog Posts table
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
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
