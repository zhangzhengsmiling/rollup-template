import path from 'path';
import { plugins, pathResolve, CURRENT_WORKSPACE_DIRECTORY } from '../common'
const entry = pathResolve('src');

const umdBundler = () => {
  return {
    input: entry,
    output: {
      name: 'ICEMaterial',
      file: path.resolve(CURRENT_WORKSPACE_DIRECTORY, 'dist/index.js'),
      format: 'umd',
      globals: {
        react: 'React',
      },
    },
    plugins,
    external: ['react'],
  };
};

export default umdBundler;
