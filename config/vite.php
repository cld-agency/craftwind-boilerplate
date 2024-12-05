<?php

use craft\helpers\App;

/**
 * More docs here
 * https://nystudio107.com/blog/using-vite-js-next-generation-frontend-tooling-with-craft-cms
 */
return [
	/**
	 * This setting controls whether or not the Vite plugin will attempt to load
	 * files and resources from the running Vite dev server. If `true`, it will
	 * attempt to fetch these resources even if the dev server is not running.
	 */
	'useDevServer' => App::env('CRAFT_ENVIRONMENT') === 'local',

	/**
	 * The internal location of the manifest file.
	 */
	'manifestPath' => '@webroot/dist/.vite/manifest.json',

	/**
	 * The browser-facing URL for the Vite dev server.
	 */
	'devServerPublic' =>
		(!empty(App::env('VITE_SSL_KEY')) ? 'https://' : 'http://') .
		App::env('VITE_HOST') . ':' . (App::env('VITE_PORT') ?: '3000'),

	/**
	 * The URL/path to the folder in which built files will reside.
	 */
	'serverPublic' => '/dist/',
];