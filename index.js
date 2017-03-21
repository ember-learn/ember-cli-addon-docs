/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-cli-addon-docs',

  includedCommands() {
    return {
      'generate-docs': require('./lib/commands/generate-docs')
    };
  }
};
