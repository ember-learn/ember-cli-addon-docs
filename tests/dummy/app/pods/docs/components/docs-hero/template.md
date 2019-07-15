# Docs Hero

This component helps you quickly get a hero section on your addon's homepage. The hero on the homepage of this site is an example.

The component has three arguments. By default, these arguments are pulled from your project's `package.json`:

  - `prefix` and `heading` come from the `name` field
  - `byline` comes from the `description` field

As long as these are present, you can just render `{{docs-hero}}` with no arguments:

{{docs/components/docs-hero/demo-1}}

You can also override any of the args if necessary:

{{docs/components/docs-hero/demo-2}}
