'use strict';

const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    usePnpm: true,
    scenarios: [
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            '@ember/test-helpers': '^2.5.0',
            '@ember/test-waiters': '^3.1.0',
            'ember-cli-babel': '^7.26.11',
            'ember-source': '~4.8.0',
          },
        },
      },
      {
        name: 'ember-lts-4.12',
        npm: {
          devDependencies: {
            '@ember/test-helpers': '^2.5.0',
            '@ember/test-waiters': '^3.1.0',
            'ember-cli-babel': '^7.26.11',
            'ember-source': '~4.12.0',
          },
        },
      },
      {
        name: 'ember-lts-5.4',
        npm: {
          devDependencies: {
            'ember-source': '~5.4.0',
          },
        },
      },
      {
        name: 'ember-lts-5.8',
        npm: {
          devDependencies: {
            'ember-source': '~5.8.0',
          },
        },
      },
      {
        name: 'ember-lts-6.12',
        npm: {
          devDependencies: {
            'ember-source': '~6.12.0',
          },
        },
      },
      // The release, beta and canary channels are ember-source 7+, which is a v2
      // addon that can only be built with Vite/Embroider. The classic ember-cli
      // build used by this addon can't run them, so they are not tested here.
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
