module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    requireConfigFile: false
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
    'no-unused-vars': ["error", { "args": "none" }],
    'no-console': ["error", { allow: ["warn", "error"] }],

    // ember-keyboard uses events
    'ember/no-on-calls-in-components': 'off',
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2017
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['n']
    },
  ]
};
