'use strict';

const JSONAPISerializer = require('json-api-serializer');

const Serializer = new JSONAPISerializer();

Serializer.register('project', {
  relationships: {
    modules: { type: 'module' }
  }
});

Serializer.register('module', {
  relationships: {
    classes: { type: 'class' },
    components: { type: 'component' }
  }
});

Serializer.register('class', {
  relationships: {
    parentClass: { type: 'class' }
  }
});

Serializer.register('component', {
  relationships: {
    parentClass: { type: 'component' }
  }
});

module.exports = Serializer;
