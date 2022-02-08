import Controller from '@ember/controller';
import compileMarkdown from 'ember-cli-addon-docs/utils/compile-markdown';
import { htmlSafe } from '@ember/template';

export default class RouteUsingCompileMarkdown extends Controller {

  body = `In the beginning, we could only use

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
`;

  get htmlBody() {
    return htmlSafe(compileMarkdown(this.body));
  }

}
