// TODO: this is currently only being used by ESLint via @babel/eslint-parser.
// When https://github.com/babel/ember-cli-babel/issues/418 gets resolved,
// we can switch to using it throughout properly

const { buildEmberPlugins } = require('ember-cli-babel');

module.exports = {
  plugins: [...buildEmberPlugins(__dirname)],
};
