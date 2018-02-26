# Deploying

Deploying your documentation site can involve a lot of moving parts, but Ember CLI Addon Docs aims to streamline as much of the process as possible by providing a set of out-of-the-box conventions for deploying to GitHub Pages.

- [Deployment Using `ember-cli-deploy`](#deployment-using-ember-cli-deploy)
- [Versioning Your Content](#versioning-your-content)
- [Automating Deploys](#automating-deploys)
- [Customizing Deploys](#customizing-deploys)

## Deployment Using `ember-cli-deploy`

To deploy your docs site to GitHub pages, you'll need to go through a few steps of first-time setup:

 1. Run `ember g ember-cli-addon-docs` to set up the relevant deploy plugins (this is done automatically if you used `ember install` to install Addon Docs)
 2. Set [the `repository` field](https://docs.npmjs.com/files/package.json#repository) of your `package.json`.
 3. Commit any outstanding changes you've got on your current branch and push them to GitHub.
 4. Run `ember deploy production` and answer "yes" if prompted to create a `gh-pages` branch. **Note**: if your repo already has a `gh-pages` branch, you may want to manually archive the existing content there before deploying.

Once the deploy completes and GitHub has a moment to publish your pages site, if all went well you should see your addon's dummy app live at
<u>https://**[username]**.github.io/**[repo-name]**/**[current-branch-name]**</u>.

Now take a look at the `gh-pages` branch either locally or on GitHub. You should see a layout something like this:

```sh
├── 404.html
├── index.html
├── [current-branch-name]
│   ├── assets
│   ├── index.html
│   └── ...
└── versions.json
```

Let's break down what each of those items is doing.
 - `index.html` simply redirects from the root of your gh-pages site to `/latest` (more details on that below)
 - `404.html` contains [some smart redirect logic](https://github.com/rafrex/spa-github-pages) to keep you from having to use `locationType: 'hash'` in your dummy app
 - `versions.json` contains a manifest of the available versions of your documentation
 - `[current-branch-name]` contains all the files from your built docs app

If you were to make a change to your dummy app and run `ember deploy production` again right now, the entry for `[current-branch-name]` in `version.json` and the entire contents of the `[current-branch-name]` directory would be replaced with the updated version of your site. Next we'll talk about how to manage multiple versions of your documentation at once.

## Versioning Your Content

TODO write me
 - `/latest`
 - `/master`
 - `/<tag>`
 - `index.html` redirect

## Automating Deploys

TODO write me
- generating a key
- configuring the public key for Github
- configuring the private key for Travis
- setting up deployment in `.travis.yml`

## Customizing Deploys

TODO write me
- `AddonDocsConfig`
- `shouldUpdateLatest()`
   <!-- * This hook controls whether the 'latest' docs version alis will be updated
   * to point to the current build. By default, this will return true whenever
   * a deploy is occurring from a tagged commit.
   *
   * The default behavior can be overridden by setting the environment variable
   * ADDON_DOCS_UPDATE_LATEST to 'true' or 'false'.
   *
   * @return {boolean} Whether to update the 'latest' docs version alias. -->
- `getVersionPath()`
   <!-- * This hook sets the directory that this version will be deployed to,
   * typically either a tag (e.g. 'v1.2.3'), a branch name like 'master'
   * for continuously deploying docs that track a given branch, or nothing
   * at all to skip deploying.
   *
   * The default behavior can be overridden by setting the environment variable
   * ADDON_DOCS_VERSION_PATH to the desired location (or to '' to skip).
   *
   * @return {string} The target directory for this build's files in the deploy
   * branch -->
- `getVersionName()`

<!-- ## Deploy Plugins

When you first install Addon Docs (or when you run `ember g ember-cli-addon-docs`), we'll automatically add some deployment-related addons to your project:
 - [ember-cli-deploy](https://github.com/ember-cli-deploy/ember-cli-deploy), which orchestrates the process of deploying an app via an `ember deploy` command
 - [ember-cli-deploy-build](https://github.com/ember-cli-deploy-build), which automatically runs a build as part of your deployment
 - [ember-cli-deploy-git](https://github.com/ef4/ember-cli-deploy-git), which sets up a git branch as your deploy target
 - [ember-cli-deploy-git-ci](https://github.com/dfreeman/ember-cli-deploy-git-ci), which takes care of some of the details of deploying to GitHub Pages as part of your CI builds

Together, these plugins will allow you to run `ember deploy production` to build your docs site and push it to GitHub pages. -->

