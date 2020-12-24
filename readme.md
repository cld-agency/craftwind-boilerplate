This is starter boilerplate for Craft CMS 3 + Tailwind 2 + Vue 2 via Laravel Mix 5.

To use this Craft boilerplate:
====================================

1. `npm install`
1. `npm run development` or `npm run watch` or `npm run all`. Running `all` will trigger both development (with watch) and production builds simulataneously. Downside to that is that production CSS will only be purged when the task is first run, so you'll need to run production task again (`npm run production` or `npm run all`).

The full unpurged Tailwind CSS is available in local dev to make it easier to select classes in the Inspector. The build is purged when running `npm run production`.

-------------------------------------------

MIT License

Copyright &copy; 2020 Clever Little Design Ltd.

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