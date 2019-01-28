/* @flow */

import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
// 在应用了所有内置模块之后，应该最后应用指令模块。
const modules = platformModules.concat(baseModules)

/**
 * patch 构造函数 （利用了`函数颗粒化`的技巧,避免了重复判断vue[weex，web] 所运行的平台）
 *
 * @type {Function} createPatchFunction
 * @description
 *  `patch`函数调用了`createPatchFunction`函数，`createPatchFunction`传入两个参数
 *      @param {Object} nodeOps 一些操作DOM的方法
 *      @param {Object} modules 一些类、属性……的钩子函数
 */
export const patch: Function = createPatchFunction({ nodeOps, modules })
