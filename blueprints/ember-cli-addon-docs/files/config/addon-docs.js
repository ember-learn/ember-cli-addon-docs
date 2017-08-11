/* eslint-env node */
'use strict';

const AddonDocsConfig = require('ember-cli-addon-docs/lib/config');

module.exports = class extends AddonDocsConfig {
  /*
    An array of paths or globs that should be kept across deploys, relative to
    the target deploy directory. Everything in that directory will be cleared
    before the new version is committed. See also the `deployDirectory()` hook.
  */
  get preservePaths() {
    return super.preservePaths;
  }

  /*
    Return a boolean indicating whether or not the current deploy should
    actually run. The `info` parameter contains details about the most recent
    git commit. Note that you can also access any configured environment
    variables via `process.ENV`.

    info.branch         => the current branch
    info.sha            => the current sha
    info.abbreviatedSha => the first 10 chars of the current sha
    info.tag            => the tag for the current sha or `null` if none exists
    info.committer      => the committer for the current sha
    info.committerDate  => the commit date for the current sha
    info.author         => the author for the current sha
    info.authorDate     => the authored date for the current sha
    info.commitMessage  => the commit message for the current sha
  */
  shouldDeploy(info) {
    return super.shouldDeploy(info);
  }

  /*
    Return a string indicating a subdirectory in the gh-pages branch you want
    to deploy to, or nothing to deploy to the root. This hook receives the same
    info object as `shouldDeploy` above.
  */
  deployDirectory(info) {
    return super.deployDirectory(info);
  }
}
