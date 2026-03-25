import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';

export default class DocsApiRoute extends Route {
  @service docsStore;

  model({ path }) {
    let item;

    if (path.match(/^modules\//)) {
      // Find by fully qualified id
      let itemId = path.replace(/^modules\//, '');
      let [moduleId] = itemId.split(/~|#/);

      let module = this.docsStore.peekRecord('module', moduleId);

      item =
        module.components.find((component) => component.id === itemId) ||
        module.classes.find((_class) => _class.id === itemId) ||
        module;
    } else {
      // Create a regex that will match modules by either the path, or the
      // pod-path (/component, /route, etc)
      let type = path.match(/^([\w-]*)s\//)[1];
      let pathRegex = new RegExp(`${path}(/${type})?$`);

      let modules = this.docsStore.peekAll('module');
      let matches = modules.filter((m) => m.id.match(pathRegex));
      let module = matches[0];

      assert(`no modules match the path '${path}'`, matches.length > 0);
      assert(
        `multiple modules match the path '${path}', ids: ${matches
          .map((m) => m.id)
          .join(', ')}`,
        matches.length <= 1,
      );

      item =
        module.components.find(
          (component) => component.exportType === 'default',
        ) ||
        module.classes.find((_class) => _class.exportType === 'default') ||
        module;
    }

    assert(`item not found for path '${path}'`, item);

    return item;
  }
}
