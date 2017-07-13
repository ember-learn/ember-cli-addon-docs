import Ember from 'ember';

export default Ember.Component.extend({

  layout: Ember.computed.alias('compiledTemplate')

});
