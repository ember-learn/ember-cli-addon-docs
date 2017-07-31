module.exports = {
  plugins: ['node'],
  parserOptions: {
    sourceType: 'script',
  },
  env: {
    browser: false,
    node: true,
    es6: true
  },
  rules: {
    'node/no-unsupported-features': 'error'
  }
};
