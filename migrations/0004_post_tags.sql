-- Normalized topic junction: indexed equality replaces the
-- tags LIKE '%"x"%' full scans in /api/posts and /api/search.
-- Backfilled from existing rows so the migration is safe regardless of
-- reseed order; the seed script maintains it with DELETE+INSERT pairs
-- (same rule as posts: never INSERT OR REPLACE — REPLACE skips the
-- AFTER DELETE triggers), and the triggers below keep direct writes
-- consistent.
CREATE TABLE IF NOT EXISTS post_tags (
  post_slug TEXT NOT NULL REFERENCES posts(slug) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (post_slug, tag)
);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag);

INSERT OR IGNORE INTO post_tags (post_slug, tag)
SELECT posts.slug AS post_slug, value AS tag
FROM posts, json_each(posts.tags);

DROP TRIGGER IF EXISTS posts_tags_ai;
CREATE TRIGGER posts_tags_ai AFTER INSERT ON posts BEGIN
  INSERT OR IGNORE INTO post_tags (post_slug, tag)
  SELECT new.slug, value FROM json_each(new.tags);
END;
DROP TRIGGER IF EXISTS posts_tags_ad;
CREATE TRIGGER posts_tags_ad AFTER DELETE ON posts BEGIN
  DELETE FROM post_tags WHERE post_slug = old.slug;
END;
DROP TRIGGER IF EXISTS posts_tags_au;
CREATE TRIGGER posts_tags_au AFTER UPDATE ON posts BEGIN
  DELETE FROM post_tags WHERE post_slug = old.slug;
  INSERT OR IGNORE INTO post_tags (post_slug, tag)
  SELECT new.slug, value FROM json_each(new.tags);
END;
