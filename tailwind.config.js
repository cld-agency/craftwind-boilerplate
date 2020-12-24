const colors = require('tailwindcss/colors');

module.exports = {
	purge: [
		'templates/**/*.twig',
		'src/**/*.js',
		'src/**/*.vue'
	],
	corePlugins: {
		gradientColorStops: false,
	},
	theme: {
		fontFamily: {
			//'sans': ["Helvetica Neue", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "Noto Sans", "sans-serif"]
		},
		colors: {
			white: '#fff',
			transparent: 'transparent',
			current: 'currentColor',
			gray: colors.blueGray,
			brand: {
				DEFAULT: '#1375BC',
				highlight: '#228edc',
			},
			accent: {
				DEFAULT: '#9FD321',
				highlight: '#bef735'
			}
		},
		extend: {
			transitionDuration: {
				'220': '220ms',
				'250': '250ms',
				'320': '320ms',
				'410': '410ms'
			},
			transitionTimingFunction: {
				'cld': 'cubic-bezier(.54,.74,.02,.95)',
			},
		},
	},
	variants: {
		extend: {
			// this is so that we can use `top:1px` on :active button states
			inset:['active']
		}
	},
	plugins: [
		// fluid plugin: https://github.com/soberwp/tailwindcss-fl
		require('tailwindcss-fl')({
			theme: {
				fontSize: {
					config: {

					}
				}
			}
		}),
	],
}