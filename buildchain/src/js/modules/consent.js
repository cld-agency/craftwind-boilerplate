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
		}).then(response => response.text()).then(data => {

			// inject the scripts
			const container = document.querySelector('[data-consented-scripts]');
			container.innerHTML = data;

			Array.from(container.getElementsByTagName('script')).forEach(scriptEl => {
				const newScript = document.createElement('script');

				// Copy attributes
				Array.from(scriptEl.attributes).forEach(attr => {
					newScript.setAttribute(attr.name, attr.value);
				});

				// Handle script content
				if (scriptEl.textContent.trim()) {
					newScript.textContent = scriptEl.textContent;
				}

				// Handle external scripts
				if (scriptEl.src) {
					newScript.src = scriptEl.src;
				}

				// Append to body (this also executes them)
				document.body.appendChild(newScript);
			});

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
	// that can be swapped out and then appended to the container to execute it.
	switchOnPlaceholderScripts(scriptContainers, onComplete) {
		const allScripts = [];

		scriptContainers.forEach(el => {
			const scripts = el.querySelectorAll('script[data-src]');
			scripts.forEach(script => {
				allScripts.push({ script, container: el });
			});
		});

		if (allScripts.length === 0) {
			onComplete?.();
			return;
		}

		let loadedCount = 0;

		allScripts.forEach(({ script, container }) => {
			const scriptTag = document.createElement('script');

			const handleComplete = () => {
				loadedCount++;
				if (loadedCount === allScripts.length) {
					onComplete?.();
				}
			};

			scriptTag.addEventListener('load', handleComplete);
			scriptTag.addEventListener('error', handleComplete);

			container.appendChild(scriptTag);
			scriptTag.src = script.dataset.src;
		});
	}

});