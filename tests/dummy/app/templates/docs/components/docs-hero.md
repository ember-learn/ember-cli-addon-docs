# Docs Hero

This component helps you quickly get a hero section on your addon's homepage. The hero on the homepage of this site is an example.

The component has three arguments. By default, these arguments are pulled from your project's `package.json`:

  - `prefix` and `heading` come from the `name` field
  - `byline` comes from the `description` field

As long as these are present, you can just render `{{docs-hero}}` with no arguments:

{{#docs-demo as |demo|}}
  {{#demo.example name="docs-hero-1.hbs"}}
    {{docs-hero}}
  {{/demo.example}}

  {{demo.snippet "docs-hero-1.hbs"}}
{{/docs-demo}}

You can also override any of the args if necessary:

{{#docs-demo as |demo|}}
  {{#demo.example name="docs-hero-2.hbs"}}
    {{docs-hero
      prefix="EmberData"
      heading="Something"
      byline="The best addon ever. Now playing in theaters."
      class="some-custom-class"
    }}
  {{/demo.example}}

  {{demo.snippet "docs-hero-2.hbs"}}
{{/docs-demo}}
