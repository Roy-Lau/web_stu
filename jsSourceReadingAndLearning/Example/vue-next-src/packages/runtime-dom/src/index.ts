import { createRenderer, warn } from '@vue/runtime-core'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'
// Importing from the compiler, will be tree-shaken in prod
// 从编译器中导入，将在生产环境中通过 "树摇" 删除
import { isHTMLTag, isSVGTag } from '@vue/compiler-dom'
import { isFunction, isString } from '@vue/shared'

const { render, createApp: baseCreateApp } = createRenderer<Node, Element>({
  patchProp,
  ...nodeOps
})

const createApp = () => {
  const app = baseCreateApp()

  if (__DEV__) {
    // Inject `isNativeTag`
    // 注入 `isNativeTag`
    // this is used for component name validation (dev only)
    // 这用于组件名称验证（仅限开发人员）
    Object.defineProperty(app.config, 'isNativeTag', {
      value: (tag: string) => isHTMLTag(tag) || isSVGTag(tag),
      writable: false
    })
  }

  // 缓存原 app.mount
  const mount = app.mount
  /**
   * 修改 app.mount 函数
   * @type {[type]} component 组件
   * @type {[type]} container 容器
   * @type {[type]} props
   */
  app.mount = (component, container, props): any => {
    // 如果 container 是字符串
    if (isString(container)) {
      // 查询 container(非空，一定能查到) 并重新赋值给 container
      container = document.querySelector(container)!
      // 如果未查询到 container ，抛出警告，不再执行下面的代码
      if (!container) {
        __DEV__ &&
          warn(`Failed to mount app: mount target selector returned null.`)
          // warn(`无法挂载应用程序：挂载目标选择器返回null。`)
        return
      }
    }

    // 如果 __RUNTIME_COMPILE__ 为真、 component 不是一个函数、 component.render为真、 component.template为真
    if (
      __RUNTIME_COMPILE__ &&
      !isFunction(component) &&
      !component.render &&
      !component.template
    ) {
      // 将 container.innerHTML 赋值给 component.template
      component.template = container.innerHTML
    }
    // clear content before mounting
    // 挂载前清除 container 里的 HTML 内容
    container.innerHTML = ''
    // 返回处理后的挂载函数
    return mount(component, container, props)
  }

  return app
}

// 导出渲染函数和创建应用函数
export { render, createApp }

// DOM-only runtime helpers
// 仅限 DOM 的运行时助手
export {
  vModelText,
  vModelCheckbox,
  vModelRadio,
  vModelSelect,
  vModelDynamic
} from './directives/vModel'

export { withModifiers, withKeys } from './directives/vOn'

// re-export everything from core
// 从 运行时核心模块 导出所有 接口及函数，如下：
// h, Component, reactivity API, nextTick, flags & types
export * from '@vue/runtime-core'

// Type augmentations
// 类型扩充
export interface ComponentPublicInstance {
  $el: Element
}
