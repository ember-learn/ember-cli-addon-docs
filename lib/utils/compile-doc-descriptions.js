'use strict';

const compileMarkdown = require('addon-docs-shared/compile-markdown');

module.exports = function compileDescriptions(docs) {
  for (let doc of docs) {
    if (doc.type === 'module') {
      compileDescription([doc.attributes]);
      compileDescription(doc.attributes.functions);
      compileDescription(doc.attributes.variables);
      compileDescription(doc.attributes.events);
    } else if (doc.type === 'class') {
      compileDescription([doc.attributes]);
      compileDescription(doc.attributes.fields);
      compileDescription(doc.attributes.methods);
    } else if (doc.type === 'component') {
      compileDescription([doc.attributes]);
      compileDescription(doc.attributes.arguments);
      compileDescription(doc.attributes.fields);
      compileDescription(doc.attributes.methods);
    }
  }
}

function compileDescription(objects) {
  if (!objects) { return; }

  for (let object of objects) {
    if (object.description) {
      object.description = compileMarkdown(object.description);
    }
  }
}
