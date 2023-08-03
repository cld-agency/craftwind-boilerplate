This is an opinionated starter boilerplate for Craft CMS 4 + Tailwind-JIT and Vanilla JS via Laravel Mix 6. No JavaScript frameworks are included.

This branch does *not* use Tailwind's base styles (we're setting `preflight: false` in the Tailwind config), because we prefer to have at least _some_ base styling - instead we use our own CSS reset and base styles (see global.scss and elements.scss respectively).

Unlike many other boilerplates, this one prioritises simplicity. We don't want or need node/npm anywhere near our production server thank-you very much, and we don't want a complex deployment process, so builds are done locally on save (when running `npm run all`), and compiled files are committed to the repo and pushed to the remote. If for some reason you prefer a complicated deployment process and don't want to commit compiled files to your repo, you can run `npm run watch` and `npm run prod` separately for dev/production builds, and gitignore the public `assets` directory.

As a minimum, though, your deployment process will need to run `composer install && ./craft migrate/all` if `composer.lock` has changed, and `composer install && ./craft project-config/apply` if `config/project/project.yaml` has changed. Depending on how you write your templates, you might also want to clear Craft's template caches. (We tend to prefer full page static caching, which makes using Craft's `{% cache %}` tags redundant).

To use this Craft boilerplate:
====================================

1. Be sure that your CLI is running at least PHP 8.1, then run `composer install`
1. Create a new local blank database and local virtual host
1. Update your control panel trigger word in `config/general.php` to something unique
1. Create your local `.env` file from the sample and populate with all relevant details
1. Run `./craft setup/app-id && ./craft setup/security-key` to recreate a new app ID and security key (copy these values to the remote env files manually later)
1. Install Craft by visiting the control panel and following the on-screen instructions. Keep the site name as $PRIMARY_SITE_URL so it will pull from .env
1. Create an entry in the Home Pages section
1. Update `package.json` with project name
1. `npm install`
1. `npm run all` or `npm run prod` or `npm run watch` to start work at http://localhost:3000. If you're working with multiple developers you should have `nvm` installed locally and run `nvm use` prior to starting the build process. This automatically reads the `.nvmrc` file and uses the project's version of Node, which in turn avoids some unpleasant issues that can crop up if different developers are running different versions of Node.

The `npm run all` task is configured to do both dev and production builds locally on save, so no need for separate dev/prod build processes here. If running both at the same time ever becomes too taxing on your CPU, you can run them separately with `npm run prod` and `npm run watch`.

The included functionality is relatively barebones, however there are some things that we find ourselves using on every project and they are therefore included here:

JS functionality
-------------------

This repo includes the following JS libraries:

* <a href="https://github.com/tuax/tua-body-scroll-lock">tua-body-scroll-lock</a> for reliably locking the body scroll while modals and overlays are on, whilst still allowing the modal/overlay content to be scrollable.
* <a href="https://codepen.io/croxton/pen/yLOLzjo">Toggle</a> by @croxton
* <a href="https://github.com/verlok/vanilla-lazyload">Vanilla Lazyload</a> by @verlok-cn

Example code for using the accessible toggle functionality (set this as an auto-expand snippet/live template in your editor):

```html
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
	<button type="button" data-close>Close me</button>
	toggle me
</div>

Now put this into your bindUI function in main.js:
new Toggle('.js-toggleAThing');
(best to use a new instantiation for each type of toggler so that they don't interfere with each other)
```

If you want to transition-in the hidden thing instead of an instant show/hide, just use a transform class like `class="translate-x-full"` instead of `hidden`. (The `.is-active` modifier will remove all transforms, set opacity to 1 and enable pointer events (see utilities.scss)).

If you want to disable the auto-focus functionality that shifts focus into the toggled element, pass in `data-focus="false"` on the trigger element. Be careful when doing this that any children of the toggled element are focusable in the right order.

CSS functionality
-------------------

* A custom made SCSS `fluid` mixin for fluid values between two breakpoints. Useful for font-sizes and also vertical padding.
* A mixin from <a href="http://text-crop.eightshapes.com">http://text-crop.eightshapes.com</a> called `text-crop` to prevent line-heights from affecting vertical box padding.

Craft templates
----------------

This is a fairly opinionated repository, so here's a description of how certain templating techniques work.

### `_partials/picture.twig`

This boilerplate includes a powerful [picture](templates/_partials/picture.twig) partial for outputting optimised responsive images natively in Craft without the use of any third-party image plugins or external image generation services. It handles:

- srcset & sizes (the sizes attribute must still be figured out for each use case)
- webp variant generation
- lazyloading
- focal point handling
- optional aspect ratio box
- svg inlining
- captions

Here's an example of including the picture partial with all available parameters:

```twig
{% include '_partials/picture.twig' with {
    image: img,
    transforms: craft.app.config.custom.globalTransforms.fullWidthContained,
    sizes: '(min-width: XXXpx) XXXpx, (min-width: XXXpx) calc(XXXvw + XXpx), XXXpx',
    alt: '',
    extraImgClasses: '',
    extraPictureClasses: '',
    extraSVGClasses: '',
    useInlineSVG: false,
    useLazyLoading: true,
    useRatioBox: false,
    useFocalPoint: true,
    useCaption: false
} %}
```

Read the introduction in the picture partial file for a full description of how each parameter works.

All image transforms should be stored globally in the custom config array at [config/custom.php](config/custom.php). Each transform array in `$globalTransforms` is dynamically duplicated into another array called `$transformsToEagerLoad` which includes the `webp` variant. The specific set of transforms from the `$globalTransforms` array should be passed in to the `picture` partial (which takes care of adding the webp variant), whilst eager loading of the transforms should be done via the `$transformsToEagerLoad` array. Here's an example of how to eager load some imgs contained inside a matrix field to clarify:

```twig
{% set blocks = entry.matrixField.with([
	['someBlockTypeHandle:someImgBlockHandle', { withTransforms: craft.app.config.custom.transformsToEagerLoad.halfWidth }],
	['anotherBlockTypeHandle:someImgBlockHandle', { withTransforms: craft.app.config.custom.transformsToEagerLoad.fullWidth }],
]).all() %}
```

This approach ensures that both the `webp` and original format transforms are eager loaded so as to fully avoid an N+1 issue when looping through multiple images.

Finally, be sure to add an accurate `sizes` attribute according to your use case. This is a useful bookmarklet for figuring out the more complex ones: [https://ausi.github.io/respimagelint/](https://ausi.github.io/respimagelint/).

### entry / listing routing

Full description coming soon. See `_entry.twig` and `_listing.twig` in the meantime and follow the control flow.

### Local SMTP overrides

Full description coming soon. See `config/app.php` and `.env.sample` in the meantime.

### `_partials/container.twig`

Full description coming soon. The `container` partial outputs a vertically and horizontally padded container for a site section, along with various background colour options. It should always be used as a Twig `embed` so that you can populate its `content` block.

### `_partials/flexGrid.twig`

Full description coming soon. This is for outputting a collection of units arranged in columns - typically "card" elements. This currently uses flexbox with negative margins on the parent, but should be modernised to use CSS grid and `gap`.

Craft plugins
----------------

This repo includes the following Craft plugins:

* <a href="https://plugins.craftcms.com/mix">Mix</a>
* <a href="https://plugins.craftcms.com/minify">Minify</a>
* <a href="https://plugins.craftcms.com/cp-field-inspect">CP Field Inspect</a>

-------------------------------------------

MIT License

Copyright &copy; 2023 Clever Little Design Ltd.

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