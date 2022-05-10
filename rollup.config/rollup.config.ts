import esBundler from './es-bundler';
import cjsBundler from './cjs-bundler';
import umdBundler from './umd-bundler';

export default Promise.all(
  [
    esBundler(),
    cjsBundler(),
    umdBundler(),
  ]
);
