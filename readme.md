Craft CMS boilerplate with Tailwind 4, Vite, and AlpineJS.
=============================

This is an opinionated starter boilerplate for Craft CMS 5 + Tailwind 4 and AlpineJS with Vite for the build.

This boilerplate does not use Tailwind's base styles (we're omitting preflight.css), because we prefer to have at least some base styling - instead we use our own CSS reset and base styles (see global.scss and elements.scss respectively). We're also opting out of Tailwind 4's cascade layering to avoid potential issues with third-party CSS and also to reduce unnecessary complexity.

Unlike many other boilerplates, this one prioritises simplicity. We don't want or need node/npm anywhere near our production server thank-you very much, and we don't want a complex deployment process, so builds are done locally on save (when running npm run all), and compiled files are committed to the repo and pushed to the remote. If for some reason you prefer a complicated deployment process and don't want to commit compiled files to your repo, you can run npm run watch and npm run prod separately for dev/production builds, and gitignore the public `dist` directory.

As a minimum, though, your deployment process will need to run `craft up` after deployment in order to run migrations and project config updates and manage composer dependencies. Depending on how you write your templates, you might also want to clear Craft's template caches. (We tend to prefer full page static caching, which makes using Craft's {% cache %} tags mostly redundant).

IMPORTANT
-----------

Be sure to use an appropriate version of Node - there appears to be a serious bug with fsevents on Apple Silicon on certain versions. The version in .nvmrc works ok. If you use version 18.20.5 or 22.x or 23.x, you may find that your CPU usage goes very high.
https://github.com/fsevents/fsevents/issues/401 (instead of the workaround there, which installs an extra copy of fsevents manually as part of your package.json, we're locking the node version to 20.10.0 in nvmrc which sidesteps the issue).

Notes
-------

Ideally should to find a better way to trigger the production build. At the moment, it's just blindly watching for any changes in `src` or `templates`, even if those changes don't actually require a rebuild. Could perhaps use a Git hook instead, or use an intermediary build directory as we used to with Mix. Or just ignore that issue entirely as it's so fast it doesn't really matter (though could be argued that it pollutes the repo a bit).

Grid bookmarklet for 72px/32px|12col:

```
javascript:/*_DRAG_ME_INTO_YOUR_BOOKMARK_BAR_*/(function(){window.javascriptgrid={columns:{"default":{columns:12}},columnWidth:72,gapWidth:32};var script=document.createElement('script');script.src='https://jsg.javascriptgrid.org/jsg.js';document.getElementsByTagName('HEAD')[0].appendChild(script);})();
```

(this boilerplate's default TW breakpoints line up with that grid)

To use this Craft boilerplate:
-----------

1. Be sure that your CLI is running at least PHP 8.3, then run `composer install`
1. Create a new local blank database and local virtual host and wire them up
1. Update your control panel trigger word in `config/general.php` to something unique
1. Create your local `.env` file from the sample and populate with all relevant details
1. Run `php craft setup/app-id && php craft setup/security-key` to recreate a new app ID and security key (copy these values to the remote env files manually later)
1. Install Craft by visiting the control panel and following the on-screen instructions. Keep the site name as `$PRIMARY_SITE_URL` so it will pull from .env
1. Run `php craft update all` to upgrade Craft and plugins to their latest point-releases.
1. Update `package.json` with project name
1. `cd buildchain && nvm use && npm install`
1. `npm run all` to start work at http://$PRIMARY_SITE_URL.test
1. Add a new entry in the home pages section.

Previewing on a phone or tablet
-----------

Vite serves your JS and CSS from its own dev server, so a phone needs to reach *both* the site and that dev server. Two things make this work:

1. Set `PRIMARY_SITE_URL=@web` in your `.env`. Craft then builds every URL from whichever hostname the request arrived on, so the same install serves correct links to your Mac and your phone with no duplicate config. Local only — never do this on a public server, where the `Host` header can't be trusted.
1. Run `npm run lan` (or just `npm run all`, which now calls it). It reads your machine's LAN IP and rewrites `VITE_HOST` to something like `boilerplate.test.192-168-1-5.sslip.io`, then prints the URL to open on your phone.

`sslip.io` is a free public DNS service that resolves any hostname containing a dash-separated IP straight back to that IP, and MAMP already gives each host a `<hostname>.test.*` wildcard server name — so one hostname reaches both the site on port 80 and the dev server on `VITE_PORT`. No extra software, and nothing to configure on the phone beyond joining the same Wi-Fi. Only DNS lookups leave your network; the traffic itself never does.

Because the IP is baked into the hostname, it changes when your DHCP lease does — which is why `npm run all` re-stamps it on every start. If you'd rather it never moved, give the machine a static reservation on your router.

Two caveats worth knowing. The dev server binds to every network interface, so anyone on the same Wi-Fi can reach it — think twice on café or client networks. And CORS is restricted to your exact hostnames rather than a `*.sslip.io` wildcard, deliberately: sslip.io will resolve a lookalike name to *any* IP, so a wildcard would let a hostile page read your source. If you add another hostname for the site, add it to `localHosts` in `buildchain/vite.config.js`.

If you're working with multiple developers you should have `nvm` installed locally and run `nvm use` prior to starting the build process. This automatically reads the `.nvmrc` file and uses the project's version of Node, which in turn avoids some unpleasant issues that can crop up if different developers are running different versions of Node.

--------------------------------------------------

MIT License

Copyright © 2025 Clever Little Design Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.