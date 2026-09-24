import { expect, test } from "@playwright/test";

/**
 * D1 search integration suite. Gated on SEARCH_API_URL: it runs against a
 * live Worker (local `opennext preview` or production), never against
 * `next start` (no D1 binding there — covered by the fallback contract test
 * in smoke.spec.ts).
 *
 * Run locally:  npm run preview &  SEARCH_API_URL=http://localhost:8787 npx playwright test tests/search-d1.spec.ts
 * Run vs prod:   SEARCH_API_URL=https://paulpan.net npx playwright test tests/search-d1.spec.ts
 * If this suite passes against prod, prod reads D1. If only smoke passes,
 * prod is silently on the static fallback — check migrations/seeding.
 */
const BASE = process.env.SEARCH_API_URL ?? "";

test.skip(
	BASE === "",
	"Set SEARCH_API_URL to a Worker URL (preview or prod) to run the D1 suite.",
);

async function search(q: string): Promise<{ slugs: string[]; source?: string }> {
	const res = await fetch(`${BASE}/api/search?q=${encodeURIComponent(q)}`);
	expect(res.status, `GET /api/search?q=${q}`).toBe(200);
	return (await res.json()) as { slugs: string[]; source?: string };
}

test("answers come from D1, not the fallback", async () => {
	const body = await search("tetlock");
	expect(body.source).toBe("d1-fts5");
});

test("body-only term resolves (full-text, not metadata)", async () => {
	// "tetlock" appears in essay bodies/references, never in titles/tags.
	expect((await search("tetlock")).slugs).toEqual(["who-predicts-well"]);
});

test("multi-token AND with title-boosted ranking", async () => {
	const { slugs } = await search("intelligence measurement");
	expect(slugs[0]).toBe("benchmark-intelligence-gap");
	expect(slugs).toContain("frontier-models-september-2026");
});

test("porter stemming matches word families", async () => {
	// "forecasting" stems to "forecast", matching "forecast", "forecasts", …
	const { slugs } = await search("forecasting");
	expect(slugs).toContain("who-predicts-well");
});

test("nonsense query returns empty, not an error", async () => {
	expect((await search("zzzznonexistent")).slugs).toEqual([]);
});

test("short query returns empty without touching FTS", async () => {
	expect((await search("a")).slugs).toEqual([]);
});
