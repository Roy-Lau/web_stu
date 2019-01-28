/* @flow */

import config from '../config'
import VNode, { createEmptyVNode } from './vnode'
import { createComponent } from './create-component'
import { traverse } from '../observer/traverse'

import {
  warn,
  isDef,
  isUndef,
  isTrue,
  isObject,
  isPrimitive,
  resolveAsset
} from '../util/index'

import {
  normalizeChildren,
  simpleNormalizeChildren
} from './helpers/index'

const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
/**
 * 创建元素
 *
 * @param  {[type]} context:           Component     VM 实例
 * @param  {[type]} tag:               any           标签
 * @param  {[type]} data:              any           数据
 * @param  {[type]} children:          any           子节点
 * @param  {[type]} normalizationType: any           归一化类型
 * @param  {[type]} alwaysNormalize:   boolean       始终正常化
 * @return {Function}  _createElement: Function      创建元素的函数
 */
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {

  // 如果 `data` 不存在， 下边的两个个参数向上移
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }

  // 如果 `alwaysNormalize` 是 `true` ，`normalizationType` 等于常量 `2`
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }

  // 最后，返回 `_createElement`
  return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {

  // 判断在开发环境下 `VNode data` 是不是响应式的，
  // 如果 `data` 是响应式的就抛出警告。 （响应的的 `data` 会有 `__ob__` 标记）
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode()
  }
  // object syntax in v-bind
  // v-bind中的对象语法
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  // 判断`data` 是否存在，判断 `data.key` 是否是基础类型，如果 `data.key` 不是基础类型，抛出警告。
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }
  // support single function children as default scoped slot
  // 支持单个函数children作为默认的作用域槽
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  /*
    如果 `normalizationType` 等于 `2 (ALWAYS_NORMALIZE)`, 调用 `normalizeChildren` 处理 `children`
    如果 `normalizationType` 等于 `1 (SIMPLE_NORMALIZE)`, 调用 `simpleNormalizeChildren` 处理 `children`

    normalizeChildren 函数： 将多维数组递归平铺成一维数组。
    simpleNormalizeChildren 函数： 将二维数组平铺为一维数组，一维数组直接返回。
   */
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }

  /**
   * 如果 `tag` 是个字符串
   *   1. tag 是 html 的保留标签，根据tag创建 VNode
   *   2. tag 是 组件 ，调用 `createComponent` 方法，创建组件。
   *   3. 根据传入的参数，创建 VNode。
   * 如果 `tag` 不是个字符串，根据参数调用 `createComponent` 方法创建组件
   */
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    // 直接组件选项/构造函数
    // * 调用 createComponent (创建组件）方法
    vnode = createComponent(tag, data, context, children)
  }
  /*
      如果 `vnode` 是数组，直接返回 `vnode`
      如果 `vnode` 不为空，对 `ns` 和 `data` 做一些处理，返回 `vnode`
      否则直接创建一个空的`VNode`返回。
   */
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined
    force = true
  }
  if (isDef(vnode.children)) {
    for (let i = 0, l = vnode.children.length; i < l; i++) {
      const child = vnode.children[i]
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force)
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style)
  }
  if (isObject(data.class)) {
    traverse(data.class)
  }
}
