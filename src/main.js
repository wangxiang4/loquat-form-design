import Vue from 'vue'
import App from './App'
import request from './request'

/** 调式ElementUI源码,打包时可以注释 */
/* import ElementUI from 'element-ui'
import 'element-ui/packages/theme-chalk/src/index.scss'
Vue.use(ElementUI)*/

// 开发版,目前不支持按需加载,后期会填补此功能
import { install, remoteFunc, remoteOption } from '../packages/all'
Vue.use(install, { axiosInstance: request })
Vue.prototype.remoteFunc = remoteFunc
Vue.prototype.remoteOption = remoteOption

// 发布版
/* import LoquatFormDesign from '../lib/loquat-form-design.umd.min.js'
import '../lib/loquat-form-design.css'
Vue.use(LoquatFormDesign, { axiosInstance: request })*/

Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
