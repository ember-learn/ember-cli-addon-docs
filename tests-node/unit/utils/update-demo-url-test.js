'use strict';

const QUnit = require('qunit');
const fs = require('fs-extra');
const path = require('path');
const updateDemoUrl = require('../../../lib/utils/update-demo-url');

const qModule = QUnit.module;
const test = QUnit.test;

qModule('`updateDemoUrl` | fixture test', hooks => {
  const fixturesPath = path.join(__dirname, '../..', 'fixtures', 'update-demo-url');

  let inputCopyPath, outputPath, setupFixtureDirectory;

  hooks.beforeEach(() => {
    setupFixtureDirectory = (dir) => {
      inputCopyPath = path.join(fixturesPath, dir, 'input--temp.json');
      outputPath = path.join(fixturesPath, dir, 'output.json');
      fs.copySync(path.join(fixturesPath, dir, 'input.json'), inputCopyPath);
    }
  });

  hooks.afterEach(() => {
    if (inputCopyPath) {
      fs.unlinkSync(inputCopyPath);
      inputCopyPath = '';
    }
  });

  test('it updates the `demoUrl` on the `ember-addon` property', assert => {
    setupFixtureDirectory('ember-addon-present');

    const result = updateDemoUrl(inputCopyPath);

    assert.ok(result);
    assert.equal(
      fs.readFileSync(inputCopyPath, 'utf-8'),
      fs.readFileSync(outputPath, 'utf-8')
    );
  });

  test('it adds `ember-addon` property if not there in package.json', assert => {
    setupFixtureDirectory('ember-addon-missing');

    const result = updateDemoUrl(inputCopyPath);

    assert.ok(result);
    assert.equal(
      fs.readFileSync(inputCopyPath, 'utf-8'),
      fs.readFileSync(outputPath, 'utf-8')
    );
  });

  test('it updates the `demoUrl` on the `ember-addon` property when repository is an object', assert => {
    setupFixtureDirectory('repository-object');

    const result = updateDemoUrl(inputCopyPath);

    assert.ok(result);
    assert.equal(
      fs.readFileSync(inputCopyPath, 'utf-8'),
      fs.readFileSync(outputPath, 'utf-8')
    );
  });

  test('it returns false when there is no repository', assert => {
    const dir = 'missing-repository';
    setupFixtureDirectory(dir);

    const gitPath = path.join(fixturesPath, dir, 'git-config');
    const result = updateDemoUrl(inputCopyPath, gitPath);

    assert.notOk(result);
  });

  test('it returns false when the repository is not a git repo', assert => {
    const dir = 'non-git-repository';
    setupFixtureDirectory(dir);

    const gitPath = path.join(fixturesPath, dir, 'git-config');
    const result = updateDemoUrl(inputCopyPath, gitPath);

    assert.notOk(result);
  });

  test('it falls back to the git origin when it can', assert => {
    const dir = 'missing-repository-with-git';
    setupFixtureDirectory(dir);

    const gitPath = path.join(fixturesPath, dir, 'git-config');

    const result = updateDemoUrl(inputCopyPath, gitPath);

    assert.ok(result);
    assert.equal(
      fs.readFileSync(inputCopyPath, 'utf-8'),
      fs.readFileSync(outputPath, 'utf-8')
    );
  });
});
