/**
 * @program: loquat-form-design
 *
 * @description: 导出表单设计器
 *
 * todo: 考虑稳定一段时间,采用typeScript重构项目,结构全采用插件化结构
 * todo: 目前采用vue高级语法(sfc),模板可控性,可扩展性太差,考虑将全部采用低级语法
 * todo: 渲染函数的方式编写,工具包全部封装成一个新项目(类似xe-utils)
 * todo: Plugins,Configs全部使用按需加载
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-19
 **/

import Configs from './config'
import Plugins from './plugins'
import FormDesign from './index.vue'
import permission from './directive'
import { kebabCase } from '@utils'
import { KEY_COMPONENT_NAME } from '@/global/variable'
import '@/assets/iconfont/iconfont.css'
import { setup } from './core'

export default {
  install (Vue, options = {}) {
    setup(options)
    Vue.use(Configs)
    Vue.use(Plugins)
    Vue.use(permission)
    Vue.component(KEY_COMPONENT_NAME.concat(kebabCase(FormDesign.name)), FormDesign)
  }
}

export * from './core/index'
