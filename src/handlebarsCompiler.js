/* eslint-disable no-undef */
/* eslint-disable no-console */

import handlebars from 'handlebars';
import path from 'path';
import chalk from 'chalk';
import template from './index-template.hbs';
import fs from './filesystemHelper';

handlebars.registerHelper('list', (items, options) => {
  let out = '<ul>';

  for (let i = 0, l = items.length; i < l; i++) { // eslint-disable-line
    out = out + '<li>' + options.fn(items[i]) + '</li>'; // eslint-disable-line
  }

  return out + '</ul>'; // eslint-disable-line
});

const createLinks = components =>
  components.map(c => ({
    title: c.title,
    url: c.path,
  }));

const compile = (components) => {
  const componentLinks = createLinks(components || []);
  const html = template({ title: 'Propdown', componentLinks });
  // console.log(html);
  fs.writeFile(path.resolve('docs'), 'index.html', html, true);

  console.log(`${chalk.green('Compiled index.html')}`);
};

export default {
  compile,
};
