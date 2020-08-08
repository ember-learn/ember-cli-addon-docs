'use strict';

module.exports = {
  globals: {
    server: true
  },
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    'no-unused-vars': ['error', { args: 'none' }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'ember/no-incorrect-calls-with-inline-anonymous-functions': 'off',
    'ember/require-return-from-computed': 'off',
    'ember/no-jquery': 'error',
    // ember-keyboard uses events
    'ember/no-on-calls-in-components': 'off',

    // TODO: enable these rules
    'ember/no-get': 'off',
    'ember/no-private-routing-service': 'off'
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.prettierrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'addon/styles/tailwind.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/**/*.js',
        'tests/dummy/config/**/*.js',
        'tests-node/**/*.js'
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script'
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended']
    },

    // node test files
    {
      globals: {
        describe: true,
        it: true,
        beforeEach: true,
        afterEach: true
      },
      files: ['tests-node/**/*.js'],
      rules: {
        'node/no-unpublished-require': 'off'
      }
    }
  ]
};
