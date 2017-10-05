/* eslint-disable no-undef */
/* eslint-disable no-console */

import path from 'path';
import chalk from 'chalk';
import argv from 'argv';
import fs from './filesystemHelper';
import parser from './parser';

const JSX = '.jsx';

const processReadFiles = (outputDirectory, failedFiles) => (err, files) => {
  files.forEach((file) => {
    console.log(`${chalk.blue('Processing file')} ${chalk.cyan(file)}`);

    const documentName = `${path.basename(file, path.extname(file))}${JSX}`;
    const { ok, content, error } = parser.parseContent(file);

    if (ok) {
      fs.writeFile(outputDirectory, documentName, content);
    } else {
      failedFiles.push(error);
    }
  });
};

const processFailedFiles = (failedFiles, outputDirectory) => {
  fs.createFileIfNotExists(
    outputDirectory,
    '_errors.txt',
    JSON.stringify(failedFiles, null, 2),
  );

  console.log(`${chalk.yellow(failedFiles.length)} ${chalk.red(`files failed. See ${path.resolve(outputDirectory, '_errors.txt')} for details`)}`);
};

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
  }).run();

const getOptions = () => {
  const args = parseArgs();
  return {
    outDirectory: args.options.out || 'docs',
    srcDirectory: args.options.src || 'src',
  };
};

const main = () => {
  const options = getOptions();

  const outDirectory = path.resolve(options.outDirectory);
  fs.createDirectoryIfNotExists(outDirectory);

  const failedFiles = [];
  const processFiles = processReadFiles(outDirectory, failedFiles);

  const srcDirectory = path.resolve(__dirname, options.srcDirectory);
  fs.getFilesInSubDiretoriesRecursive(srcDirectory, processFiles, JSX);

  if (failedFiles.length > 0) {
    processFailedFiles(failedFiles, outDirectory);
  }
};

main();
