export default els => {
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