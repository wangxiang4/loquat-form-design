import Config from './config'
import Plugins from './plugins'
import FormDesign from './index.vue'

export default {
  install (Vue) {
    Vue.use(Config)
    Vue.use(Plugins)
    Vue.component('Avue' + FormDesign.name, FormDesign)
  }
}
