import Vue from 'vue'
import App from './App'
import '/packages/assets/styles/index.scss'
import LoquatFormDesign from '../packages/'
import request from './request'
Vue.use(LoquatFormDesign, { axios: request })

Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
