import Markdownit from 'markdown-it';
import emojis from 'markdown-it-emoji';

const markdownIt = new Markdownit();
markdownIt.use(emojis);

export default markdownIt;
