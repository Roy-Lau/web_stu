const path = require('path')

/**
 * 提供真实文件地址的映射关系
 *
 * @param  {String} p 需要处理路径
 * @return {String}   真实文件地址
 *
 * path.resolve 	`nodejs` 提供的路径解析的方法
 * __dirname		当前目录
 * ../ 				上一级
 */
const resolve = p => path.resolve(__dirname, '../', p)

module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  entries: resolve('src/entries'),
  sfc: resolve('src/sfc')
}
