'use strict';

const compileMarkdown = require('./compile-markdown');

module.exports = function compileDescriptions(docs) {
  for (let doc of docs) {
    compileDescription([doc.attributes]);
    compileDescription(doc.attributes.properties);
    compileDescription(doc.attributes.methods);
    compileDescription(doc.attributes.events);
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
