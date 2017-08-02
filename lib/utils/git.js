'use strict';

const execa = require('execa');

exports.getCurrentTag = function getCurrentTag() {
  return git(['describe', '--tags', '--exact-match']);
};

exports.getCurrentBranch = function getCurrentBranch() {
  return git(['symbolic-ref', '--short', 'HEAD']);
};

function git(args) {
  return execa('git', args)
    .then((result) => result.stdout.trim())
    .catch(() => null);
}
