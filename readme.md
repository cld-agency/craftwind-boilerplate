This is an opinionated starter boilerplate for Craft CMS 4 + Tailwind-JIT and Vanilla JS via Laravel Mix 6. No JavaScript frameworks are included.

This branch does *not* use Tailwind's base styles (we're setting `preflight: false`), because we prefer to have at least _some_ base styling - instead we use our own CSS reset and base styles (see global.scss and elements.scss respectively).

To use this Craft boilerplate:
====================================

1. Run `composer install`
1. Create a new local blank database and local virtual host
1. Update your control panel trigger word in `config/general.php` to something unique
1. Create your local `.env` file from the sample and populate with all relevant details
1. Install Craft by visiting the control panel and following the on-screen instructions
1. Run `./craft update all`
1. Create an entry in the Home Pages section
1. Update `package.json` with project name
1. `npm install`
1. `npm run all` or `npm run prod` or `npm run watch` to start work at http://localhost:3000

The `npm run all` task is configured to do both dev and production builds locally on save, so no need for separate dev/prod build processes here. If running both at the same time ever becomes too taxing on your CPU, you can run them separately with `npm run prod` and `npm run watch`.

The included functionality is relatively barebones, however there are some things that we find ourselves using on every project and they are therefore included here:

JS functionality
-------------------

This repo includes the following JS libraries:

* <a href="https://github.com/willmcpo/body-scroll-lock">BodyScrollLock</a> by @willmcpo
* <a href="https://codepen.io/croxton/pen/yLOLzjo">Toggle</a> by @croxton

Example code for using the accessible toggle functionality (set this as an auto-expand snippet/live template in your editor):

```
<button type="button"
	class="button-reset js-toggleAThing"
	aria-controls="js-idOfThingToToggle"
	data-active-target-id="js-idOfThingToToggle"
	data-active-target="is-active"
	data-active="is-active"
	aria-expanded="false"
>
	Toggle Text
</button>

<div id="js-idOfThingToToggle" aria-hidden="true" class="hidden">
	<button type="button" class="close">Close me</button>
	toggle me
</div>

Now put this into your bindUI function in main.js:
new Toggle('.js-toggleAThing');
(best to use a new instantiation for each type of toggler so that they don't interfere with each other)
```

If you want to transition-in the hidden thing instead of an instant show/hide, just use a transform class like `class="translate-x-full"` instead of `hidden`. (The `.is-active` modifier will remove all transforms, set opacity to 1 and enable pointer events (see utilities.scss)).

CSS functionality
-------------------

* A custom made SCSS `fluid` mixin for fluid values between two breakpoints. Useful for font-sizes and also vertical padding.

Craft plugins
----------------

This repo includes the following Craft plugins:

* <a href="https://plugins.craftcms.com/mix">Mix (fork for Craft 4)</a>
* <a href="https://plugins.craftcms.com/minify">Minify</a>
* <a href="https://plugins.craftcms.com/cp-field-inspect">CP Field Inspect</a>

-------------------------------------------

MIT License

Copyright &copy; 2022 Clever Little Design Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.