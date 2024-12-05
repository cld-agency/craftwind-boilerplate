import fs from 'node:fs';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const config = {
		// In dev mode, we serve assets at the root of http://localhost:3000
		// In production, files live in the /assets directory
		base: command === 'serve' ? '' : '/dist/',
		build: {
			manifest: true,
			outDir: 'public_html/dist/',
			rollupOptions: {
				input: {
					app: 'src/js/main.js'
				}
			},
		},
		server: {
			host: env.VITE_HOST ?? env.PRIMARY_SITE_URL.replace(/^http:\/\//, ""),
			// Use a strict port because we have to hard code this in vite.php
			strictPort: true,
			port: env.VITE_PORT ?? 3000
		}
	};

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