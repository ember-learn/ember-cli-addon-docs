// BEGIN-SNIPPET docs-demo-counter.gts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

interface DemoCounterSignature {
  Args: {
    initial?: number;
  };
}

export default class DemoCounter extends Component<DemoCounterSignature> {
  @tracked count: number = this.args.initial ?? 0;

  increment = () => {
    this.count++;
  };

  <template>
    <button
      type="button"
      class="docs-btn"
      data-test-demo-counter
      {{on "click" this.increment}}
    >
      Clicked
      {{this.count}}
      times
    </button>
  </template>
}
// END-SNIPPET
