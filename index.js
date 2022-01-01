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
 */
import * as LoquatFormDesignExport from './packages/all'

export * from './packages/all'
export default LoquatFormDesignExport
