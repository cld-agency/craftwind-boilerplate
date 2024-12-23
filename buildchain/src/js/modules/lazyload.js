// --------------------------------------------
// LAZY LOADER (https://github.com/verlok/vanilla-lazyload)
// --------------------------------------------

import LazyLoad from 'vanilla-lazyload';

export default els => {

	// --------------------------------------------
	// Standard lazyloader for loading elements when
	// they get close to being in the viewport
	// (1/5 of the viewport height away in this case)
	// --------------------------------------------

	const globalLazyLoader = new LazyLoad({
		elements_selector: '.js-lazyload',
		class_loaded: 'lazy-load--loaded',
		threshold: (window.innerHeight / 5),
		unobserve_entered: true,
		callback_enter: afterLazyLoad
	});

	// --------------------------------------------
	// DO STUFF AFTER AN ELEMENT HAS LAZYLOADED IN
	// --------------------------------------------

	function afterLazyLoad(el) {
		// if (el.dataset.lazyHandle === 'navBGTrigger') {
		// 	document.querySelector('#js-headerWrap').classList.remove('scrolled');
		// }
	}
}

