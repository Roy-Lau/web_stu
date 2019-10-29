
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
  if ((key === 'innerHTML' || key === 'textContent') && prevChildren != null) {
    unmountChildren(prevChildren, parentComponent, parentSuspense)
  }
  if (key === 'value' && el.tagName !== 'PROGRESS') {
    // store value as _value as well since
    // non-string values will be stringified.
    el._value = value
  }
  if (value === '' && typeof el[key] === 'boolean') {
    // e.g. <select multiple> compiles to { multiple: '' }
    el[key] = true
  } else {
    el[key] = value == null ? '' : value
  }
}
