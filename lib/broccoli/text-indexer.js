'use strict';

const Writer = require('broccoli-caching-writer');
const fs = require('fs-extra');
const path = require('path');

module.exports = class SearchIndexCompiler extends Writer {
  constructor(input, options) {
    super([input]);
    this.outputFile = options.outputFile;
  }

  build() {
    let output = {};
    for (let filePath of this.listFiles()) {
      if (/\.text-index$/.test(filePath)) {
        let relativePath = filePath.replace(this.inputPaths[0], '');
        output[relativePath] = fs.readFileSync(filePath, 'utf-8');
      }
    }
    let outputFile = path.join(this.outputPath, this.outputFile);

    fs.ensureDirSync(path.dirname(outputFile));
    fs.writeJsonSync(outputFile, output, { space: 2 });
  }
}
