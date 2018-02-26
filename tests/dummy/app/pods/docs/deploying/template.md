# Deploying

Deploying your documentation site can involve a lot of moving parts, but Ember CLI Addon Docs aims to streamline as much of the process as possible by providing a set of out-of-the-box conventions for deploying to GitHub Pages.

- [Deployment Using `ember-cli-deploy`](#deployment-using-ember-cli-deploy)
- [Versioning Your Content](#versioning-your-content)
- [Automating Deploys](#automating-deploys)
- [Customizing Deploys](#customizing-deploys)

## Deployment Using `ember-cli-deploy`

When you first install Addon Docs (or when you run `ember g ember-cli-addon-docs`), we'll automatically add some deployment-related addons to your project:
 - [ember-cli-deploy](https://github.com/ember-cli-deploy/ember-cli-deploy), which orchestrates the process of deploying an app via an `ember deploy` command
 - [ember-cli-deploy-build](https://github.com/ember-cli-deploy-build), which automatically runs a build as part of your deployment
 - [ember-cli-deploy-git](https://github.com/ef4/ember-cli-deploy-git), which sets up a git branch as your deploy target
 - [ember-cli-deploy-git-ci](https://github.com/dfreeman/ember-cli-deploy-git-ci), which takes care of some of the details of deploying to GitHub Pages as part of your CI builds

Together, these plugins will allow you to run `ember deploy production` to build your docs site and push it to GitHub pages.

## Versioning Your Content

## Automating Deploys

## Customizing Deploys
