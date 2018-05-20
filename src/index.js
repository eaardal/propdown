/* eslint-disable no-undef */
/* eslint-disable no-console */

import path from 'path';
import chalk from 'chalk';
import argv from 'argv';
import fs from './filesystemHelper';
import parser from './parser';

const END_OF_LINE = require('os').EOL;

const JSX = '.jsx';
const MD = '.md';
const DEFAULT_BOOKMARK = '## Generated component docs';

const parseArgs = () =>
  argv
    .option({
      name: 'src',
      short: 's',
      type: 'string',
      description: 'The source folder to recursively look for JSX files',
    })
    .option({
      name: 'out',
      short: 'o',
      type: 'string',
      description: 'The directory to put processed markdown',
    })
    .option({
      name: 'verbose',
      type: 'bool',
      description: 'Enable to output more details',
    })
    .option({
      name: 'indexFilePath',
      type: 'string',
      description:
        'The name or path of a file to use as the index file for all generated documentation, typically a readme markdown file.',
    })
    .option({
      name: 'indexFileBookmark',
      type: 'string',
      description:
        'The identifier of the start of the line where links to the documentation should be inserted. For example "## Components".',
    })
    .option({
      name: 'ignoreFiles',
      type: 'string',
      description:
        'List of files to ignore. Use comma to separate files. Filename should include extension',
    })
    .run();

const getOptions = () => {
  const args = parseArgs();
  return {
    outDirectory: args.options.out || 'docs',
    srcDirectory: args.options.src || 'src',
    verbose: args.options.verbose || false,
    indexFilePath: args.options.indexFilePath || null,
    indexFileBookmark: args.options.indexFileBookmark || null,
    ignoreFiles: args.options.ignoreFiles || null,
  };
};

const processFailedFiles = (failedFiles, outDirectory) => {
  fs.writeFile(
    outDirectory,
    '_errors.txt',
    JSON.stringify(failedFiles, null, 2),
    true
  );
};

const writeToIndexFile = options => {
  const filePath = path.resolve(options.indexFilePath);
  const dirName = path.dirname(options.indexFilePath);
  const fileName = path.basename(options.indexFilePath);

  fs.createFileIfNotExists(dirName, fileName);

  const file = fs.readFile(filePath);
  const lines = file.split(END_OF_LINE);

  const linesToKeep = [];
  const linesToDiscard = [];
  let foundBookmark = false;

  // eslint-disable-next-line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (
      line.trim().startsWith(options.indexFileBookmark) ||
      line.trim().startsWith(DEFAULT_BOOKMARK)
    ) {
      foundBookmark = true;
      linesToKeep.push(line);
      continue; // eslint-disable-line no-continue
    }

    if (foundBookmark && !line.trim().startsWith('#')) {
      linesToDiscard.push(line);
    } else {
      linesToKeep.push(line);
    }

    if (foundBookmark && line.trim().startsWith('#')) {
      foundBookmark = false;
    }
  }

  const linesToInsert = [];
  const emptyLine = '';

  linesToInsert.push(emptyLine);

  const outDirectory = path.resolve(options.outDirectory);
  const filesInOutDirectory = fs.getFilesInDirectory(outDirectory);

  filesInOutDirectory.forEach(f => {
    const linkToFile = `[${path.basename(f, '.md')}](${path.join(
      '.',
      options.outDirectory,
      f
    )})`;
    linesToInsert.push(linkToFile);
  });

  linesToInsert.push(emptyLine);

  const allLines = [];
  let foundExistingBookmarkSection = false;

  // eslint-disable-next-line
  for (let i = 0; i < linesToKeep.length; i++) {
    const line = linesToKeep[i];

    allLines.push(line);

    // If the bookmark section exists, insert here
    if (
      line.trim().startsWith(options.indexFileBookmark) ||
      line.trim().startsWith(DEFAULT_BOOKMARK)
    ) {
      foundExistingBookmarkSection = true;
      linesToInsert.forEach(lineToInsert => {
        allLines.push(lineToInsert);
      });
    }
  }

  // If no existing bookmark section exists, append lines at the end of the file
  if (!foundExistingBookmarkSection) {
    if (options.indexFileBookmark) {
      allLines.push(options.indexFileBookmark);
    } else {
      allLines.push(DEFAULT_BOOKMARK);
    }

    linesToInsert.forEach(l => allLines.push(l));
  }

  const outstr = allLines.reduce((acc, li) => {
    // eslint-disable-next-line no-param-reassign
    acc += `${li}${END_OF_LINE}`;
    return acc;
  }, '');

  fs.writeFile(dirName, fileName, outstr);
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

  files.forEach(file => {
    processedFiles.push(file);

    if (options.verbose) {
      console.log(
        `${chalk.blue('Generating documentation from')} ${chalk.gray(file)}`
      );
    }

    const documentName = `${path.basename(file, path.extname(file))}${MD}`;
    const { ok, content, error } = parser.parseContent(file, options);

    if (ok) {
      fs.writeFile(outDirectory, documentName, content, true);

      const fullPath = path.resolve(outDirectory, documentName);
      successfulFiles.push(fullPath);

      if (options.verbose) {
        console.log(
          `${chalk.green('Successfully saved to')} ${chalk.gray(fullPath)}`
        );
      }
    } else {
      if (options.verbose) {
        console.log(
          `${chalk.red('Failed to process')} ${chalk.gray(error.filePath)}`
        );
      }
      failedFiles.push(error);
    }
  });

  if (failedFiles.length > 0) {
    processFailedFiles(failedFiles, outDirectory);
  }

  console.log(
    `${chalk.yellow(processedFiles.length)} ${chalk.white('files processed')}`
  );
  console.log(
    `${chalk.yellow(successfulFiles.length)} ${chalk.green(
      'files successfully parsed to documentation'
    )}`
  );
  if (failedFiles.length > 0) {
    console.log(
      `${chalk.yellow(failedFiles.length)} ${chalk.red(
        `files failed. See ${path.resolve(
          outDirectory,
          '_errors.txt'
        )} for details`
      )}`
    );
  } else {
    console.log(
      `${chalk.yellow(failedFiles.length)} ${chalk.white('files failed')}`
    );
  }

  if (options.indexFilePath) {
    writeToIndexFile(options);
  }
};

const main = () => {
  const options = getOptions();

  const srcDirectory = path.resolve(options.srcDirectory);
  console.log(
    `${chalk.white('Using source directory:')} ${chalk.gray(srcDirectory)}`
  );

  const outDirectory = path.resolve(options.outDirectory);
  fs.createDirectoryIfNotExists(outDirectory);
  console.log(
    `${chalk.white('Using output directory:')} ${chalk.gray(outDirectory)}`
  );

  const processFiles = processReadFiles(outDirectory);

  console.log('options', options);
  const filesToIgnore = options.ignoreFiles
    ? options.ignoreFiles.split(',')
    : [];
  console.log('filesToIgnore', filesToIgnore);
  fs.getFilesInSubDiretoriesRecursive(
    srcDirectory,
    processFiles,
    JSX,
    filesToIgnore
  );
};

main();
