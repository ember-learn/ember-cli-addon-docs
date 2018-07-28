import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  tagName: '',

  layout: hbs`
    <li class='
      ad-mt-8 ad-text-grey ad-font-bold
      ad-tracking-wide ad-uppercase
      {{if (eq style 'large') 'ad--mb-4 ad-text-sm' 'ad-text-xs'}}
    '>
      {{label}}
    </li>
  `
}).reopenClass({

  positionalParams: [ 'label' ]

});
