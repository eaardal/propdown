import propdown from './gendocs/propdown';
import indexCompiler from './indexPage/indexCompiler';

propdown()
  .then(({ components, options }) => {
    indexCompiler.compile(components, options);
  });
