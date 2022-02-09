# Docs Viewer

The page layout you're viewing right now, including the side nav on the left and the main center panel, come from the Docs Viewer component. This component is an opinionated setup intended to be used with a dedicated <code>docs</code> route.

Both the side nav section and the main area fill up the available height and are independently scrollable. This is a nice pattern used by many other online documentation viewers that gives your users easy access to navigation while also letting them focus on individual pieces of content without getting overwhelmed.


The nav is designed to be flexible enough for simple and complex addons. You should feel free to structure it as you see fit (some addons will need one section for Components but some will want more, and so on).


The large main area is also useful for addons that need more space to illustrate a concept or show a demo. However, most pages in an addon's docs site should be optimized for reading.


To use the Docs Viewer, create a <code>docs</code> route and put your docs-viewer there. Here's how we're using it in this app:

<DocsSnippet @name="docs-viewer.hbs"/>
