/*
 * Toggle.js
 *
 * Accessible region toggle.
 * Toggles a region's visibility with a button by manipulating ARIA states.
 * Automatically hides other regions managed by buttons in a matched set of elements.
 *
 * @link https://github.com/croxton/toggle.js
 * @link https://codepen.io/croxton/pen/yLOLzjo
 * @author Mark Croxton
 * @version 1.0.0
 * @copyright Mark Croxton 2020
 */

class Toggle {

	/*
     * Setup buttons and panels
     */
	constructor(el) {

		let self = this;
		this.buttons = document.querySelectorAll(el);

		// set initial state
		//self.resetToggleState();

		for (let i=0; i < this.buttons.length; i++) {
			this.buttons[i].addEventListener("click", function(e) {
				e.preventDefault();
				self.toggle(e.currentTarget);
			});

			// if there is a 'close' button in the panel associated with this button,
			// allow it to close the panel (if it is open), and return focus to the button
			let btnPanel = document.querySelector('#' + this.buttons[i].getAttribute('aria-controls'));
			if (btnPanel != null) {
				let closeBtn = btnPanel.querySelector('[data-close]');
				if (closeBtn != null) {
					closeBtn.addEventListener("click", function() {
						if (self.buttons[i].getAttribute('aria-expanded') === 'true') {
							self.buttons[i].click(); // triggers doToggle()
							self.buttons[i].focus();
						}
					});
				}
			}
		}

		// allow user to press the ESCAPE key to close any open regions
		window.addEventListener("keyup", function(e){
			let key = e.key || e.keyCode;
			if (key === 'Escape' || key === 'Esc' || key === 27) {
				for (let i=0; i < self.buttons.length; i++) {
					if (self.buttons[i].getAttribute('aria-expanded') === 'true') {
						self.buttons[i].click(); // triggers doToggle()
						self.buttons[i].focus(); // will return focus to last button in sequence
					}
				}
			}

		});
	}

	resetToggleState() {

		for (let i=0; i < this.buttons.length; i++) {

			let btn = this.buttons[i];
			let btnPanel = document.querySelector('#' + btn.getAttribute('aria-controls'));

			if (btnPanel != null) {

				// remove aria state and calculate 'natural' display property
				btnPanel.setAttribute('aria-hidden', null);

				if (window.getComputedStyle(btnPanel).display === 'block' && window.getComputedStyle(btnPanel).visibility === 'visible') {
					this.toggle(btn, 'true', false);
				} else {
					this.toggle(btn, 'false', false);
				}

			}

		}
	}

	/*
     * Event handler for region toggle
     */
	toggle(targetBtn, state, focus) {

		state = (typeof state !== 'undefined') ? (state === 'true') : (targetBtn.getAttribute('aria-expanded') === 'false');
		focus = (typeof focus !== 'undefined') ? focus : true;

		let targetPanel = document.querySelector('#' + targetBtn.getAttribute('aria-controls'));

		// update classes
		if (state === true) {

			// opening a panel
			targetBtn.setAttribute('aria-expanded', 'true');
			targetPanel.setAttribute('aria-hidden', 'false');

			// toggle any tabindexes in the region
			let tabIndexes = targetPanel.querySelectorAll('[tabindex]:not([aria-hidden="true"])');
			for (let i=0; i < tabIndexes.length; i++) {
				tabIndexes[i].setAttribute("tabindex", "0");
			}

			// when opening a region, close other open buttons in the matched set
			for (let i=0; i < this.buttons.length; i++) {

				let btn = this.buttons[i];

				if (btn != targetBtn) {
					let btnPanel = document.querySelector('#' + btn.getAttribute('aria-controls'));
					this.closePanel(btn, btnPanel);
				}
			}

			// activate self
			if (targetBtn.dataset.active) {
				targetBtn.classList.add(targetBtn.dataset.active);
			}

			// activate parent
			if (targetBtn.dataset.activeParent) {
				targetBtn.parentNode.classList.add(targetBtn.dataset.activeParent);
			}

			// activate target
			if (targetBtn.dataset.activeTarget && targetBtn.dataset.activeTargetId) {
				document.getElementById(targetBtn.dataset.activeTargetId).classList.add(targetBtn.dataset.activeTarget);
			}

			// activate root
			if (targetBtn.dataset.activeRoot) {
				document.querySelector('html').classList.add(targetBtn.dataset.activeRoot);
			}

			// focus first element in the newly opened panel
			if (focus) {
				if (targetBtn.dataset.focus) {

					let focusable = targetPanel.querySelector(targetBtn.dataset.focus);
					clearTimeout(delayFocus);
					let delayFocus = setTimeout(function() {
						focusable.focus({
							preventScroll: true
						});
					}, 300);

				} else {
					let focusable = targetPanel.querySelectorAll('button:not([data-close]), [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])');
					if (focusable.length) {
						let firstFocusable = focusable[0];
						let delayFocus;
						clearTimeout(delayFocus);
						delayFocus = setTimeout(function() {
							firstFocusable.focus({
								preventScroll: true
							});
						}, 300);
					}
				}

			}


		} else {
			// closing an open panel
			this.closePanel(targetBtn, targetPanel);

		}
	}

	closePanel(btn, panel) {

		// update state
		btn.setAttribute('aria-expanded', 'false');
		panel.setAttribute('aria-hidden', 'true');

		// reset tabindexes
		let tabIndexes = panel.querySelectorAll('[tabindex]');
		for (let i=0; i < tabIndexes.length; i++) {
			tabIndexes[i].setAttribute("tabindex", "-1");
		}

		// self active class
		if (btn.dataset.active) {
			btn.classList.remove(btn.dataset.active);
		}

		// parent active class
		if (btn.dataset.activeParent) {
			btn.parent().classList.remove(btn.dataset.activeParent);
		}

		// activate target
		if (btn.dataset.activeTarget && btn.dataset.activeTargetId) {
			document.getElementById(btn.dataset.activeTargetId).classList.remove(btn.dataset.activeTarget);
		}

		// root active class
		if (btn.dataset.activeRoot) {
			document.querySelector('html').classList.remove(btn.dataset.activeRoot);
		}
	}

}

// if you want to import this class from somewhere else, uncomment this:
export default Toggle;

// use like this - multiple matched toggle buttons act like an accordion.
// let toggleGroupA = new Toggle('.js-toggle-group-a');
// let toggleGroupB = new Toggle('.js-toggle-group-b');