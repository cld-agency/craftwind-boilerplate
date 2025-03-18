// --------------------------------------------
// LAZYLOAD scripts on focussing first required form input
// (reCAPTCHA basically), but only if consent was granted
// for functionality scripts
// --------------------------------------------

export default els => {
	els.forEach(el => {
		const ctx = el.closest('form');
		const firstRequiredField = ctx.querySelector('input[required]') || ctx.querySelector('textarea[required]') || ctx.querySelector('input[data-required]');
		const consentComponent = document.querySelector('[x-data="consent"]');

		if (firstRequiredField) {
			firstRequiredField.addEventListener('focus', e => {
				// open the extra consent modal if functionality cookies have not been accepted,
				// otherwise inject the scripts
				if (!window.getCookie('functionality')) {
					Alpine.$data(consentComponent).openFunctionalityConsentModal = true;
					Alpine.$data(consentComponent).functionalityModalMessage = el.dataset.functionalityModalMessage;
				} else {
					Alpine.$data(consentComponent).switchOnPlaceholderScripts(els);
				}
			}, {once: true});
		}
	});
}