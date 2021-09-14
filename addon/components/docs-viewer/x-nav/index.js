import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';
import { classify } from '@ember/string';
import { addonLogo } from 'ember-cli-addon-docs/utils/computed';

export default class DocsViewerXNavComponent extends Component {
  @service media;
  @service store;

  root = 'docs';

  @tracked projectName;

  constructor() {
    super(...arguments);

    const config =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-cli-addon-docs'
      ];
    const { projectName } = config;
    this.projectName = projectName;
  }

  get addonLogo() {
    return addonLogo(this.projectName);
  }

  get addonTitle() {
    let logo = this.addonLogo;

    return classify(this.projectName.replace(`${logo}-`, ''));
  }

  /*
    This is overwritten for the Sandbox.
  */
  get project() {
    return this.store.peekRecord('project', this.projectName);
  }
}
