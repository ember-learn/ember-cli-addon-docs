'use strict';

module.exports = function addonDocsDeployEnv(env) {
  env.pipeline = env.pipeline || {};

  env.pipeline.alias = env.pipeline.alias || {};
  env.pipeline.alias.build = env.pipeline.alias.build || {};
  env.pipeline.alias.build.as = env.pipeline.alias.build.as || ['build'];
  env.pipeline.alias.build.as.push('build-addon-docs-latest');

  env.pipeline.runOrder = env.pipeline.runOrder || {};
  env.pipeline.runOrder['ember-cli-addon-docs'] = { after: ['build'], before: ['build-addon-docs-latest'] };
};
