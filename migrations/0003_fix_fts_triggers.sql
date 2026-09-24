-- Fix FTS sync triggers: the 0001 delete path used the external-content
-- 'delete' command form, which does not suppress rows in a normal FTS5
-- table — reseeds returned duplicate hits. Plain DELETE is correct here.
DROP TRIGGER IF EXISTS posts_ad;
DROP TRIGGER IF EXISTS posts_au;
CREATE TRIGGER posts_ad AFTER DELETE ON posts BEGIN
  DELETE FROM posts_fts WHERE slug = old.slug;
END;
CREATE TRIGGER posts_au AFTER UPDATE ON posts BEGIN
  DELETE FROM posts_fts WHERE slug = old.slug;
  INSERT INTO posts_fts (slug, body) VALUES (new.slug, new.body);
END;
-- Rebuild the index from stored content to drop orphaned rows left by the
-- old triggers (present in any database seeded more than once).
INSERT INTO posts_fts (posts_fts) VALUES ('rebuild');
