const fs = require('fs-extra');
const path = require('path');

module.exports = function maybeMigrateSiteFormat(context) {
  return shouldMigrate(context).then(weShould => {
    if (weShould) {
      return migrateSiteFormat(context);
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

function migrateSiteFormat(context) {
    let stagingDirectory = context.addonDocs.stagingDirectory;
    let versionedApps = discoverLegacyVersionedApps(stagingDirectory);

    moveVersionedApps(stagingDirectory, versionedApps);
    moveLatestToRoot(stagingDirectory);
    rewriteIndexHTMLs(stagingDirectory);
    rewriteVersionsJSON(stagingDirectory);
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
}

function rewriteIndexHTMLs(stagingDirectory){
    fs.readdirSync(path.join(stagingDirectory, 'versions')).forEach(appName => {
        rewriteIndexHTML(path.join(stagingDirectory, 'versions', appName, 'index.html'), appName, 'versions/' + appName);
    })
    rewriteIndexHTML(path.join(stagingDirectory, 'index.html'), 'latest', '');
}

function rewriteIndexHTML(filename, oldPath, newPath){
    //TODO
}

function rewriteVersionsJSON(stagingDirectory){
    //TODO
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
