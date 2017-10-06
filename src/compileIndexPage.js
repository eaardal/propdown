import indexCompiler from './indexPage/indexCompiler';

const md = `
## ActionButton

A generic button to use in ActionList

prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
**Icon** | \`Function\` |  | :white_check_mark: | The icon to be displayed in the button
**className** | \`String\` | \`'action-list__button'\` | :x: | The class name to apply to internal DOM elements.
**disabled** | \`Boolean\` | \`false\` | :x: | Is the button disabled?
**onClick** | \`Function\` |  | :white_check_mark: | The click handler to be executed when the button is clicked
**showSpinner** | \`Boolean\` | \`false\` | :x: | Should the spinner be active?
**value** | \`String\` |  | :white_check_mark: | The text to be displayed on the button
`;

const md2 = `
## ActionList

prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
**Icon** | \`Function\` |  | :white_check_mark: | The icon to be displayed in the button
**className** | \`String\` | \`'action-list__button'\` | :x: | The class name to apply to internal DOM elements.
`;

const md3 = `
## EditButton

A generic button to use in ActionList

prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
**value** | \`String\` |  | :white_check_mark: | The text to be displayed on the button
`;

const components = [
  {
    id: 1,
    title: 'ActionButton',
    markdown: md,
  },
  {
    id: 2,
    title: 'ActionList',
    markdown: md2,
  },
  {
    id: 3,
    title: 'EditButton',
    markdown: md3,
  },
];

const options = {
  outDirectory: 'docs',
  indexFileName: 'index.html',
  indexTitle: 'Propdown',
};

indexCompiler.compile(components, options);
