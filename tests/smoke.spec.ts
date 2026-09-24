import { expect, test } from "@playwright/test";
import { getPostSlugs } from "../src/content/posts";

// Post routes derive from the POST_DEFS registry, so new posts are covered
// automatically. (The .mdx imports in posts.ts are lazy and never execute
// here — only the slug list is used.)
const ALL_POST_ROUTES = getPostSlugs().map((slug) => `/blog/${slug}`);

// Full enumeration is fine for a small archive; past 25 posts, check a
// deterministic sample instead (latest 10 + every 25th + oldest 5) so the
// suite stays fast at 500+ essays.
const POST_ROUTES =
	ALL_POST_ROUTES.length <= 25
		? ALL_POST_ROUTES
		: [
				...ALL_POST_ROUTES.slice(0, 10),
				...ALL_POST_ROUTES.filter((_, i) => i % 25 === 0),
				...ALL_POST_ROUTES.slice(-5),
			];

const ROUTES = ["/", "/blog", "/blog?page=2", ...POST_ROUTES, "/blog/rss.xml", "/sitemap.xml"];

test("routes return 200", async ({ request, baseURL }) => {
	for (const route of ROUTES) {
		const res = await request.get(`${baseURL}${route}`);
		expect(res.status(), route).toBe(200);
	}
});

// The search/listing APIs need a D1 binding. Under `next start` the
// platform proxy may or may not have resolved it by request time (a startup
// race — verified flaky both ways), so this asserts the SHAPE contract,
// not a fixed status: 200 carries posts + source:'d1'; 503 carries an
// explicit error and the UI reports unavailability instead of fake results.
// Real D1 behavior is pinned by tests/search-d1.spec.ts under preview/prod.
test("APIs answer the shape contract with or without a database", async ({
	request,
	baseURL,
}) => {
	for (const route of ["/api/search?q=tetlock", "/api/posts", "/api/tags"]) {
		const res = await request.get(`${baseURL}${route}`);
		const body = await res.json();
		if (res.status() === 200) {
			expect(["d1", "d1-fts5"], route).toContain(body.source);
		} else {
			expect(res.status(), route).toBe(503);
			expect(body.error, route).toMatch(/unavailable/);
		}
	}
});

test("no horizontal overflow at mobile width", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	for (const route of ["/", "/blog", ...POST_ROUTES]) {
		await page.goto(route);
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow, route).toBeLessThanOrEqual(1);
	}
});
