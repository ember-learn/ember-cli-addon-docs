import Controller from '@ember/controller';
import { computed } from '@ember/object';
import compileMarkdown from 'ember-cli-addon-docs/utils/compile-markdown';
import { htmlSafe } from '@ember/string';

export default Controller.extend({

  body: `In the beginning, we could only use

\`\`\`js
function foo() {
  console.log('bar');
}
\`\`\`

Now, we can use

\`\`\`js
const foo = () => {
  console.log('bar');
});
\`\`\`
`,

  htmlBody: computed('body', function() {
    return htmlSafe(compileMarkdown(this.body));
  })

});
