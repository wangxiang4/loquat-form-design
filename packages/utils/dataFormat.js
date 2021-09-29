/**
 * @program: loquat-form-design
 *
 * @description: 设置一些通用的数据格式,表单,以及其他地方
 *
 * todo: 等插件加完,要把组件LIST,比如ARRAY_LIST,MULTIPLE_LISTd等等需要统一
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-15
 **/
import {
  ARRAY_LIST,
  ARRAY_VALUE_LIST,
  INPUT_LIST,
  DATE_LIST,
  KEY_COMPONENT_NAME_LINE,
  MULTIPLE_LIST, SELECT_LIST,
  KEY_COMPONENT_CONFIG_NAME_LINE
} from '@/global/variable'
import { validateNull, setPx, deepClone, responseDataAccept } from './index'
import request from '@utils/request'
import packages from './packages'
import { hasOwnProperty } from '@/directive/hasPerm'
import { handleRowDeepClone } from '@utils/layout'

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
  return KEY_COMPONENT_NAME_LINE + result
}

/** 表单初始化默认模型设置prop **/
export function formInitVal (list = []) {
  let formModel = {}
  list.forEach(ele => {
    switch (ele.type) {
      // 珊瑚布局数据处理
      case 'coralLayoutRow':
        ele.cols.forEach(col => {
          formModel = Object.assign(formModel, formInitVal(col.list))
        })
        break
      // 插件数据处理
      default:
        if (ARRAY_VALUE_LIST.includes(ele.type) || (MULTIPLE_LIST.includes(ele.type) && ele.multiple) || ele.isRange) {
          formModel[ele.prop] = []
        } else if (['rate', 'slider', 'number'].includes(ele.type)) {
          formModel[ele.prop] = undefined
        } else {
          formModel[ele.prop] = ''
        }
        if (!validateNull(ele.value)) {
          formModel[ele.prop] = ele.value
        }
    }
  })
  return formModel
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
  if ((!type || component) && type !== 'ueditor') return KEY_COMPONENT_CONFIG_NAME_LINE + 'custom'
  let result = 'input'
  if ([undefined, 'input', 'password', 'url', 'textarea'].includes(type)) {
    result = 'input'
  } else if (['array', 'img'].includes(type)) {
    result = 'array'
  } else if (['time', 'timerange'].includes(type)) {
    result = 'time'
  } else if (DATE_LIST.includes(type)) {
    result = 'date'
  } else if (INPUT_LIST.includes(type)) {
    result = 'input-' + type
  } else {
    result = type
  }
  return KEY_COMPONENT_CONFIG_NAME_LINE + result
}

/** 设计器配置转换设计器预览配置 **/
export function designTransformPreview (_this) {
  const data = deepClone(_this.option)
  const eventScript = data.eventScript
  const autoDataSource = data.dataSource && data.dataSource.filter(item => item.auto)
  handleDeepDesignTransformPreview(_this, data.column, {
    eventScript,
    autoDataSource
  })
  delete data.dataSource
  delete data.eventScript
  return data
}

/** 处理设计器配置转换设计器预览配置深度递归 **/
function handleDeepDesignTransformPreview (_this, column, ops = {}) {
  // 设置参数配置,为了后面好扩展单独提出来
  const options = {
    eventScript: ops.eventScript || [],
    autoDataSource: ops.autoDataSource || []
  }
  for (let i = 0; i < column.length; ++i) {
    const col = column[i]
    switch (col.type) {
      // 珊瑚布局数据处理
      case 'coralLayoutRow':
        for (let colIndex = 0; colIndex < col.cols.length; ++colIndex) {
          const coralCol = col.cols[colIndex]
          handleDeepDesignTransformPreview(_this, coralCol.list, {
            eventScript: ops.eventScript,
            autoDataSource: ops.autoDataSource
          })
        }
        break
      // 插件数据处理
      default:
        // 处理动作转换数据
        if (!validateNull(col.events)) {
          for (const key in col.events) {
            if (typeof col.events[key] !== 'string') continue
            if (col.events[key]) {
              const event = options.eventScript.find(item => item.name === col.events[key])
              col.events[key] = new Function(event?.func)
            } else delete col.events[key]
          }
        }
        // 处理上传数据
        if (col.type === 'upload') {
          // 转换请求头部与请求参数数据格式
          col.headers = col.headers && Object(...col.headers.map(({ key, value }) => ({ [key]: value })))
          col.data = col.data && Object(...col.data.map(({ key, value }) => ({ [key]: value })))
          // 处理动作数据
          for (const key in col.events) col[key] = col.events[key]
          delete col.events
        }
        // 处理远端请求数据转换
        if (SELECT_LIST.includes(col.type) || col.type === 'upload') {
          if (col.static) _this.$set(_this.DIC, col.prop, col.dicData)
          if (!col.static) {
            const dataSource = options.autoDataSource.find(item => item.key === col.remoteDataSource)
            // 提取请求参数
            const param = (({ url, method, headers, params }) => {
              return { url, method, headers, params }
            })(dataSource || {})
            // 远端请求显示标签不能手动控制,设置显示
            if (hasOwnProperty(col, 'showLabel')) col.showLabel = true
            switch (col.remoteType) {
              case 'option' :
                if (_this.$loquat.remoteOption[col.remoteOption]) _this.$set(_this.DIC, col.prop, _this.$loquat.remoteOption[col.remoteOption])
                break
              case 'func' :
                if (_this.$loquat.remoteFunc[col.remoteFunc]) _this.$set(_this.DIC, col.prop, _this.$loquat.remoteFunc[col.remoteFunc]())
                break
              case 'datasource' :
                if (!dataSource) break
                // 是否使用第三方Axios请求
                if (dataSource.thirdPartyAxios) {
                  !validateNull(_this.$loquat.axios) ? _this.$loquat.axios(param).then(res => {
                    try {
                      const execute = new Function('res', dataSource.responseFunc)(res)
                      _this.$set(_this.DIC, col.prop, responseDataAccept(execute, col.type))
                    } catch (e) {
                      console.error(e)
                    }
                  }).catch(error => {
                    try {
                      const execute = new Function('error', dataSource.errorFunc)(error)
                      console.error(execute)
                    } catch (e) {
                      console.error(e)
                    }
                  }) : packages.logs('thirdPartyAxios')
                } else {
                  request.interceptors.request.empty()
                  dataSource.method !== 'GET' && request.interceptors.request.use(config => {
                    return new Function('config', dataSource.requestFunc)(config)
                  }, undefined)
                  request(param).then(res => {
                    try {
                      const execute = new Function('res', dataSource.responseFunc)(res)
                      _this.$set(_this.DIC, col.prop, responseDataAccept(execute, col.type))
                    } catch (e) {
                      console.error(e)
                    }
                  }).catch(error => {
                    try {
                      const execute = new Function('error', dataSource.errorFunc)(error)
                      console.error(execute)
                    } catch (e) {
                      console.error(e)
                    }
                  })
                }
                break
            }
          }
          delete col.static
          delete col.dicData
          delete col.remoteDataSource
          delete col.remoteType
          delete col.remoteFunc
          delete col.remoteOption
        }
        // 校验规则处理
        if (col.validateConfig) {
          const rules = []
          if (hasOwnProperty(col, '_type')) col._type = ''
          col.validateConfig.required && rules.push({ required: true, message: col.validateConfig.requiredMessage || `${col.label}必须填写` })
          if (col.validateConfig.type) {
            rules.push({ type: col.validateConfig.typeFormat, message: col.validateConfig.typeMessage || `${col.label}格式不正确` })
            if (['number', 'integer', 'float'].includes(col.validateConfig.typeFormat) && hasOwnProperty(col, '_type')) col._type = 'number'
          }
          col.validateConfig.pattern && rules.push({ pattern: col.validateConfig.patternFormat, message: col.validateConfig.patternMessage || `${col.label}格式不匹配` })
          delete col.validateConfig
          col.rules = rules
        }
    }
  }
}

/** 字段数据转换为插件数据 **/
export function fieldTransformWidget (data) {
  delete data.icon
  switch (data.type) {
    // 珊瑚布局数据处理
    case 'coralLayoutRow':
      data = handleRowDeepClone(data)
      break
    // 插件数据处理
    default:
      data.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
  }
  return data
}
