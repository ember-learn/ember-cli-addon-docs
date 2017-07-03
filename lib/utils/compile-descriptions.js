const marked = require('marked');
const highlightjs = require('highlightjs');

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
      object.description = marked(object.description, { highlight });
    }
  }
}

function highlight(code, lang) {
  return highlightjs.highlight(lang, code).value;
}
