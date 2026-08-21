import fs from 'node:fs';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, '../', '');

	// Browser-facing host for the dev server. Point VITE_HOST at an sslip.io name
	// (see .env.example) to preview on a phone; `npm run lan` maintains it for you.
	const previewHost = env.VITE_HOST || 'localhost';

	// Kept in lockstep with `devServerPublic` in config/vite.php, which builds the
	// same string from the same .env vars.
	const scheme = env.VITE_SSL_KEY ? 'https' : 'http';
	const devServerPort = env.VITE_PORT ?? 3000;
	const devServerOrigin = `${scheme}://${previewHost}:${devServerPort}`;

	// The hostnames this site is reachable on: the preview host, the plain hostname
	// sitting underneath any sslip.io suffix, and loopback.
	const localHosts = [...new Set([
		previewHost,
		previewHost.replace(/\.\d{1,3}-\d{1,3}-\d{1,3}-\d{1,3}\.sslip\.io$/, ''),
		'localhost',
		'127.0.0.1',
	].filter(Boolean))];

	// Exact hostnames on any port. Deliberately not a wildcard: sslip.io will
	// resolve a name to *any* IP, so a lookalike origin must not be trusted.
	const escapeRe = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const allowedOrigin = new RegExp(`^https?://(${localHosts.map(escapeRe).join('|')})(:\\d+)?$`);

	const config = {
		// In dev mode, assets are served from the dev server origin below.
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
			// Listen on every interface, so devices on the LAN can reach the dev
			// server rather than only this machine's loopback.
			host: true,

			// Use a strict port because we have to hard code this in config/vite.php
			strictPort: true,
			port: devServerPort,

			// Hand out absolute asset URLs on this origin, so a phone doesn't try
			// to fetch modules from its own localhost.
			origin: devServerOrigin,

			// The HMR socket dials this directly, so it needs the reachable host.
			hmr: {
				host: previewHost,
			},

			// Vite rejects unrecognised Host headers as DNS-rebinding protection.
			allowedHosts: localHosts,

			// fix CORS stuff:
			// https://github.com/vitejs/vite/security/advisories/GHSA-vg6x-rcgg-rjx6
			cors: {
				origin: allowedOrigin,
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