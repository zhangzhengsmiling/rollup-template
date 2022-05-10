import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import less from 'rollup-plugin-less';
import { PATH_MAIN_CSS } from './constants'

const PLUGIN_TERSER = terser();

const PLUGINS_COMMON = [
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
  commonjs(),
  less({
    output: PATH_MAIN_CSS,
    insert: false,
  }),
]

export const plugins = [
  ...PLUGINS_COMMON,
  PLUGIN_TERSER
];

export const pluginWithoutTerser = [
  ...PLUGINS_COMMON
];
