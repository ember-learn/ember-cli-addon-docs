'use strict';

const fs = require('fs-extra');
const hostedGitInfo = require('hosted-git-info');
const parseGitConfig = require('parse-git-config');

function gitConfigUrl(configPath) {
  const options = configPath ? { path: configPath } : {};
  const config = parseGitConfig.sync(options);
  const originProp = Object.keys(config).find(key => /^remote/.test(key));

  return originProp ? config[originProp].url : '';
}

function repoFromPackage(packageJson) {
  const repo = packageJson.repository;
  return typeof repo === 'object' ? repo.url : repo;
}

module.exports = function updateDemoUrl(packageJsonPath, gitConfigPath) {
  const packageJson = fs.readJsonSync(packageJsonPath);
  const addonConfig = packageJson['ember-addon'] || {};
  const hasDemo = addonConfig.demoUrl;

  if (hasDemo) {
    return true;
  }

  const repo = repoFromPackage(packageJson) || gitConfigUrl(gitConfigPath);
  const gitInfo = hostedGitInfo.fromUrl(repo);

  if (gitInfo) {
    addonConfig.demoUrl = `https://${gitInfo.user}.github.io/${gitInfo.project}`;
    packageJson['ember-addon'] = addonConfig;

    fs.writeJSONSync(packageJsonPath, packageJson, {
      spaces: 2
    });

    return true;
  } else {
    return false;
  }
}
