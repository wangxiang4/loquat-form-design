/**
 * @program: loquat-form-design
 *
 * @description: 参数规范权限许可证
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-12
 **/

import hasPerm from './hasPerm'
import { KEY_COMPONENT_NAME } from '@/global/variable'
const install = function (Vue) {
  Vue.directive(KEY_COMPONENT_NAME.concat('has-perm'), hasPerm)
}

export default install
