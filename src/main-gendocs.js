/* eslint-disable no-undef */
/* eslint-disable no-console */

import path from 'path';
import chalk from 'chalk';
import argv from 'argv';
import fs from './filesystemHelper';
import parser from './parser';

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

const processReadFiles = outDirectory => (err, files) => {
  const failedFiles = [];
  const successfulFiles = [];
  const processedFiles = [];

  if (err) {
    console.log(`${chalk.red(err)}`);
    return;
  }

  if (!files || files.length === 0) {
    console.log(`${chalk.yellow('No files to process')}`);
    return;
  }

  const options = getOptions();

  files.forEach((file) => {
    processedFiles.push(file);

    if (options.verbose) {
      console.log(`${chalk.blue('Generating documentation from')} ${chalk.gray(file)}`);
    }

    const documentName = `${path.basename(file, path.extname(file))}${MD}`;
    const { ok, content, error } = parser.parseContent(file);

    if (ok) {
      fs.writeFile(outDirectory, documentName, content, true);

      const fullPath = path.resolve(outDirectory, documentName);
      successfulFiles.push(fullPath);

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
  console.log(`${chalk.yellow(successfulFiles.length)} ${chalk.green('files successfully parsed to documentation')}`);
  console.log(`${chalk.yellow(failedFiles.length)} ${chalk.red(`files failed. See ${path.resolve(outDirectory, '_errors.txt')} for details`)}`);
};

const main = () => {
  const options = getOptions();

  const srcDirectory = path.resolve(options.srcDirectory);
  console.log(`${chalk.white('Using source directory:')} ${chalk.gray(srcDirectory)}`);

  const outDirectory = path.resolve(options.outDirectory);
  fs.createDirectoryIfNotExists(outDirectory);
  console.log(`${chalk.white('Using output directory:')} ${chalk.gray(outDirectory)}`);

  const processFiles = processReadFiles(outDirectory);

  fs.getFilesInSubDiretoriesRecursive(srcDirectory, processFiles, JSX);
};

export default main;
