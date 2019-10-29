// compiler should normalize class + :class bindings on the same element
// into a single binding ['staticClass', dynamic]
// 编译器应规范同一元素上的 class 和 :class 绑定，统一为 ['staticClass', dynamic] 数组绑定

/**
 * 导出 添加类（class） 函数
 * @param {Element} el    元素
 * @param {string}  value class值
 * @param {boolean} isSVG 是否为 SVG
 *
 * 如果 isSVG 为 true ，使用 setAttribute 函数 设置类(class) 。 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/Element/setAttribute
 * 如果 isSVG 为 false ，使用 className 属性 设置值(value) 。 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/Element/className
 *
 */
export function patchClass(el: Element, value: string, isSVG: boolean) {
  // directly setting className should be faster than setAttribute in theory
  // 理论上直接设置 className 应该比 setAttribute 快
  if (isSVG) {
    el.setAttribute('class', value)
  } else {
    el.className = value
  }
}
