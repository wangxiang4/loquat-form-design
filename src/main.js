import Vue from 'vue'
import App from './App'
import '/packages/assets/styles/index.scss'
import LoquatFormDesign from '../packages/'
Vue.use(LoquatFormDesign)
/** 目前开发先挂载一些通用库,打包通过内部挂载 **/
import {
  setPx,
  deepClone
} from '@utils'
import { validateNull } from '@utils/validate'

Vue.prototype.setPx = setPx
Vue.prototype.deepClone = deepClone
Vue.prototype.validatenull = validateNull

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
