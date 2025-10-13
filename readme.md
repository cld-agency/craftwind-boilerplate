Experimental work-in-progress Vite-based build
=============================

Notes
-----

Beware to use an appropriate version of Node - there appears to be a serious bug with fsevents on Apple Silicon on certain versions. The version in .nvmrc works ok. If you use version 22, you may find that your CPU usage goes very high.
https://github.com/fsevents/fsevents/issues/401

Need to find a better way to trigger the production build. At the moment, it's just blindly watching for any changes in src or templates, even if those changes don't actually require a rebuild. Could perhaps use a Git hook instead, or use an intermediary build directory as we did with Mix.

Grid bookmarklet for 72px/32px|12col:
```
javascript:/*_DRAG_ME_INTO_YOUR_BOOKMARK_BAR_*/(function(){window.javascriptgrid={columns:{"default":{columns:12}},columnWidth:72,gapWidth:32};var script=document.createElement('script');script.src='https://jsg.javascriptgrid.org/jsg.js';document.getElementsByTagName('HEAD')[0].appendChild(script);})();
```

(breakpoints line up with this grid)

To use this Craft boilerplate:
====================================

1. Be sure that your CLI is running at least PHP 8.3, then run `composer install`
1. Create a new local blank database and local virtual host
1. Update your control panel trigger word in `config/general.php` to something unique
1. Create your local `.env` file from the sample and populate with all relevant details
1. Run `php craft setup/app-id && php craft setup/security-key` to recreate a new app ID and security key (copy these values to the remote env files manually later)
1. Install Craft by visiting the control panel and following the on-screen instructions. Keep the site name as `$PRIMARY_SITE_URL` so it will pull from .env
1. Run `php craft update all` to upgrade Craft and plugins to their latest point-releases.
1. Update `package.json` with project name
1. `cd buildchain && nvm use && npm install`
1. `npm run all` to start work at http://$PRIMARY_SITE_URL.test

If you're working with multiple developers you should have `nvm` installed locally and run `nvm use` prior to starting the build process. This automatically reads the `.nvmrc` file and uses the project's version of Node, which in turn avoids some unpleasant issues that can crop up if different developers are running different versions of Node.