-- Full post metadata in D1 (previously slug -> body only). Listings and
-- search read from here via paginated APIs so no UI path bundles N posts.
ALTER TABLE posts ADD COLUMN title TEXT NOT NULL DEFAULT '';
ALTER TABLE posts ADD COLUMN published_at TEXT NOT NULL DEFAULT '';
ALTER TABLE posts ADD COLUMN description TEXT NOT NULL DEFAULT '';
ALTER TABLE posts ADD COLUMN tags TEXT NOT NULL DEFAULT '[]';
ALTER TABLE posts ADD COLUMN reading_minutes INTEGER NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN provenance TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published_at DESC);
