const _ = require('lodash');
const RESOLVED_TYPES = [
  'components',
  'helpers',
  'controllers',
  'mixins',
  'models',
  'services',
  'classes'
];

module.exports = class NavigationIndexGenerator {

  generate(modules) {
    // The index is an array - the order is important for the UI
    let navIndex = [...RESOLVED_TYPES, 'modules'].map(type => ({
      type,
      items: []
    }));

    // Push each module into the right section
    modules.forEach(module => {
      let moduleType = this._getModuleType(module);
      let navItem = this._getNavItemForModule(module, moduleType);

      navIndex.find(({ type }) => type === moduleType)
        .items
        .push(navItem);
    });

    // Filter out empty sections, and sort non-empty section items by path
    return navIndex
      .filter(section => section.items.length > 0)
      .map(section => {
        section.items = _.sortBy(section.items, ['name']);

        return section;
      });
  }


  // Private

  _getModuleType(module) {
    let resolvedType = this._resolvedTypeForModule(module);

    if (!resolvedType && this._hasSingleExportOfResolvedType(module)) {
      let singleExport = this._exportsForModuleOfResolvedTypes(module)[0];
      resolvedType = singleExport.type;
    }

    return resolvedType || 'modules';
  }

_resolvedTypeForModule(module) {
  let path = module.file.split('/');

  // By default we assume that the type is at index 1
  let type = path[1];

  // If the module is a scoped package, then the type will be at index 2
  if (path[0].charAt(0) === '@') {
    type = path[2];
  }

  return RESOLVED_TYPES.includes(type) && type;
}

  _isResolvedType(module) {
    return this._resolvedTypeForModule(module);
  }

  _exportsForModuleOfResolvedTypes(module) {
    return [
      ...module.classes.map(item => ({ type: 'classes', export: item })),
      ...module.components.map(item => ({ type: 'components', export: item }))
    ];
  }

  _exportsForModuleOfNonResolvedTypes(module) {
    return [
      ...module.functions.map(item => ({ type: 'functions', export: item })),
      ...module.variables.map(item => ({ type: 'variables', export: item })),
    ];
  }

  _hasSingleExportOfResolvedType(module) {
    return (
      this._exportsForModuleOfResolvedTypes(module).length === 1 &&
      this._exportsForModuleOfNonResolvedTypes(module).length === 0
    );
  }

  _getNavItemForModule(module, type) {
    let navItem;

    if (this._isResolvedType(module)) {
      navItem = this._getNavItemForModuleOfResolvedType(module, type);
    } else if (this._hasSingleExportOfResolvedType(module)) {
      navItem = this._getNavItemForModuleWithSingleExport(module, type);
    } else {
      navItem = this._getNavItemForGenericModule(module, type)
    }

    return navItem;
  }

  _getNavItemForModuleOfResolvedType(module, type) {
    let segments = module.file.split('/');
    segments = segments.slice(segments.indexOf(type) + 1);

    if (type.match(segments[segments.length - 1])) {
      segments.pop();
    }

    let path = segments.join('/');
    let name;

    if (['components', 'helpers'].includes(type)) {
      name = `{{${path}}}`;
    } else {
      let fileName = segments.pop();
      name = _.upperFirst(_.camelCase(fileName));
    }

    return {
      id: module.id,
      path: `${type}/${path}`,
      name
    };
  }

  _getNavItemForModuleWithSingleExport(module, type) {
    let singleExport = module[type][0];

    return {
      id: singleExport.id,
      path: `modules/${singleExport.id}`,
      name: singleExport.name
    };
  }

  _getNavItemForGenericModule(module, type) {
    return {
      id: module.id,
      path: `modules/${module.id}`,
      name: module.id
    };
  }

}
