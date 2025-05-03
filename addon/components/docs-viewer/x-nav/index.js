import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { localCopy } from 'tracked-toolbox';
import { classify } from '@ember/string';
import { addonLogo } from 'ember-cli-addon-docs/utils/computed';
import { addonDocsConfig } from 'ember-cli-addon-docs/-private/config';

export default class XNav extends Component {
  @addonDocsConfig config;

  @localCopy('args.root', 'docs')
  root;

  @service store;

  @tracked isShowingMenu;

  get addonLogo() {
    return addonLogo(this.config.projectName);
  }

  get addonTitle() {
    let logo = this.addonLogo;

    return classify(this.config.projectName.replace(`${logo}-`, ''));
  }

  get project() {
    if (this.args.project) {
      return this.args.project;
    }

    return this.store.peekRecord('project', this.config.projectName);
  }
}
