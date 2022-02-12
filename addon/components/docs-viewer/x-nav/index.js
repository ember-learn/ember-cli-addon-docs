import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { localCopy } from 'tracked-toolbox';
import config from 'ember-get-config';
import { classify } from '@ember/string';
import { addonLogo } from 'ember-cli-addon-docs/utils/computed';

const projectName = config['ember-cli-addon-docs'].projectName;

export default class XNav extends Component {
  @localCopy('args.root', 'docs')
  root;

  @service store;
  @service media;

  @tracked isShowingMenu;

  addonLogo = addonLogo(projectName);

  get addonTitle() {
    let logo = this.addonLogo;

    return classify(projectName.replace(`${logo}-`, ''));
  }

  get project() {
    if (this.args.project) {
      return this.args.project;
    }

    return this.store.peekRecord('project', projectName);
  }
}
