/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

// 缓存原型上的 `$mount` 方法（`$mount` 是在 `./runtime/index`文件里定义的）
const mount = Vue.prototype.$mount

/*
  重写 `$mount`方法，这个是在 `compiler`下使用的。
 */
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el) // 查找 `DOM` 元素

  /*
    如果传入的 `DOM`元素是`body`或者`documentElement`对象，又在开发模式下。
    给用户抛出警告 “不要将Vue挂载到`<html>`或`<body>` - 而是挂载到普通元素。”
   */
  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  /**
   * 解析 模板/元素 并转换为 render
   */

  // 判断 `render` 方法是否存在
  if (!options.render) {
    let template = options.template

    // 判断 `template` 方法是否存在
    if (template) {
      // 如果 `template` 是个 `String`
      if (typeof template === 'string') {
        // 判断 `template` 的第一位是否是井号（有井号说明是个ID选择器）
        if (template.charAt(0) === '#') {
          // id 转成 模板
          template = idToTemplate(template)
          // 如果在开发模式下，`template` 不存在。则抛出 `options.template` 模板是空的警告
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) { // 如果 `template` 是一个 DOM 对象
        // 获取 `template` 的 HTML 内容
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    // 如果 `template` 方法不存在，`el`元素存在。
    } else if (el) {
      // 获取 `el`元素的外部 `HTML`
      template = getOuterHTML(el)
    }

    /*
      编译相关的
     */
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }
      /**
       * 编译成一个函数
       *   传入 `template` 和一些参数，返回 `render` 方法和 静态渲染函数(staticRenderFns)。
       */
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  // `Vue.prototype.$mount` 上缓存的 `mount` 方法
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
/**
 * 获取外部HTML元素，同时处理IE中的SVG元素。
 *
 * @param  {Element} el: Element       DOM 元素
 * @return {String}     DOM 字符串
 * @description
 *     判断传入的 `el` 元素是否有 `outerHTML` ，如果有直接返回 `el.outerHTML`。
 *     如果没有，则创建一个 `div` 元素，插入 `Node` 节点，返回 `innerHTML` 元素。
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue
