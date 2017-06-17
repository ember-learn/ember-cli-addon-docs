import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('docs-navbar', 'Integration | Component | docs navbar', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{docs-navbar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#docs-navbar}}
      template block text
    {{/docs-navbar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
