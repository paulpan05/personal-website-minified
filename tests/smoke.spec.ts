import { expect, test } from "@playwright/test";
import { getPostSlugs } from "../src/content/posts";

// Post routes derive from the POST_DEFS registry, so new posts are covered
// automatically. (The .mdx imports in posts.ts are lazy and never execute
// here — only the slug list is used.)
const POST_ROUTES = getPostSlugs().map((slug) => `/blog/${slug}`);

const ROUTES = ["/", "/blog", ...POST_ROUTES, "/blog/rss.xml", "/sitemap.xml"];

test("routes return 200", async ({ request, baseURL }) => {
	for (const route of ROUTES) {
		const res = await request.get(`${baseURL}${route}`);
		expect(res.status(), route).toBe(200);
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
