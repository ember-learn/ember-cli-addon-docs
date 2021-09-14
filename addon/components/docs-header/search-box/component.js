import Component from '@ember/component';
import template from './template';
import { task } from 'ember-concurrency';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { classNames, layout } from '@ember-decorators/component';
import { formElementHasFocus } from 'ember-cli-addon-docs/keyboard-config';

@classNames('docs-ml-auto')
@layout(template)
export default class DocsHeaderSearchBoxComponent extends Component {
  @service store;

  query = null;

  constructor() {
    super(...arguments);

    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];
    const { projectName } = config;

    this.set('projectName', projectName);
  }

  didInsertElement() {
    super.didInsertElement(...arguments);

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
    this.get('on-input')(null);
  }
}
