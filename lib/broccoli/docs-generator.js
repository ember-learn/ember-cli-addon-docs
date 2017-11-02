'use strict';

const path = require('path');
const fs = require('fs-extra');

const CachingWriter = require('broccoli-caching-writer');
const YUIDoc = require('yuidocjs').YUIDoc;
const gitRepoVersion = require('git-repo-version');
const yuidocToJsonapi = require('yuidoc-to-jsonapi/lib/converter');

const compileDocDescriptions = require('../utils/compile-doc-descriptions');
const buildProjectVersionDocument = require('../utils/build-project-version-document');

module.exports = class DocsGenerator extends CachingWriter {
  constructor(inputNodes, options) {
    let defaults = {
      cacheInclude: [/\.js$/]
    };

    super(inputNodes, Object.assign(defaults, options));

    this.project = options.project;
    this.destDir = options.destDir;
  }

  build() {
    let project = this.project;
    let version = gitRepoVersion(8, project.root);
    let document = this._generateYUIDoc(project, version);

    let data = yuidocToJsonapi(document).data;
    compileDocDescriptions(data);

    let baseDir = path.join(this.outputPath, this.destDir);
    fs.ensureDirSync(path.join(baseDir, 'project-versions'));
    fs.ensureDirSync(path.join(baseDir, 'projects'));

    let projectVersionDoc = buildProjectVersionDocument(data, project.name(), version);
    fs.writeJSONSync(path.join(baseDir, 'project-versions', `${projectVersionDoc.data.id}.json`), projectVersionDoc, 'utf-8');

    let projectDoc = generateProjectDocument(project.name(), version);
    fs.writeJSONSync(path.join(baseDir, 'projects', `${projectDoc.data.id}.json`), projectDoc, 'utf-8');
  }

  _generateYUIDoc(project, version) {
    let json = new YUIDoc({
      quiet: true,
      writeJSON: false,
      paths: this.inputPaths,
      project: {
        name: project.name(),
        version: version,
      }
    }).run();

    for (let warning of json.warnings) {
      project.ui.writeWarnLine(`${warning.line}: ${warning.message}`);
    }

    return json;
  }
};

// Someday, assuming we get to versioned documentation independent of
// versioned guides, this may need to be managed external to the build.
function generateProjectDocument(name, version) {
  return {
    data: {
      type: 'project',
      id: name,
      attributes: {},
      relationships: {
        'project-versions': {
          data: [
            {
              type: 'project-version',
              id: `${name}-${version}`
            }
          ]
        }
      }
    }
  };
}
