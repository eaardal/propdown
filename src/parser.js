/* eslint-disable */

import path from 'path';
import { parse as parseReactDocs } from 'react-docgen';
import ReactDocGenMarkdownRenderer from 'react-docgen-markdown-renderer';
import fs from './filesystemHelper';
import { match } from 'react-docgen/dist/utils';

const renderer = new ReactDocGenMarkdownRenderer({
  componentsBasePath: __dirname,
});

const isPropTypesVariableAssignment = node => {
  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'AssignmentExpression' &&
    node.expression.left.property.name === 'propTypes'
  );
};

const extractImportedObjects = ast => {
  const importedObjectNames = [];

  const imports = ast.body.filter(n => n.type === 'ImportDeclaration');
  imports.forEach(n2 => {
    const defaultImports = n2.specifiers.filter(
      specifier => specifier.type === 'ImportDefaultSpecifier'
    );
    defaultImports.forEach(s => {
      // console.log("Default import:", s.local.name);
      importedObjectNames.push({
        name: s.local.name,
        fileName: path.basename(n2.source.value),
        path: n2.source.value,
      });
    });

    const namedImports = n2.specifiers.filter(
      specifier => specifier.type === 'ImportSpecifier'
    );
    namedImports.forEach(s => {
      // console.log("Named import:", s.local.name);
      importedObjectNames.push({
        name: s.local.name,
        fileName: path.basename(n2.source.value),
        path: n2.source.value,
      });
    });
  });

  return importedObjectNames;
};

const getAllFiles = dir => {
  const files = fs
    .getFilesInSubDiretoriesRecursiveSync(dir)
    .map(file => {
      const dir = path.basename(__dirname);
      // console.log('dir', dir);
      // console.log('file', file);
      if (file.startsWith(dir)) {
        const newFileName = file.substring(dir.length + 1, file.length);
        // console.log('newFileName', newFileName);
        return newFileName;
      }
      return file;
    })
    .map(file => ({
      fileName: path.basename(file),
      filePath: path.join(__dirname, file),
    }))
    .reduce((existingFiles, f) => {
      if (fs.fileExists(f.filePath)) {
        existingFiles.push(f);
      }
      return existingFiles;
    }, []);
  console.log('files', files);
  return files;
};

const resolve = options => (ast, recast) => {
  // console.log(ast);
  try {
    const existingFiles = getAllFiles(options.srcDirectory);

    ast.body.forEach(node => {
      if (isPropTypesVariableAssignment(node)) {
        // console.log(node);
        if (node.expression.right.type === 'ObjectExpression') {
          node.expression.right.properties.forEach(objectProperty => {
            // console.log("objectProperty", objectProperty);

            const propertyValue = objectProperty.value.name;
            // console.log("propertyValue", propertyValue);
            // console.log(ast.body.map(n => n.type));
            const importedObjects = extractImportedObjects(ast);
            // console.log('names', importedObjects);

            const importedPropType = importedObjects.find(
              obj => obj.name === propertyValue
            );
            if (importedPropType) {
              // console.log('THIS PROPTYPE IS IMPORTED', importedPropType);

              const potentialFileNames = [
                `${importedPropType.fileName}.js`,
                `${importedPropType.fileName}.jsx`,
              ];

              let foundMatch = false;
              let matchingFile = null;

              existingFiles.forEach(file => {
                potentialFileNames.forEach(pot => {
                  if (!foundMatch && file.fileName === pot) {
                    foundMatch = true;
                    matchingFile = file;
                  }
                });
              });

              if (foundMatch) {
                console.log('FOUND MATCHING FILE', matchingFile);
              }
            }
          });
        }
      }
    });
  } catch (error) {
    console.log('ERROR', error);
  }
};

const parseContent = (filePath, options) => {
  const content = fs.readFile(filePath);

  try {
    const doc = parseReactDocs(content, resolve(options));

    const renderedContent = renderer.render(
      /* The path to the component, used for linking to the file. */
      filePath,
      /* The actual react-docgen AST */
      doc,
      /* Array of component ASTs that this component composes */
      []
    );

    return { ok: true, content: renderedContent, error: null };
  } catch (e) {
    const error = { filePath, error: e.toString() };
    return { ok: false, content: null, error };
  }
};

export default {
  parseContent,
};
