'use strict';

module.exports = {
  globals: {
    server: true,
  },
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    'no-unused-vars': ['error', { args: 'none' }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'ember/no-incorrect-calls-with-inline-anonymous-functions': 'off',
    'ember/require-return-from-computed': 'off',
    'ember/no-jquery': 'error',

    // TODO: enable these rules
    'ember/classic-decorator-no-classic-methods': 'off',
    'ember/no-actions-hash': 'off',
    'ember/no-classic-classes': 'off',
    'ember/no-classic-components': 'off',
    'ember/no-component-lifecycle-hooks': 'off',
    'ember/no-computed-properties-in-native-classes': 'off',
    'ember/no-get': 'off',
    'ember/no-private-routing-service': 'off',
    'ember/no-string-prototype-extensions': 'off',
    'ember/require-tagless-components': 'off',
  },
  overrides: [
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './index.js',
        './testem.js',
        './addon/styles/tailwind.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './lib/**/*.js',
        './tests/dummy/config/**/*.js',
        './tests-node/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
    },
    // node test files
    {
      globals: {
        describe: true,
        it: true,
        beforeEach: true,
        afterEach: true,
      },
      files: ['tests-node/**/*.js'],
      rules: {
        'node/no-unpublished-require': 'off',
      },
    },
    {
      // Test files:
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
    },
  ],
};
