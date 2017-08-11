import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,

  classNames: 'docs-demo',

  init() {
    this._super(...arguments);

    this.set('snippetRegistrations', Ember.A());
  },

  isJavascript: Ember.computed.match('name', /.js$/),
  snippets: Ember.computed('activeSnippet', 'snippetRegistrations.[]', function() {
    let activeSnippet = this.get('activeSnippet');

    return this.get('snippetRegistrations')
      .map(({ name, label, language }) => {
        let defaults = this.defaultsFromName(name);
        return {
          name,
          isActive: activeSnippet === name,
          label: label || defaults.label,
          language: language || defaults.language
        };
      })
  }),

  defaultsFromName(name) {
    let label, language;
    switch (name.split('.').pop()) {
      case 'js':
        label = 'controller.js';
        language = 'javascript';
        break;
      case 'css':
        label = 'styles.css';
        language = 'css';
        break;
      case 'scss':
        label = 'styles.scss';
        language = 'sass';
        break;
      case 'hbs':
      case 'md':
        label = 'template.hbs';
        language = 'htmlbars';
        break;
      default:
        label = 'script.js';
        break;
    }

    return { label, language };
  },

  actions: {
    registerSnippet(snippet) {
      this.get('snippetRegistrations').pushObject(snippet);

      if (this.get('snippetRegistrations.length') === 1) {
        this.set('activeSnippet', snippet.name);
      }
    },

    selectSnippet(snippet) {
      this.set('activeSnippet', snippet.name);
    }
  }
});
