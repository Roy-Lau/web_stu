import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

/**
 * Vue 构造函数
 *
 * @param {Object} options 参数
 * @description
 * 		判断用户当前是否已经实例化了 Vue ，
 * 		如果没有实例化，提醒用户通过 `new` 关键字来实例化 Vue 。
 * 	   @then 初始化 传入参数
 */
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

/**
 * 通过 Mixin 的方式，向 Vue 原型上定义(挂载)方法
 */
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
