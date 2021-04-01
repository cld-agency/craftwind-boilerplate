import Toggle from './_toggle.js';
import * as bodyScrollLock from './_bodyScrollLock.js';

const SITE = {

	// --------------------------------------------
	// CACHE SOME COMMON PROPERTIES
	// --------------------------------------------

	getSettings: function(){
		//this.$html = $('html');
	},

	// --------------------------------------------
	// GET THIS PARTY STARTED...
	// --------------------------------------------

	init: function(){
		SITE.getSettings();
		SITE.bindUI();
	},

	// --------------------------------------------
	// UI EVENT BINDINGS
	// --------------------------------------------

	bindUI: function(){

		// --------------------------------------------
		// TOGGLEABLES
		// --------------------------------------------

		new Toggle('.js-toggle');

		// --------------------------------------------
		// PREVENT BACKGROUND SCROLLING esp on iOS while
		// various overlays are on.
		// Uses this lib: https://github.com/willmcpo/body-scroll-lock
		// --------------------------------------------

		// toggle method allows a single element to do both on and off functions...
		document.querySelectorAll('.js-toggleScrollLock').forEach(item => {
			item.addEventListener('click', e => {
				if (e.target.getAttribute('aria-expanded') === 'true'){
					let target = document.getElementById(e.target.dataset.activeTargetId);
					bodyScrollLock.disableBodyScroll(target);
				} else {
					bodyScrollLock.clearAllBodyScrollLocks();
				}
			});
		});
	},
};

SITE.init();