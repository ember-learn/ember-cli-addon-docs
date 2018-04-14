import Route from '@ember/routing/route';
import { assert } from '@ember/debug';

export default Route.extend({
  model({ path }) {
    let item;

    if (path.match(/^root\//)) {
      // Find by fully qualified id
      let itemId = path.replace(/^root\//, '');
      let [moduleId] = itemId.split('~');

      let module = this.store.peekRecord('module', moduleId);

      item = module.get('components').findBy('id', itemId)
        || module.get('classes').findBy('id', itemId)
        || module;
    } else {
      let modules = this.store.peekAll('module');
      let matches = modules.filter(m => (m.get('file') === `/${path}`));
      let module = matches[0];

      assert(`no modules match the path '${path}'`, matches.length > 0);
      assert(`multiple modules match the path '${path}', ids: ${matches.mapBy('id').join(', ')}`, matches.length <= 1);

      item = module.get('components').findBy('exportType', 'default')
        || module.get('classes').findBy('exportType', 'default')
        || module;
    }

    assert(`item not found for path '${path}'`, item);

    return item;
  }
});
