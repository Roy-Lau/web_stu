// 系统修饰符
const systemModifiers = ['ctrl', 'shift', 'alt', 'meta']

// 定义键盘事件的类型
type KeyedEvent = KeyboardEvent | MouseEvent | TouchEvent

// 定义事件修饰符 guards
const modifierGuards: Record<
  string,
  (e: Event, modifiers?: string[]) => void | boolean
> = {
  stop: e => e.stopPropagation(),
  prevent: e => e.preventDefault(),
  self: e => e.target !== e.currentTarget,
  ctrl: e => !(e as KeyedEvent).ctrlKey,
  shift: e => !(e as KeyedEvent).shiftKey,
  alt: e => !(e as KeyedEvent).altKey,
  meta: e => !(e as KeyedEvent).metaKey,
  left: e => 'button' in e && (e as MouseEvent).button !== 0,
  middle: e => 'button' in e && (e as MouseEvent).button !== 1,
  right: e => 'button' in e && (e as MouseEvent).button !== 2,
  exact: (e, modifiers: string[]) =>
    systemModifiers.some(m => (e as any)[`${m}Key`] && !modifiers.includes(m))
}

/**
 * 导出 带修饰符 的函数
 * @type {Function} fn          事件函数(回调)
 * @type {string[]}   modifiers   修饰符
 * @return {Function}   fn      回调函数
 *
 * @description 如果传入的参数 modifiers 数组内的值命中 modifierGuards 内的键，
 *              则调用 modifierGuards 定义的函数。
 *              否则调用传入的回调函数
 *
 * @usage let keyModifiers = withModifiers(fn,['stop','self'])
 *        keyModifiers(event)
 */
export const withModifiers = (fn: Function, modifiers: string[]) => {
  return (event: Event) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]]
      if (guard && guard(event, modifiers)) return
    }
    return fn(event)
  }
}

// Kept for 2.x compat.
// 保持2.x兼容。
// Note: IE11 compat for `spacebar` and `del` is removed for now.
// 注意：IE11的 “空格键” 和 “del” 兼容性已被删除。

// 定义常用的键盘按键名
const keyNames: Record<string, string | string[]> = {
  esc: 'escape',
  space: ' ',
  up: 'arrowup',
  left: 'arrowleft',
  right: 'arrowright',
  down: 'arrowdown',
  delete: 'backspace'
}

/**
 * 定义 带键盘事件 的函数
 * @type {Function} fn          事件函数(回调)
 * @type {string}   modifiers   修饰符
 * @return {Function}   fn      回调函数
 * @description TODO……
 */
export const withKeys = (fn: Function, modifiers: string[]) => {
  return (event: KeyboardEvent) => {
    // 如果 'key' 不在 event 中，直接 return 掉
    if (!('key' in event)) return
    // 将键盘事件名转为小写，并赋值给常量 eventKey
    const eventKey = event.key.toLowerCase()
    // 如果传入的键盘修饰符与当前的键盘事件不匹配，直接 return 掉
    if (
      // None of the provided key modifiers match the current event key
      // 提供的键修饰符均与当前事件键不匹配
      !modifiers.some(k => k === eventKey || keyNames[k] === eventKey)
    ) {
      return
    }
    // 最后，返回传入 event 的回调函数
    return fn(event)
  }
}
