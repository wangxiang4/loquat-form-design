/**
 * @program: loquat-form-design
 *
 * @description: 数据格式工具类,格式转换,数据分类,设置表单数据...
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-15
 **/
import {
  ARRAY_VALUE_TYPES,
  INPUT_FEATURE_TYPES,
  KEY_COMPONENT_NAME_LINE,
  MULTIPLE_FEATURE_TYPES,
  RANGE_FEATURE_TYPES,
  SELECT_TYPES,
  NUMBER_VALUE_TYPES,
  REMOTE_REQUEST_TYPES,
  KEY_COMPONENT_CONFIG_NAME_LINE
} from '@/global/variable'
import { validateNull, setPx, deepClone, getObjType } from './index'
import request from '@utils/request'
import packages from './packages'
import { hasOwnProperty } from '@/directive/hasPerm'
import { handleRowDeepClone } from '@utils/layout'

/** 获取控件默认提示 **/
export function getPlaceholder (item) {
  const label = item.label
  if (SELECT_TYPES.includes(item.type)) {
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
  } else if (['textarea', 'password'].includes(type)) {
    result = 'input'
  } else if (INPUT_FEATURE_TYPES.includes(type)) {
    result = 'input-' + type
  }
  return KEY_COMPONENT_NAME_LINE + result
}

/** 表单初始化默认模型设置prop **/
export function formInitVal (list = []) {
  const formModel = {}
  list.forEach(ele => {
    const plugin = ele.plugin || {}
    switch (ele.type) {
      // 珊瑚布局数据处理
      case 'coralLayoutRow':
        ele.cols.forEach(col => {
          const deepModel = formInitVal(col.list)
          for (const [key, value] of Object.entries(deepModel)) formModel[key] = value
        })
        break
      // 插件数据处理
      default:
        if (ele.propExclude) break
        if (ARRAY_VALUE_TYPES.includes(plugin.type || ele.type) ||
          (MULTIPLE_FEATURE_TYPES.includes(ele.type) && plugin.multiple) ||
          (RANGE_FEATURE_TYPES.includes(ele.type) && plugin.range)
        ) {
          formModel[ele.prop] = []
        } else if (NUMBER_VALUE_TYPES.includes(ele.type)) {
          formModel[ele.prop] = undefined
        } else {
          formModel[ele.prop] = ''
        }
        if (!validateNull(plugin.value)) {
          formModel[ele.prop] = plugin.value
        }
    }
  })
  return formModel
}

/** 清空表单值 **/
export function formClearVal (obj, list = []) {
  if (!obj) return {}
  Object.keys(obj).forEach(ele => {
    if (!list.includes(ele)) {
      if (getObjType(obj[ele]) === 'array') {
        obj[ele] = []
      } else if (getObjType(obj[ele]) === 'boolean') {
        obj[ele] = {}
      } else if (['number', 'boolean', 'undefined'].includes(getObjType(obj[ele]))) {
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
  let result = type || 'input'
  // 引入第三方组件打开自定义配置面板
  if (!validateNull(component)) {
    return KEY_COMPONENT_CONFIG_NAME_LINE + 'custom'
  } else if (['textarea', 'password'].includes(type)) {
    result = 'input'
  } else if (INPUT_FEATURE_TYPES.includes(type)) {
    result = 'input-' + type
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
    const plugin = col.plugin || {}
    const validateConfig = col.validateConfig || {}
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
        if (['object', 'string'].includes(getObjType(col.events))) {
          if (typeof col.events === 'string') {
            try {
              const execute = eval // 将this指向window
              const parse = execute('(' + col.events + ')')
              getObjType(parse) === 'object' ? col.events = parse : col.events = {}
            } catch (e) {
              col.events = {}
            }
          }
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
          plugin.headers = plugin.headers && Object(...plugin.headers.map(({ key, value }) => ({ [key]: value })))
          plugin.data = plugin.data && Object(...plugin.data.map(({ key, value }) => ({ [key]: value })))
          // 处理动作数据
          for (const key in col.events) plugin[key] = col.events[key]
          delete col.events
        }
        // 处理远端请求数据转换
        if (REMOTE_REQUEST_TYPES.includes(col.type)) {
          if (!col.remote) _this.$set(_this.DIC, col.prop, col.dicData)
          else {
            const dataSource = options.autoDataSource.find(item => item.key === col.remoteDataSource)
            // 提取请求参数
            const param = (({ url, method, headers, params }) => {
              return { url, method, headers, params }
            })(dataSource || {})
            // 远端请求显示标签不能手动控制,设置显示
            if (hasOwnProperty(plugin, 'showLabel')) plugin.showLabel = true
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
                      _this.$set(_this.DIC, col.prop, remoteAccept(execute, col.type))
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
                      _this.$set(_this.DIC, col.prop, remoteAccept(execute, col.type))
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
          delete col.remote
          delete col.dicData
          delete col.remoteType
          delete col.remoteFunc
          delete col.remoteOption
          delete col.remoteDataSource
        }
        // 校验规则处理
        if (getObjType(validateConfig) === 'object') {
          const rules = []
          validateConfig.required && rules.push({ required: true, message: validateConfig.requiredMessage || `${col.label}必须填写` })
          validateConfig.type && rules.push({ type: validateConfig.typeFormat, message: validateConfig.typeMessage || `${col.label}格式不正确` })
          validateConfig.pattern && rules.push({ pattern: validateConfig.patternFormat, message: validateConfig.patternMessage || `${col.label}格式不匹配` })
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

/** 处理响应数据数据是否受理,解决dic应对各种类型问题 **/
export function remoteAccept (data, type) {
  // 远程类型细粒化处理,类型具体参考REMOTE_REQUEST_TYPES
  switch (type) {
    case 'radio':
    case 'select':
    case 'checkbox':
    case 'cascader':
      if (getObjType(data) === 'array') return data
      else return []
    case 'upload':
      if (getObjType(data) === 'string') return data
      else return ''
  }
  return undefined
}
