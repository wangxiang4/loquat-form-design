import Vue from 'vue'
import App from './App'
import '/packages/assets/styles/index.scss'
import LoquatFormDesign from '../packages/'
import request from './request'
Vue.use(LoquatFormDesign, { axios: request })

/** 调式ElementUI源码,打包时可以注释 **/
/* import ElementUI from 'element-ui'
import 'element-ui/packages/theme-chalk/src/index.scss'
Vue.use(ElementUI)*/

Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
