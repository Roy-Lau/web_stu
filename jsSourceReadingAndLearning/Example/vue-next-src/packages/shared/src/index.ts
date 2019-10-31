import { makeMap } from './makeMap'

export { makeMap }
export * from './patchFlags'
export { isGloballyWhitelisted } from './globalsWhitelist'

// 导出一个空对象
export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__
  ? Object.freeze({})
  : {}

// 导出一个空数组
export const EMPTY_ARR: [] = []

// 导出一个空函数
export const NOOP = () => {}

/**
 * Always return false.
 */
export const NO = () => false

// 判断传入的字符串的前两个字符是否为 'on'
export const isOn = (key: string) => key[0] === 'o' && key[1] === 'n'

export const extend = <T extends object, U extends object>(
  a: T,
  b: U
): T & U => {
  for (const key in b) {
    ;(a as any)[key] = b[key]
  }
  return a as any
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

export const isArray = Array.isArray
// 判断传入的参数是否是函数
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
// 判断传入的参数是否是字符串
export const isString = (val: unknown): val is string => typeof val === 'string'
// 判断传入的参数是否是 symbol
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
// 判断传入的参数是否是对象
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

// 判断传入的参数是否是 Promise
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export const objectToString = Object.prototype.toString
// 导出传入参数的类型字符串
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

// 导出传入参数的原始类型
export function toRawType(value: unknown): string {
  return toTypeString(value).slice(8, -1)
}

// 判断传入的参数是否是普通对象
export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'

// 判断是否是 预留 prop
export const isReservedProp = /*#__PURE__*/ makeMap(
  'key,ref,' +
    'onVnodeBeforeMount,onVnodeMounted,' +
    'onVnodeBeforeUpdate,onVnodeUpdated,' +
    'onVnodeBeforeUnmount,onVnodeUnmounted'
)

const camelizeRE = /-(\w)/g
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
}

const hyphenateRE = /\B([A-Z])/g
export const hyphenate = (str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// compare whether a value has changed, accounting for NaN.
export const hasChanged = (value: any, oldValue: any): boolean =>
  value !== oldValue && (value === value || oldValue === oldValue)
