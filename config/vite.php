<?php

use craft\helpers\App;

return [
	'useDevServer' => App::env('CRAFT_ENVIRONMENT') === 'local',
	'manifestPath' => '@webroot/dist/.vite/manifest.json',
	'devServerPublic' => 'http://localhost:3000',
	'devServerInternal' => 'http://localhost:3000',
	'checkDevServer' => true,
	'serverPublic' => '/dist/',
];