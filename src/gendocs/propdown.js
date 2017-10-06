/* eslint-disable no-undef */
/* eslint-disable no-console */

import path from 'path';
import chalk from 'chalk';
import argv from 'argv';
import fs from '../helpers/filesystemHelper';
import reactDocParser from '../helpers/reactDocParser';

const JSX = '.jsx';
const MD = '.md';

const parseArgs = () =>
  argv.option({
    name: 'src',
    short: 's',
    type: 'string',
    description: 'The source folder to recursively look for JSX files',
  }).option({
    name: 'out',
    short: 'o',
    type: 'string',
    description: 'The directory to put processed markdown',
  }).option({
    name: 'verbose',
    type: 'bool',
    description: 'Enable to output more details',
  }).run();

const getOptions = () => {
  const args = parseArgs();
  return {
    outDirectory: args.options.out || 'docs',
    srcDirectory: args.options.src || 'src',
    verbose: args.options.verbose || false,
    indexFileName: args.options.indexFileName || 'index.html',
    indexTitle: args.options.indexTitle || 'Propdown',
  };
};

const processFailedFiles = (failedFiles, outDirectory) => {
  fs.writeFile(
    outDirectory,
    '_errors.txt',
    JSON.stringify(failedFiles, null, 2),
    true,
  );
};

const createComponents = successfulComponents =>
  successfulComponents.map((comp, index) => ({
    id: index + 1,
    title: comp.title,
    markdown: comp.markdown,
  }));

const processReadFiles = (outDirectory, resolve, reject) => (err, files) => {
  const failedFiles = [];
  const successfulComponents = [];
  const processedFiles = [];

  if (err) {
    console.log(`${chalk.red(err)}`);
    reject(err);
    return;
  }

  if (!files || files.length === 0) {
    const errorMessage = 'No files to process';
    console.log(`${chalk.yellow(errorMessage)}`);
    reject(errorMessage);
    return;
  }

  const options = getOptions();

  files.forEach((file) => {
    processedFiles.push(file);

    if (options.verbose) {
      console.log(`${chalk.blue('Generating documentation from')} ${chalk.gray(file)}`);
    }

    const fileName = path.basename(file, path.extname(file));
    const documentName = `${fileName}${MD}`;
    const { ok, content, error } = reactDocParser.parseContent(file);

    if (ok) {
      fs.writeFile(outDirectory, documentName, content, true);

      const fullPath = path.resolve(outDirectory, documentName);
      successfulComponents.push({ path: fullPath, markdown: content, title: fileName });

      if (options.verbose) {
        console.log(`${chalk.green('Successfully saved to')} ${chalk.gray(fullPath)}`);
      }
    } else {
      if (options.verbose) {
        console.log(`${chalk.red('Failed to process')} ${chalk.gray(error.filePath)}`);
      }
      failedFiles.push(error);
    }
  });

  if (failedFiles.length > 0) {
    processFailedFiles(failedFiles, outDirectory);
  }

  console.log(`${chalk.yellow(processedFiles.length)} ${chalk.white('files processed')}`);
  console.log(`${chalk.yellow(successfulComponents.length)} ${chalk.green('files successfully parsed to documentation')}`);
  console.log(`${chalk.yellow(failedFiles.length)} ${chalk.red(`files failed. See ${path.resolve(outDirectory, '_errors.txt')} for details`)}`);

  const components = createComponents(successfulComponents);
  resolve({ components, options });
};

const main = () => {
  const options = getOptions();

  const srcDirectory = path.resolve(options.srcDirectory);
  console.log(`${chalk.white('Using source directory:')} ${chalk.gray(srcDirectory)}`);

  const outDirectory = path.resolve(options.outDirectory);
  fs.createDirectoryIfNotExists(outDirectory);
  console.log(`${chalk.white('Using output directory:')} ${chalk.gray(outDirectory)}`);

  return new Promise((resolve, reject) => {
    const processFiles = processReadFiles(outDirectory, resolve, reject);
    fs.getFilesInSubDiretoriesRecursive(srcDirectory, processFiles, JSX);
  });
};

export default main;
