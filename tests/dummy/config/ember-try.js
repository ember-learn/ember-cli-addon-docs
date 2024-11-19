'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    usePnpm: true,
    scenarios: [
      {
        name: 'ember-lts-4.4',
        npm: {
          devDependencies: {
            '@ember-data/adapter': '~4.11.3',
            '@ember-data/model': '~4.11.3',
            '@ember-data/serializer': '~4.11.3',
            '@ember-data/store': '~4.11.3',
            '@ember/test-helpers': '^2.5.0',
            'ember-cli-babel': '^7.26.11',
            'ember-data': '~4.11.3',
            'ember-source': '~4.4.0',
          },
        },
      },
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            '@ember-data/adapter': '~4.11.3',
            '@ember-data/model': '~4.11.3',
            '@ember-data/serializer': '~4.11.3',
            '@ember-data/store': '~4.11.3',
            '@ember/test-helpers': '^2.5.0',
            'ember-cli-babel': '^7.26.11',
            'ember-data': '~4.11.3',
            'ember-source': '~4.8.0',
          },
        },
      },
      {
        name: 'ember-lts-4.12',
        npm: {
          devDependencies: {
            '@ember-data/adapter': '~4.11.3',
            '@ember-data/model': '~4.11.3',
            '@ember-data/serializer': '~4.11.3',
            '@ember-data/store': '~4.11.3',
            '@ember/test-helpers': '^2.5.0',
            'ember-cli-babel': '^7.26.11',
            'ember-data': '~4.11.3',
            'ember-source': '~4.12.0',
          },
        },
      },
      {
        name: 'ember-lts-5.4',
        npm: {
          devDependencies: {
            'ember-data': '~5.3.8',
            'ember-source': '~5.4.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta'),
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('canary'),
          },
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
