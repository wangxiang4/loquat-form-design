/**
 * @program: loquat-form-design
 *
 * @description: 设置一些通用的数据格式,表单,以及其他地方
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-15
 **/
import {
  ARRAY_LIST,
  ARRAY_VALUE_LIST,
  DATE_LIST,
  INPUT_LIST,
  KEY_COMPONENT_NAME_HTML,
  MULTIPLE_LIST, SELECT_LIST,
  KEY_COMPONENT_CONFIG_NAME_HTML
} from '@/global/variable'
import { validateNull, setPx } from './index'

/** 获取控件提示 **/
export function getPlaceholder (item) {
  const label = item.label
  if (SELECT_LIST.includes(item.type)) {
    return `请选择 ${label}`
  } else {
    return `请输入 ${label}`
  }
}

/** 获取标签长度 **/
export function getLabelWidth (column, item, defval) {
  let result
  if (!this.$loquat.validateNull(column.labelWidth)) {
    result = column.labelWidth
  } else if (!this.$loquat.validateNull(item.labelWidth)) {
    result = item.labelWidth
  }
  return setPx(result, defval)
}

/** 获取组件名称 **/
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
  return KEY_COMPONENT_NAME_HTML + result
}

/** 初始化表单默认值 **/
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

/** 清空表单值 **/
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

/** 获取配置组件名称 **/
export function getComponentConfig (type, component) {
  if ((!type || component) && type != 'ueditor') return KEY_COMPONENT_CONFIG_NAME_HTML + 'custom'
  let result = 'input'
  if ([undefined, 'input', 'password', 'url'].includes(type)) result = 'input'
  else if (DATE_LIST.includes(type)) result = 'date'
  else if (['array', 'img'].includes(type)) result = 'array'
  else if (['tree', 'cascader'].includes(type)) result = 'tree'
  else if (['radio', 'checkbox', 'select'].includes(type)) result = 'select'
  else result = type

  return KEY_COMPONENT_CONFIG_NAME_HTML + result
}
