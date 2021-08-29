import Custom from './custom.vue'
import Input from './input.vue'
import select from './select'
import inputNumber from './inputNumber'
import radio from './radio'
import checkbox from './checkbox'
import time from './time'
import date from './date'
import rate from './rate'
import color from './inputColor'
import _switch from './switch'
import { KEY_COMPONENT_CONFIG_NAME } from '@/global/variable'
const components = [
  Custom,
  Input,
  select,
  inputNumber,
  radio,
  checkbox,
  time,
  date,
  rate,
  color,
  _switch
]

const Config = {
  install (Vue) {
    if (this.installed) return
    this.installed = true

    components.map(component => {
      // 检查当前name是否有唯一标识,没有加上,确保注册组件唯一
      (typeof component.name === 'string' && !component.name.includes(KEY_COMPONENT_CONFIG_NAME))
        ? component.name = KEY_COMPONENT_CONFIG_NAME + component.name : ''
      Vue.component(component.name, component)
    })
  }
}

export default Config
