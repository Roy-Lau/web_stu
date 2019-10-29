const doc = document
const svgNS = 'http://www.w3.org/2000/svg'

 /**
  * dom 节点的基本函数封装
  * @type {Object} 节点对象
  */
export const nodeOps = {
  /**
   * 插入函数
   *
   * @type {Node} child
   * @type {Node} parent
   * @type {Node} anchor
   */
  insert: (child: Node, parent: Node, anchor?: Node) => {
    // 如果 anchor 不为空
    if (anchor != null) {
      // 将 child 插入到 anchor 节点之前， parent 节点中
      // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore
      parent.insertBefore(child, anchor)
    } else {
      // 将 child 插入到 parent 的末尾节点中
      // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/appendChild
      parent.appendChild(child)
    }
  },
  /**
   * 移除函数
   */
  remove: (child: Node) => {
    // 获取 child 节点的父节点
    const parent = child.parentNode
    // 如果 parent 不为空
    if (parent != null) {
      // 移除 parent 节点的子节点（child）
      parent.removeChild(child)
    }
  },

  /**
   * 创建元素
   *
   * @type {string} tag 标签
   * @type {boolean} isSVG 是否为 svg
   * @return {Element} 返回创建后的元素
   *
   * 先判断传入的是否是个 svg
   * 如果是 svg , 通过 createElementNS 创建 svg 标签。 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElementNS
   * 如果不是 svg , 通过 createElement 创建元素标签。 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElement
   */
  createElement: (tag: string, isSVG?: boolean): Element =>
    isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag),

  /**
   * 创建 text 节点
   * @param {String} text 要创建文本
   * @return {String} Text 文本节点
   *
   * 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createTextNode
   */
  createText: (text: string): Text => doc.createTextNode(text),

  /**
   * 创建注释节点
   *
   * @param {String} text 注释文本
   * @return {String} text 注释节点
   *
   * 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createComment
   */
  createComment: (text: string): Comment => doc.createComment(text),

  /**
   * 设置节点值
   *
   * @type {Text} node dom 节点
   * @type {string} text 要插入 dom 节点的文本
   *
   * 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeValue
   */
  setText: (node: Text, text: string) => {
    node.nodeValue = text
  },

  /**
   * 设置元素文本
   *
   * @type {HTMLElement} el 元素
   * @type {string} text 要插入元素中的文本
   *
   * 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/Node/textContent
   */
  setElementText: (el: HTMLElement, text: string) => {
    el.textContent = text
  },

  /**
   * 获取 dom 节点的父节点
   *
   * @type {Node} node 子节点
   * @return {HTMLElement|null} node 父节点元素
   *
   * 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/ParentNode
   */
  parentNode: (node: Node): HTMLElement | null =>
    node.parentNode as HTMLElement,

  /**
   * 获取 dom 节点的兄弟节点（相邻节点）
   *
   * @type {Node} node dom 节点
   * @return {Node|null} node 相邻节点
   *
   * 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nextSibling
   */
  nextSibling: (node: Node): Node | null => node.nextSibling,

  /**
   * 获取 document 对象中的某个元素
   * @type {string} selector 要获取的元素名
   * @return {HTMLElement|null}  返回获取的元素节点（如果有多个，只返回第一个）
   *
   * 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelector
   */
  querySelector: (selector: string): Element | null =>
    doc.querySelector(selector)
}
