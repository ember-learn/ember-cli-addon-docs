import Component from '@ember/component';
import { A } from '@ember/array';

import { action, computed } from '@ember-decorators/object';
import { match } from '@ember-decorators/object/computed';
import { classNames } from '@ember-decorators/component';
import layout from './template';

/**
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
 * tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
 * quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
 * consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
 * cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
 * proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
 *
 * ```js
 * {{#docs-demo as |demo|}}
 *   {{#demo.example name='docs-demo-basic.hbs'}}
 *     <p>I am a <strong>handlebars</strong> template!</p>
 *     <p>The value is: {{val}}</p>
 *     <div>
 *       {{input value=val}}
 *     </div>
 *   {{/demo.example}}
 *
 *   {{demo.snippet 'docs-demo-basic.hbs'}}
 * {{/docs-demo}}
 * ```
 *
 *
 * @yield {Hash} demo - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
 * sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
 * minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
 * commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
 * esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
 * non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
 *
 * @yield {Component} demo.example - Lorem ipsum dolor sit amet, consectetur
 * adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
 * aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
 * nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
 * in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
 * sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
 * mollit anim id est laborum.
 *
 * @yield {Component} demo.snippet - Lorem ipsum dolor sit amet, consectetur
 * adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
 * aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
 * nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
 * in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
 * occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
 * anim id est laborum.
 *
 * @yield {Component} demo.liveExample - Lorem ipsum dolor sit amet, consectetur
 * adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
 * aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
 * nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
 * in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
 * occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
 * anim id est laborum.
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

  /**
   * Lorem ipsum dolor sit amet, consectetur
   * adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
   * aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
   * nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
   * in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
   * occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
   * anim id est laborum.
   *
   * @param {string} name - the name of the snippet
   * @param {Object} param - aoeu
   * @param {string} param.bar - uaoeu
   * @returns {Object} - the label and language defaults
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
