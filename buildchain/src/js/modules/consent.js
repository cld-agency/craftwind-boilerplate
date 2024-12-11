export default () => ({
	openModal: false,
	openBanner: false,
	showModalTrigger: false,
	typesToLoad: [],
	lightswitches: null,

	init() {
		// open the cookie banner if user has not yet made any choice
		this.openBanner = !this.getCookie('cookiesAccepted');

		this.lightswitches = this.$root.querySelectorAll('.js-cookieLightswitch');

		// set lightswitch input values on page load and inject accepted scripts
		this.lightswitches.forEach(label => {
			const type = label.getAttribute('for');
			const input = label.querySelector('input');

			// set the input checked states according to cookies if they've done this before
			input.checked = !!this.getCookie(type);
			// and inject the actual scripts if they've previously accepted cookies
			if (this.getCookie('cookiesAccepted') && input.checked){
				this.typesToLoad.push(type);
			}
		});
		if (this.typesToLoad.length){
			this.getScripts(this.typesToLoad);
		}
	},

	// Handle submit button clicks (beware, this could be from banner or modal)
	setChoices(mode) {
		mode = mode || '';
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
		});
		// inject the chosen scripts
		if (this.typesToLoad.length){
			this.getScripts(this.typesToLoad);
		}
		// remember that this happened so we don't show the banner again
		document.cookie = 'cookiesAccepted=1;path=/;max-age=15768000'; // 6 months
	},

	getCookie(name) {
		let value = `; ${document.cookie}`;
		let parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	},

	getScripts(typesToLoadArray) {
		var types = typesToLoadArray.join('|');
		fetch('/get-scripts?types=' + types, {
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
	}
});