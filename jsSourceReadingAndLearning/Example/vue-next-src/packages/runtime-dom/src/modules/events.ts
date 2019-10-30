import { EMPTY_OBJ } from '@vue/shared'
import {
  ComponentInternalInstance,
  callWithAsyncErrorHandling
} from '@vue/runtime-core'
import { ErrorCodes } from 'packages/runtime-core/src/errorHandling'

interface Invoker extends EventListener {
  value: EventValue
  lastUpdated: number
}

type EventValue = (Function | Function[]) & {
  invoker?: Invoker | null
}

type EventValueWithOptions = {
  handler: EventValue
  options: AddEventListenerOptions
  invoker?: Invoker | null
}

// Async edge case fix requires storing an event listener's attach timestamp.
// 异步 edge 案例 修复需要存储事件侦听器附加时间戳。
// 人话： 获取当前时间的毫秒数
let _getNow: () => number = Date.now

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res ( relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// 确定浏览器正在使用的事件时间戳。 烦人的是，时间戳可以是高分辨率（相对于页面加载），也可以是低分辨率（相对于UNIX时期），
// 因此，为了比较时间，我们在保存刷新时间戳时必须使用相同的时间戳类型。
if (
  typeof document !== 'undefined' &&
  _getNow() > document.createEvent('Event').timeStamp
) {
  // if the low-res timestamp which is bigger than the event timestamp
  // (which is evaluated AFTER) it means the event is using a hi-res timestamp,
  // and we need to use the hi-res version for event listeners as well.
  // 如果低分辨率时间戳大于事件时间戳（在事件后评估），则表示该事件正在使用高分辨率时间戳，我们也需要对事件侦听器使用高分辨率版本。
  _getNow = () => performance.now()
}

// To avoid the overhead of repeatedly calling performance.now(), we cache
// and use the same timestamp for all event listeners attached in the same tick.
// 为了避免重复调用 performance.now() 的开销，我们使用缓存并为同一时间戳中附加的所有事件侦听器使用相同的时间戳。
let cachedNow: number = 0
const p = Promise.resolve()
const reset = () => {
  cachedNow = 0
}
const getNow = () => cachedNow || (p.then(reset), (cachedNow = _getNow()))

/**
 * 添加事件监听（封装原生的 添加事件监听函数）
 *
 * @param {Element}              el      目标元素
 * @param {string}               event   添加事件
 * @param {EventListener}        handler 绑定方法
 * @param {EventListenerOptions} options 参数
 *
 * 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
 */
export function addEventListener(
  el: Element,
  event: string,
  handler: EventListener,
  options?: EventListenerOptions
) {
  el.addEventListener(event, handler, options)
}

/**
 * 移除事件监听（封装原生的 移除事件监听函数）
 *
 * @param {Element}              el      目标元素
 * @param {string}               event   移除事件
 * @param {EventListener}        handler 绑定方法
 * @param {EventListenerOptions} options 参数
 *
 * 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/removeEventListener
 */
export function removeEventListener(
  el: Element,
  event: string,
  handler: EventListener,
  options?: EventListenerOptions
) {
  el.removeEventListener(event, handler, options)
}

/**
 * 添加事件
 *
 * @param {Element}                      el   元素
 * @param {string}                       name 事件名
 * @param {EventValueWithOptions     |    EventValue    | null} prevValue 上个事件值(带选项，不带选项，或null)
 * @param {EventValueWithOptions     |    EventValue    | null} nextValue 下个事件值(带选项，不带选项，或null)
 * @param {ComponentInternalInstance |    null          = null} instance  组件内部实例
 */
export function patchEvent(
  el: Element,
  name: string,
  prevValue: EventValueWithOptions | EventValue | null,
  nextValue: EventValueWithOptions | EventValue | null,
  instance: ComponentInternalInstance | null = null
) {
  // prevValue 存在， 且 'options' 在 prevValue 中，prevValue.options 存在。 赋值给常量 prevOptions
  const prevOptions = prevValue && 'options' in prevValue && prevValue.options
  // nextValue 存在， 且 'options' 在 nextValue 中，nextValue.options 存在。 赋值给常量 nextOptions
  const nextOptions = nextValue && 'options' in nextValue && nextValue.options
  // prevValue 存在， prevValue.invoker 存在。 赋值给常量 invoker
  const invoker = prevValue && prevValue.invoker
  // nextValue 存在， 且 'handler' 在 nextValue 中。 常量 value 为 nextValue.handler，否则为 nextValue
  const value =
    nextValue && 'handler' in nextValue ? nextValue.handler : nextValue

  // 如果 prevOptions 或 nextOptions 存在
  if (prevOptions || nextOptions) {
    // 将 prevOptions 赋值给常量 prev, 如果 prevOptions 不存在 赋值一个空对象
    const prev = prevOptions || EMPTY_OBJ
    // 将 nextOptions 赋值给常量 next, 如果 nextOptions 不存在 赋值一个空对象
    const next = nextOptions || EMPTY_OBJ

    // 如果 prev.capture 不等于 next.capture 或者 prev.passive 不等于 next.passive 或者 prev.once 不等于 next.once
    if (
      prev.capture !== next.capture ||
      prev.passive !== next.passive ||
      prev.once !== next.once
    ) {
      // 如果 invoker 不存在
      if (invoker) {
        // 移除事件监听
        removeEventListener(el, name, invoker, prev)
      }
      // 如果 nextValue 和 value 存在
      if (nextValue && value) {
        // todo ....
        const invoker = createInvoker(value, instance)
        nextValue.invoker = invoker
        添加事件监听
        addEventListener(el, name, invoker, next)
      }
      return
    }
  }

  // 如果 nextValue 和 value 存在
  if (nextValue && value) {
    // 如果 invoker 存在
    if (invoker) {
      // 清空 prevValue 的 invoker
      ;(prevValue as EventValue).invoker = null
      // 更新 invoker 的值
      invoker.value = value
      // 将当前 invoker 赋值给 nextValue 的 nextValue
      nextValue.invoker = invoker
      // 更新 invoker 的时间戳
      invoker.lastUpdated = getNow()
    } else {
      // 添加事件监听
      addEventListener(
        el,
        name,
        createInvoker(value, instance),
        nextOptions || void 0
      )
    }
  } else if (invoker) {
    // 移除事件监听
    removeEventListener(el, name, invoker, prevOptions || void 0)
  }
}

/**
 * 创建调用者
 *
 * @param {EventValue}                   initialValue [description]
 * @param {ComponentInternalInstance | null}        instance [description]
 */
function createInvoker(
  initialValue: EventValue,
  instance: ComponentInternalInstance | null
) {
  const invoker: Invoker = (e: Event) => {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    // 异步边缘情况 https://github.com/vuejs/vue/issues/10366：内部点击事件触发补丁，事件处理程序在补丁期间附加到外部元素，然后再次触发。
    // 发生这种情况是因为浏览器在事件传播之间触发了微任务时间戳。
    // 解决方案很简单：我们在附加处理程序时保存时间戳，只有当传递给它的事件在附加后触发时，处理程序才会触发。
    if (e.timeStamp >= invoker.lastUpdated - 1) {
      callWithAsyncErrorHandling(
        invoker.value,
        instance,
        ErrorCodes.NATIVE_EVENT_HANDLER,
        [e]
      )
    }
  }
  invoker.value = initialValue
  initialValue.invoker = invoker
  invoker.lastUpdated = getNow()
  return invoker
}
