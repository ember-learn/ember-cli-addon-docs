import { tagName, layout as templateLayout } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import layout from './template';
import { set as _set } from 'lodash';

@templateLayout(layout)
@tagName('')
export default class XAutogeneratedApiDocs extends Component {
  @service
  store;

  @readOnly('project.navigationIndex')
  sections;

  /*
    Autogenerated sections include "resolved types", by which we mean things like
    Components and Helpers, as well as generic "modules", which is any other
    public JavaScript export from this library.

    These are the sections for the resolved types.
  */
  @computed('sections')
  get resolvedTypeSections() {
    return this.sections.filter((section) => section.type !== 'modules');
  }

  /*
    Autogenerated sections include "resolved types", by which we mean things like
    Components and Helpers, as well as generic "modules", which is any other
    public JavaScript export from this library.

    This is the index of nodes for generic modules. We transform the raw array
    of modules that look like this

    ```
    [
      {id: "ember-cli-addon-docs/keyboard-config", path: "modules/ember-cli-addon-docs/keyboard-config", name: "ember-cli-addon-docs/keyboard-config"}
      {id: "ember-cli-addon-docs/router", path: "modules/ember-cli-addon-docs/router", name: "ember-cli-addon-docs/router"}
      {id: "ember-cli-addon-docs/utils/compile-markdown", path: "modules/ember-cli-addon-docs/utils/compile-markdown", name: "ember-cli-addon-docs/utils/compile-markdown"}
    ]
    ```

    into a nested data structure resembling the filesystem:

    ```
    {
      name: '@ember-cli-addon-docs',
      children: [
        { name: 'keyboard-config', path: "modules/ember-cli-addon-docs/keyboard-config" },
        { name: 'router', children: [], path: "modules/ember-cli-addon-docs/router"  },
        {
          name: 'utils',
          children: [
            { name: 'compile-markdown', children: [], path: "modules/ember-cli-addon-docs/utils/compile-markdown"  },
          ]
        },
      ]
    };
    ```
  */
  @computed('sections')
  get moduleIndex() {
    let modulesSection = this.sections.filter(
      (section) => section.type === 'modules'
    )[0];

    if (modulesSection) {
      let modules = modulesSection.items;

      /*
      Intermediate data structure:

      ```
      {
        '@ember-cli-addon-docs': {
          'keyboard-config': {},
          'router': {},
          'utils': {
            'compile-markdown': {}
          }
        }
      };
      ```
      */
      let index = {};
      modules.forEach((module) => {
        let parts = module.id.split('/');
        _set(index, parts, {});
      });

      let transform = (obj, id) =>
        Object.keys(obj).map((key) => {
          let node = {
            name: key,
          };
          let children = transform(obj[key], id ? `${id}/${key}` : key);
          if (children.length) {
            node.children = children;
          } else {
            node.id = `${id}/${key}`;
          }

          return node;
        });

      return transform(index)[0];
    }

    return null;
  }
}
