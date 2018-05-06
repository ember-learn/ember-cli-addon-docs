'use strict';

module.exports = function readConfig(project) {
  let configPath = `${project.root}/config/addon-docs`;

  let ConfigClass;
  try {
    ConfigClass = require(configPath);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' && error.message.indexOf(configPath) !== -1) {
      ConfigClass = require('../config');
    } else {
      throw error;
    }
  }

  return new ConfigClass(project);
}
