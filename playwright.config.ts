import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	// `npm run start -- -p 3100` serves the production build locally.
	webServer: {
		command: "npm run start -- -p 3100",
		port: 3100,
		reuseExistingServer: true,
		timeout: 60_000,
	},
});
