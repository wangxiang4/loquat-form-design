/**
 * @program: loquat-form-design
 *
 * @description: 参数规范许可验证
 *
 * 参数说明:
 * data:
 *  * description: 要检查的数据
 *  * type: Object
 * path:
 *  * description: 设置检查数据的路径
 *  数据:{a:[{b:1}]} 写法:a[0].b
 *  数据:{a:[{b:1}]} 写法:['a',0,'b']
 *  * type: Object (Array|string)
 * policy:
 *  * description: 策略模式
 *  0:查找数据中其中一个属性是否存在
 *  1:查找数据中多个属性其中一个属性是否存在,相当于||判断
 *  2:查找数据中多个属性全部属性是否存在,相当于&&判断
 *  3:查找数据中多个属性全部属性是否存在与多个属性其中一个属性是否存在,相当于&&与||判断
 *  * type: Number
 *
 * 支持多参数验证:
 * format: 注意启动后,第二个path参数必须为数组格式,否则报错
 * description:
 * 由于javascript不能像typescript声明变量数据类型,
 * 虽然可以使用类型判断,但是没必要,显得代码太雍肿了,让内部自行处理就行
 *
 * @example
 * v-loquat-has-perm="[{ fruit: 'loquat', hobby: 'daze' }, 'fruit']"
 * v-loquat-has-perm="[{ fruit: 'loquat', hobby: 'daze' }, ['fruit', 'hobby'], 1]"
 * v-loquat-has-perm="[{ fruit: 'loquat', hobby: 'daze' }, ['fruit', 'hobby'], 2]"
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-12
 */
import { pathFormat } from '@utils'
export default {
  update (el, binding) {
    const { value } = binding
    const [data, path, policy] = value
    el.hidden = false
    // 采用java策略模式,运行时动态执行对应策略
    switch (policy) {
      case 1:
        if (!path.some(item => hasOwnProperty(data, item))) el.hidden = true
        break
      case 2:
        if (!path.every(item => hasOwnProperty(data, item))) el.hidden = true
        break
      case 3: {
        const [somePath, everyPath] = path
        const hideEveryPath = []
        for (const path of everyPath) {
          if (!path.every(item => hasOwnProperty(data, item))) {
            path.forEach(e => {
              const text = String(e).trim()
              hideEveryPath.includes(text) || hideEveryPath.push(text)
            })
          }
        }
        if (!somePath.filter(item =>
          !hideEveryPath.includes(item)
        ).some(item => hasOwnProperty(data, item))) el.hidden = true
        break
      }
      default:
        if (!hasOwnProperty(data, path)) el.hidden = true
    }
  }
}

/** 采用正则对路径进行解析查找对象key */
export function hasOwnProperty (object, path) {
  path = RegExp('^\w*$').test(path) ? [path] : pathFormat(path)
  let index = 0
  const length = path.length - 1
  while (object != null && index < length) {
    object = object[path[index++]]
  }
  const lastKey = path[length]
  return object == null ? false : (lastKey in object)
}
