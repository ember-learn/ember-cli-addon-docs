const fs = require('fs-extra');
const path = require('path');
const { JSDOM } = require('jsdom');

module.exports = function maybeMigrateSiteFormat(context, plugin) {
  return shouldMigrate(context).then(weShould => {
    if (weShould) {
      return migrateSiteFormat(context, plugin);
    }
  })
}

function shouldMigrate(context) {
  // we should migrate if there a `versions.json` file but no `versions` folder
  return directoryExists(path.join(context.gitDeploy.worktreePath, "versions"))
  .then(hasVersions => {
    if (hasVersions){
      return false;
    }
    return fs.stat(path.join(context.gitDeploy.worktreePath, "versions.json"))
      .then(() => true, () => false);
    });
}

function migrateSiteFormat(context, plugin) {
    let stagingDirectory = context.addonDocs.stagingDirectory;
    let versionedApps = discoverLegacyVersionedApps(stagingDirectory);

    moveVersionedApps(stagingDirectory, versionedApps);
    moveLatestToRoot(stagingDirectory);
    rewriteIndexHTMLs(stagingDirectory);
    rewriteVersionsJSON(stagingDirectory, plugin);
}

function moveVersionedApps(stagingDirectory, versionedApps){
    fs.mkdirSync(path.join(stagingDirectory, "versions"));
    versionedApps.forEach(name => {
      fs.renameSync(path.join(stagingDirectory, name), path.join(stagingDirectory, 'versions', name));      
    });
}

function moveLatestToRoot(stagingDirectory){
    let latestContents;
    try {
      latestContents = fs.readdirSync(path.join(stagingDirectory, 'versions', 'latest'));
    } catch (err){
      if (err.code !== 'ENOENT') {
        throw err;
      }
      latestContents = [];
    }
    latestContents.forEach(name => {
      fs.renameSync(path.join(stagingDirectory, 'versions', 'latest', name), path.join(stagingDirectory, name));
    });
    fs.rmdirSync(path.join(stagingDirectory, 'versions', 'latest'));
}

function rewriteIndexHTMLs(stagingDirectory){
    fs.readdirSync(path.join(stagingDirectory, 'versions')).forEach(appName => {
        rewriteIndexHTML(path.join(stagingDirectory, 'versions', appName, 'index.html'), appName, 'versions/' + appName);
    })
    rewriteIndexHTML(path.join(stagingDirectory, 'index.html'), 'latest', '');
}

function rewriteIndexHTML(filename, oldPath, newPath){
    let indexPath = `${filename}`;
    let contents = fs.readFileSync(indexPath, 'utf-8');
    let updated = contents.replace(new RegExp(`/ember-cli-addon-docs/${oldPath}/assets`, 'g'), path.join('/ember-cli-addon-docs', newPath, 'assets'));
    let doc = new JSDOM(contents).window.document;
    let oldMeta = [...doc.querySelectorAll('meta')].find(m => /config\/environment$/.test(m.name)).content;
    let config = JSON.parse(decodeURIComponent(oldMeta));
    let newRootURL = config.rootURL.replace(`/${oldPath}/`, `/${newPath}` + (newPath ? '/' : ''));
    config.rootURL = newRootURL;
    if (config['ember-cli-addon-docs'] && config['ember-cli-addon-docs'].deployVersion) {
      config['ember-cli-addon-docs'].deployVersion.path = newPath; 
    }
    let updatedMeta = encodeURIComponent(JSON.stringify(config));
    updated = updated.replace(oldMeta, updatedMeta);
    fs.writeFileSync(indexPath, updated);
}

function rewriteVersionsJSON(stagingDirectory){
  let versionsFile = `${stagingDirectory}/versions.json`;
  let versions = require(versionsFile);
  
  Object.keys(versions).forEach(key => {
    let entry = versions[key];
    let newPath = path.join('versions', entry.path);
    if (entry.path === 'latest') {
      newPath = '';
    }
    entry.oldPath = entry.path;
    entry.path = newPath;
  });
  fs.writeJSONSync(versionsFile, versions, { spaces: 2 });
}



function discoverLegacyVersionedApps(stagingDirectory){
    return fs.readdirSync(stagingDirectory).filter(name => {
      // a versioned app is a directory that contains index.html
      let dir = path.join(stagingDirectory, name);
      if (!fs.statSync(dir).isDirectory()) {
        return false;
      }
      try {
        fs.statSync(path.join(dir, "index.html"));
        return true;
      } catch(err) {
        if (err.code !== 'ENOENT') {
          throw err;
        }
        return false;
      }
    });
}

function directoryExists(dir){
    return fs.stat(dir)
      .then(stats => {
        return stats.isDirectory();
      }, err => {
        return false;
      });
  }
