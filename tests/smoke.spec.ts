import { expect, test } from "@playwright/test";

const ROUTES = [
	"/",
	"/blog",
	"/blog/benchmark-intelligence-gap",
	"/blog/frontier-models-september-2026",
	"/blog/rss.xml",
	"/sitemap.xml",
];

test("routes return 200", async ({ request, baseURL }) => {
	for (const route of ROUTES) {
		const res = await request.get(`${baseURL}${route}`);
		expect(res.status(), route).toBe(200);
	}
});

test("no horizontal overflow at mobile width", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	for (const route of ["/", "/blog", "/blog/benchmark-intelligence-gap", "/blog/frontier-models-september-2026"]) {
		await page.goto(route);
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow, route).toBeLessThanOrEqual(1);
	}
});
