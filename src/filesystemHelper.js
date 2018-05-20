import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import recursiveReadDir from 'recursive-readdir';

const fileExists = file => fs.existsSync(file);

const directoryExists = directory => fs.existsSync(directory);

const createDirectoryIfNotExists = directory => {
  if (!directoryExists(directory)) {
    mkdirp(directory);
  }
};

const createFileIfNotExists = (directoryPath, fileName, content = '') => {
  const fullPath = path.join(directoryPath, fileName);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, { encoding: 'utf-8' });
  }
};

const deleteFile = filePath => fs.unlinkSync(filePath);

const writeFile = (directoryPath, fileName, content, overwrite = false) => {
  createDirectoryIfNotExists(directoryPath);

  const fullPath = path.resolve(directoryPath, fileName);

  if (overwrite && fileExists(fullPath)) {
    deleteFile(fullPath);
  }

  fs.writeFileSync(fullPath, content, { encoding: 'utf-8' });
};

const readFile = filePath => fs.readFileSync(filePath, { encoding: 'utf-8' });

const isDirectoryOrFile = (directoryOrFilePath, predicateFn) => {
  try {
    const stats = fs.statSync(directoryOrFilePath);
    return predicateFn(stats);
  } catch (e) {
    return false;
  }
};

const isDirectory = directoryOrFilePath =>
  isDirectoryOrFile(directoryOrFilePath, stats => stats.isDirectory());

const isFile = directoryOrFilePath =>
  isDirectoryOrFile(directoryOrFilePath, stats => stats.isFile());

const getFilesInDirectory = directory => {
  const directoryContents = fs.readdirSync(directory);
  return directoryContents.filter(dirOrFile => {
    const fullPath = path.join(directory, dirOrFile);
    return isFile(fullPath);
  });
};

const getFilesInSubDiretoriesRecursive = (
  directory,
  onCompleted,
  extensionToInclude,
  filesToIgnore
) => {
  const ignore = (file, stats) =>
    extensionToInclude
      ? !stats.isDirectory() && path.extname(file) !== extensionToInclude
      : false;

  recursiveReadDir(directory, [ignore, ...filesToIgnore], onCompleted);
};

const getFilesInSubDiretoriesRecursiveSync = (dir, filelist) => {
  // Thanks to kethinov: https://gist.github.com/kethinov/6658166
  const files = fs.readdirSync(dir);
  // eslint-disable-next-line no-param-reassign
  filelist = filelist || [];
  files.forEach(file => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      // eslint-disable-next-line no-param-reassign
      filelist = getFilesInSubDiretoriesRecursiveSync(
        path.join(dir, file),
        filelist
      );
    } else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const renameFile = (sourcePath, destinationPath) =>
  fs.renameSync(sourcePath, destinationPath);

export default {
  createDirectoryIfNotExists,
  createFileIfNotExists,
  directoryExists,
  fileExists,
  writeFile,
  readFile,
  isDirectory,
  deleteFile,
  getFilesInDirectory,
  getFilesInSubDiretoriesRecursive,
  getFilesInSubDiretoriesRecursiveSync,
  renameFile,
};
