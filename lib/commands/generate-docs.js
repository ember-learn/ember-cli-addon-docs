'use strict';

const path = require('path');
const fs = require('fs-extra');

const Command = require('ember-cli/lib/models/command');
const { YUIDoc } = require('yuidocjs');
const gitRepoVersion = require('git-repo-version');
const Inflected = require('inflected');

const transformYuiObject = require('ember-jsonapi-docs-generator/lib/transform-yui-object');
const markup = require('ember-jsonapi-docs-generator/lib/markup');

module.exports = Command.extend({
  name: 'generate-docs',
  description: 'Generate JSON documentation data for this project.',
  works: 'insideProject',

  run() {
    let { project } = this;
    let version = gitRepoVersion(8, project.root);
    let data = this._generateYUIDoc(project, version);

    return transformYuiObject([{ data, version }], project.name())
      .then(markup)
      .then(({ data }) => {
        let baseDir = path.join(project.root, 'public', 'docs');
        for (let doc of data) {
          let dir = path.join(baseDir, version, Inflected.pluralize(doc.type));
          fs.ensureDirSync(dir);
          fs.writeJSONSync(path.join(dir, `${doc.id}.json`), { data: doc }, 'utf-8');
        }

        let projectsDir = path.join(baseDir, 'projects');
        let projectData = this._generateProjectData(project, version);
        fs.ensureDirSync(projectsDir);
        fs.writeJSONSync(path.join(projectsDir, `${project.name()}.json`), projectData, 'utf-8');
      });
  },

  _generateYUIDoc(project, version) {
    let json = new YUIDoc({
      quiet: true,
      writeJSON: false,
      paths: ['./addon'],
      project: {
        name: project.name(),
        version: version,
      }
    }).run();

    for (let { line, message } of json.warnings) {
      this.ui.writeWarnLine(`${line}: ${message}`);
    }

    return json;
  },

  _generateProjectData(project, version) {
    return {
      data: {
        type: 'project',
        id: project.name(),
        attributes: {},
        relationships: {
          'project-versions': {
            data: [
              {
                type: 'project-version',
                id: `${project.name()}-${version}`
              }
            ]
          }
        }
      }
    };
  }
});
