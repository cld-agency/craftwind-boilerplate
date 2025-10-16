export default els => {
	// Helper function to get cookie value
	const getCookie = (name) => {
		let value = `; ${document.cookie}`;
		let parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	};

	// Only proceed if logged-in cookie exists and is 'true'
	if (getCookie('logged-in') !== 'true') {
		return;
	}

	const editMarker = els[0];
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
}