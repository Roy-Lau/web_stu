import { isString } from '@vue/shared'

// 定义 Style 类型
type Style = string | Partial<CSSStyleDeclaration> | null

/**
 * 导出 添加样式 函数
 * @param {Element} el   元素
 * @param {Style}   prev 元素上个样式
 * @param {Style}   next 元素下个样式
 */
export function patchStyle(el: Element, prev: Style, next: Style) {
  // 获取元素的内联样式
  const style = (el as HTMLElement).style
  // 如果 next 存在，删除元素的内联样式
  if (!next) {
    el.removeAttribute('style')
  // 如果 next 为字符串，设置元素的css样式名为 next
  } else if (isString(next)) {
    style.cssText = next
  } else {
    // 遍历 next , 可能是其他属性
    for (const key in next) {
      // 将 next 的 key 设置为 style 的 key
      style[key] = next[key] as string
    }

    // 如果 prev 存在，且不是字符串类型
    if (prev && !isString(prev)) {
      // 遍历 prev
      for (const key in prev) {
        if (!next[key]) {
          style[key] = ''
        }
      }
    }
  }
}
