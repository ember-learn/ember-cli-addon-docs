# Deploying

Deploying your documentation site can involve a lot of moving parts, but Ember CLI Addon Docs aims to streamline as much of the process as possible by providing a set of out-of-the-box conventions for deploying to GitHub Pages.

Once everything is set up, you'll be able to visit <u>https://**[user]**.github.io/**[repo]**</u> to see the docs for the latest release of your addon, and your CI builds will automatically keep it up to date.

- [Deployment Using `ember-cli-deploy`](#deployment-using-ember-cli-deploy)
- [Versioning Your Content](#versioning-your-content)
- [Automating Deploys](#automating-deploys)
- [Customizing Deploys](#customizing-deploys)
- [Removing Deployed Versions](#removing-deployed-versions)

## Deployment Using `ember-cli-deploy`

To deploy your docs site to GitHub pages, you'll need to go through a few steps of first-time setup:

 1. Run `ember g ember-cli-addon-docs` to set up the relevant deploy plugins (this is done automatically if you used `ember install` to install Addon Docs)
 2. Set [the `repository` field](https://docs.npmjs.com/files/package.json#repository) of your `package.json`.
 3. Commit any outstanding changes you've got on your current branch and push them to GitHub.
 4. Run `ember deploy production` and answer "yes" if prompted to create a `gh-pages` branch. **Note**: if your repo already has a `gh-pages` branch, you may want to manually archive the existing content there before deploying.

Once the deploy completes and GitHub has a moment to publish your pages site, if all went well you should see your addon's dummy app live at
<u>https://**[user]**.github.io/**[repo]**/**[current-branch]**</u>.

Now take a look at the `gh-pages` branch either locally or on GitHub. You should see a layout something like this:

```sh
├── 404.html
├── index.html
├── [current-branch]
│   ├── assets
│   ├── index.html
│   └── ...
└── versions.json
```

Let's break down what each of those items is doing.
 - `index.html` simply redirects from the root of your gh-pages site to `/latest` (more details on that [below](#tag-deploys))
 - `404.html` contains [some smart redirect logic](https://github.com/rafrex/spa-github-pages) to keep you from having to use `locationType: 'hash'` in your dummy app
 - `versions.json` contains a manifest of the available versions of your documentation
 - `[current-branch]` contains all the files from your built docs app

If you were to make a change to your dummy app and run `ember deploy production` again right now, the entry for `[current-branch]` in `version.json` and the entire contents of the `[current-branch]` directory would be replaced with the updated version of your site. Next we'll talk about how to manage keeping published documentation around for multiple versions of your addon.

## Versioning Your Content

Whenever you deploy your documentation site with Addon Docs, it places the compiled application in a subdirectory based on the current state of your git repository. All of this behavior [is customizable](#customizing-deploys), but we expect the out-of-the-box configuration should be a good place to get started.

### Tag Deploys

When you run `ember deploy` at a commit that has a git tag associated with it, the app will wind up in a directory named after that tag. For example, if you've just published version 1.2.3 of your addon (creating tag `v1.2.3` in your git repository), your deployed site will be available at <u>https://**[user]**.github.io/**[repo]**/v1.2.3</u>.

By default, deploying from a tagged commit also places a copy of your app under a special directory called `/latest`. As mentioned above, the `index.html` that Addon Docs sets up at the root redirects to `/latest`, so <u>https://**[user]**.github.io/**[repo]**</u> will always bring developers to the documentation for the most recent stable release of your addon.

Note that this only applies to non-prerelease tags, so `v1.2.3` would update `/latest`, but `v2.0.0-beta.1` would not. Check out the documentation for [node-semver](https://github.com/npm/node-semver) for the exact details on what constitutes a prerelease version.

### Branch Deploys

When you deploy from a commit at the head of a branch that _doesn't_ have a tag associated with it, the compiled app will land in a folder named after that branch, as in our "getting started" example above. Unlike tag deploys, branch deploys will never automatically update `/latest`.

The main use case for branch deploys is tracking development work since your last stable release. If you run `ember deploy` after successful builds on `master`, you'll always have documentation available for the bleeding edge of your addon's features. Since branch deploys don't update `/latest`, though, developers looking at your docs will still hit your most recent stable tag by default, so there won't be any confusion about things that have drifted since the last release.

## Automating Deploys

While you _can_ just run `ember deploy production` yourself after every commit to `master` and each new release of your addon, you can simplify life a bit by automating the process as part of your CI setup. The process described here details the configuration for [Travis CI](https://travis-ci.org/), which Ember addons are configured to work with out of the box, but the setup should be very similar for other CI providers.

### Generate a Deploy Key

The first step you'll need to take is to generate a _deploy key_. This is a special SSH key that will only have write access to a single git repository: the one for your addon.

To generate the public/private key pair on macOS or Linux, you'll use the [`ssh-keygen`](https://www.freebsd.org/cgi/man.cgi?query=ssh-keygen&sektion=1&manpath=OpenBSD+3.9) command line tool. On Windows, you can use [PuTTYGen](https://www.ssh.com/ssh/putty/windows/puttygen) instead.

```sh
ssh-keygen -t rsa -b 4096 -N '' -f deploy_key
```

This will produce two files in your current directory: `deploy_key` (the private key) and `deploy_key.pub` (the public key). **Do not commit these files to your repository.**

### Configure the Public Key with GitHub

On GitHub, open the page for your repo and navigate to Settings -> Deploy keys (or just directly visit <u>https://github.com/**[user]**/**[repo]**/settings/keys)</u> and click "Add deploy key".

Enter a name for your key and then paste the contents of your public key (`id_rsa.pub`) into the big textarea. Make sure you check the **Allow write access** box, then click "Add key" and you're all set.

### Configure the Private Key with Travis

Now that GitHub knows that this public key is allowed to push commits to your repo, we need to set up Travis to use the corresponding private key. Because the keyfile contains newlines, the easiest way to do this is using the [Travis CLI](https://github.com/travis-ci/travis.rb#installation) tool.

```sh
travis env set -- DEPLOY_KEY "$(cat deploy_key)"
```

### Deploy After Successful Builds

All that's left now is to set up Travis to run your deploys for you. The simplest way to do this is to add this `after_success` script to the end of your `.travis.yml`:

```yml
after_success:
  - if [[ ($TRAVIS_BRANCH == master || -n $TRAVIS_TAG) && $EMBER_TRY_SCENARIO == ember-default ]]; then
      node_modules/.bin/ember deploy production;
    fi
```

Alternatively, if you're using Travis's [build stages system](https://docs.travis-ci.com/user/build-stages/), you can set up the deploy as a conditional stage at the end of your build:

```yml
stages:
  # ...your other build stages...
  - name: deploy
    if: (branch = master or tag is present) and type = push
    script: node_modules/.bin/ember deploy production
```

## Customizing Deploys

TODO write me
- `AddonDocsConfig`
- `shouldUpdateLatest()`
   <!-- * This hook controls whether the 'latest' docs version alias will be updated
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

## Removing Deployed Versions

TODO write me
