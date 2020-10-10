module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true
	},
	purge: [
		'templates/**/*.twig',
		'src/**/*.js',
		'src/**/*.vue'
	],
	theme: {
	  extend: {},
	},
	variants: {},
	plugins: [],
}