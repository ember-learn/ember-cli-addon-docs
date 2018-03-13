module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
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
  }
};
