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
	'devServerPublic' => (!empty(App::env('VITE_SSL_KEY')) ? 'https://' : 'http://') .
		App::env('VITE_HOST') . ':' . (App::env('VITE_PORT') ?: '3000'),

	/**
	 * These two settings provide Vite dev server detection from within the plugin.
	 *
	 * If you are running the Vite dev server on your host computer and happen to
	 * be running the web server from within a docker container (such as ddev) then
	 * you may want to specify VITE_HOST_INTERNAL in your .env as 'host.docker.internal'
	 * which will allow this plugin to see the dev server running status.
	 * @see https://docs.docker.com/desktop/features/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host
	 */
	'devServerInternal' => (!empty(App::env('VITE_SSL_KEY')) ? 'https://' : 'http://') .
		(App::env('VITE_HOST_INTERNAL') ?: App::env('VITE_HOST')) . ':' .
		(App::env('VITE_PORT') ?: '3000'),
	'checkDevServer' => true,

	/**
	 * The URL/path to the folder in which built files will reside.
	 */
	'serverPublic' => '/dist/',
];