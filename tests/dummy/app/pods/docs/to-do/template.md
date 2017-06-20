# TODO

To build:

- PR to markdown-templates to wrap compiled templates in an optional classname div
- Add API for rendering a docs-viewer page as a full-page
- Add "Edit this page" link to the top of every page
- Add &lt; and &gt; arrows to the bottom of each page of the docs-viewer
- Mobile navigation for docs-viewer
- Some acceptance tests (with links as examples)
- Heading links
- **API Reference.** Bug right now when rendering &#123;&#123;&#123; &#125;&#125;&#125; content
    - Want to autobuild this section from the data
    - apireference=true should be an option to the `docs-viewer.nav`

To document:

- How it supports older versions of sites. Want to be able to migrate Mirage's docs, Liquid Fire's docs etc.
- Explain CSS convention. All our css classes are prefixed with `docs-`. Components look like this: `docs-hero`, utilities like this `docs__center`. Pick and choose what you'd like. We want addon authors to be able to make their own unique sites.
- Explain the reasoning around docs layout: left-hand nav, etc.

Future ideas:

- Blueprint generator to scaffold a site/nav
- Single-page viewer for simple addons
