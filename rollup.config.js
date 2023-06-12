import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import rollupPostCss from 'rollup-plugin-postcss'
import fs from 'fs'
import dts from 'rollup-plugin-dts'
import url from 'postcss-url'
import rollPostcssInject2Css from 'rollup-plugin-postcss-inject-to-css'
import less from 'rollup-plugin-less'

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

const postCssConfig = {
  inject: true,
  plugins: [
    url({
      url: 'inline',
      maxSize: 1000000, // 所有图片转成base64
    }),
  ],
  extensions: ['.css', '.scss', '.less'],
}

const processENV = process.env.ENV

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
  rollupPostCss(postCssConfig),
  // less(),
  rollPostcssInject2Css({
    exclude: /\/node_modules\//,
  }),
]

const exts = ['.js', '.jsx', '.ts', '.tsx']
const entry = pathResolve('src')

const esBundler = () => {
  const dirs = fs.readdirSync(path.resolve(__dirname, 'src/modules'))
  const sourceConfigs = dirs.map((module) => ({
    input: pathResolve(`src/modules/${module}`),
    output: [
      {
        name: module,
        file: path.resolve(__dirname, `es/${module}/index.js`),
        format: 'es',
      },
    ],
    plugins,
    external: ['react'],
  }))

  // const dtsConfigs = dirs.map((module) => ({
  //   input: pathResolve(`src/modules/${module}`),
  //   output: [
  //     {
  //       name: module,
  //       file: path.resolve(__dirname, `es/${module}/index.d.ts`),
  //       format: 'es',
  //     },
  //   ],
  //   plugins: [dts()],
  // }))

  const rootDtsConfig = {
    input: entry,
    output: {
      file: path.resolve(__dirname, 'es/index.d.ts'),
    },
    plugins: [dts()],
  }

  if (!fs.existsSync(path.resolve(process.cwd(), 'es'))) fs.mkdirSync(path.resolve(process.cwd(), 'es'))

  const buffer = fs.readFileSync(entry)
  const strData = buffer.toString().replace(/\/modules/g, '')
  fs.writeFileSync(path.resolve(process.cwd(), 'es/index.js'), strData)

  // const modules = fs.readdirSync(path.resolve(process.cwd(), 'src/modules'))
  // console.log(modules)
  // const dtsConfigs = modules.map(module => {
  //   input: pathResolve()
  // })

  return [
    ...sourceConfigs,
    // ...dtsConfigs,
    rootDtsConfig,
  ]
}

// const cjsBundler = () => {
//   return [
//     {
//       input: entry,
//       output: {
//         file: path.resolve(__dirname, 'cjs/index.js'),
//         format: 'cjs',
//       },
//       plugins,
//       external: ['react'],
//     },
//   ]
// }

// const umdBundler = () => {
//   return [
//     {
//       input: entry,
//       output: {
//         name: 'ICEMaterial',
//         file: path.resolve(__dirname, 'dist/index.js'),
//         format: 'umd',
//         globals: {
//           react: 'React',
//         },
//       },
//       plugins,
//       external: ['react'],
//     },
//   ]
// }

const configs = [...esBundler()]

export default configs
