import config from '../config/environment';
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
          main: {
            sha: '12345',
            tag: null,
            path: 'main',
            name: 'main',
          },
        };
      });

      this.passthrough();
    },
  };

  return createServer(finalConfig);
}
