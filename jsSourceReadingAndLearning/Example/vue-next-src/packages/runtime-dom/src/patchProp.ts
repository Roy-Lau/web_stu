import { patchClass } from './modules/class'
import { patchStyle } from './modules/style'
import { patchAttr } from './modules/attrs'
import { patchDOMProp } from './modules/props'
import { patchEvent } from './modules/events'
import { isOn } from '@vue/shared'
import {
  VNode,
  ComponentInternalInstance,
  SuspenseBoundary
} from '@vue/runtime-core'

export function patchProp(
  el: Element,
  key: string,
  nextValue: any,
  prevValue: any,
  isSVG: boolean,
  prevChildren?: VNode[],
  parentComponent?: ComponentInternalInstance,
  parentSuspense?: SuspenseBoundary<Node, Element>,
  unmountChildren?: any
) {
  switch (key) {
    // special 特殊情况
    // 如果 key 为 class
    case 'class':
      // 添加 class(类)
      patchClass(el, nextValue, isSVG)
      break
    // 如果 key 为 style
    case 'style':
      // 添加内联样式
      patchStyle(el, prevValue, nextValue)
      break
    case 'modelValue':
    case 'onUpdate:modelValue':
      // Do nothing. This is handled by v-model directives.
      // 不做任何事， 这由 v-model 指令处理。
      break
    default:
      // 如果 key 的前两个字符为 on （事件）
      if (isOn(key)) {
        // 给元素添加事件
        patchEvent(
          el,
          key.slice(2).toLowerCase(),
          prevValue,
          nextValue,
          parentComponent
        )
      } else if (!isSVG && key in el) { // 如果不是 svg 且 key 在元素上
        // 添加 dom prop
        patchDOMProp(
          el,
          key,
          nextValue,
          prevChildren,
          parentComponent,
          parentSuspense,
          unmountChildren
        )
      } else {
        // 给元素添加属性 attribute
        patchAttr(el, key, nextValue)
      }
      break
  }
}
