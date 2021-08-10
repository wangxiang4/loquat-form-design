import Vue from 'vue'
import App from './App'
import '/packages/assets/styles/index.scss'
import LoquatFormDesign from '../packages/'
Vue.use(LoquatFormDesign, {
  remoteOption: {
    optionDemo: [
      { value: '4399小游戏', label: '4399小游戏' },
      { value: '7k7k小游戏', label: '7k7k小游戏' },
      { value: '拇指玩小游戏', label: '拇指玩小游戏' }
    ]
  },
  remoteFunc: {
    funcDemo: function () {
      return [
        { value: '小白兔', label: '小白兔' },
        { value: '煎饼果子', label: '煎饼果子' },
        { value: '彩虹猫', label: '彩虹猫' }
      ]
    }
  }
})

Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
