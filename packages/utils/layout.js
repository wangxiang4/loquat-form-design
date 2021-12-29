/**
 * @program: loquat-form-design
 *
 * @description: 布局数据处理工具类
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-09-27
 */
import { getWidgetCloneData } from '@utils/dataFormat'

// 处理珊瑚布局行克隆递归
export function coralLayoutRowDeepClone (data) {
  data = getWidgetCloneData(data)
  data.cols = data.cols.map(item => coralLayoutColumnDeepClone(item))
  return data
}

// 处理珊瑚布局列克隆递归
export function coralLayoutColumnDeepClone (data) {
  data = getWidgetCloneData(data)
  data.list = coralLayoutPluginDeepClone(data.list)
  return data
}

// 处理珊瑚布局插件克隆递归
function coralLayoutPluginDeepClone (list) {
  return list.map(plugin => {
    if (plugin.type === 'coralLayout') {
      plugin = coralLayoutRowDeepClone(plugin)
    } else {
      plugin = getWidgetCloneData(plugin)
    }
    return plugin
  })
}
