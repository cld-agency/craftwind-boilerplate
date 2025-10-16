<?php
namespace modules;

use Craft;
use craft\controllers\UsersController;
use yii\base\Event;

class EditThis extends \yii\base\Module
{
	public function init()
	{
		parent::init();

		// the sole point of this module (so far) is to set a cookie when someone logs in
		// to the CP so we know whether or not to trigger the ajax fetch for the Edit This
		// button on the front end.
		Event::on(
			UsersController::class,
			UsersController::EVENT_AFTER_FIND_LOGIN_USER,
			function() {
				$this->setLoggedInCookie();
			}
		);
	}

	private function setLoggedInCookie(): void
	{
		setcookie('logged-in', 'true', [
			'expires' => 0,
			'path' => '/',
			'secure' => Craft::$app->getRequest()->getIsSecureConnection(),
			'httponly' => false,
			'samesite' => 'Lax',
		]);
	}
}