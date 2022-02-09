import { scheduleOnce } from '@ember/runloop';
import Component from '@glimmer/component';

export default class XSnippet extends Component {
  constructor() {
    super(...arguments);

    scheduleOnce('afterRender', () => {
      this.args.didInit({
        name: this.args.name,
        label: this.args.label,
        language: this.args.language,
      });
    });
  }
}
