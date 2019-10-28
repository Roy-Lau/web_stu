/*
Produces production builds and stitches together d.ts files.
生成生产版本并将 d.ts 文件合并到一起。

To specify the package to build, simply pass its name and the desired build
formats to output (defaults to `buildOptions.formats` specified in that package,
or "esm,cjs"):
要指定要构建的软件包，只需传递其名称和所需的构建输出格式（默认为该包中指定的“ buildOptions.formats”，或“ esm，cjs”）：

```
# name supports fuzzy match. will build all packages with name containing "dom":
名称支持模糊匹配。 将构建名称包含“dom”的所有软件包：
yarn build dom

# specify the format to output
指定输出格式
yarn build core --formats cjs
```
*/

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const execa = require('execa')
const { gzipSync } = require('zlib')
const { compress } = require('brotli')
const { targets: allTargets, fuzzyMatchTarget } = require('./utils')

const args = require('minimist')(process.argv.slice(2))
const targets = args._
const formats = args.formats || args.f
const devOnly = args.devOnly || args.d
const prodOnly = !devOnly && (args.prodOnly || args.p)
const buildAllMatching = args.all || args.a
const lean = args.lean || args.l
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

run()
/**
 * 运行 build 程序
 */
async function run() {
  // 如果 targets.length 为 0 ，打包所有的 packages（yarn build 没有带参数走这个）
  if (!targets.length) {
    /**
     allTargets 值如下
    [ 'compiler-core',
      'compiler-dom',
      'reactivity',
      'runtime-core',
      'runtime-dom',
      'runtime-test',
      'server-renderer',
      'template-explorer',
      'vue' ]
      */
    await buildAll(allTargets)
    checkAllSizes(allTargets)
  } else {// 如果 targets.length 不为 0 ，打包指定的 packages（yarn build dom 走这个）[ 'compiler-dom' ]
    await buildAll(fuzzyMatchTarget(targets, buildAllMatching))
    checkAllSizes(fuzzyMatchTarget(targets, buildAllMatching))
  }
}

async function buildAll(targets) {
  for (const target of targets) {
    await build(target)
  }
}

async function build(target) {
  const pkgDir = path.resolve(`packages/${target}`)
  const pkg = require(`${pkgDir}/package.json`)

  // 删除原来打包的目录
  await fs.remove(`${pkgDir}/dist`)

  // 获取打包环境（development: 开发, production: 生产）
  const env =
    (pkg.buildOptions && pkg.buildOptions.env) ||
    (devOnly ? 'development' : 'production')

  // 执行 rollup 进行打包 packages
  await execa(
    'rollup',
    [
      '-c',
      '--environment',
      [
        `COMMIT:${commit}`,
        `NODE_ENV:${env}`,
        `TARGET:${target}`,
        formats ? `FORMATS:${formats}` : ``,
        args.types ? `TYPES:true` : ``,
        prodOnly ? `PROD_ONLY:true` : ``,
        lean ? `LEAN:true` : ``
      ]
        .filter(Boolean)
        .join(',')
    ],
    { stdio: 'inherit' }
  )

  // 如果传入离开 types 参数，或 package.json 里 types 的值为 true，打包出 typescript 语法文件
  if (args.types && pkg.types) {
    console.log()
    console.log(
      chalk.bold(chalk.yellow(`Rolling up type definitions for ${target}...`))
    )

    // build types
    const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

    const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
    const extractorConfig = ExtractorConfig.loadFileAndPrepare(
      extractorConfigPath
    )
    const result = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: true
    })

    if (result.succeeded) {
      console.log(
        chalk.bold(chalk.green(`API Extractor completed successfully.`))
      )
    } else {
      console.error(
        `API Extractor completed with ${extractorResult.errorCount} errors` +
          ` and ${extractorResult.warningCount} warnings`
      )
      process.exitCode = 1
    }

    await fs.remove(`${pkgDir}/dist/packages`)
  }
}

/**
 * 遍历检查所有文件的大小，调用 checkSize
 * @param {*} targets 目标文件
 */
function checkAllSizes(targets) {
  console.log()
  for (const target of targets) {
    checkSize(target)
  }
  console.log()
}
/**
 * 检查文件大小
 * @param {String} target 要检查文件的目录
 */
function checkSize(target) {
  const pkgDir = path.resolve(`packages/${target}`)
  const esmProdBuild = `${pkgDir}/dist/${target}.global.prod.js`
  if (fs.existsSync(esmProdBuild)) {
    const file = fs.readFileSync(esmProdBuild)
    const minSize = (file.length / 1024).toFixed(2) + 'kb'
    const gzipped = gzipSync(file)
    const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'
    const compressed = compress(file)
    const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb'
    console.log(
      `${chalk.gray(
        chalk.bold(target)
      )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
    )
  }
}
