import '../css/main.css';
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
import consent from './modules/consent';

window.Alpine = Alpine;
Alpine.data('consent', consent);
Alpine.plugin(focus);
Alpine.start();

// Accept HMR as per: https://vitejs.dev/guide/api-hmr.html and https://nystudio107.com/docs/vite/#entry-script-hmr
if (import.meta.hot) {
	import.meta.hot.accept(() => {
		console.log("HMR");
	});
}

// --------------------------------------------
// DYNAMIC IMPORTS, technique cribbed from here:
// https://www.mostlyserious.io/news-updates/process-spotlight-how-we-do-javascript-at-mostly-serious
// --------------------------------------------

const modules = {
	'[name="CRAFT_CSRF_TOKEN"], craft-csrf-input': () => import('./modules/csrf-refresh'),
	'[data-edit-this]': () => import('./modules/edit-this'),
	'.js-lazyload': () => import('./modules/lazyload'),
	'.js-lazyloadScriptsWhenFieldFocussed': () => import('./modules/lazyload-scripts'),
};

(() => {
	const init = (scope) => {

		// --------------------------------------------
		// INITIALISE MODULES
		// --------------------------------------------

		Object.keys(modules).forEach(selector => {
			const request = modules[selector];

			(els => {
				if (els && els.length) {
					request().then(({ default: module }) => module(els));
				}
			})(scope.querySelectorAll(selector));
		});

		// --------------------------------------------
		// WRAP TABLES
		// --------------------------------------------

		Array.from(scope.getElementsByTagName('table')).forEach(el => {
			const wrapper = scope.createElement('div');
			wrapper.style.overflowX = 'auto';
			wrapper.className = 'spacing';
			el.parentNode.insertBefore(wrapper, el);
			wrapper.appendChild(el);
		});
	};

	// --------------------------------------------
	// Global SITE object for shared functions
	// --------------------------------------------

	window.SITE = {

	};

	// --------------------------------------------
	// IGNITION...
	// --------------------------------------------

	if (document.readyState !== 'loading') {
		init(document);
	} else {
		document.addEventListener('DOMContentLoaded', () => init(document));
	}

	// --------------------------------------------
	// ALPINE STORE
	// --------------------------------------------

	// // Alpine Store for any global JS code that needs to interact with Alpine components.
	// // external access like this: Alpine.store('utils').someGlobalFunction;
	// document.addEventListener('alpine:init', () => {
	// 	Alpine.store('utils', {
	// 		someGlobalFunction() {
	// 			console.log('hi from Alpine Store');
	// 		}
	// 	});
	// });

})();