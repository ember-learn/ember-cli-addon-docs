const Plugin = require('broccoli-plugin');
const symlinkOrCopy = require('symlink-or-copy');
const fs = require('fs-extra');

module.exports = class Bridge {
  constructor() {
    this._members = new Map();
  }

  fulfill(name, tree) {
    if (this._members.has(name)) {
      let existing = this._members.get(name);
      if (existing instanceof Placeholder) {
        existing.fulfill(tree);
      } else {
        throw new Error(`A tree named '${name}' was already registered with this Bridge instance.`);
      }
    } else {
      this._members.set(name, tree);
    }
  }

  placeholderFor(name) {
    if (this._members.has(name)) {
      return this._members.get(name);
    } else {
      let placeholder = new Placeholder(name);
      this._members.set(name, placeholder);
      return placeholder;
    }
  }
}

class Placeholder extends Plugin {
  constructor(name) {
    super([]);
    this.name;
    this._hasLinked = false;
  }

  fulfill(tree) {
    if (this._inputNodes.length) {
      throw new Error(`BroccoliBridge placeholder '${this.name}' was fulfilled more than once.`);
    }

    this._inputNodes.push(tree);
  }

  build() {
    if (!this._inputNodes.length) {
      throw new Error(`BroccoliBridge placeholder '${this.name}' was never fulfilled.`);
    }

    if (!this._hasLinked) {
      fs.removeSync(this.outputPath);
      symlinkOrCopy.sync(this.inputPaths[0], this.outputPath);
      this._hasLinked = true;
    }
  }
}
