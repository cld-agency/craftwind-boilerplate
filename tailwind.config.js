const colors = require('tailwindcss/colors');

module.exports = {
	purge: [
		'templates/**/*.twig',
		'src/**/*.js',
		'src/**/*.vue'
	],
	theme: {
		fontFamily: {
			'sans': ["Helvetica Neue", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "Noto Sans", "sans-serif"],
			'serif': ["Georgia", "serif"],
			// 'body': theme => theme('fontFamily.sans'),
			// 'headings': theme => theme('fontFamily.serif')
		},
		_vars: {
			'headingWeight': 400,
			'boldWeight': 600
		},
		colors: {
			white: '#fff',
			transparent: 'transparent',
			current: 'currentColor',
			gray: colors.blueGray,
			body: '#464646',
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
			}
			// transitionTimingFunction: {
			// 	'cld': 'cubic-bezier(.54,.74,.02,.95)',
			// },
		},
	},
	plugins: [
		// fluid plugin: https://github.com/soberwp/tailwindcss-fl
		// this doesn't work yet in JIT
		//require('tailwindcss-fl')()
	],
}