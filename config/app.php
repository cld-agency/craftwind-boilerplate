<?php
/**
 * Yii Application Config
 *
 * Edit this file at your own risk!
 *
 * The array returned by this file will get merged with
 * vendor/craftcms/cms/src/config/app.php and app.[web|console].php, when
 * Craft's bootstrap script is defining the configuration for the entire
 * application.
 *
 * You can define custom modules and system components, and even override the
 * built-in system components.
 *
 * If you want to modify the application config for *only* web requests or
 * *only* console requests, create an app.web.php or app.console.php file in
 * your config/ folder, alongside this one.
 */

use craft\helpers\App;
use craft\mail\transportadapters\Smtp;

return [
	'*' => [
		'id' => App::env('APP_ID') ?: 'CraftCMS',
		'modules' => [
			'my-module' => \modules\Module::class,
		],
		//'bootstrap' => ['my-module'],
	],
	'local' => [
		// override local env to use Mailhog SMTP via MAMP Pro.
		// these overrides are not visible in the Craft CP, and
		// also do not get used when using the Test button on
		// the email settings screen.
		'components' => [
			'mailer' => function() {
				$settings = craft\helpers\App::mailSettings();
				$settings->transportType = Smtp::class;
				$settings->transportSettings = [
					'host' => App::env('SMTP_HOST'),
					'port' => App::env('SMTP_PORT'),
					'useAuthentication' => App::env('SMTP_AUTHENTICATION') ?? '',
					'username' => App::env('SMTP_USERNAME') ?? '',
					'password' => App::env('SMTP_PASSWORD') ?? '',
					'encryptionMethod' => App::env('SMTP_ENCRYPTION') ?? '',
					'timeout' => App::env('SMTP_TIMEOUT') ?? 10
				];

				$config = craft\helpers\App::mailerConfig($settings);

				return Craft::createObject($config);
			}
		]
	]
];
