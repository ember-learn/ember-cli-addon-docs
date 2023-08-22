'use strict';

const path = require('path');
const fs = require('fs-extra');
const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');

let setupTestHooks = blueprintHelpers.setupTestHooks;
let emberNew = blueprintHelpers.emberNew;
let emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

const expect = require('ember-cli-blueprint-test-helpers/chai').expect;
const file = require('ember-cli-blueprint-test-helpers/chai').file;

describe('Blueprints | non-pods docs page test', function () {
  setupTestHooks(this);

  it('it generates a docs page and updates router with no docs.hbs present', function () {
    return emberNew({ target: 'addon' }).then(() => {
      return emberGenerateDestroy(['docs-page', 'foo-bar'], (_file) => {
        expect(_file('tests/dummy/app/templates/docs/foo-bar.md'))
          .to.exist.to.contain('# Foo bar')
          .to.contain('Foo bar content');

        expect(file('tests/dummy/app/router.js')).to.contain(
          "this.route('foo-bar');",
        );

        expect(file('tests/dummy/app/templates/docs.hbs')).to.not.exist;
      });
    });
  });

  it('it generates a docs page, updates router, and adds nav item to docs.hbs', function () {
    return emberNew({ target: 'addon' })
      .then(() =>
        copyFixtureFile(
          getFixturePath('docs.hbs'),
          'tests/dummy/app/templates/docs.hbs',
        ),
      )
      .then(() => {
        return emberGenerateDestroy(['docs-page', 'foo-bar'], (_file) => {
          expect(_file('tests/dummy/app/templates/docs/foo-bar.md'))
            .to.exist.to.contain('# Foo bar')
            .to.contain('Foo bar content');

          expect(file('tests/dummy/app/router.js')).to.contain(
            "this.route('foo-bar');",
          );

          expect(
            file('tests/dummy/app/templates/docs.hbs'),
          ).to.exist.to.contain(
            '<nav.item @label="Foo bar" @route="docs.foo-bar" />',
          );
        });
      });
  });

  it('it generates a docs page, updates router, and adds nav item to docs.hbs when subnav present', function () {
    return emberNew({ target: 'addon' })
      .then(() =>
        copyFixtureFile(
          getFixturePath('docs-subnav.hbs'),
          'tests/dummy/app/templates/docs.hbs',
        ),
      )
      .then(() => {
        return emberGenerateDestroy(['docs-page', 'foo-bar'], (_file) => {
          expect(_file('tests/dummy/app/templates/docs/foo-bar.md'))
            .to.exist.to.contain('# Foo bar')
            .to.contain('Foo bar content');

          expect(file('tests/dummy/app/router.js')).to.contain(
            "this.route('foo-bar');",
          );

          expect(
            file('tests/dummy/app/templates/docs.hbs'),
          ).to.exist.to.contain(
            '<nav.item @label="Foo bar" @route="docs.foo-bar" />',
          );
        });
      });
  });
});

function copyFixtureFile(src, dest) {
  return fs.copy(src, path.join(process.cwd(), dest));
}

function getFixturePath(fixtureRelativePath) {
  const fixturesPath = path.join(__dirname, '../..', 'fixtures', 'blueprints');

  return path.join(fixturesPath, fixtureRelativePath);
}
