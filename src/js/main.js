'use strict';

import Vue from 'vue';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

const vm = new Vue({
	el: '#app',
	delimiters: ['${', '}'],

	// Why data must be a function: https://flaviocopes.com/vue-data-function/
	data() {
		return {
			mobileNavActive: false,
		}
	},

	mounted: function(){

	},

	// Watch uses magical function names i.e. - mobileNavActive()
	// will run whenever the `mobileNavActive` variable changes.
	// The function is sent the new and old values as parameters.
	watch: {

		// --------------------------------------------
		// Activate body-scroll-lock when mobile nav is on.
		// https://www.npmjs.com/package/body-scroll-lock
		// --------------------------------------------

		mobileNavActive: function(newValue, oldValue) {
			let scrollLockEl = document.querySelector('[data-scroll-lock-target-of="mobileNavActive"]');
			if (newValue === true) {
				disableBodyScroll(scrollLockEl, {reserveScrollBarGap: true});
			} else {
				enableBodyScroll(scrollLockEl, {reserveScrollBarGap: true});
			}
		}
	},

	methods: {

	}
});