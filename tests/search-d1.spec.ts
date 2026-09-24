import { expect, test } from "@playwright/test";

/**
 * D1 search/listing integration suite. Gated on SEARCH_API_URL: it runs
 * against a live Worker (local `opennext preview` or production), never
 * against `next start` (no D1 binding there — covered by the unavailability
 * contract test in smoke.spec.ts).
 *
 * Run locally:  npm run preview &  SEARCH_API_URL=http://localhost:8787 npx playwright test tests/search-d1.spec.ts
 * Run vs prod:   SEARCH_API_URL=https://paulpan.net npx playwright test tests/search-d1.spec.ts
 * If this suite passes against prod, prod reads D1. If only smoke passes,
 * prod has no database — check migrations/seeding.
 */
const BASE = process.env.SEARCH_API_URL ?? "";

test.skip(
	BASE === "",
	"Set SEARCH_API_URL to a Worker URL (preview or prod) to run the D1 suite.",
);

interface ApiPost {
	slug: string;
	title: string;
	published_at: string;
	description: string;
	tags: string;
	reading_minutes: number;
	provenance: string;
}

async function get<T>(path: string): Promise<{ status: number; body: T }> {
	const res = await fetch(`${BASE}${path}`);
	return { status: res.status, body: (await res.json()) as T };
}

test("answers come from D1", async () => {
	const { status, body } = await get<{ posts: ApiPost[]; source?: string }>(
		"/api/search?q=tetlock",
	);
	expect(status).toBe(200);
	expect(body.source).toBe("d1-fts5");
	expect(body.posts.map((p) => p.slug)).toEqual(["who-predicts-well"]);
});

test("search rows carry full metadata", async () => {
	const { body } = await get<{ posts: ApiPost[] }>("/api/search?q=tetlock");
	const [post] = body.posts;
	expect(post.title).toMatch(/Who Predicts Well/);
	expect(post.published_at).toBe("2026-09-23T22:43:59-04:00");
	expect(JSON.parse(post.tags)).toContain("forecasting");
	expect(post.reading_minutes).toBe(19);
});

test("multi-token AND ranks title hits first", async () => {
	const { body } = await get<{ posts: ApiPost[] }>(
		"/api/search?q=intelligence%20measurement",
	);
	expect(body.posts[0].slug).toBe("benchmark-intelligence-gap");
});

test("tag narrows search", async () => {
	const { body } = await get<{ posts: ApiPost[] }>(
		"/api/search?q=intelligence&tag=survey",
	);
	const slugs = body.posts.map((p) => p.slug);
	expect(slugs).toContain("frontier-models-september-2026");
	expect(slugs).not.toContain("benchmark-intelligence-gap");
});

test("porter stemming matches word families", async () => {
	const { body } = await get<{ posts: ApiPost[] }>(
		"/api/search?q=forecasting",
	);
	expect(body.posts.map((p) => p.slug)).toContain("who-predicts-well");
});

test("listing pages metadata newest-first", async () => {
	const { body } = await get<{
		posts: ApiPost[];
		total: number;
		page: number;
		totalPages: number;
		source?: string;
	}>("/api/posts?page=1");
	expect(body.source).toBe("d1");
	expect(body.total).toBeGreaterThanOrEqual(3);
	expect(body.posts[0].slug).toBe("who-predicts-well");
	expect(body.posts[0].title).toMatch(/Who Predicts Well/);
});

test("listing tag filter narrows", async () => {
	const { body } = await get<{ posts: ApiPost[]; total: number }>(
		"/api/posts?tag=forecasting",
	);
	expect(body.total).toBe(1);
	expect(body.posts[0].slug).toBe("who-predicts-well");
});

test("tags enumerate distinct topics", async () => {
	const { body } = await get<{ tags: string[]; source?: string }>(
		"/api/tags",
	);
	expect(body.source).toBe("d1");
	expect(body.tags).toContain("forecasting");
	expect(body.tags).toEqual([...body.tags].sort());
});

test("nonsense query returns empty, not an error", async () => {
	const { status, body } = await get<{ posts: ApiPost[] }>(
		"/api/search?q=zzzznonexistent",
	);
	expect(status).toBe(200);
	expect(body.posts).toEqual([]);
});

test("short query returns empty without touching FTS", async () => {
	const { status, body } = await get<{ posts: ApiPost[] }>(
		"/api/search?q=a",
	);
	expect(status).toBe(200);
	expect(body.posts).toEqual([]);
});
