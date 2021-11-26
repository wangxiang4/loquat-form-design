import Vue from 'vue'
import App from './App'
import request from './request'

/** 调式ElementUI源码,打包时可以注释 **/
/* import ElementUI from 'element-ui'
import 'element-ui/packages/theme-chalk/src/index.scss'
Vue.use(ElementUI)*/

// 开发版
/* import LoquatFormDesign from '../packages'
Vue.use(LoquatFormDesign, { axiosInstance: request })*/

// 发布版
import LoquatFormDesign from '../lib/loquat-form-design.umd.min.js'
import '../lib/loquat-form-design.css'
Vue.use(LoquatFormDesign, { axiosInstance: request })

Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
