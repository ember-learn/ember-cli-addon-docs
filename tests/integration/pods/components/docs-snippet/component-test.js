import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('docs-snippet', 'Integration | Component | docs snippet', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{docs-snippet}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#docs-snippet}}
      template block text
    {{/docs-snippet}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
