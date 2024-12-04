# Deploying

Deploying your documentation site can involve a lot of moving parts, but Ember CLI AddonDocs aims to streamline as much of the process as possible by providing a set of out-of-the-box conventions for deploying to GitHub Pages.

Once everything is set up, you'll be able to visit <u>https://**[user]**.github.io/**[repo]**</u> to see the docs for the latest release of your addon, and your CI builds will automatically keep it up to date.

## Deploying your docs site

To deploy your docs site to GitHub pages, you'll need to go through a few steps of first-time setup:

1.  Run `ember g ember-cli-addon-docs` to set up the relevant deploy plugins (this is done automatically if you used `ember install` to install AddonDocs)
2.  Set [the `repository` field](https://docs.npmjs.com/files/package.json#repository) of your `package.json`.
3.  Commit any outstanding changes you've got on your current branch and push them to GitHub.
4.  Run `ember deploy production` and answer "yes" if prompted to create a `gh-pages` branch. **Note**: if your repo already has a `gh-pages` branch, you may want to manually archive the existing content there before deploying.

Once the deploy completes and GitHub has a moment to publish your pages site, if all went well you should see your addon's dummy app live at
<u>https://**[user]**.github.io/**[repo]**/versions/**[current-branch]**</u>.

Now take a look at the `gh-pages` branch either locally or on GitHub. You should see a layout something like this:

```sh
├── 404.html
├── versions
│   └── [current-branch]
│       ├── assets
│       ├── index.html
│       └── ...
└── versions.json
```

Let's break down what each of those items is doing.

- `404.html` contains [some smart redirect logic](https://github.com/rafrex/spa-github-pages) to keep you from having to use `locationType: 'hash'` in your dummy app
- `versions.json` contains a manifest of the available versions of your documentation
- `versions/[current-branch]` contains all the files from your built docs app

If you were to make a change to your dummy app and run `ember deploy production` again right now, the entry for `[current-branch]` in `versions.json` and the entire contents of the `versions/[current-branch]` directory would be replaced with the updated version of your site. Next we'll talk about how to manage keeping published documentation around for multiple versions of your addon.

## Versioning your content

Whenever you deploy your documentation site with AddonDocs, it places the compiled application in a subdirectory based on the current state of your git repository. All of this behavior [is customizable](#customizing-deploys), but we expect the out-of-the-box configuration should be a good place to get started.

### Tag deploys

When you run `ember deploy` at a commit that has a git tag associated with it, the app will wind up in a directory named after that tag. For example, if you've just published version 1.2.3 of your addon (creating tag `v1.2.3` in your git repository), your deployed site will be available at <u>https://**[user]**.github.io/**[repo]**/versions/v1.2.3</u>.

By default, deploying from a tagged commit also places a copy of your app at the root of your `gh-pages` branch, so <u>https://**[user]**.github.io/**[repo]**</u> will always bring developers to the documentation for the most recent stable release of your addon. If you deploy without a tagged release, <u>https://**[user]**.github.io/**[repo]**</u> will return a 404.

Note that this only applies to non-prerelease tags, so `v1.2.3` would update the root app, but `v2.0.0-beta.1` would not. Check out the documentation for [node-semver](https://github.com/npm/node-semver) for the exact details on what constitutes a prerelease version.

### Branch deploys

When you deploy from a commit at the head of a branch that _doesn't_ have a tag associated with it, the compiled app will land in a folder named after that branch, as in our "getting started" example above. Unlike tag deploys, branch deploys will never automatically update the root app.

The main use case for branch deploys is tracking development work since your last stable release. If you run `ember deploy` after successful builds on `main`, you'll always have documentation available for the bleeding edge of your addon's features. Since branch deploys don't update the root, though, developers looking at your docs will still hit your most recent stable tag by default, so there won't be any confusion about things that have drifted since the last release.

## Automating deploys

While you _can_ just run `ember deploy production` yourself after every commit to `main` and each new release of your addon, you can simplify life a bit by automating the process as part of your CI setup. This setup can be used for GitHub Actions, which is currently the preferred, built-in CI used by Ember blueprints.

- Create a new file at `.github/workflows/addon-docs.yml`
- Paste in the following contents:

```yml
```



## Customizing deploys

When you install AddonDocs, a `config/addon-docs.js` file will automatically be created for you that looks something like this:

```js
const AddonDocsConfig = require('ember-cli-addon-docs/lib/config');

module.exports = class extends AddonDocsConfig {
  // ...
};
```

You can override methods on this class to customize deploy behavior.

### `getVersionPath()`

This method determines the location that a given version of your documentation will be written to within the `versions` directory on your deploy branch.

By default, this method will use the current tag name (if any), or fall back to the current branch name as described above. Note that you can override this behavior by setting an `ADDON_DOCS_VERSION_PATH` environment variable.

If this method returns a falsey value, the deploy will be aborted.

### `getVersionName()`

This method returns a name for a given version of your documentation. By default it returns the current tag if any, or the current branch name otherwise. If, for instance, you wanted to set up named releases, you might override this method. You can also explicitly specify the version name by setting an `ADDON_DOCS_VERSION_NAME` environment variable.

### `shouldUpdateLatest()`

This method determines whether the root copy of your docs app will also be updated with the current deploy. By default, this will return true for builds from a tagged commit where the tag is a [semver non-prerelease version](https://github.com/npm/node-semver), and false otherwise. You can explicitly set the `ADDON_DOCS_UPDATE_LATEST` environment variable to `true` or `false` to override this behavior.

### `getRootURL()`

This method determines the static path under which all deploys of your docs app expect to live. It defaults to the name of your project, which matches the typical GitHub Pages setup where your site lives at <u>https://**[user]**.github.io/**[project]**/...</u>.

If instead, however, you want to [set up a CNAME for your project](https://help.github.com/articles/using-a-custom-domain-with-github-pages/) and host it at e.g. <u>https://my-great-project.com</u>, you would override this method to return `''`, since there would be no static path at the beginning of the URL.

**Note**: if you change this configuration after you've already deployed copies of your docs site, you'll need to check out your `gh-pages` branch and find/replace your previous root URL in those copies in order for them to continue to function in their new location.

### `getPrimaryBranch()`

This method determines what AddonDocs considers to be your primary branch, which is where links such as "edit this page" will point. By default, this branch is `master`, but you can override this method to choose a different branch instead, e.g. `develop`.

## Removing a deployed version

Deploying a version of your documentation does two things: it copies the `dist` directory of your built docs app into a particular place on your `gh-pages` branch, and it adds or updates an entry in the `versions.json` manifest in the root of that branch. To remove a version, then, you just need to undo those two things.

First, you can run `git checkout gh-pages` to switch to your deploy branch. You may see a message indicating that that branch has already been checked out somewhere else by `git worktree`—if that's the case, you can just `cd` to that directory instead.

Next, remove the item from `versions.json` for the version you want to get rid of, and delete the corresponding directory. For example, if you ran a deploy on a branch called `deploy-test` and wanted to remove the results of that after you finished testing it out, you could `git rm -r versions/deploy-test` to remove the deployed app, and then find the `deploy-test` key in `versions.json` and remove it:

```js
{
  // ...
  "deploy-test": {
    "sha": "caad536c48dd3562629a4f7a467c976f0ec6bb2b",
    "tag": null,
    "path": "versions/deploy-test",
    "name": "deploy-test"
  },
  // ...
}
```

Keep in mind, your deployed site is still a git branch like everything else in your repo, so you have all the same tools at your disposal for making changes to it. In many case, rather than going through the manual steps outlined above, you may be able to just find the commit that added the version you want to remove and `git revert` it.

## Disabling the default deployment plugins

If you wish to disable ember-cli-addon-docs' built-in deployment plugins altogether and instead define your own pipeline, you can do so by [editing your pipeline configuration](http://ember-cli-deploy.com/docs/v1.0.x/configuration/#disabling-plugins). In your `config/deploy.js` file:

```js
// ...
ENV.pipeline = {
  disabled: {
    'ember-cli-addon-docs': true
  }
};
// ...
```
