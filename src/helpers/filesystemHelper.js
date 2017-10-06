import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import recursiveReadDir from 'recursive-readdir';

const fileExists = file => fs.existsSync(file);

const directoryExists = directory => fs.existsSync(directory);

const createDirectoryIfNotExists = (directory) => {
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

const getFilesInDirectory = (directory) => {
  const directoryContents = fs.readdirSync(directory);
  return directoryContents.filter((dirOrFile) => {
    const fullPath = path.join(directory, dirOrFile);
    return isFile(fullPath);
  });
};

const getFilesInSubDiretoriesRecursive = (directory, onCompleted, extensionToInclude) => {
  const ignore = (file, stats) =>
    (extensionToInclude
      ? !stats.isDirectory() && path.extname(file) !== extensionToInclude
      : false);

  recursiveReadDir(directory, [ignore], onCompleted);
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
  renameFile,
};
