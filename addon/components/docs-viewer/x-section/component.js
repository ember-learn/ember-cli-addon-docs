import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  tagName: '',

  layout: hbs`
    <li class='
      mt-8 text-grey font-bold
      tracking-wide uppercase
      {{if (eq style 'large') '-mb-4 text-sm' 'text-xs'}}
    '>
      {{label}}
    </li>
  `
}).reopenClass({

  positionalParams: [ 'label' ]

});
