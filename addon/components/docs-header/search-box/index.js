import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { formElementHasFocus } from 'ember-cli-addon-docs/keyboard-config';
import { addonDocsConfig } from 'ember-cli-addon-docs/-private/config';

export default class DocsHeaderSearchBox extends Component {
  @service docsStore;

  constructor() {
    super(...arguments);

    this.fetchProject.perform();
  }

  @addonDocsConfig config;

  fetchProject = task(async () => {
    await this.docsStore.findRecord('project', this.config.projectName);
  });

  @action
  focusSearch() {
    if (!formElementHasFocus()) {
      this.element.querySelector('input').focus();
    }
  }

  @action
  unfocusSearch() {
    this.args.onInput?.(null);
  }

  @action
  handleInput(event) {
    this.args.onInput?.(event.target.value);
  }
}
