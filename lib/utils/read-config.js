'use strict';

module.exports = function readConfig(project) {
  let config = null;
  try {
    config = require(`${project.root}/config/addon-docs`);
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }
  }

  return Object.assign({}, DEFAULTS, config);
}

// Bare minimum to ensure the expected keys exist with appropriate types of values
const DEFAULTS = {
  persist: [],

  shouldDeploy() {
    return true;
  },

  deployDirectory() {
    // Just deploy to the root
  }
};
