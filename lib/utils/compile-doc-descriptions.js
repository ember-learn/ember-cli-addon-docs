'use strict';

const compileMarkdown = require('./compile-markdown');

module.exports = function compileDescriptions(docs) {
  for (let doc of docs) {
    compileDescription(doc, [doc.attributes]);
    compileDescription(doc, doc.attributes.properties);
    compileDescription(doc, doc.attributes.methods);
    compileDescription(doc, doc.attributes.events);
  }
}

function compileDescription(doc, objects) {
  if (!objects) { return; }

  for (let object of objects) {
    if (object.description) {
      object.description = compileMarkdown(object.description, { file: doc.attributes.file });
    }
  }
}
