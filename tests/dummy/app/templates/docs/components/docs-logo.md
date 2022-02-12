# Docs Logo

An SVG logo that fills its container and takes on the current color.

By default it renders the Ember logo (you can also pass `@logo="ember"`):

<DocsDemo as |demo|>
  <demo.example @name="docs-logo-ember.hbs">
    <div class="my-ember-addon-logo">
      <DocsLogo />
    </div>
  </demo.example>

  <demo.snippet @name="docs-logo-ember.hbs" />
  <demo.snippet @name="docs-logo-ember-styles.scss" />
</DocsDemo>

Pass `@logo="ember-cli"` for the Ember CLI logo:

<DocsDemo as |demo|>
  <demo.example @name="docs-logo-ember-cli.hbs">
    <div class="my-ember-cli-addon-logo">
      <DocsLogo @logo="ember-cli" />
    </div>
  </demo.example>

  <demo.snippet @name="docs-logo-ember-cli.hbs" />
  <demo.snippet @name="docs-logo-ember-cli-styles.scss" />
</DocsDemo>

Pass `@logo="ember-data"` for the Ember Data logo:

<DocsDemo as |demo|>
  <demo.example @name="docs-logo-ember-data.hbs">
    <div class="my-ember-data-addon-logo">
      <DocsLogo @logo="ember-data" />
    </div>
  </demo.example>

  <demo.snippet @name="docs-logo-ember-data.hbs" />
  <demo.snippet @name="docs-logo-ember-data-styles.scss" />
</DocsDemo>
