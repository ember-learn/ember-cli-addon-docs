import config from 'dummy/config/environment';
const packageJson = config['ember-cli-addon-docs'].packageJson;

export default function() {
  this.get('/versions.json', () => {
    return {
      "v0.2.0": {
        "sha": "c205237d508e13e1df30e7cc0d43194214b48a2d",
        "tag": "v0.2.0",
        "path": "v0.2.0",
        "name": "v0.2.0"
      },
      "latest": {
        "sha": "53b73465d31925f26fd1f77881aefcaccce2915a",
        "tag": packageJson.version,
        "path": "latest",
        "name": "latest"
      },
      "v0.2.3": {
        "sha": "d752437850bc9833ea3e354095b501473b0420ae",
        "tag": "v0.2.3",
        "path": "v0.2.3",
        "name": "v0.2.3"
      },
      "master": {
        "sha": "ded622f6fc5f612a0382bebcbc2452cf478dbe27",
        "tag": null,
        "path": "master",
        "name": "master"
      },
      "v0.3.0": {
        "sha": "53b73465d31925f26fd1f77881aefcaccce2915a",
        "tag": "v0.3.0",
        "path": "v0.3.0",
        "name": "v0.3.0"
      },
      "v0.2.4": {
        "sha": "29d6b9f412fa433f406fcadfedb69554bfaf18ef",
        "tag": "v0.2.4",
        "path": "v0.2.4",
        "name": "v0.2.4"
      },
    };
  });

  this.passthrough();
}
