# Index Page

The Index Page is a self-contained html page listing all components that was processed at build time.

### How it works:

1. Compile React components to markdown
2. Take the result (list of components + options) and pass it to the index compiler
3. Embed all markdown in the HTML using HandlebarsJS (see the `registerHelper` function for `"markdown"` in `indexCompiler.js`) but hidden using CSS. Each div hiding the markdown has it's `id` attribute set to `component.id`.
4. Render a link in the left-hand side menu for each component, using the `component.id` as the `href` (see `registerHelper` function for `"list"` in `indexCompiler.js`)
5. JavaScript embedded in the handlebars template registers a click handler on each link.
6. When a link is clicked, the click handler finds all hidden markdown divs and looks for one with an `id` attribute matching the clicked link's `href`. It then sets the matching div's CSS to visible and hides the others.

### Resources

* Handlebars [http://handlebarsjs.com/](http://handlebarsjs.com/)
* GitHub markdown styling from [https://github.com/sindresorhus/github-markdown-css](https://github.com/sindresorhus/github-markdown-css)
* Markdown compiler [https://github.com/markdown-it/markdown-it](https://github.com/markdown-it/markdown-it)
* Markdown emojis [https://github.com/markdown-it/markdown-it-emoji](https://github.com/markdown-it/markdown-it-emoji)
