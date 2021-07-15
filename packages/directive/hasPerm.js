/**
 * @program: loquat-form-design
 *
 * @description: 验证权限
 *
 * 支持两种模式进行验证,对象格式,数组格式
 * 对象格式: {data:{},path:''}
 * 数组格式: [{},'']
 * path支持两种写法:
 * 字符串写法: 数据:{a:[{b:1}]} 写法:a[0].b
 * 数组写法:  数据:{a:[{b:1}]} 写法:['a',0,'b']
 *
 * 支持多参数验证:
 * 写法: 把第三个参数multi:设置为(1||true||'yes'),即可启动
 * 格式: 注意启动后,第二个path参数必须为数组格式,否则无效,始终校验为 false
 * path写法: 校验b跟b1 数据:{a:[{b:1,a1:{b1:2}}]} 写法:['a[0].b',['a',0,'a1','b1']]
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-12
 **/
import { getObjType, validateNull, pathFormat } from '@utils'

export default {
  inserted (el, binding, vNode) {
    const { value } = binding
    if (getObjType(value) !== 'array' && getObjType(value) !== 'object') throw new Error(`请设置校验权限标签值"`)
    const [data, path, multi] = deconstruction(value)
    if (multi && !hasOwnMultiProperty(data, path)) {
      vNode.componentInstance && vNode.componentInstance.$destroy()
      el.parentNode && el.parentNode.removeChild(el)
    } else if (!hasOwnProperty(data, path)) {
      vNode.componentInstance && vNode.componentInstance.$destroy()
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}

/** 查找多个属性如果发现全部不存在返回失败 **/
function hasOwnMultiProperty (data, path) {
  if (getObjType(path) !== 'array') return false
  for (const item of path) {
    if (hasOwnProperty(data, item)) return true
  }
  return false
}

/** 采用正则对路径进行解析查找对象key **/
function hasOwnProperty (object, path) {
  if (validateNull(object) && validateNull(path)) return false
  if (getObjType(path) !== 'array') path = RegExp('^\w*$').test(path) ? [path] : pathFormat(path)
  let index = 0
  const length = path.length - 1
  while (object != null && index < length) {
    object = object[path[index++]]
  }
  if (validateNull(object) || getObjType(object) !== 'object') return false
  const lastKey = path[path.length - 1]
  return (lastKey in object)
}

/** 解构格式转换 **/
function deconstruction (data) {
  if (getObjType(data) === 'array') return data
  return Object.values(data)
}

