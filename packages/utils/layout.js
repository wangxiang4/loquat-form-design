/**
 * @program: loquat-form-design
 *
 * @description: 布局数据处理工具类
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-09-27
 **/
import { getObjType } from '@/utils/index'
import { getWidgetCloneData } from '@utils/dataFormat'

// 处理行克隆递归
export function rowDeepClone (data) {
  data = getWidgetCloneData(data)
  data.cols = getObjType(data.cols) === 'array' ? data.cols.map(item => columnDeepClone(item)) : []
  return data
}

// 处理列克隆递归
export function columnDeepClone (data) {
  data = getWidgetCloneData(data)
  data.list = pluginDeepClone(data.list)
  return data
}

// 处理插件克隆递归
function pluginDeepClone (list) {
  return getObjType(list) === 'array' ? list.map(plugin => {
    if (plugin.type === 'coralLayoutRow') {
      plugin = rowDeepClone(plugin)
    } else {
      plugin = getWidgetCloneData(plugin)
    }
    return plugin
  }) : []
}
