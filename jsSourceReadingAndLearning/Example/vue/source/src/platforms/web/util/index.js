/* @flow */

import { warn } from 'core/util/index'

export * from './attrs'
export * from './class'
export * from './element'

/**
 * Query an element selector if it's not an element already.
 */
/**
 * 查找 DOM 元素
 *
 * @param  {String|Element} el: string | Element 传入 `DOM` 字符串，或者 `DOM`元素
 * @return {Element}     Element   `DOM`元素
 */
export function query (el: string | Element): Element {
  // 如果传入的是个字符串
  if (typeof el === 'string') {
    // 通过`js`原生的 `document.querySelector` 查找 `DOM` 元素
    const selected = document.querySelector(el)
    // 如果查找不到，输出个错误提示。并创建返回个`div`元素
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      )
      return document.createElement('div')
    }
    // 返回查找到的 `DOM` 元素
    return selected
  } else {
    // 直接返回 `DOM` 元素
    return el
  }
}
