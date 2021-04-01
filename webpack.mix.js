const mix = require('laravel-mix');
const tailwindJit = require("@tailwindcss/jit");
require('dotenv').config();

// --------------------------------------------

// set PRIMARY_SITE_URL to your local domain in your .env file...
let localDomain = process.env.PRIMARY_SITE_URL || 'example.test';
let srcPath = 'src';
let buildPath = 'public_html/assets';

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
	postCss: [ tailwindJit ],
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

// --------------------------------------------
// Ol faithful BrowserSync...
// --------------------------------------------

mix.browserSync({
	proxy: localDomain,
	injectChanges: true,
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

// --------------------------------------------
// File revving
// --------------------------------------------

mix.version();