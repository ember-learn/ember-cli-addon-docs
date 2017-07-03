'use strict';

const path = require('path');
const fs = require('fs-extra');

const CachingWriter = require('broccoli-caching-writer');
const { YUIDoc } = require('yuidocjs');
const Inflected = require('inflected');
const gitRepoVersion = require('git-repo-version');
const yuidocToJsonapi = require('yuidoc-to-jsonapi/lib/converter');

const compileDescriptions = require('../utils/compile-descriptions');
const versionDocuments = require('../utils/version-documents');

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
    let { project } = this;
    let version = gitRepoVersion(8, project.root);
    let document = this._generateYUIDoc(project, version);

    let { data } = yuidocToJsonapi(document);

    compileDescriptions(data);
    versionDocuments(data, project.name(), version);

    let baseDir = path.join(this.outputPath, this.destDir);
    for (let doc of data) {
      let dir = path.join(baseDir, version, Inflected.pluralize(doc.type));
      fs.ensureDirSync(dir);
      fs.writeJSONSync(path.join(dir, `${doc.id}.json`), { data: doc }, 'utf-8');
    }

    let projectDoc = generateProjectDocument(project.name(), version);
    fs.ensureDirSync(path.join(baseDir, 'projects'));
    fs.writeJSONSync(path.join(baseDir, 'projects', `${projectDoc.id}.json`), { data: projectDoc }, 'utf-8');
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

    for (let { line, message } of json.warnings) {
      project.ui.writeWarnLine(`${line}: ${message}`);
    }

    return json;
  }
};

function generateProjectDocument(name, version) {
  return {
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
  };
}
