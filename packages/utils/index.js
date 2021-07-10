import { ARRAY_LIST, ARRAY_VALUE_LIST, DATE_LIST, INPUT_LIST, KEY_COMPONENT_NAME, MULTIPLE_LIST, SELECT_LIST } from '@/global/variable'

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

export function clearVal (obj, list = []) {
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

export function formInitVal (list = []) {
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
    if (!validateNull(ele.value)) {
      tableForm[ele.prop] = ele.value
    }
  })
  return { tableForm }
}

export function getComponent (type, component) {
  let result = type || 'input'
  if (!validateNull(component)) {
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

export function getPlaceholder (item) {
  const label = item.label
  if (SELECT_LIST.includes(item.type)) {
    return `请选择 ${label}`
  } else {
    return `请输入 ${label}`
  }
}
