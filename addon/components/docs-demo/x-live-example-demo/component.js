import { alias } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({

  layout: alias('compiledTemplate')

});
