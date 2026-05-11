<?php
namespace modules;

use Craft;
use craft\controllers\UsersController;
use craft\web\User;
use yii\base\Event;

class EditThis extends \yii\base\Module
{
	private const COOKIE_NAMES = ['logged-in', 'logged-in-with-cp-access'];

	public function init()
	{
		Craft::setAlias('@modules', __DIR__);

		parent::init();

		// Set a cookie when someone logs in so the front end knows whether to
		// trigger the ajax fetch for the Edit This button. Remember, this
		// functionality is purely a nicety to avoid subjecting non-logged-in
		// guests to the extra ajax request - naturally you must not tie any
		// private logged-in user functionality to the existence of this cookie
		// as it can prob easily be faked.
		Event::on(
			UsersController::class,
			UsersController::EVENT_AFTER_FIND_LOGIN_USER,
			function($event) {
				$this->setLoggedInCookie($event->user->can('accessCp'));
			}
		);

		// Clear the cookies on logout so a stale value doesn't stick around.
		Event::on(
			User::class,
			User::EVENT_AFTER_LOGOUT,
			function() {
				$this->clearLoggedInCookies();
			}
		);
	}

	private function setLoggedInCookie($hasCpAccess): void
	{
		$name = $hasCpAccess ? 'logged-in-with-cp-access' : 'logged-in';

		setcookie($name, 'true', [
			'expires' => $this->loginExpiry(),
			'path' => '/',
			'secure' => Craft::$app->getRequest()->getIsSecureConnection(),
			'httponly' => false,
			'samesite' => 'Lax',
		]);
	}

	private function clearLoggedInCookies(): void
	{
		foreach (self::COOKIE_NAMES as $name) {
			setcookie($name, '', [
				'expires' => time() - 3600,
				'path' => '/',
				'secure' => Craft::$app->getRequest()->getIsSecureConnection(),
				'httponly' => false,
				'samesite' => 'Lax',
			]);
		}
	}

	// Mirror Craft's own login duration: rememberedUserSessionDuration if "Remember Me"
	// was ticked, otherwise userSessionDuration. A duration of 0 means a session cookie.
	private function loginExpiry(): int
	{
		$general = Craft::$app->getConfig()->getGeneral();
		$rememberMe = (bool)Craft::$app->getRequest()->getBodyParam('rememberMe');
		$duration = $rememberMe ? $general->rememberedUserSessionDuration : $general->userSessionDuration;

		return $duration ? time() + $duration : 0;
	}
}