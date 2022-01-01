import Configs from './config'
import Plugins from './plugins'
import FormDesign from './index.vue'
import permission from './directive'
import { kebabCase } from '@utils'
import { KEY_COMPONENT_NAME } from '@/global/variable'
import { setup } from './core'

// todo: 资源文件后期通过gulp流构建填补
import '@/assets/icons'
import '@/assets/iconfont/iconfont.css'

// 默认安装
export function install (Vue, options = {}) {
  setup(options)
  Vue.use(Configs)
  Vue.use(Plugins)
  Vue.use(permission)
  Vue.component(KEY_COMPONENT_NAME.concat(kebabCase(FormDesign.name)), FormDesign)
}

export * from './core'
export * from './utils/provide'
