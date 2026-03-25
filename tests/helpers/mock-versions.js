import Pretender from 'pretender';
import config from 'dummy/config/environment';

const projectTag = config['ember-cli-addon-docs']?.projectTag;

const DEFAULT_VERSIONS = {
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

export function setupMockVersions(hooks) {
  hooks.beforeEach(function () {
    this.server = new Pretender(function () {
      this.get('/versions.json', () => [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(DEFAULT_VERSIONS),
      ]);
    });

    // Let unhandled requests pass through
    this.server.unhandledRequest = function (verb, path, request) {
      request.passthrough();
    };
  });

  hooks.afterEach(function () {
    this.server.shutdown();
  });
}

export function mockVersionsEndpoint(server, versions) {
  server.get('/versions.json', () => [
    200,
    { 'Content-Type': 'application/json' },
    JSON.stringify(versions),
  ]);
}
