/**
 * Stamps this machine's current LAN IP into VITE_HOST in ../.env, as an
 * sslip.io hostname that both this Mac and other devices on the Wi-Fi resolve.
 *
 * sslip.io answers any `<anything>.192-168-1-5.sslip.io` with 192.168.1.5, and
 * MAMP's vhost carries a matching `<site>.test.*` wildcard server name — so one
 * hostname reaches the site on port 80 and the Vite dev server on VITE_PORT.
 *
 * Run it directly (`npm run lan`) or let `npm run all` call it on start-up.
 * Never exits non-zero: a failure here must not stop the dev server booting.
 */

import { networkInterfaces } from 'node:os';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ENV_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', '.env');

// Only these ranges are reachable from other devices on the same network.
const isPrivate = (ip) =>
	/^192\.168\./.test(ip) ||
	/^10\./.test(ip) ||
	/^172\.(1[6-9]|2\d|3[01])\./.test(ip);

/** Pick the LAN IPv4, preferring real hardware ports (en0, en1, …) over VPN/Docker adapters. */
function findLanIp() {
	const candidates = Object.entries(networkInterfaces())
		.flatMap(([name, addrs]) => (addrs ?? []).map((addr) => ({ name, ...addr })))
		.filter((i) => i.family === 'IPv4' && !i.internal && isPrivate(i.address));

	const rank = (name) => {
		const en = name.match(/^en(\d+)$/); // en0 is Wi-Fi on most Macs
		return en ? Number(en[1]) : 100;
	};

	candidates.sort((a, b) => rank(a.name) - rank(b.name));
	return candidates[0] ?? null;
}

const iface = findLanIp();

if (!iface) {
	console.warn('[lan] No LAN address found — leaving VITE_HOST alone. On Wi-Fi?');
	process.exit(0);
}

let env;
try {
	env = readFileSync(ENV_PATH, 'utf8');
} catch (err) {
	console.warn(`[lan] Could not read ${ENV_PATH}: ${err.message}`);
	process.exit(0);
}

const match = env.match(/^VITE_HOST=(.*)$/m);
if (!match) {
	console.warn('[lan] No VITE_HOST line in .env — nothing to update.');
	process.exit(0);
}

// Keep whatever the hostname starts with, swapping only a trailing sslip.io suffix.
const base = match[1].trim().replace(/\.\d{1,3}-\d{1,3}-\d{1,3}-\d{1,3}\.sslip\.io$/, '');
if (!base) {
	console.warn('[lan] VITE_HOST is empty — set it to your site hostname first.');
	process.exit(0);
}

const host = `${base}.${iface.address.replaceAll('.', '-')}.sslip.io`;
const port = env.match(/^VITE_PORT=(.*)$/m)?.[1].trim() || '3000';

if (match[1].trim() !== host) {
	try {
		writeFileSync(ENV_PATH, env.replace(/^VITE_HOST=.*$/m, `VITE_HOST=${host}`));
		console.log(`[lan] VITE_HOST updated (${iface.name} is now ${iface.address})`);
	} catch (err) {
		console.warn(`[lan] Could not write ${ENV_PATH}: ${err.message}`);
		console.warn(`[lan] Set it by hand:  VITE_HOST=${host}`);
	}
}

console.log(`[lan] Preview on your phone:  http://${host}`);
console.log(`[lan] Vite dev server:        http://${host}:${port}`);
