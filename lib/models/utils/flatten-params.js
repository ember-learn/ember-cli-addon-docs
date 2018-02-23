'use strict';

const _ = require('lodash');

module.exports = function flattenParams(params, prefix) {
  return _.flatMapDeep(params, (param) => {
    let newParam = {};

    newParam.name = prefix ? `${prefix}.${param.name}` : param.name;
    newParam.type = param.type;
    newParam.description = param.description;

    return param.props ? [newParam, flattenParams(param.props, newParam.name)] : newParam;
  });
}
