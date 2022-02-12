import { action } from '@ember/object';
import { A } from '@ember/array';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

/**
  A demo component that can be used to demonstrate code samples. Comes
  with built in snippet handling, so you don't have to write code twice!

  ```hbs
  <DocsDemo as |demo|>
    <demo.example @name="docs-demo-basic.hbs">
      <p>I am a <strong>handlebars</strong> template!</p>
      <p>The value is: {{this.val}}</p>
      <div>
        <Input @value={{this.val}}/>
      </div>
    </demo.example>

    <demo.snippet @name="docs-demo-basic.hbs"/>
  </DocsDemo>
  ```

  @class DocsDemo
  @yield {Hash} demo
  @yield {Component} demo.example
  @yield {Component} demo.snippet
  @yield {Component} demo.liveExample
*/

export default class DocsDemo extends Component {
  @tracked activeSnippet;

  /**
    The snippets registered with this demo component

    @field snippetRegistrations
    @type Array<Object>
  */
  snippetRegistrations = A();

  /**
    The finalized snippets complete with name (or default), language,
    and whether or not it is active.

    @computed snippets
    @private
    @type Array<Object>
    @readOnly
   */
  get snippets() {
    let activeSnippet = this.activeSnippet;

    return this.snippetRegistrations.map(({ name, label, language }) => {
      let defaults = this.defaultsFromName(name);
      return {
        name,
        isActive: activeSnippet === name,
        label: label || defaults.label,
        language: language || defaults.language,
      };
    });
  }

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
        language = 'handlebars';
        break;
      default:
        label = 'script.js';
        break;
    }

    return { label, language };
  }

  /**
    Registers snippets with the demo component and sets it to the active
    snippet if it's the only one

    @action registerSnippet
    @param {Object} snippet
  */
  @action
  registerSnippet(snippet) {
    this.snippetRegistrations.pushObject(snippet);

    if (this.snippetRegistrations.length === 1) {
      this.activeSnippet = snippet.name;
    }
  }

  /**
    Sets the active snippet

    @action selectSnippet
    @param {Object} snippet
  */
  @action
  selectSnippet(snippet) {
    this.activeSnippet = snippet.name;
  }
}
