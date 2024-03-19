import Toggle from './_toggle.js';
import LazyLoad from './_vanilla-lazyload.js';
import { lock, unlock, clearBodyLocks } from './_tua-body-scroll-lock.js';

const SITE = {

	// --------------------------------------------
	// CACHE SOME COMMON PROPERTIES
	// --------------------------------------------

	getSettings: function(){

	},

	// --------------------------------------------
	// GET THIS PARTY STARTED...
	// --------------------------------------------

	init: function(){
		SITE.getSettings();
		SITE.bindUI();
		SITE.refreshCSRFs();
		SITE.getEditLink();
	},

	// --------------------------------------------
	// refreshCSRFs to evade any static caching
	// --------------------------------------------

	refreshCSRFs: function() {
		fetch('/get-csrf', {
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
			},
			method: 'GET'
		})
			.then(response => response.text())
			.then(data => {
				document.querySelectorAll('[name="CRAFT_CSRF_TOKEN"]').forEach(item => {
					item.value = data;
				});
				// also store in window so it can be reused by other scripts
				window.csrfTokenValue = data;
			});
	},

	// --------------------------------------------
	// GET EDIT LINK via ajax just in case we're using static cache
	// --------------------------------------------

	getEditLink: function(){
		const editMarker = document.querySelector('.js-edit-this');
		const data = {
			"thing": editMarker.dataset.thing,
			"CRAFT_CSRF_TOKEN": window.csrfTokenValue
		};

		fetch('/get-edit-link', {
			headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json' },
			method: 'POST',
			body: JSON.stringify(data)
		})
			.then(response => response.text())
			.then(xhrResponse => {
				if (xhrResponse && xhrResponse.trim()) {
					editMarker.innerHTML = xhrResponse;
					setTimeout(function () {
						document.querySelector('.edit-this').classList.remove('posing');
					}, 600);
				}
			});
	},

	// --------------------------------------------
	// UI EVENT BINDINGS
	// --------------------------------------------

	bindUI: function(){

		// --------------------------------------------
		// TOGGLEABLES
		// --------------------------------------------

		new Toggle('.js-toggle');
		new Toggle('.js-toggleCookieModal');
		new Toggle('.js-toggleCookieBanner');

		// --------------------------------------------
		// LAZY LOADER (https://github.com/verlok/vanilla-lazyload)
		// --------------------------------------------

		window.lazyLoadInstance = new LazyLoad({
			elements_selector: '.js-lazyload',
			class_loaded: 'lazy-load--loaded',
			threshold: (window.innerHeight / 5)
		});

		// --------------------------------------------
		// PREVENT BACKGROUND SCROLLING esp on iOS while
		// various overlays are on.
		// Uses tua-body-scroll-lock
		// --------------------------------------------

		// toggle method allows a single element to do both on and off functions...
		document.querySelectorAll('.js-toggleScrollLock').forEach(el => {
			el.addEventListener('click', e => {
				if (e.currentTarget.getAttribute('aria-expanded') === 'true' || e.currentTarget.dataset.close){
					// if we want an area inside the overlay element to still be scrollable, we
					// can specify it here via data-scroll-allow-id.
					var target = null;
					if (e.currentTarget.dataset.scrollAllowId){
						target = document.getElementById(e.currentTarget.dataset.scrollAllowId);
					} else {
						target = document.getElementById(e.currentTarget.dataset.activeTargetId);
					}
					lock(target);
				} else {
					clearBodyLocks();
				}
			});
		});

		// --------------------------------------------
		// WRAP TABLES
		// --------------------------------------------

		Array.from(document.getElementsByTagName('table')).forEach(el => {
			const wrapper = document.createElement('div');
			wrapper.style.overflowX = 'auto';
			wrapper.className = 'spacing';
			el.parentNode.insertBefore(wrapper, el);
			wrapper.appendChild(el);
		});
	},
};

SITE.init();
// allow other scripts to access the SITE object
// https://github.com/laravel-mix/laravel-mix/issues/2541#issuecomment-707309902
//window.SITE = SITE;