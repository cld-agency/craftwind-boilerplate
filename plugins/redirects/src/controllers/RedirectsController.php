<?php

namespace cld\redirects\controllers;

use Craft;
use craft\web\Controller;
use cld\redirects\Plugin;
use cld\redirects\records\RedirectRecord;
use yii\web\NotFoundHttpException;
use yii\web\Response;

class RedirectsController extends Controller
{
    public function beforeAction($action): bool
    {
        if (!parent::beforeAction($action)) {
            return false;
        }

        $this->requirePermission(Plugin::PERMISSION_MANAGE);

        return true;
    }

    public function actionIndex(): Response
    {
        $redirects = RedirectRecord::find()
            ->orderBy(['sourceUri' => SORT_ASC])
            ->all();

        return $this->renderTemplate('redirects/_index', [
            'redirects' => $redirects,
        ]);
    }

    public function actionEdit(?int $id = null): Response
    {
        if ($id) {
            $redirect = RedirectRecord::findOne($id);
            if (!$redirect) {
                throw new NotFoundHttpException('Redirect not found.');
            }
        } else {
            $redirect = new RedirectRecord();
        }

        return $this->renderTemplate('redirects/_edit', [
            'redirect' => $redirect,
        ]);
    }

    public function actionSave(): ?Response
    {
        $this->requirePostRequest();

        $id = Craft::$app->getRequest()->getBodyParam('id');

        if ($id) {
            $redirect = RedirectRecord::findOne($id);
            if (!$redirect) {
                throw new NotFoundHttpException('Redirect not found.');
            }
        } else {
            $redirect = new RedirectRecord();
        }

        $redirect->sourceUri = trim(Craft::$app->getRequest()->getBodyParam('sourceUri'), '/');

        $redirect->destinationUri = self::sanitiseDestinationUri(
            Craft::$app->getRequest()->getBodyParam('destinationUri')
        );

        if (!$redirect->validate()) {
            Craft::$app->getSession()->setError('Couldn\'t save redirect.');
            Craft::$app->getUrlManager()->setRouteParams([
                'redirect' => $redirect,
            ]);
            return null;
        }

        $redirect->save(false);
        Craft::$app->getCache()->delete('redirects_all');

        Craft::$app->getSession()->setNotice('Redirect saved.');

        return $this->redirectToPostedUrl($redirect);
    }

    public function actionBulk(): Response
    {
        return $this->renderTemplate('redirects/_bulk');
    }

    public function actionSaveBulk(): ?Response
    {
        $this->requirePostRequest();

        $lines = Craft::$app->getRequest()->getBodyParam('redirects');
        $created = 0;
        $errors = [];

        foreach (explode("\n", $lines) as $i => $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }

            $lineNum = $i + 1;

            if (!str_contains($line, '>')) {
                $errors[] = "Line {$lineNum}: missing &gt; separator.";
                continue;
            }

            $parts = explode('>', $line, 2);
            $sourceUri = trim(trim($parts[0]), '/');
            $destinationUri = trim($parts[1]);

            if ($sourceUri === '' || $destinationUri === '') {
                $errors[] = "Line {$lineNum}: source and destination are both required.";
                continue;
            }

            $redirect = new RedirectRecord();
            $redirect->sourceUri = $sourceUri;
            $redirect->destinationUri = self::sanitiseDestinationUri($destinationUri);

            if (!$redirect->validate()) {
                $fieldErrors = implode(', ', $redirect->getFirstErrors());
                $errors[] = "Line {$lineNum}: {$fieldErrors}";
                continue;
            }

            $redirect->save(false);
            $created++;
        }

        if ($created > 0) {
            Craft::$app->getCache()->delete('redirects_all');
        }

        if ($errors) {
            Craft::$app->getSession()->setError("{$created} redirect(s) added. " . count($errors) . " line(s) skipped.");
            Craft::$app->getUrlManager()->setRouteParams([
                'errors' => $errors,
                'redirectsInput' => $lines,
            ]);
            return null;
        }

        Craft::$app->getSession()->setNotice("{$created} redirect(s) added.");

        return $this->redirect('redirects');
    }

    public function actionDelete(): Response
    {
        $this->requirePostRequest();

        $id = Craft::$app->getRequest()->getBodyParam('id');
        $redirect = RedirectRecord::findOne($id);

        if ($redirect) {
            $redirect->delete();
            Craft::$app->getCache()->delete('redirects_all');
            Craft::$app->getSession()->setNotice('Redirect deleted.');
        }

        return $this->redirect('redirects');
    }

    private static function sanitiseDestinationUri(string $uri): string
    {
        $uri = trim($uri);

        // Block dangerous URI schemes
        $scheme = strtolower(parse_url($uri, PHP_URL_SCHEME) ?? '');
        if (in_array($scheme, ['javascript', 'data', 'vbscript'], true)) {
            $uri = '/';
        }

        // Auto-prepend leading slash for relative paths
        if (!str_starts_with($uri, '/') && !str_starts_with($uri, 'http')) {
            $uri = '/' . $uri;
        }

        return $uri;
    }
}
