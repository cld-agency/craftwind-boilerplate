import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
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
			host: env.PRIMARY_SITE_URL.replace(/^http:\/\//, ""),
			// Use a strict port because we have to hard code this in vite.php
			strictPort: true,
			port: 3000,
			origin: 'http://localhost:3000'
		}
	}
})