const mix = require('laravel-mix');
const tailwind = require("tailwindcss");

// --------------------------------------------

// set MIX_PRIMARY_SITE_URL to your local domain in your .env file...
let localDomain = process.env.MIX_LOCAL_SITE_URL || 'example.test';
let srcPath = 'src';
let buildPath = mix.inProduction() ? 'public_html/assets' : 'public_html/_assets';

// This sets the location of the mix-manifest.json file.
// Putting in public_html/assets makes it more straight-forward to get read by the Craft Mix plugin
// when using "public_html" and "assets" respectively in the plugin's settings for publicPath + assetsPath.
mix.setPublicPath(buildPath);

// --------------------------------------------
// Options
// --------------------------------------------

mix.options({
	// don't be touchin' the urls in our CSS! Faster compile times,
	// ...and also might be required for using Tailwind with Sass anyway (see docs).
	// https://tailwindcss.com/docs/installation#build-tool-examples
	// (what kind of monster uses relative URLs in CSS anyway?!)
	processCssUrls: false,
	// specify which postcss plugins to use here...
	postCss: [ tailwind ],
	// when running `npm run all` it's confusing to clear the console each time...
	clearConsole: false,
});

// this allows any sass errors/warnings to shine through
// mix.webpackConfig({stats:{children: true}});

// --------------------------------------------
// CSS
// --------------------------------------------

mix.sass(srcPath + '/css/main.scss', buildPath + '/css/');

// --------------------------------------------
// Very Magical JS Method. This does a *lot* without us even asking.
// See detail in the docs: https://laravel-mix.com/docs/6.0/mixjs
// --------------------------------------------

mix.js([
	srcPath + '/js/_bodyScrollLock.js',
	srcPath + '/js/_toggle.js',
	srcPath + '/js/main.js'
], buildPath + '/js/main.js');

// If you want to minify and concatenate some separate scripts that do not require
// ES6 transpiling, use combine() e.g.:
// mix.combine([
// 	srcPath + '/js/mapping/*.js'
// ], buildPath + '/js/maps.min.js');

// --------------------------------------------
// Ol faithful BrowserSync...
// --------------------------------------------

if (!mix.inProduction()) {
	mix.browserSync({
		proxy: localDomain,
		open: false,
		notify: {
			styles: {
				top: 'auto',
				bottom: '1rem'
			}
		},
		files: [
			'templates/**/*.twig',
			buildPath + '/**/main.{css,js}',
		]
	});
}

// --------------------------------------------
// File revving
// --------------------------------------------

mix.version();