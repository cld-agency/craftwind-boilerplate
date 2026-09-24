<?php
namespace modules\controllers;

use Craft;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\web\Controller;
use yii\web\BadRequestHttpException;
use yii\web\Response;

/**
 * Persists Testing Matrix (/tests) state to storage/testing/<tester>.json.
 *
 * Routes (via the my-module module):
 *   GET  actions/my-module/testing-matrix/list
 *   GET  actions/my-module/testing-matrix/load?tester=name
 *   POST actions/my-module/testing-matrix/save?tester=name   (JSON body: { statuses, notes })
 *   POST actions/my-module/testing-matrix/delete?tester=name
 *
 * Every action requires a logged-in user with control-panel access, matching the
 * gate on the template itself. POSTs are covered by Craft's CSRF validation.
 */
class TestingMatrixController extends Controller
{
	private const NAME_PATTERN = '/^[A-Za-z0-9_-]{1,64}$/';
	private const KEY_PATTERN = '/^[a-z0-9-]{1,80}-[0-9]{1,10}$/i'; // cat.id ~ '-' ~ item.id
	private const STATUSES = ['pass', 'fail', 'partial', 'na', 'untested'];
	private const MAX_BODY_BYTES = 256 * 1024;
	private const MAX_NOTE_LENGTH = 2000;

	public function beforeAction($action): bool
	{
		if (!parent::beforeAction($action)) {
			return false;
		}

		$this->requireAcceptsJson();
		$this->requirePermission('accessCp');

		return true;
	}

	/**
	 * Returns every saved tester, alphabetically.
	 */
	public function actionList(): Response
	{
		$testers = [];

		foreach (glob($this->storageDir() . '/*.json') ?: [] as $file) {
			$testers[] = [
				'name' => basename($file, '.json'),
				'lastSaved' => date('c', filemtime($file)),
			];
		}

		usort($testers, fn($a, $b) => strcmp($a['name'], $b['name']));

		return $this->asJson($testers);
	}

	/**
	 * Returns a tester's saved state, or an empty default if they have none yet.
	 */
	public function actionLoad(): Response
	{
		$file = $this->filePath();

		if (!is_file($file)) {
			return $this->asJson(['statuses' => new \stdClass(), 'notes' => new \stdClass()]);
		}

		$this->response->format = Response::FORMAT_RAW;
		$this->response->getHeaders()->set('Content-Type', 'application/json; charset=UTF-8');
		$this->response->data = file_get_contents($file);

		return $this->response;
	}

	/**
	 * Saves a tester's state. Unknown keys, unknown statuses and non-string notes are dropped.
	 */
	public function actionSave(): Response
	{
		$this->requirePostRequest();

		$raw = $this->request->getRawBody();

		if (strlen($raw) > self::MAX_BODY_BYTES) {
			throw new BadRequestHttpException('Payload too large');
		}

		try {
			$input = Json::decode($raw);
		} catch (\Throwable) {
			$input = null;
		}

		if (!is_array($input) || !array_key_exists('statuses', $input)) {
			throw new BadRequestHttpException('Invalid payload');
		}

		$statuses = [];
		$notes = [];

		foreach ($this->assoc($input['statuses']) as $key => $value) {
			if ($this->isValidKey($key) && in_array($value, self::STATUSES, true)) {
				$statuses[$key] = $value;
			}
		}

		foreach ($this->assoc($input['notes'] ?? null) as $key => $value) {
			if ($this->isValidKey($key) && is_string($value) && $value !== '') {
				$notes[$key] = mb_substr($value, 0, self::MAX_NOTE_LENGTH);
			}
		}

		$data = [
			'statuses' => (object)$statuses,
			'notes' => (object)$notes,
			'lastSaved' => date('c'),
		];

		FileHelper::writeToFile($this->filePath(), Json::encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

		return $this->asJson(['ok' => true]);
	}

	/**
	 * Removes a tester and all their saved results.
	 */
	public function actionDelete(): Response
	{
		$this->requirePostRequest();

		$file = $this->filePath();

		if (is_file($file)) {
			FileHelper::unlink($file);
		}

		return $this->asJson(['ok' => true]);
	}

	private function storageDir(): string
	{
		$dir = Craft::$app->getPath()->getStoragePath() . '/testing';
		FileHelper::createDirectory($dir);

		return $dir;
	}

	/**
	 * Resolves the current tester's JSON file from the `tester` query param, or 400s if it's missing/invalid.
	 */
	private function filePath(): string
	{
		$tester = (string)$this->request->getQueryParam('tester', '');

		if (!preg_match(self::NAME_PATTERN, $tester)) {
			throw new BadRequestHttpException('Missing or invalid tester name');
		}

		return $this->storageDir() . "/$tester.json";
	}

	private function assoc(mixed $value): array
	{
		return is_array($value) ? $value : [];
	}

	private function isValidKey(int|string $key): bool
	{
		return (bool)preg_match(self::KEY_PATTERN, (string)$key);
	}
}
