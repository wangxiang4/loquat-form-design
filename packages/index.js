/**
 * @program: loquat-form-design
 *
 * @description: 导出表单设计器
 * todo:考虑稳定一段时间加入按需加载
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-19
 **/

import Config from './config'
import Plugins from './plugins'
import FormDesign from './index.vue'
import permission from './directive'
import { deepClone, setPx, validateNull, get } from '@utils'
import { KEY_COMPONENT_NAME } from '@/global/variable'

export default {
  install (Vue) {
    Vue.use(Config)
    Vue.use(Plugins)
    Vue.use(permission)
    if (!Vue.prototype.$loquat) {
      Vue.prototype.$loquat = {
        setPx: setPx,
        deepClone: deepClone,
        validateNull: validateNull,
        get: get
      }
    } else {
      Vue.prototype.$loquat.setPx = setPx
      Vue.prototype.$loquat.deepClone = deepClone
      Vue.prototype.$loquat.validateNull = validateNull
      Vue.prototype.$loquat.get = get
    }
    Vue.component(KEY_COMPONENT_NAME + FormDesign.name, FormDesign)
  }
}
