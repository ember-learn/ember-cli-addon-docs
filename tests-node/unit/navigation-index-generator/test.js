'use strict';

const QUnit = require('qunit'), test = QUnit.test;
const NavigationIndexGenerator = require('../../../lib/broccoli/docs-compiler/navigation-index-generator');

let generator = new NavigationIndexGenerator();

QUnit.module('Unit | NavigationIndexGenerator', function(hooks) {

  test('the correct navigation is generated for a component', function(assert) {
    let modulesWithComponent = require('./examples/one-component.json');
    let navigationIndex = generator.generate(modulesWithComponent);

    assert.deepEqual(navigationIndex, [
      {
        type: 'components',
        items: [
          {
            id: "ember-cli-addon-docs/components/docs-demo/component",
            path: "components/docs-demo",
            name: "{{docs-demo}}"
          }
        ]
      }
    ]);
  });

  test('it sorts modules by path', function(assert) {
    let modulesWithComponent = require('./examples/multiple-components.json');
    let navigationIndex = generator.generate(modulesWithComponent);

    assert.deepEqual(navigationIndex, [
      {
        type: 'components',
        items: [
          {
            id: "ember-cli-addon-docs/components/docs-demo/component",
            path: "components/docs-demo",
            name: "{{docs-demo}}"
          },
          {
            id: "ember-cli-addon-docs/components/docs-header/component",
            path: "components/docs-header",
            name: "{{docs-header}}"
          }
        ]
      }
    ]);
  });

  test('the correct navigation is generated for a generic module with multiple classes', function(assert) {
    let modulesWithComponent = require('./examples/generic-module-multiple-classes.json');
    let navigationIndex = generator.generate(modulesWithComponent);

    assert.deepEqual(navigationIndex, [
      {
        type: 'modules',
        items: [
          {
            id: "ember-cli-mirage/identity-manager",
            path: "modules/ember-cli-mirage/identity-manager",
            name: "ember-cli-mirage/identity-manager"
          }
        ]
      }
    ]);
  });

  test('it correctly handles modules with a single type', function(assert) {
    let modulesWithComponent = require('./examples/generic-module-one-class.json');
    let navigationIndex = generator.generate(modulesWithComponent);

    assert.deepEqual(navigationIndex, [
      {
        type: 'classes',
        items: [
          {
            id: "ember-cli-mirage/identity-manager~IdentityManager",
            path: "modules/ember-cli-mirage/identity-manager~IdentityManager",
            name: "IdentityManager"
          }
        ]
      }
    ]);
  });

  test('sanity check: it handles addon-docs', function(assert) {
    let modules = require('./examples/addon-docs.json');
    let navigationIndex = generator.generate(modules);

    assert.deepEqual(navigationIndex, [
      {
        "type": "components",
        "items": [
          {
            "id": "ember-cli-addon-docs/components/docs-demo/component",
            "path": "components/docs-demo",
            "name": "{{docs-demo}}"
          },
          {
            "id": "ember-cli-addon-docs/components/docs-header/component",
            "path": "components/docs-header",
            "name": "{{docs-header}}"
          },
          {
            "id": "ember-cli-addon-docs/components/docs-hero/component",
            "path": "components/docs-hero",
            "name": "{{docs-hero}}"
          },
          {
            "id": "ember-cli-addon-docs/components/docs-keyboard-shortcuts/component",
            "path": "components/docs-keyboard-shortcuts",
            "name": "{{docs-keyboard-shortcuts}}"
          },
          {
            "id": "ember-cli-addon-docs/components/docs-link/component",
            "path": "components/docs-link",
            "name": "{{docs-link}}"
          },
          {
            "id": "ember-cli-addon-docs/components/docs-logo/component",
            "path": "components/docs-logo",
            "name": "{{docs-logo}}"
          },
          {
            "id": "ember-cli-addon-docs/components/docs-snippet/component",
            "path": "components/docs-snippet",
            "name": "{{docs-snippet}}"
          },
          {
            "id": "ember-cli-addon-docs/components/docs-svg-icon/component",
            "path": "components/docs-svg-icon",
            "name": "{{docs-svg-icon}}"
          },
          {
            "id": "ember-cli-addon-docs/components/docs-viewer/component",
            "path": "components/docs-viewer",
            "name": "{{docs-viewer}}"
          }
        ]
      },
      {
        "type": "modules",
        "items": [
          {
            "id": "ember-cli-addon-docs/keyboard-config",
            "path": "modules/ember-cli-addon-docs/keyboard-config",
            "name": "ember-cli-addon-docs/keyboard-config"
          },
          {
            "id": "ember-cli-addon-docs/router",
            "path": "modules/ember-cli-addon-docs/router",
            "name": "ember-cli-addon-docs/router"
          }
        ]
      }
    ]);
  });

  test('sanity check: it handles sandbox', function(assert) {
    let modules = require('./examples/sandbox.json');
    let navigationIndex = generator.generate(modules);

    assert.deepEqual(navigationIndex, [
      {
        "type": "components",
        "items": [
          {
            "id": "sandbox/components/esdoc-component",
            "path": "components/esdoc-component",
            "name": "{{esdoc-component}}"
          },
          {
            "id": "sandbox/components/simple-list/item/component",
            "path": "components/simple-list/item",
            "name": "{{simple-list/item}}"
          },
          {
            "id": "sandbox/components/simple-list/component",
            "path": "components/simple-list",
            "name": "{{simple-list}}"
          },
          {
            "id": "sandbox/components/yuidoc-component",
            "path": "components/yuidoc-component",
            "name": "{{yuidoc-component}}"
          }
        ]
      },
      {
        "type": "helpers",
        "items": [
          {
            "id": "sandbox/helpers/esdoc-class-helper",
            "path": "helpers/esdoc-class-helper",
            "name": "{{esdoc-class-helper}}"
          },
          {
            "id": "sandbox/helpers/esdoc-helper",
            "path": "helpers/esdoc-helper",
            "name": "{{esdoc-helper}}"
          },
          {
            "id": "sandbox/helpers/yuidoc-class-helper",
            "path": "helpers/yuidoc-class-helper",
            "name": "{{yuidoc-class-helper}}"
          },
          {
            "id": "sandbox/helpers/yuidoc-helper",
            "path": "helpers/yuidoc-helper",
            "name": "{{yuidoc-helper}}"
          }
        ]
      },
      {    "type": "modules",
        "items": [
          {
            "id": "sandbox/utils/esdoc-module",
            "path": "modules/sandbox/utils/esdoc-module",
            "name": "sandbox/utils/esdoc-module"      },
          {
            "id": "sandbox/utils/yuidoc-module",
            "path": "modules/sandbox/utils/yuidoc-module",
            "name": "sandbox/utils/yuidoc-module"
          }
        ]
      }
    ]);
  });

});
