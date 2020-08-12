# pika-plugin-esbuild

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Adds a bundled Web distribution to your package, built & optimized to run in a web browsers. Useful for hosting on a CDN like UNPKG and/or when package dependencies aren't written to run natively on the web.
> Uses `esbuild` for speed.


## Install

```sh
# npm:
npm install pika-plugin-esbuild --save-dev
# yarn:
yarn add pika-plugin-esbuild --dev
```


## Usage

```js
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@pika/plugin-build-web"], // Required to precede in pipeline
      ["pika-plugin-esbuild", { /* esbuild options (optional) */ }]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).

## Options

This plugin accepts an optional options object which is passed directly to `esbuild`. We set some defaults:

- `"sourcemap"` (Default: `"true"`): Adds a [source map](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) for this build.
- `"minify"` (Default: `true`): Specify if bundle should be minifed using [`terser`](https://github.com/terser-js/terser) or not. Can also be [`terser` options object](https://github.com/terser-js/terser#minify-options) to further tweak minification.
- `"target"` (Default: `es2017`): The browsers supported/targeted by the build. Defaults to support all browsers that support ES Module (ESM) syntax.
- `"entrypoint"` (Default: `"browser"`): Customize the package.json manifest entrypoint set by this plugin. Accepts either a string, an array of strings, or `null` to disable entrypoint. Changing this is not recommended for most usage.
  - `{"entrypoint": "browser"}` will create an "browser" entrypoint that points to "dist-web/index.bundled.js". This is supported by both [`unpkg`](https://unpkg.com) and [`jsdelivr`](https://jsdelivr.com).
  - `{"entrypoint": ["unpkg", "jsdelivr"]}` will create both "unpkg" & "jsdelivr" "dist-web/index.bundled.js" entrypoints.

## Result

1. Adds a web bundled distribution to your built package: `dist-web/index.bundled.js`
  1. ES Module (ESM) syntax (by default)
  1. Transpiled to run on all browsers where ES Module syntax is supported.
  1. All dependencies inlined into this file.
  1. Minified using `esbuild` (Can optionally be skipped)
  1. (if specified) Adds the file to your specified "entrypoint".

Note that this does not add or modify the "module" entrypoint to your package.json. Bundles should continue to use the "module" entrypoint, while this build can be loaded directly in the browser (from a CDN like UNPKG).
