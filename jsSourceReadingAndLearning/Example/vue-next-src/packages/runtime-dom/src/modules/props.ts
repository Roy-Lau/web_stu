
/**
 * 导出 添加dom prop 函数
 * @param {any}    el              dom 元素
 * @param {string} key             [description]
 * @param {any}    value           [description]
 * @param {any}    prevChildren    [description]
 * @param {any}    parentComponent [description]
 * @param {any}    parentSuspense  [description]
 * @param {Function}    unmountChildren [description]
 */
export function patchDOMProp(
  el: any,
  key: string,
  value: any,
  // the following args are passed only due to potential innerHTML/textContent
  // overriding existing VNodes, in which case the old tree must be properly
  // unmounted.
  // 仅由于潜在的 innerHTML/textContent 覆盖现有 VNode 而传递以下 arg ，在这种情况下，必须正确卸载旧树
  prevChildren: any,
  parentComponent: any,
  parentSuspense: any,
  unmountChildren: any
) {
  // 如果 key 是 innerHTML 或者 textContent，且 prevChildren 不等于 null
  if ((key === 'innerHTML' || key === 'textContent') && prevChildren != null) {
    // TODO……
    unmountChildren(prevChildren, parentComponent, parentSuspense)
  }
  // 如果 key 是 value ，且 el.tagName 不等于 PROGRESS （进度）
  if (key === 'value' && el.tagName !== 'PROGRESS') {
    // store value as _value as well since
    // non-string values will be stringified.
    // 将值存储为_value，因为非字符串值将被字符串化。
    el._value = value
  }
  // 如果 value 为 空字符串，且 元素的 key 是布尔值（可能是个下拉菜单）
  if (value === '' && typeof el[key] === 'boolean') {
    // e.g. <select multiple> compiles to { multiple: '' }
    // 例如 <select multiple> 编译为 { multiple: '' }
    el[key] = true
  } else {
    el[key] = value == null ? '' : value
  }
}
