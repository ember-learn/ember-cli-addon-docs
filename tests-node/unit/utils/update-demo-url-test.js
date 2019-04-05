'use strict';

const assert = require('chai').assert;
const fs = require('fs-extra');
const path = require('path');
const updateDemoUrl = require('../../../lib/utils/update-demo-url');

describe('`updateDemoUrl` | fixture test', function() {
  const fixturesPath = path.join(__dirname, '../..', 'fixtures', 'update-demo-url');

  let inputCopyPath, outputPath, setupFixtureDirectory;

  beforeEach(function() {
    setupFixtureDirectory = (dir) => {
      inputCopyPath = path.join(fixturesPath, dir, 'input--temp.json');
      outputPath = path.join(fixturesPath, dir, 'output.json');
      fs.copySync(path.join(fixturesPath, dir, 'input.json'), inputCopyPath);
    }
  });

  afterEach(function() {
    if (inputCopyPath) {
      fs.unlinkSync(inputCopyPath);
      inputCopyPath = '';
    }
  });

  it('it leaves the `homepage` property if it already exists', function() {
    setupFixtureDirectory('has-existing-homepage');

    const result = updateDemoUrl(inputCopyPath);

    assert.ok(result);
    assert.equal(
      fs.readFileSync(inputCopyPath, 'utf-8'),
      fs.readFileSync(outputPath, 'utf-8')
    );
  });

  it('it adds the `homepage` property based on git remote repository', function() {
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

  it('it adds the `homepage` property based on package repository value', function() {
    setupFixtureDirectory('has-package-repository');

    const result = updateDemoUrl(inputCopyPath);

    assert.ok(result);
    assert.equal(
      fs.readFileSync(inputCopyPath, 'utf-8'),
      fs.readFileSync(outputPath, 'utf-8')
    );
  });

  it('it adds the `homepage` property based on package repository url property', function() {
    setupFixtureDirectory('has-git-repository-object');

    const result = updateDemoUrl(inputCopyPath);

    assert.ok(result);
    assert.equal(
      fs.readFileSync(inputCopyPath, 'utf-8'),
      fs.readFileSync(outputPath, 'utf-8')
    );
  });

  it('it returns false when there is no repository to update', function() {
    const dir = 'missing-repository';
    setupFixtureDirectory(dir);

    const gitPath = path.join(fixturesPath, dir, 'git-config');
    const result = updateDemoUrl(inputCopyPath, gitPath);

    assert.notOk(result);
  });

  it('it returns false when the repository is not a git repo', function() {
    const dir = 'non-git-repository';
    setupFixtureDirectory(dir);

    const gitPath = path.join(fixturesPath, dir, 'git-config');
    const result = updateDemoUrl(inputCopyPath, gitPath);

    assert.notOk(result);
  });
});
