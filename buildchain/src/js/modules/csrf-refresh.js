// --------------------------------------------
// refresh CSRF tokens to evade any static caching.
// cater for both hardcoded hidden inputs and
// also Craft's custom <craft-csrf-input> elements.
// (See docs on `asyncCsrfInputs` config setting).
// --------------------------------------------

export default els => {
	// convert nodeList to an array so we can filter().
	els = [...els];
	const nativeEls = els.filter(el => el.matches('[name="CRAFT_CSRF_TOKEN"]'));
	const customEls = els.filter(el => el.matches('craft-csrf-input'));

	fetch('/index.php?p=actions/users/session-info', {
		headers: {
			'Accept': 'application/json',
		}
	})
		.then(response => response.json())
		.then(data => {
			if (nativeEls.length) {
				nativeEls.forEach(item => {
					item.value = data.csrfTokenValue;
				});
			}

			// also replace any of Craft's silly custom elements
			if (customEls.length) {
				customEls.forEach(element => {
					const input = document.createElement('input');
					input.type = 'hidden';
					input.name = data.csrfTokenName;
					input.value = data.csrfTokenValue;
					element.replaceWith(input);
				});
			}

			// also store in window so it can be reused by other scripts
			window.csrfTokenValue = data.csrfTokenValue;
		});
}