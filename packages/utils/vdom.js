/**
 * @program: loquat-form-design
 *
 * @description: 操作虚拟dom工具类
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-08-04
 */

/** 是否是虚拟dom节点 */
export function isVNode (node) {
  const hasOwnProperty = Object.prototype.hasOwnProperty
  return node !== null && typeof node === 'object' && hasOwnProperty.call(node, 'componentOptions')
}

/** 是否是真实dom节点 */
export function isDom (obj) {
  // 首先要对HTMLElement进行类型检查，因为即使在支持HTMLElement
  // 的浏览器中，类型却是有差别的，在Chrome,Opera中HTMLElement的
  // 类型为function，此时就不能用它来判断了
  return typeof HTMLElement === 'object'
    ? (function () {
      return obj instanceof HTMLElement
    })()
    : (function () {
      return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
    })()
}
