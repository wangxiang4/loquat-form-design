/**
 * @program: loquat-form-design
 *
 * @description: 布局数据处理工具类
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-09-27
 **/
import { getObjType, deepClone } from '@/utils/index'

// 处理行克隆递归
export function handleRowDeepClone (data) {
  const cloneData = deepClone(data)
  // todo:行布局数据处理
  cloneData.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
  cloneData.cols = getObjType(cloneData.cols) === 'array' ? cloneData.cols.map(item => {
    // todo:列布局数据处理
    item.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
    item.list = handlePluginDeepClone(item.list)
    return item
  }) : []
  return cloneData
}

// 处理列克隆递归
export function handleColumnDeepClone (data) {
  const cloneData = deepClone(data)
  // todo:列布局数据处理
  cloneData.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
  cloneData.list = handlePluginDeepClone(cloneData.list)
  return cloneData
}

// 处理插件克隆递归
function handlePluginDeepClone (list) {
  return getObjType(list) === 'array' ? list.map(plugin => {
    // todo:插件数据处理
    if (plugin.type === 'coralLayoutRow') {
      plugin = handleRowDeepClone(plugin)
    } else {
      plugin.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
    }
    return plugin
  }) : []
}
