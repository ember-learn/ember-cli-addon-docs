import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,

  classNames: 'docs-demo',

  init() {
    this._super(...arguments);

    this.set('snippetNames', Ember.A());
  },

  isJavascript: Ember.computed.match('name', /.js$/),
  snippets: Ember.computed('activeSnippet', 'snippetNames.[]', function() {
    let activeSnippet = this.get('activeSnippet');
    function labelFromName(name) {
      let label;
      switch (name.split('.').pop()) {
        case 'js':
          label = 'controller.js';
          break;
        case 'css':
          label = 'style.css';
          break;
        case 'scss':
          label = 'style.scss';
          break;
        case 'hbs':
          label = 'template.hbs';
          break;
        default:
          label = 'script.js';
          break;
      }

      return label;
    }

    return this.get('snippetNames')
      .map(name => {
        return {
          name,
          isActive: activeSnippet === name,
          label: labelFromName(name)
        };
      })
  }),

  actions: {
    registerSnippet(snippetName) {
      this.get('snippetNames').pushObject(snippetName);

      if (this.get('snippetNames.length') === 1) {
        this.set('activeSnippet', snippetName);
      }
    },

    selectSnippet(snippetName) {
      this.set('activeSnippet', snippetName);
    }
  }
});
