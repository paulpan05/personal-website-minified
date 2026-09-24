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

// The search API needs a D1 binding, which `next start` does not provide
// (verified for real under `opennext preview`). Contract: without a
// database it answers 503 + fallback:true, and the client uses the bundled
// static index instead. With D1 it answers 200 + ranked slugs.
test("search API degrades to the static-index contract", async ({
	request,
	baseURL,
}) => {
	const res = await request.get(`${baseURL}/api/search?q=tetlock`);
	const body = await res.json();
	if (res.status() === 200) {
		expect(Array.isArray(body.slugs)).toBe(true);
	} else {
		expect(res.status()).toBe(503);
		expect(body.fallback).toBe(true);
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
