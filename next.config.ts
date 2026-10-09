import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	pageExtensions: ["ts", "tsx", "md", "mdx"],
	// Baseline security headers. The CSP is deliberately partial (framing, base
	// URI, plugins, form targets): a script/style policy needs per-request
	// nonces under Next's inline scripts, and a wrong one blanks the site.
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "Strict-Transport-Security", value: "max-age=31536000" },
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-Frame-Options", value: "SAMEORIGIN" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
					{
						key: "Content-Security-Policy",
						value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'",
					},
				],
			},
		];
	},
};

const withMDX = createMDX({
	options: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [rehypeHighlight],
	},
});

export default withMDX(nextConfig);

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
