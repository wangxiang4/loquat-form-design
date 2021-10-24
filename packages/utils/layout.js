/**
 * @program: loquat-form-design
 *
 * @description: 布局数据处理工具类
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-09-27
 **/
import { getWidgetCloneData } from '@utils/dataFormat'

// 处理行克隆递归
export function rowDeepClone (data) {
  data = getWidgetCloneData(data)
  data.cols = data.cols.map(item => columnDeepClone(item))
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
  return list.map(plugin => {
    if (plugin.type === 'coralLayout') {
      plugin = rowDeepClone(plugin)
    } else {
      plugin = getWidgetCloneData(plugin)
    }
    return plugin
  })
}
