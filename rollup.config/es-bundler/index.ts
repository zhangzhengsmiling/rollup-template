import * as path from 'path';
import * as fs from 'fs';
import _less from 'less';
import * as uglifyCss from 'uglifycss';
import { plugins, pluginWithoutTerser, BUILD_DIR_NAME, filesOf, createDirectoryIfNotExist, CURRENT_WORKSPACE_DIRECTORY } from '../common'
import dts from 'rollup-plugin-dts'

const processENV = process.env.ENV;
console.log(processENV);

const toString = (d: { toString: () => string }) => d.toString();
const readFileSync = (filename: string) => fs.readFileSync(filename);

const less2css = async (lessFiles: string[]) => {
  const d = lessFiles
    .map((p) => path.resolve(CURRENT_WORKSPACE_DIRECTORY, p))
    .map(readFileSync)
    .map(toString)
    .map((content, i) => _less.render(content, { filename: lessFiles[i] }));
  return Promise.all(d)
    .then((cssResults) => {
      const imports = cssResults.reduce((arr, item) => [...arr, ...item.imports], [] as string[]);
      return cssResults
        .map((item, i) => ({
          ...item,
          source: lessFiles[i],
        }))
        .filter((d) => !imports.includes(d.source))
        .map((d) => [
          d.source
            .replace(CURRENT_WORKSPACE_DIRECTORY, '')
            .replace('/src/', '')
            .replace(/.less$/, ''),
          d,
        ]);
    })
    .then((data) => {
      data.map(([name, content]) => {
        const filename = path.resolve(CURRENT_WORKSPACE_DIRECTORY, BUILD_DIR_NAME, name + '.css');
        createDirectoryIfNotExist(filename);
        if (typeof content !== 'string')
          fs.writeFileSync(filename, uglifyCss.processString(content.css));
      });
    });
};

const allFiles = filesOf(path.resolve(CURRENT_WORKSPACE_DIRECTORY, 'src'));
const tsFiles = allFiles.filter((p) => /.tsx$|.ts$/.test(p));
const lessFiles = allFiles.filter((p) => /.less$/.test(p));

const esBundler = async () => {
  const pathParser = (path: string) =>
    path
      .replace(CURRENT_WORKSPACE_DIRECTORY, '')
      .replace('/src/', '')
      .replace(/.ts$|.tsx$/, '');

  const input = tsFiles.reduce(
    (temp, source) => ({
      ...temp,
      [pathParser(source)]: source,
    }),
    {},
  );

  const sourceConfigs = {
    input,
    output: [
      {
        dir: path.resolve(CURRENT_WORKSPACE_DIRECTORY, BUILD_DIR_NAME),
        format: 'es',
      },
    ],
    plugins,
    external: ['react'],
  };
  await less2css(lessFiles);
  return sourceConfigs;
};

export const esDtsBundler = () => {
  const build = tsFiles.map(file => ({
    input: file,
    plugins: [...pluginWithoutTerser, dts()],
    output: {
      file: file.replace(/.ts|.tsx/, '.d.ts').replace(/src/, BUILD_DIR_NAME)
    }
  }))
  return build
}

export default esBundler;
