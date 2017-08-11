'use strict';

module.exports = function readConfig(project) {
  let ConfigClass;
  try {
    ConfigClass = require(`${project.root}/config/addon-docs`);
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    } else {
      ConfigClass = require('ember-cli-addon-docs/lib/config');
    }
  }

  return new ConfigClass();
}
