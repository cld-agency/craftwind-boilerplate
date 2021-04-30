This is an opinionated starter boilerplate for Craft CMS 3 + Tailwind-JIT and Vanilla JS via Laravel Mix 6. No JavaScript frameworks are included.

This branch does *not* use Tailwind's `base` / preflight layer - instead you are expected to bring your own CSS reset and base styles (see global.scss and elements.scss respectively).

To use this Craft boilerplate:
====================================

1. `npm install`
1. `npm run all` or `npm run prod` or `npm run watch`

The `npm run all` task is configured to do both dev and production builds locally on save, so no need for separate dev/prod build processes here. If running both at the same time ever becomes too taxing on your CPU, you can run them separately with `npm run prod` and `npm run watch`.

The included functionality is relatively barebones, however there are some things that we find ourselves using on every project and they are therefore included here:

JS functionality
-------------------

This repo includes the following JS libraries:

* <a href="https://github.com/willmcpo/body-scroll-lock">BodyScrollLock</a> by @willmcpo
* <a href="https://codepen.io/croxton/pen/yLOLzjo">Toggle</a> by @croxton

CSS functionality
-------------------

* A custom made SCSS `fluid` mixin for fluid values between two breakpoints. Useful for font-sizes and also vertical padding.

Craft plugins
----------------

This repo includes the following Craft plugins:

* <a href="https://plugins.craftcms.com/mix">Mix</a>
* <a href="https://plugins.craftcms.com/minify">Minify</a>
* <a href="https://plugins.craftcms.com/cp-field-inspect">CP Field Inspect</a>

-------------------------------------------

MIT License

Copyright &copy; 2021 Clever Little Design Ltd.

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