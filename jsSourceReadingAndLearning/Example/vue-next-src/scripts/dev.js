/*
Run Rollup in watch mode for development.
在观察模式运行 Rollup 进行开发

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "global"):
要指定观察的 package ，只需要传递具体名称和 formats 的类型（默认 global，选项：cjs）

```
# name supports fuzzy match. will watch all packages with name containing "dom"
# 名称支持模糊匹配。 将监视所有名称包含“ dom”的软件包
yarn dev dom

# specify the format to output
# 指定输出格式
yarn dev core --formats cjs

# Can also drop all __DEV__ blocks with:
# 也可以使用以下命令删除所有__DEV__块：
__DEV__=false yarn dev
```
*/

const execa = require('execa')
const { fuzzyMatchTarget } = require('./utils')
const args = require('minimist')(process.argv.slice(2)) // undefined
const target = args._.length ? fuzzyMatchTarget(args._)[0] : 'vue' // "vue"
const formats = args.formats || args.f // undefined
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7) // e2917fe

console.log("开始开发vue3……")


// rollup -wc --environment COMMIT:e2917fe,TARGET:vue,FORMATS:global

execa(
  'rollup',
  [
    '-wc',
    '--environment',
    [
      `COMMIT:${commit}`,
      `TARGET:${target}`,
      `FORMATS:${formats || 'global'}`
    ].join(',')
  ],
  {
    stdio: 'inherit'
  }
)
