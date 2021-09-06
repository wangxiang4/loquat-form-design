/**
 * @program: loquat-form-design
 *
 * @description: 图片预览提供函数调用导出
 * 采用消息构造器可传递消息(比如插槽...)
 *
 * 参数选项:
 * datas : 轮播显示数据,类型Array
 * index : 初始轮播索引,类型Number
 * ops : 更多选项,类型Object
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-08-31
 **/

import Main from './index.vue'
import { isVNode } from '@utils/vdom'
let instance
const instances = []
// 创建组件序列号
let seed = 1
const ImagePreview = function (Vue) {
  // 创建全局图片预览消息构造器
  const MessageConstructor = Vue.extend(Main)
  // 将图片预览消息构造器挂载到body元素内
  const obj = function (datas = [], index = 0, ops = {}) {
    const id = 'imagePreview_' + seed++
    const options = {
      datas: datas,
      index: index,
      ops: Object.assign({
        closeOnClickModal: false,
        modal: true
      }, ops)
    }
    const userOnClose = options.onClose
    instance = new MessageConstructor({
      data: options
    })
    options.onClose = function () {
      obj.close(id, userOnClose)
    }
    instance.id = id
    // 插槽是否插入组件对象,插槽必须为vNode节点
    if (isVNode(instance.message)) {
      instance.$slots.default = [instance.message]
      instance.message = null
    }
    // 追加渲染节点
    instance.vm = instance.$mount()
    document.body.appendChild(instance.vm.$el)
    instance.vm.isShow = true
    instance.dom = instance.vm.$el
    instances.push(instance)
    return instance.vm
  }
  // 处理·关闭组件,可传入自定义关闭函数
  obj.close = function (id, userOnClose) {
    for (let i = 0, len = instances.length; i < len; ++i) {
      if (id === instances[i].id) {
        if (typeof userOnClose === 'function') {
          userOnClose(instances[i])
        }
        instances.splice(i, 1)
        break
      }
    }
  }
  return obj
}

export default ImagePreview
