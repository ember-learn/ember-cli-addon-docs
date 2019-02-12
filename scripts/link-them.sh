#!/bin/bash

# Copied from https://github.com/ef4/ember-auto-import/blob/master/scripts/link-them.sh

set -e

##################################################
#
# addon-docs-shared setup
#
#
# Link it, so its packages can be used in node & ember
mkdir -p ./node_modules
pushd ./node_modules > /dev/null
rm -rf ./addon-docs-shared
ln -s ../addon-docs-shared ./addon-docs-shared
popd > /dev/null

# Give it a node_modules directory and a .bin link, so it can find its dependencies
mkdir -p ./addon-docs-shared/node_modules
rm -rf ./addon-docs-shared/node_modules/.bin
ln -s ./node_modules/.bin ./addon-docs-shared/node_modules/.bin
#
##################################################

# All packages get a node_modules directory and a .bin link
for package in "new-addon"; do
    mkdir -p ./test-apps/$package/node_modules
    pushd ./test-apps/$package/node_modules > /dev/null
    rm -rf .bin
    ln -s ../../../node_modules/.bin .bin
    popd > /dev/null
done

# These packages get to depend on ember-cli-addon-docs
for package in "new-addon"; do
    pushd ./test-apps/$package/node_modules > /dev/null
    rm -rf ./ember-cli-addon-docs
    ln -s ../../.. ./ember-cli-addon-docs
    popd > /dev/null
done
