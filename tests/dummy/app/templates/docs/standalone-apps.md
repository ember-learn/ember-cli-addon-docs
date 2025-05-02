# Standalone apps

ember-cli-addon-docs now supports shipping your docs site as a separate app,
rather than using the dummy app.

General steps to convert an existing dummy app to a separate app:

## 1. Decide whether you want a monorepo or a nested app.

Either should work, but they have different pros and cons. With a monorepo you only need to run `yarn install` once and you get efficient sharing of dependencies. But it's also harder for users to point their app directly at an unreleased commit or fork of your addon.

    In my case, I went with a nested app, meaning I have a regular ember-addon, plus a `/docs` folder that contains a regular ember app. So you need to `yarn install` in both before the docs app will work.

## 2. Generate a new app to be your docs app, with `ember new`.

ember-cli doesn't like to generate new apps inside existing apps, so you may need to generate it elsewhere first and then move it into place.

## 3. Make your docs app depend on your addon.

In my case, I did it as an [in repo addon](https://github.com/ember-animation/ember-animated/blob/152943adb41cdf2de8082b679daafffd6f9c3f77/docs/package.json#L70). If you're using a monorepo with yarn workspaces, you can have a regular `devDependency` on it instead.

## 4. Add `ember-cli-addon-docs` to your docs app.

You can follow the <DocsLink @route="docs.quickstart">quickstart guide.</DocsLink>

## 5. Set `documentingAddonAt`

Configure the docs app's `ember-cli-build.js` to tell ember-cli-addon-docs to point at the addon:

```js
let app = new EmberApp(defaults, {
  'ember-cli-addon-docs': {
    documentingAddonAt: '..'
  }
});
```

If the addon is authored in [v2 Addon Format](https://rfcs.emberjs.com/id/0507-embroider-v2-package-format/) `ember-cli-addon-docs` will look for the addon source code in `src` folder.
You may need to set `addonSrcFolder` config option if addon uses another folder:

```js
let app = new EmberApp(defaults, {
  'ember-cli-addon-docs': {
    documentingAddonAt: '../my-awesome-addon',
    addonSrcFolder: 'src',
  }
});
```

At this point you should be able to run the docs app and it should look the same as if you had just added ember-cli-addon-docs for the first time to your addon.

## 6. Move all the things

Move all the things (routes, templates, components, styles, etc) in your tests/dummy app into your new docs app. Also move any tests that are specifically about testing the docs app, as opposed to testing the addon. When you're done, you'll still have a dummy app and you can still use it for dev and test, but it won't contain the docs.

## 7. Configure CI

Remember to configure CI to run `ember test` in both the addon and the docs app.

## 8. Configure `.npmignore`

If you have a nested docs app, remember to configure `.npmignore` or equivalent so you don't publish the whole docs app to NPM.
