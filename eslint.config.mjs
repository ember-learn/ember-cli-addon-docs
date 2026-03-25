/**
 * Debugging:
 *   https://eslint.org/docs/latest/use/configure/debug
 *  ----------------------------------------------------
 *
 *   Print a file's calculated configuration
 *
 *     npx eslint --print-config path/to/file.js
 *
 *   Inspecting the config
 *
 *     npx eslint --inspect-config
 *
 */
import globals from 'globals';
import js from '@eslint/js';

import ember from 'eslint-plugin-ember/recommended';
import prettier from 'eslint-plugin-prettier/recommended';
import qunit from 'eslint-plugin-qunit';
import n from 'eslint-plugin-n';

import babelParser from '@babel/eslint-parser';

const esmParserOptions = {
  ecmaFeatures: { modules: true },
  ecmaVersion: 'latest',
  requireConfigFile: false,
  babelOptions: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
    ],
  },
};

export default [
  js.configs.recommended,
  prettier,
  ember.configs.base,
  ember.configs.gjs,
  /**
   * Ignores must be in their own object
   * https://eslint.org/docs/latest/use/configure/ignore
   */
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      'test-apps/',
      'tmp/',
      '!**/.*',
    ],
  },
  /**
   * https://eslint.org/docs/latest/use/configure/configuration-files#configuring-linter-options
   */
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
    },
  },
  {
    files: ['**/*.{js,gjs}'],
    languageOptions: {
      parserOptions: esmParserOptions,
      globals: {
        ...globals.browser,
        server: true,
      },
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'ember/no-incorrect-calls-with-inline-anonymous-functions': 'off',
      'ember/require-return-from-computed': 'off',
      'ember/no-jquery': 'error',

      // TODO: enable these rules
      'ember/classic-decorator-no-classic-methods': 'off',
      'ember/no-classic-classes': 'off',
      'ember/no-classic-components': 'off',
      'ember/no-component-lifecycle-hooks': 'off',
      'ember/no-computed-properties-in-native-classes': 'off',
      'ember/no-private-routing-service': 'off',
      'ember/no-runloop': 'off',
    },
  },
  {
    files: ['tests/**/*-test.{js,gjs}'],
    plugins: {
      qunit,
    },
  },
  /**
   * CJS node files
   */
  {
    files: [
      '**/*.cjs',
      'blueprints/*/index.js',
      'config/**/*.js',
      'lib/**/*.js',
      'sandbox/index.js',
      'tests/dummy/config/**/*.js',
      'testem.js',
      'testem*.js',
      '.prettierrc.js',
      '.stylelintrc.js',
      '.template-lintrc.js',
      '**/addon-docs.js',
      'ember-cli-build.js',
      'index.js',
    ],
    plugins: {
      n,
    },

    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
  },
  /**
   * Node test files (mocha)
   */
  {
    files: ['tests-node/**/*.js'],
    plugins: {
      n,
    },

    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
    },
  },
  /**
   * ESM node files
   */
  {
    files: ['**/*.mjs'],
    plugins: {
      n,
    },

    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: esmParserOptions,
      globals: {
        ...globals.node,
      },
    },
  },
];
