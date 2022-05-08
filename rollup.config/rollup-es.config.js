import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import less from 'rollup-plugin-less'
import fs from 'fs'
import _less from 'less'
import uglifyCss from 'uglifycss'

const CURRENT_WORKSPACE_DIRECTORY = process.cwd()
const BUILD_DIR_NAME = 'rollup-es'
const PATH_MAIN_CSS = `${BUILD_DIR_NAME}/style.css`
const exts = ['.js', '.jsx', '.ts', '.tsx']

const pathResolve = (_path) => {
  const fullPath = path.resolve(CURRENT_WORKSPACE_DIRECTORY, _path)
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
  less({
    output: PATH_MAIN_CSS,
    insert: false,
  }),
]

// read all files of a directory
const filesOf = (dir) => {
  const readFileOfDir = (dir, results) => {
    const list = fs.readdirSync(dir).map((item) => path.resolve(dir, item))
    list.forEach((_path) => {
      const stats = fs.statSync(_path)
      if (stats.isDirectory()) {
        readFileOfDir(path.resolve(_path), results)
      } else {
        results.push(_path)
      }
    })
  }
  const result = []
  readFileOfDir(dir, result)
  return result
}

const create = (p) => {
  const parsed = path.parse(p)
  fs.mkdirSync(parsed.dir, { recursive: true })
}

const toString = (d) => d.toString()
const readFileSync = (filename) => fs.readFileSync(filename)

const less2css = (lessFiles) => {
  const d = lessFiles
    .map((p) => path.resolve(CURRENT_WORKSPACE_DIRECTORY, p))
    .map(readFileSync)
    .map(toString)
    .map((content, i) => _less.render(content, { filename: lessFiles[i] }))
  return Promise.all(d)
    .then((cssResults) => {
      const imports = cssResults.reduce((arr, item) => [...arr, ...item.imports], [])
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
        ])
    })
    .then((data) => {
      data.map(([name, content]) => {
        const filename = path.resolve(CURRENT_WORKSPACE_DIRECTORY, BUILD_DIR_NAME, name + '.css')
        create(filename)
        fs.writeFileSync(filename, uglifyCss.processString(content.css))
      })
    })
}

const esBundler = async () => {
  const allFiles = filesOf(path.resolve(CURRENT_WORKSPACE_DIRECTORY, 'src'))
  const tsFiles = allFiles.filter((p) => /.tsx$|.ts$/.test(p))
  const lessFiles = allFiles.filter((p) => /.less$/.test(p))

  const pathParser = (path) =>
    path
      .replace(CURRENT_WORKSPACE_DIRECTORY, '')
      .replace('/src/', '')
      .replace(/.ts$|.tsx$/, '')

  const input = tsFiles.reduce(
    (temp, source) => ({
      ...temp,
      [pathParser(source)]: source,
    }),
    {},
  )

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
  }
  await less2css(lessFiles)
  return sourceConfigs
}

export default Promise.all([esBundler()])
