// create package.json, README, etc. for packages that don't have them yet
// 为尚不存在的软件包创建package.json，自述文件等

const args = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')
const baseVersion = require('../lerna.json').version

// 获取项目目录下 ../packages 文件夹的路径
const packagesDir = path.resolve(__dirname, '../packages')
// 获取 ../packages 文件夹下 所有的文件和文件夹（一层，未递归）
const files = fs.readdirSync(packagesDir)

// 遍历 ../packages 下的所有文件 和 文件夹
files.forEach(shortName => {
  // 判断如果是文件夹，则不遍历了
  if (!fs.statSync(path.join(packagesDir, shortName)).isDirectory()) {
    return
  }

  // -----start------ 在每个 packages/XXXX/ 下创建 package.json
  const name = shortName === `vue` ? shortName : `@vue/${shortName}`
  // 获取每个 packages/XXXX/ 下的 package.json 文件路径
  const pkgPath = path.join(packagesDir, shortName, `package.json`)

  // 判断 package.json 文件是否存在
  const pkgExists = fs.existsSync(pkgPath)
  if (pkgExists) {
    const pkg = require(pkgPath)
    // 如果 package.json 里的 private 为 true, 就不创建 package.json 文件了
    if (pkg.private) {
      return
    }
  }

  if (args.force || !pkgExists) {
    const json = {
      name,
      version: baseVersion,
      description: name,
      main: 'index.js',
      module: `dist/${shortName}.esm-bundler.js`,
      files: [`index.js`, `dist`],
      types: `dist/${shortName}.d.ts`,
      repository: {
        type: 'git',
        url: 'git+https://github.com/vuejs/vue.git'
      },
      keywords: ['vue'],
      author: 'Evan You',
      license: 'MIT',
      bugs: {
        url: 'https://github.com/vuejs/vue/issues'
      },
      homepage: `https://github.com/vuejs/vue/tree/dev/packages/${shortName}#readme`
    }
    // 为 packages/XXXX/ 创建 package.json 文件，并写入 json 字符串
    fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2))
  }
  // -----end------ 在每个 packages/XXXX/ 下创建 package.json

  // -----start------ 在每个 packages/XXXX/ 下创建 README.md
  // 读取每个 packages/XXXX/ 下 README.md 文件的路径
  const readmePath = path.join(packagesDir, shortName, `README.md`)
  // 如果 README.md 文件不存在
  if (args.force || !fs.existsSync(readmePath)) {
    // 创建 README.md 文件，并写入 `# ${XXX包名}`
    fs.writeFileSync(readmePath, `# ${name}`)
  }
  // -----end------ 在每个 packages/XXXX/ 下创建 README.md

  // -----start------ 在每个 packages/XXXX/ 下创建 api-extractor.json(api提取器)
  // 获取每个 packages/XXXX/ 下的 api-extractor.json 文件的路径
  const apiExtractorConfigPath = path.join(
    packagesDir,
    shortName,
    `api-extractor.json`
  )

  // 如果 api-extractor.json 文件不存在
  if (args.force || !fs.existsSync(apiExtractorConfigPath)) {

    // 创建 api-extractor.json 文件, 并写入内容
    fs.writeFileSync(
      apiExtractorConfigPath,
      `
{
  "extends": "../../api-extractor.json",
  "mainEntryPointFilePath": "./dist/packages/<unscopedPackageName>/src/index.d.ts",
  "dtsRollup": {
    "untrimmedFilePath": "./dist/<unscopedPackageName>.d.ts"
  }
}
`.trim()
    )
  }
  // -----end------ 在每个 packages/XXXX/ 下创建 api-extractor.json

  // -----start------ 在每个 packages/XXXX/src 下创建 index.ts
  // 获取  packages/XXXX/ 下的 src 文件夹的路径
  const srcDir = path.join(packagesDir, shortName, `src`)
  // 获取  packages/XXXX/ 下的 src/index.ts 文件的路径
  const indexPath = path.join(packagesDir, shortName, `src/index.ts`)

  // 如果 packages/XXXX/src/index.ts 文件不存在
  if (args.force || !fs.existsSync(indexPath)) {
    // 如果 packages/XXXX/src  文件夹不存在
    if (!fs.existsSync(srcDir)) {
      // 创建 packages/XXXX/src 文件夹
      fs.mkdirSync(srcDir)
    }
      // 创建 packages/XXXX/src/index.ts 文件
    fs.writeFileSync(indexPath, ``)
  }
  // -----end------ 在每个 packages/XXXX/src 下创建 index.ts

  // -----start------ 在每个 packages/XXXX 下创建 index.js
  // 获取  packages/XXXX/ 下的 index.js 文件的路径
  const nodeIndexPath = path.join(packagesDir, shortName, 'index.js')
  // 如果 index.js 文件不存在
  if (args.force || !fs.existsSync(nodeIndexPath)) {
    // 创建 index.js 文件，并写入内容
    fs.writeFileSync(
      nodeIndexPath,
      `
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/${shortName}.cjs.prod.js')
} else {
  module.exports = require('./dist/${shortName}.cjs.js')
}
    `.trim() + '\n'
    )
  }
  // -----end------ 在每个 packages/XXXX 下创建 index.js

})
