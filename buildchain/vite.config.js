import fs from 'node:fs';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, '../', '');
	const config = {
		// In dev mode, we serve assets at the root of http://localhost:4000
		// In production, files live in the /dist directory
		base: command === 'serve' ? '' : '/dist/',
		build: {
			manifest: true,
			outDir: '../public_html/dist/',

			// need this to force compiling outside of Vite's root.
			emptyOutDir: true,

			rollupOptions: {
				input: {
					app: 'src/js/main.js'
				},
				// in case you ever need to reference assets in CSS files, tell Vite to ignore them:
				external: [
					/^\/assets\/img/,
					/^\/assets\/fonts/,
				]
			},
		},
		server: {
			host: env.VITE_HOST ?? env.PRIMARY_SITE_URL.replace(/^http:\/\//, ""),
			// Use a strict port because we have to hard code this in config/vite.php
			strictPort: true,
			port: env.VITE_PORT ?? 3000,

			// fix CORS stuff:
			// https://github.com/vitejs/vite/security/advisories/GHSA-vg6x-rcgg-rjx6
			cors: {
				origin: env.PRIMARY_SITE_URL,
			},
		},
		plugins: [
			tailwindcss(),
		],
	};

	// Probably just for ddev users??
	if (env.VITE_SSL_CERT && env.VITE_SSL_KEY) {
		// SSL cert/key is defined in .env file — enable Vite over SSL
		config.server.https = {
			key: fs.readFileSync(env.VITE_SSL_KEY),
			cert: fs.readFileSync(env.VITE_SSL_CERT),
			...config.server.https ?? {}
		};
	}

	return config;
})