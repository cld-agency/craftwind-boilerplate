import '../css/main.css';
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
import collapse from '@alpinejs/collapse';
import consent from './modules/consent';
import editThis from './modules/edit-this';

// ============================================
// ALPINE SETUP
// ============================================

window.Alpine = Alpine;

// Alpine plugins
Alpine.plugin(focus);
Alpine.plugin(collapse);

// Static Alpine components (used globally)
Alpine.data('consent', consent);
Alpine.data('primaryNav', primaryNav);

// Dynamic Alpine components - loaded only if their DOM elements exist
const ALPINE_COMPONENTS = {
	// componentName: {
	// 	selector: '[x-data="componentName"]',
	// 	module: () => import('./modules/component-name')
	// },
};

async function registerConditionalComponents() {
	const promises = Object.entries(ALPINE_COMPONENTS).map(async ([name, { selector, module }]) => {
		if (document.querySelector(selector)) {
			const { default: component } = await module();
			Alpine.data(name, component);
		}
	});
	await Promise.all(promises);
}

// Start Alpine after conditional registration
(async () => {
	await registerConditionalComponents();
	// beware, alpine actually inits components in the order it finds them in the DOM,
	// so despite the awaited function above, we're really at the mercy of Alpine
	// in terms of execution order :-/
	Alpine.start();
})();

// ============================================
// VANILLA JS MODULES (Dynamic Imports)
// ============================================

const MODULES = {
	// '.js-lazyload': () => import('./modules/lazyload'),
	// '.js-heroCarousel, .js-newsCarousel': () => import('./modules/carousels'),
	// '.js-formieForm': () => import('./modules/formie-forms'),
	// 'lite-youtube': () => import('./modules/video-facade-youtube.js'),
	// 'lite-vimeo': () => import('./modules/video-facade-vimeo.js'),
};

function loadModules(scope = document) {
	Object.entries(MODULES).forEach(([selector, importModule]) => {
		const elements = scope.querySelectorAll(selector);

		if (elements.length) {
			importModule().then(({ default: module }) => module(elements));
		}
	});
}

// ============================================
// DOM UTILITIES
// ============================================

function wrapTables() {
	document.querySelectorAll('table').forEach(table => {
		const wrapper = document.createElement('div');
		wrapper.style.overflowX = 'auto';
		wrapper.className = 'spacing';
		table.parentNode.insertBefore(wrapper, table);
		wrapper.appendChild(table);
	});
}

// ============================================
// INITIALISATION
// ============================================

function init() {
	editThis(document.querySelectorAll('[data-edit-this]'));
	loadModules();
	wrapTables();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}

// ============================================
// HMR in local dev
// https://vitejs.dev/guide/api-hmr.html and
// https://nystudio107.com/docs/vite/#entry-script-hmr
// ============================================

if (import.meta.hot) {
	import.meta.hot.accept(() => console.log('HMR'));
}