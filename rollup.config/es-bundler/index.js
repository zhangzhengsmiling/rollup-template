import path from 'path';
import fs from 'fs';
import _less from 'less';
import uglifyCss from 'uglifycss';
import { plugins, BUILD_DIR_NAME, filesOf, createDirectoryIfNotExist, CURRENT_WORKSPACE_DIRECTORY } from '../common'


const processENV = process.env.ENV;
console.log(processENV);

const toString = (d) => d.toString();
const readFileSync = (filename) => fs.readFileSync(filename);

const less2css = async (lessFiles) => {
  const d = lessFiles
    .map((p) => path.resolve(CURRENT_WORKSPACE_DIRECTORY, p))
    .map(readFileSync)
    .map(toString)
    .map((content, i) => _less.render(content, { filename: lessFiles[i] }));
  return Promise.all(d)
    .then((cssResults) => {
      const imports = cssResults.reduce((arr, item) => [...arr, ...item.imports], []);
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
        fs.writeFileSync(filename, uglifyCss.processString(content.css));
      });
    });
};

const esBundler = async () => {
  const allFiles = filesOf(path.resolve(CURRENT_WORKSPACE_DIRECTORY, 'src'));
  const tsFiles = allFiles.filter((p) => /.tsx$|.ts$/.test(p));
  const lessFiles = allFiles.filter((p) => /.less$/.test(p));

  const pathParser = (path) =>
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

export default esBundler;