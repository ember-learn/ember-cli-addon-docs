<h2 class='ad-flex ad-items-center ad-mt-8 docs-h2'>
  {{svg-jar 'logo-horizontal' width=40 height=16
    class='mr-2'}}
  Motivation
</h2>

<aside>Looking for the quickstart? {{docs-link 'Click here' 'docs.quickstart'}}.</aside>

Documenting software libraries has gotten easier. We have nicely-formatted README.md files, the ability to host custom sites for free on GitHub Pages, and even dedicated tools like [GitBook](https://www.gitbook.com/) and [ReadTheDocs](https://readthedocs.org/). But even though these tools have come a long way, modern developers have high expectations, and library authors can quickly find themselves juggling more tasks than they can manage.

Ember addons occupy a unique space here. Besides everything that's expected of any modern JavaScript library, there's even more that goes into authoring a library that plays nicely with an ecosystem as mature as Ember's. And too often addon authors with limited time must choose between being a better community citizen, or focusing on the core problem their library was created to solve in the first place.

These days, a well-maintained Ember addon should

- **Provide interactive demos of their components** in the context of an Ember app
- **Show current *and versioned* guides,** ideally whose content is verified by automated tests
- **Show current *and versioned* API documentation** derived from structured comments in source code
- **Have excellent test coverage** across a matrix of Ember and Ember CLI versions
- **Make it easy for contributors to correct documentation errors** in addition to submitting code fixes

Looking at the available tools for authoring docs, none proved satisfactory for all these needs. This is why addons deserve their own solution.
