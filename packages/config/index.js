import Custom from './custom.vue'
import Input from './input.vue'
import select from './select'
import inputNumber from './inputNumber'
import radio from './radio'
import checkbox from './checkbox'
import time from './time'
import date from './date'
import { KEY_COMPONENT_CONFIG_NAME } from '@/global/variable'
const components = [
  Custom,
  Input,
  select,
  inputNumber,
  radio,
  checkbox,
  time,
  date
]

const Config = {
  install (Vue) {
    if (this.installed) return
    this.installed = true

    components.map(component => {
      Vue.component(KEY_COMPONENT_CONFIG_NAME + component.name, component)
    })
  }
}

export default Config
