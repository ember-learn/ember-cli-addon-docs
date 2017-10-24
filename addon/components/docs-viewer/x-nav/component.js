import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,

  store: Ember.inject.service(),

  tagName: 'nav',

  classNames: 'docs-viewer__nav',

  projectVersion: Ember.computed(function() {
    return this.get('store').peekAll('project-version').get('firstObject');
  }),

  // didInsertElement() {
  //   this._super(...arguments);
  //
  //   this.get('store').findRecord('project', 'ember-cli-mirage')
  //     .then(project => {
  //       let projectVersion = project.get('projectVersions.firstObject.id');
  //       let version = projectVersion.split('ember-cli-mirage-')[1];
  //
  //       this.set('projectVersion.version', version);
  //
  //       return this.get('store').findRecord('project-version', projectVersion);
  //     })
  //     .then(projectVersion => {
  //       this.set('projectVersion', projectVersion);
  //     });
  // }

});
