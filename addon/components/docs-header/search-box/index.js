import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { formElementHasFocus } from 'ember-cli-addon-docs/keyboard-config';

export default class DocsHeaderSearchBox extends Component {
  @service store;

  constructor() {
    super(...arguments);

    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];
    const { projectName } = config;

    this.projectName = projectName;
    this.fetchProject.perform();
  }

  // TODO: The searchbox doesn't work without the project being fetched.
  // We should move this logic (and everywhere else in the code that's fetching
  // the project) within a new addonDocs service that wires all that up together.
  // I think it's fine if our Docs-* components assume there is a single global
  // project.
  @task
  *fetchProject() {
    yield this.store.findRecord('project', this.projectName);
  }

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
