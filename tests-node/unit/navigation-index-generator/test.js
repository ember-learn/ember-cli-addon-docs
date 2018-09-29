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
            path: "components/docs-demo",
            name: "{{docs-demo}}"
          },
          {
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
            "path": "components/docs-demo",
            "name": "{{docs-demo}}"
          },
          {
            "path": "components/docs-header",
            "name": "{{docs-header}}"
          },
          {
            "path": "components/docs-hero",
            "name": "{{docs-hero}}"
          },
          {
            "path": "components/docs-keyboard-shortcuts",
            "name": "{{docs-keyboard-shortcuts}}"
          },
          {
            "path": "components/docs-link",
            "name": "{{docs-link}}"
          },
          {
            "path": "components/docs-logo",
            "name": "{{docs-logo}}"
          },
          {
            "path": "components/docs-snippet",
            "name": "{{docs-snippet}}"
          },
          {
            "path": "components/docs-svg-icon",
            "name": "{{docs-svg-icon}}"
          },
          {
            "path": "components/docs-viewer",
            "name": "{{docs-viewer}}"
          }
        ]
      },
      {
        "type": "modules",
        "items": [
          {
            "path": "modules/ember-cli-addon-docs/keyboard-config",
            "name": "ember-cli-addon-docs/keyboard-config"
          },
          {
            "path": "modules/ember-cli-addon-docs/router",
            "name": "ember-cli-addon-docs/router"
          }
        ]
      }
    ]);
  });

});
