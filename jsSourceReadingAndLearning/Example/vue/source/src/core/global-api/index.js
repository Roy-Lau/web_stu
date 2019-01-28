/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  /**
   * 给 Vue 挂载配置项(config)
   * @type {Config}
   * @readOnly 配置项（只读，用户不能写入）
   */
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // Vue 对外暴露的一些工具方法。 因为这些工具方法会经常变化，所以官方不建议用户使用。
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  // 挂载了三个常用方法
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 给 Vue 创建纯净的配置项
  Vue.options = Object.create(null)
  // 循环给 Vue 配置项上创建方法
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  /**
   * 扩展内置模板组件 (KeepAlive)
   */
  extend(Vue.options.components, builtInComponents)

  /**
   * 在 Vue上定义了全局方法 {Use, Mixin, Extend},
   * AssetRegisters 静态方法注册
   */
  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}
