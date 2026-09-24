-- Full-text search over essay bodies (SQLite FTS5, porter stemming).
-- The FTS table mirrors posts(body) via triggers; writers only touch posts.
CREATE TABLE IF NOT EXISTS posts (
  slug TEXT PRIMARY KEY,
  body TEXT NOT NULL
);
CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
  slug,
  body,
  tokenize = 'porter unicode61'
);
CREATE TRIGGER IF NOT EXISTS posts_ai AFTER INSERT ON posts BEGIN
  INSERT INTO posts_fts (slug, body) VALUES (new.slug, new.body);
END;
CREATE TRIGGER IF NOT EXISTS posts_ad AFTER DELETE ON posts BEGIN
  INSERT INTO posts_fts (posts_fts, slug, body)
  VALUES ('delete', old.slug, old.body);
END;
CREATE TRIGGER IF NOT EXISTS posts_au AFTER UPDATE ON posts BEGIN
  INSERT INTO posts_fts (posts_fts, slug, body)
  VALUES ('delete', old.slug, old.body);
  INSERT INTO posts_fts (slug, body) VALUES (new.slug, new.body);
END;
