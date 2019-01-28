const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const rollup = require('rollup')
const uglify = require('uglify-js')

/**
 * 判断 `dist`目录是否存在
 * @param  {Blooem} !fs.existsSync('dist') 如果不存在
 * @return {Object}                        创建一个 `dist` 目录
 */
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

// 获取构建需要用到的配置
let builds = require('./config').getAllBuilds()

// filter builds via command line arg
// 过滤配置
// 如： npm run build -- weex
//      process.argv[2] 对应 -- weex
if (process.argv[2]) {
  const filters = process.argv[2].split(',')
  builds = builds.filter(b => {
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
} else {
  // filter out weex builds by default
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1
  })
}

// 构建
build(builds)

function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}

function buildEntry (config) {
  const output = config.output
  const { file, banner } = output
  const isProd = /min\.js$/.test(file)
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(({ code }) => {
      // 判断是不是生产环境
      if (isProd) {
        // 判断是否需要压缩
        var minified = (banner ? banner + '\n' : '') + uglify.minify(code, {
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code
        return write(file, minified, true)
      } else {
        return write(file, code)
      }
    })
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

// 获取文件大小
function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

// 错误日志
function logError (e) {
  console.log(e)
}

// 输出蓝色
function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
