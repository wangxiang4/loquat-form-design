import Vue from 'vue'
import App from './App'
import '/packages/assets/styles/index.scss'
import LoquatFormDesign from '../packages/'
Vue.use(LoquatFormDesign)

Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
