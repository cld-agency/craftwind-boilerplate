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
		// override local env to use a different Mailer component so
		// that devs can use e.g. Mailhog SMTP via MAMP Pro, which is
		// super nice and saves faffing about waiting and hoping
		// that something might arrive in your real inbox.
		// Important: these overrides are not visible in the Craft CP, and
		// also do not get used when using the "Test" button on
		// the email settings screen. (that's a good thing, because it allows
		// for testing the remote SMTP settings locally)
		'components' => [
			'mailer' => function() {
				$settings = craft\helpers\App::mailSettings();
				$settings->transportType = Smtp::class;
				$settings->transportSettings = [
					'host' => getenv('SMTP_LOCAL_HOST'),
					'port' => getenv('SMTP_LOCAL_PORT'),
					'useAuthentication' => getenv('SMTP_LOCAL_AUTHENTICATION') ?? '',
					'username' => getenv('SMTP_LOCAL_USERNAME') ?? '',
					'password' => getenv('SMTP_LOCAL_PASSWORD') ?? '',
					'encryptionMethod' => getenv('SMTP_LOCAL_ENCRYPTION') ?? '',
					'timeout' => getenv('SMTP_LOCAL_TIMEOUT') ?? 10
				];

				$config = craft\helpers\App::mailerConfig($settings);

				return Craft::createObject($config);
			}
		]
	]
];
