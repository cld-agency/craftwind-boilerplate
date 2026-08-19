<?php

namespace cld\redirects;

use Craft;
use craft\events\RegisterUrlRulesEvent;
use craft\events\RegisterUserPermissionsEvent;
use craft\services\UserPermissions;
use craft\web\Application as WebApplication;
use craft\web\UrlManager;
use cld\redirects\records\RedirectRecord;
use yii\base\Event;

class Plugin extends \craft\base\Plugin
{
    public bool $hasCpSection = true;
    public string $schemaVersion = '1.0.0';

    public const PERMISSION_MANAGE = 'redirects-manage';

    public function getCpNavItem(): ?array
    {
        $item = parent::getCpNavItem();

        if (!Craft::$app->getUser()->checkPermission(self::PERMISSION_MANAGE)) {
            return null;
        }

        return $item;
    }

    public function init(): void
    {
        parent::init();

        // Register permissions
        Event::on(
            UserPermissions::class,
            UserPermissions::EVENT_REGISTER_PERMISSIONS,
            function (RegisterUserPermissionsEvent $event) {
                $event->permissions[] = [
                    'heading' => 'Redirects',
                    'permissions' => [
                        self::PERMISSION_MANAGE => [
                            'label' => 'Manage redirects',
                        ],
                    ],
                ];
            }
        );

        // Register CP URL rules
        Event::on(
            UrlManager::class,
            UrlManager::EVENT_REGISTER_CP_URL_RULES,
            function (RegisterUrlRulesEvent $event) {
                $event->rules['redirects'] = 'redirects/redirects/index';
                $event->rules['redirects/new'] = 'redirects/redirects/edit';
                $event->rules['redirects/bulk'] = 'redirects/redirects/bulk';
                $event->rules['redirects/<id:\d+>'] = 'redirects/redirects/edit';
            }
        );

        // Intercept front-end requests for redirects
        Event::on(
            WebApplication::class,
            WebApplication::EVENT_INIT,
            function () {
                $this->handleRedirect();
            }
        );
    }

    private function handleRedirect(): void
    {
        $request = Craft::$app->getRequest();

        // Only handle front-end site requests
        if ($request->getIsConsoleRequest() || $request->getIsCpRequest() || $request->getIsActionRequest()) {
            return;
        }

        $redirects = $this->getCachedRedirects();
        $path = $request->getFullPath();

        // Try exact match first (O(1) array key lookup)
        if (isset($redirects['exact'][$path])) {
            Craft::$app->getResponse()->redirect($redirects['exact'][$path], 301)->send();
            Craft::$app->end();
            return;
        }

        // Try wildcard matches (longest prefix first)
        foreach ($redirects['wildcards'] as $wildcard) {
            if (str_starts_with($path, $wildcard['prefix'])) {
                $matched = substr($path, strlen($wildcard['prefix']));
                $destination = str_contains($wildcard['destination'], '*')
                    ? str_replace('*', $matched, $wildcard['destination'])
                    : $wildcard['destination'];

                Craft::$app->getResponse()->redirect($destination, 301)->send();
                Craft::$app->end();
                return;
            }
        }
    }

    private function getCachedRedirects(): array
    {
        return Craft::$app->getCache()->getOrSet('redirects_all', function () {
            $exact = [];
            $wildcards = [];

            $records = RedirectRecord::find()->all();

            foreach ($records as $record) {
                if (str_ends_with($record->sourceUri, '*')) {
                    $wildcards[] = [
                        'prefix' => rtrim($record->sourceUri, '*'),
                        'destination' => $record->destinationUri,
                    ];
                } else {
                    $exact[$record->sourceUri] = $record->destinationUri;
                }
            }

            // Sort wildcards by prefix length descending (longest/most specific first)
            usort($wildcards, fn($a, $b) => strlen($b['prefix']) <=> strlen($a['prefix']));

            return ['exact' => $exact, 'wildcards' => $wildcards];
        }, 300);
    }
}
