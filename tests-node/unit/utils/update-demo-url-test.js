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

  test('it leaves the `homepage` property if it already exists', assert => {
    setupFixtureDirectory('has-existing-homepage');

    const result = updateDemoUrl(inputCopyPath);

    assert.ok(result);
    assert.equal(
      fs.readFileSync(inputCopyPath, 'utf-8'),
      fs.readFileSync(outputPath, 'utf-8')
    );
  });

  test('it adds the `homepage` property based on git remote repository', assert => {
    const dir = 'has-git-repository';
    setupFixtureDirectory(dir);

    const gitPath = path.join(fixturesPath, dir, 'git-config');

    const result = updateDemoUrl(inputCopyPath, gitPath);

    assert.ok(result);
    assert.equal(
      fs.readFileSync(inputCopyPath, 'utf-8'),
      fs.readFileSync(outputPath, 'utf-8')
    );
  });

  test('it adds the `homepage` property based on package repository value', assert => {
    setupFixtureDirectory('has-package-repository');

    const result = updateDemoUrl(inputCopyPath);

    assert.ok(result);
    assert.equal(
      fs.readFileSync(inputCopyPath, 'utf-8'),
      fs.readFileSync(outputPath, 'utf-8')
    );
  });

  test('it adds the `homepage` property based on package repository url property', assert => {
    setupFixtureDirectory('has-git-repository-object');

    const result = updateDemoUrl(inputCopyPath);

    assert.ok(result);
    assert.equal(
      fs.readFileSync(inputCopyPath, 'utf-8'),
      fs.readFileSync(outputPath, 'utf-8')
    );
  });

  test('it returns false when there is no repository to update', assert => {
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
});
