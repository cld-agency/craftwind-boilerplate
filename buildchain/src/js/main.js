import '../css/main.css';
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
import collapse from '@alpinejs/collapse';

// ============================================
// ALPINE SETUP
// ============================================

window.Alpine = Alpine;

// Alpine plugins
Alpine.plugin(focus);
Alpine.plugin(collapse);

async function registerStaticComponents() {
	Alpine.data('consent', (await import('./modules/consent')).default);
	// Alpine.data('somethingElse', (await import('./modules/something-else')).default);
}

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
	await registerStaticComponents();
	await registerConditionalComponents();
	// beware, alpine actually inits components in the order it finds them in the DOM,
	// so despite the 2 awaited functions above, we're really at the mercy of Alpine
	// in terms of execution order :-/
	Alpine.start();
})();

// ============================================
// VANILLA JS MODULES (Dynamic Imports)
// ============================================

const MODULES = {
	'[data-edit-this]': () => import('./modules/edit-this'),
	'.js-lazyload': () => import('./modules/lazyload'),
	// '.js-heroCarousel': () => import('./modules/carousels'),
	// '.js-formieForm': () => import('./modules/formie-forms'),
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