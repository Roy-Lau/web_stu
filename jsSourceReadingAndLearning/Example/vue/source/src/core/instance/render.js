/* @flow */

import {
  warn,
  nextTick,
  emptyObject,
  handleError,
  defineReactive
} from '../util/index'

import { createElement } from '../vdom/create-element'
import { installRenderHelpers } from './render-helpers/index'
import { resolveSlots } from './render-helpers/resolve-slots'
import VNode, { createEmptyVNode } from '../vdom/vnode'

import { isUpdatingChildComponent } from './lifecycle'

export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  //
  // 编译 `render` 函数时使用(传入)
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  //
  // 用户手写 `render` 函数时使用(传入)
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  const parentData = parentVnode && parentVnode.data

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
    }, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
    }, true)
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
  }
}

export function renderMixin (Vue: Class<Component>) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype)

  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }

  /**
   * _render 方法
   * @return {Object}   返回 VNode 虚拟节点
   */
  Vue.prototype._render = function (): VNode {
    // Vue 实例
    const vm: Component = this
    /*
        render ： 可以是用户手写的，也可是编译生成的
        _parentVnode： 父虚拟节点
     */
    const { render, _parentVnode } = vm.$options

    // reset _rendered flag on slots for duplicate slot check
    // 在插槽上重置 `_renderer` 标志以进行重复插槽检查
    if (process.env.NODE_ENV !== 'production') {
      for (const key in vm.$slots) {
        // $flow-disable-line
        vm.$slots[key]._rendered = false
      }
    }

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      /*
        render.call(vm._renderProxy, vm.$createElement)
        传入的第一个参数是上下文，在生产环境 `vm._renderProxy`是 `this`（Vue实例）。开发环境下是个对象
        传入的第二个参数是 在上边 `initRender` 函数里定义的
       */
      vnode = render.call(vm._renderProxy, vm.$createElement)

    } catch (e) { // 如果 render.call 执行失败

      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      // 返回错误渲染结果，或前一个vnode，以防止渲染错误导致空白组件。降级
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          } catch (e) {
            handleError(e, vm, `renderError`)
            vnode = vm._vnode
          }
        } else {
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    }
    // return empty vnode in case the render function errored out
    // 如果渲染函数出错，则返回空的vnode
    if (!(vnode instanceof VNode)) {
      // 如果 `vnode` 是个数组，说明有多个根节点(root node)。
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        // 抛出警告告诉用户，当前根节点只能有一个 `vnode` 。
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      // 创建一个空的虚拟节点(vnode)，赋值给 `vnode` 变量
      vnode = createEmptyVNode()
    }
    // set parent
    // 设置虚拟节点的父节点
    vnode.parent = _parentVnode
    // 返回 vnode
    return vnode
  }
}
