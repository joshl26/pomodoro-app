Run `npm audit` for details.

E:\GIT Working Folders\React - Pomofocus Clone - GIT\pomodoro-app>npm run analyze

> pomodoro-app@0.1.0 analyze
> cross-env GENERATE_SOURCEMAP=false craco build && npx source-map-explorer 'build/static/js/\*.js'

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

99.6 kB (-197 B) build\static\js\main.a19cef5a.js
35.54 kB (-48 B) build\static\css\main.ae1aa0b3.css

The project was built assuming it is hosted at /pomodor/.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.

Find out more about deployment here:

https://cra.link/deployment

build/static/js/main.a19cef5a.js
Unable to find a source map.
See https://github.com/danvk/source-map-explorer/blob/master/README.md#generating-source-maps

E:\GIT Working Folders\React - Pomofocus Clone - GIT\pomodoro-app>npm run analyze

> pomodoro-app@0.1.0 analyze
> cross-env GENERATE_SOURCEMAP=true craco build && source-map-explorer 'build/static/js/\*.js'

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

99.8 kB (+197 B) build\static\js\main.943ba9af.js
35.59 kB (+48 B) build\static\css\main.34ad9800.css

The project was built assuming it is hosted at /pomodor/.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.

Find out more about deployment here:

https://cra.link/deployment

build/static/js/main.943ba9af.js
Your source map refers to generated column Infinity on line 2, but the source only contains 316742 column(s) on that line.
Check that you are using the correct source map.
