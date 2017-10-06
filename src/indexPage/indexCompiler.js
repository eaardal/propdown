import handlebars from 'handlebars';
import path from 'path';
import chalk from 'chalk';
import markdown from '../helpers/markdown';
import fs from '../helpers/filesystemHelper';
import template from './index-template.hbs';

handlebars.registerHelper('list', (items, options) => {
  let out = '<ul class="list">';

  // eslint-disable-next-line
  for (let i = 0, l = items.length; i < l; i++) {
    out = `${out}
      <li>${options.fn(items[i])}</li>
    `;
  }

  return `${out}</ul>`;
});

handlebars.registerHelper('markdown', (components) => {
  let out = '<div id="markdown">';

  components.forEach((component) => {
    const html = markdown.render(component.markdown);
    out = `${out}
    <div id="${component.id}" class="hidden">
      ${html}
    </div>
    `;
  });

  return `${out}</div>`;
});

const compile = (components, options = {}) => {
  const directory = path.resolve(options.outDirectory || 'docs');
  const file = options.indexFileName || 'index.html';
  const title = options.indexTitle || 'Propdown';

  const html = template({ title, components });

  fs.writeFile(directory, file, html, true);

  console.log(`${chalk.green(`Compiled ${file}`)}`);
};

export default {
  compile,
};
