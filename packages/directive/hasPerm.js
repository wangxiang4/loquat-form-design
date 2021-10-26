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
import { getObjType, pathFormat } from '@utils'

export default {
  update (el, binding) {
    const { value } = binding
    const [data, path, multi] = deconstruction(value)
    if (multi && !hasOwnMultiProperty(data, path)) el.hidden = true
    else if (!multi && !hasOwnProperty(data, path)) el.hidden = true
    else el.hidden = false
  }
}

/** 查找多个属性如果发现全部不存在返回失败 **/
export function hasOwnMultiProperty (data, path) {
  for (const item of path) {
    if (hasOwnProperty(data, item)) return true
  }
  return false
}

/** 采用正则对路径进行解析查找对象key **/
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

/** 解构格式转换 **/
function deconstruction (data) {
  switch (getObjType(data)) {
    case 'array':
      return data
    case 'object':
      return Object.values(data)
  }
}

