/**
 * @program: loquat-form-design
 *
 * @description: 数据仓库
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-11-25
 */

import { objectEach } from '@/utils/index'

/**
 * 创建数据仓库
 */
export class Store {
  constructor () {
    this.store = {}
  }

  mixin (options) {
    Object.assign(this.store, options)
    return this
  }

  has (name) {
    return !!this.get(name)
  }

  get (name) {
    return this.store[name]
  }

  add (name, render) {
    this.store[name] = render
    return this
  }

  delete (name) {
    delete this.store[name]
  }

  forEach (callback) {
    objectEach(this.store, callback)
  }
}

export default Store
