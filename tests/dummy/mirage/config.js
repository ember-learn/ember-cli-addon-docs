import config from 'ember-get-config';
const projectTag = config['ember-cli-addon-docs']?.projectTag;
import { createServer } from 'miragejs';

export default function (config) {
  let finalConfig = {
    ...config,
    routes() {
      this.get('/versions.json', () => {
        return {
          '-latest': {
            sha: '53b73465d31925f26fd1f77881aefcaccce2915a',
            tag: projectTag,
            path: '',
            name: '-latest',
          },
          master: {
            sha: '12345',
            tag: null,
            path: 'master',
            name: 'master',
          },
        };
      });

      this.passthrough();
    },
  };

  return createServer(finalConfig);
}
