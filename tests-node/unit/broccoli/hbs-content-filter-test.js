'use strict';

const assert = require('chai').assert;
const HBSContentFilter = require('../../../lib/broccoli/hbs-content-filter');

describe('Unit | hbs-content-filter', function () {
  let filter;

  beforeEach(function () {
    filter = new HBSContentFilter('.');
  });

  it('extracts the title and body from an hbs template', function () {
    let result = JSON.parse(
      filter.processString(
        '<h1>Title</h1><p>Some text</p>',
        'templates/docs/page.hbs',
      ),
    );

    assert.deepEqual(result, { title: 'Title', body: 'TitleSome text' });
  });

  it('handles gjs and gts files', function () {
    assert.includeMembers(filter.extensions, ['hbs', 'gjs', 'gts']);

    let gjs = `
      import Foo from './foo';

      <template>
        <h1>Title</h1>
        <p>Some text</p>
      </template>
    `;
    let gts = `
      import Component from '@glimmer/component';

      export default class Page extends Component {
        count: number = 1;

        <template>
          <h1>Title</h1>
          <p>Some text</p>
        </template>
      }
    `;

    for (let [path, source] of [
      ['templates/docs/page.gjs', gjs],
      ['templates/docs/page.gts', gts],
    ]) {
      let result = JSON.parse(filter.processString(source, path));

      assert.equal(result.title, 'Title', path);
      assert.include(result.body, 'Some text', path);
      assert.notInclude(result.body, 'import', path);
    }
  });

  it('includes the content of every template tag in a gjs file', function () {
    let source = `
      const Intro = <template><h2>Intro</h2></template>;

      <template><h1>Page</h1><Intro /></template>
    `;
    let result = JSON.parse(
      filter.processString(source, 'templates/docs/page.gjs'),
    );

    assert.include(result.body, 'Intro');
    assert.include(result.body, 'Page');
    assert.equal(result.title, 'Page');
  });
});
