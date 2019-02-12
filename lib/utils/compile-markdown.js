const esmRequire = require("esm")(module, { cjs: true });
module.exports = esmRequire('../../addon/utils/compile-markdown').default;
