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
	const initModules = (scope) => {
		Object.keys(modules).forEach(selector => {
			const request = modules[selector];

			(els => {
				if (els && els.length) {
					request().then(({ default: module }) => module(els));
				}
			})(scope.querySelectorAll(selector));
		});
	};

	if (document.readyState !== 'loading') {
		initModules(document);
	} else {
		document.addEventListener('DOMContentLoaded', () => initModules(document));
	}

	// // Alpine Store for any global JS code.
	// // external access like this: const getCookie = Alpine.store('utils').someGlobalFunction;
	// document.addEventListener('alpine:init', () => {
	// 	Alpine.store('utils', {
	// 		someGlobalFunction() {
	// 			console.log('hi from Alpine Store');
	// 		}
	// 	});
	// });

})();