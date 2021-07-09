import { validateNull } from '@utils/validate'
import { ARRAY_LIST, ARRAY_VALUE_LIST, DATE_LIST, INPUT_LIST, KEY_COMPONENT_NAME, MULTIPLE_LIST } from '@/global/variable'

/** 设置px像素 **/
export const setPx = (val, defval = '') => {
  if (validateNull(val)) val = defval
  if (validateNull(val)) return ''
  val = val + ''
  if (val.indexOf('%') === -1) {
    val = val + 'px'
  }
  return val
}

/** 对象深拷贝 **/
export const deepClone = data => {
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
export const getObjType = obj => {
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

export const clearVal = (obj, list = []) => {
  if (!obj) return {}
  Object.keys(obj).forEach(ele => {
    if (!list.includes(ele)) {
      if (Array.isArray(obj[ele])) {
        obj[ele] = []
      } else if (obj[ele] !== null && typeof obj[ele] === 'object') {
        obj[ele] = {}
      } else if (['number', 'boolean'].includes(typeof obj[ele]) || undefined === obj[ele]) {
        obj[ele] = undefined
      } else {
        obj[ele] = ''
      }
    }
  })
  return obj
}

export const formInitVal = (list = []) => {
  const tableForm = {}
  list.forEach(ele => {
    if (ARRAY_VALUE_LIST.includes(ele.type) || (MULTIPLE_LIST.includes(ele.type) && ele.multiple) ||
      ele.range || ele.dataType === 'array') {
      tableForm[ele.prop] = []
    } else if (['rate', 'slider', 'number'].includes(ele.type) || ele.dataType === 'number') {
      tableForm[ele.prop] = undefined
    } else {
      tableForm[ele.prop] = ''
    }
    // 表单默认值设置
    if (!this.validatenull(ele.value)) {
      tableForm[ele.prop] = ele.value
    }
  })
  return { tableForm }
}

export const getComponent = (type, component) => {
  let result = type || 'input'
  if (!this.validatenull(component)) {
    return component
  } else if (ARRAY_LIST.includes(type)) {
    result = 'array'
  } else if (['time', 'timerange'].includes(type)) {
    result = 'time'
  } else if (DATE_LIST.includes(type)) {
    result = 'date'
  } else if (['password', 'textarea', 'search'].includes(type)) {
    result = 'input'
  } else if (INPUT_LIST.includes(type)) {
    result = 'input-' + type
  }
  return KEY_COMPONENT_NAME + result
}