/**
 * 导出 添加属性 函数
 *
 * @param {Element} el    元素
 * @param {string}  key   属性名
 * @param {any}     value 属性值
 *
 * 移除or新增 元素中的一个属性
 *
 * 如果没有 value（属性值） 则删除 key 。 移除 参考： https://developer.mozilla.org/zh-CN/docs/Web/API/Element/removeAttribute
 * 如果有 value（属性值） 则新增 key 和 value 。 新增 参考： https://developer.mozilla.org/zh-CN/docs/Web/API/Element/setAttribute
 */
export function patchAttr(el: Element, key: string, value: any) {
  if (value == null) {
    el.removeAttribute(key)
  } else {
    el.setAttribute(key, value)
  }
}
