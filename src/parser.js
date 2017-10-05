import { parse as parseReactDocs } from 'react-docgen';
import ReactDocGenMarkdownRenderer from 'react-docgen-markdown-renderer';
import fs from './filesystemHelper';

const renderer = new ReactDocGenMarkdownRenderer({
  componentsBasePath: __dirname,
});

const parseContent = (filePath) => {
  const content = fs.readFile(filePath);

  try {
    const doc = parseReactDocs(content);

    const renderedContent = renderer.render(
      /* The path to the component, used for linking to the file. */
      filePath,
      /* The actual react-docgen AST */
      doc,
      /* Array of component ASTs that this component composes */
      [],
    );

    return { ok: true, content: renderedContent, error: null };
  } catch (e) {
    const error = { filePath, error: e };
    return { ok: false, content: null, error };
  }
};

export default {
  parseContent,
};
