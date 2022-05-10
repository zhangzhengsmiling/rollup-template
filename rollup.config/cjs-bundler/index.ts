import  * as path from 'path';
import { plugins, pathResolve, CURRENT_WORKSPACE_DIRECTORY } from '../common'
const entry = pathResolve('src');

const cjsBundler = () => {
  return {
    input: entry,
    output: {
      file: path.resolve(CURRENT_WORKSPACE_DIRECTORY, 'cjs/index.js'),
      format: 'cjs',
    },
    plugins,
    external: ['react'],
  }
};

export default cjsBundler
