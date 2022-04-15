import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

import fs from 'fs'

const pathResolve = (_path) => {
  const fullPath = path.resolve(process.cwd(), _path)
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath)
    if (!stats.isDirectory()) return path
    for (let i = 0; i < exts.length; i++) {
      const joinedPath = path.resolve(fullPath, `index${exts[i]}`)
      if (fs.existsSync(joinedPath)) {
        return joinedPath
      }
    }
    throw new Error(`Can't find file or directory, ${fullPath}`)
  }
  throw new Error(`Can't find file or directory, ${fullPath}`)
}

const processENV = process.env.ENV
console.log(processENV)

const plugins = [
  resolve(),
  typescript({
    check: false,
  }),
  babel({
    exclude: 'node_modules/**', // 防止打包node_modules下的文件
    runtimeHelpers: true, // 使plugin-transform-runtime生效
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          corejs: '2.6.10',
          targets: {
            ie: 10,
          },
        },
      ],
    ],
    plugins: [
      // 解决多个地方使用相同代码导致打包重复的问题
      ['@babel/plugin-transform-runtime'],
    ],
  }),
  terser(),
  commonjs(),
]

const exts = ['.js', '.jsx', '.ts', '.tsx']
const entry = pathResolve('src')


const filesOf = (dir) => {
  const readFileOfDir = (dir, results) => {
    const list = fs.readdirSync(dir)
      .map(item => path.resolve(dir, item));
    list.forEach((_path) => {
      const stats = fs.statSync(_path);
      if (stats.isDirectory()) {
        readFileOfDir(path.resolve(_path), results);
      } else {
        results.push(_path);
      }
    })
  }
  const result = [];
  readFileOfDir(dir, result);
  return result;
}

const esBundler = () => {


  const res = filesOf(path.resolve(__dirname, 'src'));
  console.log(res);
  const pathParser = (path) => path.replace(__dirname, '')
    .replace('/src/', '')
    .replace(/.ts$/, '')
    .replace(/.tsx$/, '')

  const input = res.reduce((temp, source) => {
    temp[pathParser(source)] = source;
    return temp;
  }, {})
  console.log(input);
  const sourceConfigs = [
    {
      input,
      output: [
        {
          dir: path.resolve(__dirname, 'rollup-es'),
          format: 'es',
        }
      ],
      plugins,
      external: ['react'],
    }
  ]


  return [...sourceConfigs]
}

const configs = [...esBundler()]

export default configs
