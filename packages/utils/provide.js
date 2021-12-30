/**
 * @program: loquat-form-design
 *
 * @description: 对外提供工具
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-08-04
 */

import jsonBeautifier from './jsonBeautifier'

export const LoquatUtils = {
  jsonBeautify: jsonBeautifier
}

// 支持参数解构
export const jsonBeautify = jsonBeautifier

export default LoquatUtils
