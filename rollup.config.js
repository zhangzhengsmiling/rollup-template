import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

import fs from 'fs'
import dts from 'rollup-plugin-dts'

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
      // '@babel/preset-typescript',
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

const esBundler = () => {
  const dirs = fs.readdirSync(path.resolve(__dirname, 'src/modules'))
  const configs = dirs.map((module) => ({
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

  dirs.forEach((module) => {
    configs.push({
      input: pathResolve(`src/modules/${module}`),
      output: [
        {
          name: module,
          file: path.resolve(__dirname, `es/${module}/index.d.ts`),
          format: 'es',
        },
      ],
      plugins: [dts()],
    })
  })

  configs.push({
    input: 'src/index.tsx',
    output: {
      file: path.resolve(__dirname, 'es/index.d.ts'),
    },
    plugins: [dts()],
  })

  if (!fs.existsSync(path.resolve(process.cwd(), 'es'))) {
    fs.mkdirSync(path.resolve(process.cwd(), 'es'))
  }
  const buffer = fs.readFileSync(path.resolve(process.cwd(), 'src/index.tsx'))
  const strData = buffer.toString().replaceAll('/modules', '')

  fs.writeFileSync(path.resolve(process.cwd(), 'es/index.js'), strData)

  return configs
}

const cjsBundler = () => {
  return [
    {
      input: 'src/index.tsx',
      output: {
        file: path.resolve(__dirname, 'cjs/index.js'),
        format: 'cjs',
      },
      plugins,
      external: ['react'],
    },
  ]
}

const umdBundler = () => {
  return [
    {
      input: 'src/index.tsx',
      output: {
        name: 'ICEMaterial',
        file: path.resolve(__dirname, 'dist/index.js'),
        format: 'umd',
        globals: {
          react: 'React',
        },
      },
      plugins,
      external: ['react'],
    },
  ]
}

const configs = [...esBundler(), ...cjsBundler(), ...umdBundler()]

export default configs
