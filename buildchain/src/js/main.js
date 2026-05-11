import '../css/main.css';
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
import collapse from '@alpinejs/collapse';
import consent from './modules/consent';
import editThis from './modules/edit-this';
// import thingStore from './modules/thing-store';

// ============================================
// ALPINE SETUP
// ============================================

window.Alpine = Alpine;

// Alpine plugins
Alpine.plugin(focus);
Alpine.plugin(collapse);

// Static Alpine components + stores (registered globally on every page)
Alpine.data('consent', consent);
// Alpine.store('thing', cartStore);

// ============================================
// CONDITIONAL MODULE REGISTRY
// ============================================
//
// One unified list of selector-gated dynamic imports. Each entry is:
//
//   kind     'alpine' | 'vanilla'
//   selector CSS selector that gates the dynamic import (must match
//            something in the page or the module won't load)
//   load     () => import('./modules/...') — the module's default
//            export is either an Alpine component factory ('alpine')
//            or an init function called with the matched NodeList
//            ('vanilla')
//   name     Alpine component name — required for kind:'alpine'
//
// Alpine entries are awaited before Alpine.start(); vanilla entries
// fire after DOMContentLoaded.
const COMPONENTS = [
	// Alpine components
	// { kind: 'alpine', name: 'someAlpineThing', selector: '[x-data^="someAlpineThing"]', load: () => import('./modules/some-alpine-thing') },
	// { kind: 'alpine', name: 'anotherAlpineThing', selector: '[x-data^="anotherAlpineThing"]', load: () => import('./modules/another-alpine-thing') },

	// Vanilla modules
	{ kind: 'vanilla', selector: '.js-lazyload', load: () => import('./modules/lazyload') },
	// { kind: 'vanilla', selector: '.js-heroCarousel, .js-cardCarousel', load: () => import('./modules/carousels') },
	// { kind: 'vanilla', selector: 'lite-youtube', load: () => import('./modules/video-facade-youtube.js') },
	// { kind: 'vanilla', selector: 'lite-vimeo', load: () => import('./modules/video-facade-vimeo.js') },
];

// ============================================
// INITIALISATION
// ============================================

async function init() {

	// --------------------------------------------
	// LOAD ALPINE MODULES, then start Alpine.
	// --------------------------------------------

	const alpineRegistrations = [];
	for (const { kind, name, selector, load } of COMPONENTS) {
		if (kind !== 'alpine') continue;
		if (!document.querySelector(selector)) continue;
		alpineRegistrations.push(
			load().then(({ default: factory }) => Alpine.data(name, factory))
		);
	}
	await Promise.all(alpineRegistrations);
	// The await above only guarantees all components are *registered* before
	// Alpine starts. Alpine itself walks the DOM and inits components in DOM
	// order, so don't rely on the COMPONENTS list ordering for init order.
	Alpine.start();

	// --------------------------------------------
	// LOAD VANILLA MODULES
	// --------------------------------------------

	for (const { kind, selector, load } of COMPONENTS) {
		if (kind !== 'vanilla') continue;
		const elements = document.querySelectorAll(selector);
		if (!elements.length) continue;
		// load the module; once it resolves, grab its default export, call it "initModule", and invoke it with the matched elements.
		load().then(({ default: initModule }) => initModule(elements));
	}

	// --------------------------------------------
	// DOM TWEAKS
	// --------------------------------------------

	// add the Edit This button...
	editThis(document.querySelectorAll('[data-edit-this]'));

	// Wrap every <table> in an overflow-x:auto div so wide tables scroll
	// horizontally on narrow viewports instead of overflowing the page.
	document.querySelectorAll('table').forEach(table => {
		const wrapper = document.createElement('div');
		wrapper.style.overflowX = 'auto';
		wrapper.className = 'spacing';
		table.parentNode.insertBefore(wrapper, table);
		wrapper.appendChild(table);
	});
}

init();

// ============================================
// HMR in local dev
// https://vitejs.dev/guide/api-hmr.html and
// https://nystudio107.com/docs/vite/#entry-script-hmr
// ============================================

// note, we'd need proper teardown methods in each module
// to actually get this working properly (+ reinit on
// the inside of this, I think?) If necessary, just do it for
// modules that would benefit from HMR.
if (import.meta.hot) {
	import.meta.hot.accept(() => console.log('HMR'));
}