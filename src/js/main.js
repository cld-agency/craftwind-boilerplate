// import Toggle from './_toggle.js';
// import LazyLoad from './_vanilla-lazyload.js';
// import { lock, unlock, clearBodyLocks } from './_tua-body-scroll-lock.js';

/**
 * Accept HMR as per: https://vitejs.dev/guide/api-hmr.html & https://nystudio107.com/docs/vite/
 */
if (import.meta.hot) {
	import.meta.hot.accept(() => {
		console.log('HMR')
	})
}

import '../css/main.css';