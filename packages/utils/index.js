/**
 * @program: loquat-form-design
 *
 * @description: loquat工具类
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-15
 **/
import { PROP_PATH_EXPRESSION } from '@/global/variable'

/** 设置px像素 **/
export function setPx (val, defval = '') {
  if (validateNull(val)) val = defval
  if (validateNull(val)) return ''
  val = val + ''
  if (val.indexOf('%') === -1) {
    val = val + 'px'
  }
  return val
}

/** 对象深拷贝 **/
export function deepClone (data) {
  const type = getObjType(data)
  let obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (let i = 0, len = data.length; i < len; i++) {
      data[i] = (() => {
        if (data[i] === 0) {
          return data[i]
        }
        return data[i]
      })()
      if (data[i]) {
        delete data[i].$parent
      }
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (const key in data) {
      if (data) {
        delete data.$parent
      }
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

/** 获取对象类型 **/
export function getObjType (obj) {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

/** 判断是否为空 **/
export function validateNull (val) {
  // 特殊判断
  if (val && parseInt(val) === 0) return false
  const list = ['$parent']
  if (val instanceof Date || typeof val === 'boolean' || typeof val === 'number') return false
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    val = deepClone(val)
    list.forEach(ele => {
      delete val[ele]
    })
    for (const o in val) {
      return false
    }
    return true
  } else {
    if (
      val === 'null' ||
      val == null ||
      val === 'undefined' ||
      val === undefined ||
      val === ''
    ) {
      return true
    }
    return false
  }
  return false
}

/** 路径string格式转换为数组格式 **/
export function pathFormat (val) {
  const result = []
  if (val.charCodeAt(0) === 46) {
    result.push('')
  }
  val.replace(PROP_PATH_EXPRESSION, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(/\\(\\)?/g, '$1') : (number || match))
  })
  return result
}

/** 获取对象值 **/
export function get (object, path, defaultValue) {
  path = RegExp('^\w*$').test(path) ? [path] : pathFormat(path)
  let index = 0
  const length = path.length
  while (object != null && index < length) {
    object = object[path[index++]]
  }
  const result = object == null
    ? undefined
    : object || undefined
  return result === undefined ? defaultValue : result
}

/** 生成随机8位ID **/
export function randomId () {
  return Math.random().toString(36).slice(-8)
}

/** 字符串数据类型转化 **/
export function detailDataType (value, type) {
  if (type === 'number') {
    return Number(value)
  } else if (type === 'string') {
    return value + ''
  } else {
    return value
  }
}
