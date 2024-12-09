Experimental work-in-progrss Vite-based build
=============================

Notes
-----

Beware to use an appropriate version of Node - there appears to be a serious bug with fsevents on Apple Silicon on certain versions. The version in .nvmrc works ok. If you use version 22, you may find that your CPU usage goes very high.

Need to find a better way to trigger the production build. At the moment, it's just blindly watching for any changes in src or templates, even if those changes don't actually require a rebuild. Could perhaps use a Git hook instead, or use an intermediary build directory as we did with Mix.
