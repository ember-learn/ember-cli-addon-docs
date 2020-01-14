'use strict';

const HistorySupportMiddleware = require('ember-cli/lib/tasks/server/middleware/history-support');

module.exports = class StagedVersionsMiddleware {
  constructor(project, userConfig) {
    this.project = project;
    this.userConfig = userConfig;
  }

  attach(config) {
    let rootUrl = this.userConfig._getNormalizedRootUrl();
    let updatedConfig = Object.assign({}, config, {
      options: Object.assign({}, config.options, {
        rootURL: rootUrl ? `/${rootUrl}/` : '/'
      })
    });

    new HistorySupportMiddleware(this.project).addMiddleware(updatedConfig);
  }
};
