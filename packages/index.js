import Config from './config'
import Plugins from './plugins'
import FormDesign from './index.vue'

export default {
  install (Vue) {
    Vue.use(Config)
    Vue.use(Plugins)
    Vue.component('Loquat' + FormDesign.name, FormDesign)
  }
}
