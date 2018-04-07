import { computed } from '@ember/object';
import { A } from '@ember/array';
import Component from '@ember/component';
import layout from './template';

/**
  A demo component that can be used to demonstrate code samples. Comes
  with built in snippet handling, so you don't have to write code twice!

  ```hbs
  {{#docs-demo as |demo|}}
    {{#demo.example name='docs-demo-basic.hbs'}}
      <p>I am a <strong>handlebars</strong> template!</p>
      <p>The value is: {{val}}</p>
      <div>
        {{input value=val}}
      </div>
    {{/demo.example}}

    {{demo.snippet 'docs-demo-basic.hbs'}}
  {{/docs-demo}}
  ```

  @class DocsDemo
  @yield {Hash} demo
  @yield {Component} demo.example
  @yield {Component} demo.snippet
  @yield {Component} demo.liveExample
*/
export default Component.extend({
  layout,
  tagName: '',

  init() {
    this._super(...arguments);

    this.set('snippetRegistrations', A());
  },

  /**
    The snippets registered with this demo component

    @field snippetRegistrations
    @type Array<Object>
  */
  snippetRegistrations: null,

  /**
    The finalized snippets complete with name (or default), language,
    and whether or not it is active.

    @computed snippets
    @private
    @type Array<Object>
    @readOnly
   */
  snippets: computed('activeSnippet', 'snippetRegistrations.[]', function() {
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

  /**
    Returns the default label and language based on snippet file name

    @method defaultsFromName
    @param {String} name
    @return {Object}
  */
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
    /**
      Registers snippets with the demo component and sets it to the active
      snippet if it's the only one

      @action registerSnippet
      @param {Object} snippet
    */
    registerSnippet(snippet) {
      this.get('snippetRegistrations').pushObject(snippet);

      if (this.get('snippetRegistrations.length') === 1) {
        this.set('activeSnippet', snippet.name);
      }
    },

    /**
      Sets the active snippet

      @action selectSnippet
      @param {Object} snippet
    */
    selectSnippet(snippet) {
      this.set('activeSnippet', snippet.name);
    }
  }
});
