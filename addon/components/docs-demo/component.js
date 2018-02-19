import Component from '@ember/component';
import { A } from '@ember/array';

import { action, computed } from '@ember-decorators/object';
import { match } from '@ember-decorators/object/computed';
import { classNames } from '@ember-decorators/component';
import layout from './template';

/**
 * @yield {Hash} demo
 * @yield {Component} demo.example
 * @yield {Component} demo.snippet
 * @yield {Component} demo.liveExample
 */
@classNames('docs-demo')
export default class DocsDemoComponent extends Component {
  layout = layout;
  snippetRegistrations = A();

  @match('name', /.js$/) isJavascript;

  @computed('activeSnippet', 'snippetRegistrations.[]')
  get snippets() {
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
      });
  }

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
  }

  @action
  registerSnippet(snippet) {
    this.get('snippetRegistrations').pushObject(snippet);

    if (this.get('snippetRegistrations.length') === 1) {
      this.set('activeSnippet', snippet.name);
    }
  }

  @action
  selectSnippet(snippet) {
    this.set('activeSnippet', snippet.name);
  }
}
