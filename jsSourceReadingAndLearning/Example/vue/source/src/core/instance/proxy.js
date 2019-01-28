/* not type checking this file because flow doesn't play well with Proxy */

import config from 'core/config'
import { warn, makeMap, isNative } from '../util/index'

let initProxy

if (process.env.NODE_ENV !== 'production') {
  const allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  )
  /**
   * 警告 XX 不存在
   *
   * @param  {[type]} target [description]
   * @param  {[type]} key    元素
   * @return {[type]}        console.warn(XXXX)
   * @description
   *   警告的大意是： `render` 函数中使用的数据没有在 `data` 函数或属性中定义
   */
  const warnNonPresent = (target, key) => {
    warn(
      `Property or method "${key}" is not defined on the instance but ` +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    )
  }

  // 判断当前浏览器是否支持 `proxy`
  const hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy)

  if (hasProxy) {
    const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact')
    config.keyCodes = new Proxy(config.keyCodes, {
      set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`)
          return false
        } else {
          target[key] = value
          return true
        }
      }
    })
  }

  const hasHandler = {
    has (target, key) {
      // 如果 元素(key) 不在 target 下 has 为 false
      const has = key in target
      /*
          allowedGlobals(key) ： 全局属性和方法
          (typeof key === 'string' && key.charAt(0) === '_') ： 私有属性和方法
       */
      const isAllowed = allowedGlobals(key) || (typeof key === 'string' && key.charAt(0) === '_')
      // 如果这两个条件都不满足，抛出警告
      if (!has && !isAllowed) {
        warnNonPresent(target, key)
      }
      return has || !isAllowed
    }
  }

  const getHandler = {
    get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key)
      }
      return target[key]
    }
  }

  /**
   * 初始化代理
   *
   * @param  {Object} vm            Vue 实例
   * @return {Object} _renderProxy  渲染代理
   */
  initProxy = function initProxy (vm) {
    // 如果当前浏览器支持 `Proxy`
    if (hasProxy) {
      // determine which proxy handler to use
      const options = vm.$options
      // 判断 配置项 ，将 `getHandler` 赋值给 `handlers`,否则赋值 `hasHandler`
      const handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler
      // `new Proxy` 类，赋值给 `_renderProxy` (当前情况下 `handlers` 为 `hasHandler`)
      vm._renderProxy = new Proxy(vm, handlers)

    // 如果当前浏览器不支持 `Proxy`
    } else {
      // `_renderProxy` 代理 vm 实例
      vm._renderProxy = vm
    }
  }
}

export { initProxy }
