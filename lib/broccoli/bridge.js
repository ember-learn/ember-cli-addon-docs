module.exports = class Bridge {
  constructor() {
    this._members = new Map();
  }

  register({ name, tree, dependencies = [] }) {
    if (this._members.has(name)) {
      throw new Error(`Duplicate tree '${name}' in bridge.`);
    }

    let newMember = new Member(name, tree, dependencies);

    for (let existingMember of this._members.values()) {
      newMember.link(existingMember);
      existingMember.link(newMember);
    }

    this._members.set(name, newMember);
    this._patchBuild(name, tree);
  }

  _patchBuild(name, tree) {
    if (typeof tree.build !== 'function') return;

    let { dependencies } = this._members.get(name);
    let oldBuild = tree.build.bind(tree);
    tree.build = () => {
      if (dependencies.size > 0) {
        throw new Error(`Tree '${name}' is missing dependencies: ${[...dependencies].join(',')}`);
      }

      return oldBuild();
    };
  }
}

class Member {
  constructor(name, tree, dependencies) {
    this.name = name;
    this.tree = tree;
    this.dependencies = new Set(dependencies);
  }

  needs(dep) {
    return this.dependencies.has(dep.name);
  }

  link(dep) {
    if (this.needs(dep)) {
      this.dependencies.delete(dep.name);
      this.tree._inputNodes.push(dep.tree);
    }
  }
}
