import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  tagName: '',

  layout: hbs`
    <li class='
      docs-mt-8 docs-text-grey docs-font-bold
      docs-tracking-wide docs-uppercase
      {{if (eq style 'large') 'docs--mb-4 docs-text-sm' 'docs-text-xs'}}
    '>
      {{label}}
    </li>
  `
}).reopenClass({

  positionalParams: [ 'label' ]

});
