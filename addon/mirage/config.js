import config from 'dummy/config/environment';
const packageJson = config['ember-cli-addon-docs'].packageJson;

export default function() {
  this.get('/versions.json', () => {
    return {
      "latest": {
        "sha": "53b73465d31925f26fd1f77881aefcaccce2915a",
        "tag": packageJson.version,
        "path": "latest",
        "name": "latest"
      },
      "master": {
        "sha": "12345",
        "tag": null,
        "path": "master",
        "name": "master"
      }
    };
  });

  this.passthrough();
}
