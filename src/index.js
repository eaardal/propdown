/* eslint-disable no-undef */
/* eslint-disable no-console */

import path from 'path';
import { parse as parseReactDocs } from 'react-docgen';
import ReactDocGenMarkdownRenderer from 'react-docgen-markdown-renderer';
import chalk from 'chalk';
import argv from 'argv';
import fs from './filesystemHelper';

console.log('ARGS', argv);

const renderer = new ReactDocGenMarkdownRenderer({
  componentsBasePath: __dirname,
});

const srcDirectory = path.resolve(__dirname, 'src');

const documentationDirectoryPath = path.resolve('docs');
fs.createDirectoryIfNotExists(documentationDirectoryPath);

const failedFiles = [];

const processFiles = (err, files) => {
  files.forEach((file) => {
    console.log(`${chalk.blue('Processing file')} ${chalk.cyan(file)}`);

    const content = fs.readFile(file);
    const documentName = `${path.basename(file, path.extname(file))}${renderer.extension}`;

    try {
      const doc = parseReactDocs(content);

      const documentContent = renderer.render(
        /* The path to the component, used for linking to the file. */
        file,
        /* The actual react-docgen AST */
        doc,
        /* Array of component ASTs that this component composes */
        [],
      );

      fs.writeFile(documentationDirectoryPath, documentName, documentContent);
    } catch (e) {
      failedFiles.push({ file, error: e });
    }
  });
};

fs.getFilesInSubDiretoriesRecursive(srcDirectory, processFiles, '.jsx');

if (failedFiles.length > 0) {
  fs.createFileIfNotExists(
    documentationDirectoryPath,
    '_errors.txt',
    JSON.stringify(failedFiles, null, 2),
  );

  console.log(`${chalk.yellow(failedFiles.length)} ${chalk.red(`files failed. See ${path.resolve(documentationDirectoryPath, '_errors.txt')} for details`)}`);
}
