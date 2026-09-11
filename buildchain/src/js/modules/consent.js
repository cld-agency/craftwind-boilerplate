import { getCookie } from '../utils/cookies';

export default () => ({
	openModal: false,
	openFunctionalityConsentModal: false,
	openBanner: false,
	showModalTrigger: false,
	typesToLoad: [],
	lightswitches: null,
	functionalityModalMessage: '',
	consentCallbacks: { onAccept: null, onDecline: null },

	init() {
		// open the cookie banner if user has not yet made any choice
		this.openBanner = !this.getCookie('cookiesAccepted');

		this.lightswitches = this.$root.querySelectorAll('.js-cookieLightswitch');

		// set lightswitch input values on page load, inject accepted scripts and enable any consented functionality
		this.lightswitches.forEach(label => {
			const type = label.getAttribute('for');
			const input = label.querySelector('input');

			// set the input checked states according to cookies if they've done this before
			input.checked = !!this.getCookie(type);
			// and inject the actual scripts if they've previously accepted cookies
			if (this.getCookie('cookiesAccepted') && input.checked){
				this.typesToLoad.push(type);
				// enable any functionality on the current page that needs functionality consent
				if (this.getCookie('functionality')) {
					this.enableConsentableFunctionality(true);
				}
			}
		});
		// go get the scripts automatically
		if (this.typesToLoad.length){
			this.getScripts(this.typesToLoad);
		}
	},

	// Handle submit button clicks in the cookie modal (beware, this could be from banner or modal)
	setChoices(mode) {
		mode = mode || 'some';

		if (mode === 'none') {
			// remember that this happened so we don't show the banner again
			document.cookie = 'cookiesAccepted=1;path=/;max-age=15768000'; // 6 months
			return;
		}

		this.typesToLoad = [];
		// apply the chosen options
		this.lightswitches.forEach(label => {
			const type = label.getAttribute('for');
			const input = label.querySelector('input');

			// turn all the lightswitches on if it's one of the allCookies buttons
			if (mode === 'all'){ input.checked = true; }

			// only add to the array if it's selected and if we haven't already injected this type
			if (input.checked){
				// don't combine this into the outer condition or the `else` won't work properly
				if (!this.getCookie(type)) {
					this.typesToLoad.push(type);
					// add cookie for this type so it gets loaded on page load next time
					document.cookie = type + '=1;path=/;max-age=15768000'; // 6 months
				}
			} else {
				// delete the cookie for this type so it doesn't get loaded on next page load
				document.cookie = type + '=0;path=/;max-age=0';
			}
			// enable any functionality on the current page that needs functionality consent
			if (type === 'functionality' && input.checked) {
				this.enableConsentableFunctionality(true);
			}
		});
		// inject the chosen scripts
		if (this.typesToLoad.length){
			this.getScripts(this.typesToLoad);
		}
		// remember that this happened so we don't show the banner again
		document.cookie = 'cookiesAccepted=1;path=/;max-age=15768000'; // 6 months
	},

	// Thin wrapper around the shared cookie helper. Kept on the
	// component so templates (cookieConsent.twig, videoBlock.twig) can
	// call `getCookie(...)` from inside the consent x-data scope and
	// `consentData.getCookie(...)` via Alpine.$data() from outside.
	getCookie(name) {
		return getCookie(name);
	},

	getScripts(typesToLoadArray, mode = 'normal', facade = null) {
		const types = typesToLoadArray.join('|');
		let url = '/get-scripts?types=' + types + '&mode=' + mode;
		if (facade) url += '&facade=' + encodeURIComponent(facade);
		fetch(url, {
			headers: {'X-Requested-With': 'XMLHttpRequest'},
			method: 'GET'
		}).then(response => response.text()).then(async data => {

			// inject the scripts
			const container = document.querySelector('[data-consented-scripts]');
			container.innerHTML = data;

			// One at a time, waiting on each external script's load event before moving on:
			// dynamically-inserted scripts are async by default, so a snippet's inline initialiser
			// must not be allowed to run ahead of the library it depends on.
			for (const scriptEl of Array.from(container.getElementsByTagName('script'))) {
				const newScript = document.createElement('script');

				// Copy attributes (this carries over src for external scripts)
				Array.from(scriptEl.attributes).forEach(attr => {
					newScript.setAttribute(attr.name, attr.value);
				});

				// Handle script content
				if (scriptEl.textContent.trim()) {
					newScript.textContent = scriptEl.textContent;
				}

				const loaded = newScript.src
					? new Promise(resolve => { newScript.onload = newScript.onerror = resolve; })
					: null;

				// Append to body (this also executes them)
				document.body.appendChild(newScript);
				await loaded;
			}

			// Process non-script elements (maybe overkill?)
			Array.from(container.children)
				.filter(el => el.tagName.toLowerCase() !== 'script')
				.forEach(el => document.body.appendChild(el.cloneNode(true)));
		});
	},

	enableConsentableFunctionality(skipFetch = false) {

		// hide any video facade blocker elements
		document.querySelectorAll('.js-videoFacadeBlocker').forEach(el => {
			el.classList.add('hidden');
		});

		// reCAPTCHA. Currently unused as we might end up with Friendly Captcha instead.
		// const focusScriptContainers = document.querySelectorAll('.js-lazyloadScriptsWhenFieldFocussed');
		// if (focusScriptContainers.length) {
		// 	this.switchOnPlaceholderScripts(focusScriptContainers);
		// }

		// For some functionality we know in advance that we can skip the ajax fetching of scripts
		// as that's already being handled elsewhere (e.g. for videos it's handled in lite-youtube
		// component, for reCAPTCHA it's handled by switching on the placeholder scripts)
		if (!skipFetch) {
			this.getScripts(['functionality'], 'ignoreFacades');
		}

		// set the functionality accepted cookie...
		document.cookie = 'functionality=1;path=/;max-age=15768000';
		// ...and autocheck the lightswitch on just in case they open the cookie modal
		Array.from(this.lightswitches)
			.filter(label => label.getAttribute('for') === 'functionality')
			.forEach(label => label.querySelector('input').checked = true);

		// call the onAccept callback if one was registered
		this.consentCallbacks.onAccept?.();
		this.consentCallbacks = { onAccept: null, onDecline: null };
	},

	// Grant consent for a single category by its slug. Used by in-place, editor-configurable
	// embeds (thirdPartyEmbed) where the required category isn't fixed to functionality.
	// Mirrors the per-type handling in setChoices(): set the cookie, sync the modal
	// lightswitch, then pull in any associated scripts (which also fires the GTM consent
	// update held on the cookie type). Finally let any sibling embeds requiring the same
	// category switch themselves on.
	grantConsent(slug) {
		if (this.getCookie(slug)) return;

		document.cookie = slug + '=1;path=/;max-age=15768000'; // 6 months
		document.cookie = 'cookiesAccepted=1;path=/;max-age=15768000';

		// keep the cookie modal in sync: tick this category's lightswitch, reveal the
		// manage-cookies trigger and dismiss the banner now a choice has been made
		Array.from(this.lightswitches || [])
			.filter(label => label.getAttribute('for') === slug)
			.forEach(label => label.querySelector('input').checked = true);
		this.showModalTrigger = true;
		this.openBanner = false;

		// functionality consent has extra page-side effects (revealing video facades etc.)
		if (slug === 'functionality') {
			this.enableConsentableFunctionality(true);
		}

		// load any Scripts-section entries tied to this category + fire the GTM consent update
		this.getScripts([slug]);

		// let any other gated embeds requiring this same category reveal themselves
		window.dispatchEvent(new CustomEvent('consent:granted', { detail: { slug } }));
	},

	declineConsentableFunctionality() {
		// call the onDecline callback if one was registered, otherwise reload
		if (this.consentCallbacks.onDecline) {
			this.consentCallbacks.onDecline();
		} else {
			window.location.reload();
		}
		this.consentCallbacks = { onAccept: null, onDecline: null };
	},

	// often an easier way to inject scripts is to have a placeholder one in the DOM with a data-src
	// that can be swapped out and then appended to the container to execute it. They go in one at a
	// time, in document order, so a snippet made of a library plus an inline initialiser still works.
	async switchOnPlaceholderScripts(scriptContainers, onComplete) {
		const allScripts = [];

		scriptContainers.forEach(el => {
			const scripts = el.querySelectorAll('script[data-src]');
			scripts.forEach(script => {
				allScripts.push({ script, container: el });
			});
		});

		for (const { script, container } of allScripts) {
			const scriptTag = document.createElement('script');

			// resolve on error too, so one dead script can't wedge the queue
			const loaded = new Promise(resolve => {
				scriptTag.addEventListener('load', resolve);
				scriptTag.addEventListener('error', resolve);
			});

			container.appendChild(scriptTag);
			scriptTag.src = script.dataset.src;
			await loaded;
		}

		onComplete?.();
	}

});