<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 */

use craft\helpers\App;

return [

    // All environments
    '*' => [
        'env' => App::env('ENVIRONMENT'),
        'securityKey' => App::env('SECURITY_KEY'),
        'useProjectConfigFile' => true,

        // the siteUrl setting in the control panel (Settings > Sites) should be left blank and will auto-populate with this value
        'siteUrl' => App::env('SITE_URL'),
        // if multi-site, do it like this...
        // 'siteUrl' => [
        //     'siteOneHandle' => App::env('SITE1_URL'),
        //     'siteTwoHandle' => App::env('SITE2_URL'),
        // ],

        'isSystemLive' => true,
        'cpTrigger' => 'admin', // change me

        // fuzzy search
        'defaultSearchTermOptions' => array(
            'subLeft' => true,
            'subRight' => true,
        ),

        // prevent /cpresources/ path showing up on the front end
        'generateTransformsBeforePageLoad' => true,

        // remove index.php from auto-generated URLs
        'omitScriptNameInUrls' => true,

        'sendPoweredByHeader' => false,
        'useEmailAsUsername' => true,
        'errorTemplatePrefix' => '_errors/',
        'allowUpdates' => false,

        // too memory-intensive for many of our DBs,
        // and a bit redundant given how careful we usually are...
        'backupOnUpdate' => false,

        // if multi-site and not sharing a symlinked assets path, specify them like this
        // and then use these aliases as prefixes in the control panel (Settings > Assets > File System Path)
        // - so site-1's images directory would be `@basePathSite1/media/images`
        // 'aliases' => [
        //     '@basePathSite1' => '../public_site1',
        //     '@basePathSite2' => '../public_site2',
        // ],
    ],

    // Live (production) environment
    'live' => [
    ],

    // dev (pre-production) environment
    'dev' => [
        'disallowRobots' => true,
        'userSessionDuration' => 0, // disable auto-logout in the control panel
    ],

    // local (development) environment
    'local' => [
        'userSessionDuration' => 0,
        'allowUpdates' => true,
        'devMode' => true,
        'enableTemplateCaching' => false,
        'testToEmailAddress' => App::env('SYSTEM_EMAIL'),
        // this marks any strings that are translated, making it easier to spot ones which are not...
        //'translationDebugOutput' => true,
    ],
];