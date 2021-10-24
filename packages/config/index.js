import custom from './custom'
import input from './input'
import select from './select'
import inputNumber from './input-number'
import radio from './radio'
import checkbox from './checkbox'
import time from './time'
import date from './date'
import rate from './rate'
import inputColor from './input-color'
import Switch from './switch'
import slider from './slider'
import font from './font'
import upload from './upload'
import cascader from './cascader'
import coralLayout from './coral-layout'
import column from './coral-layout/column'
import { KEY_COMPONENT_CONFIG_NAME } from '@/global/variable'
import { kebabCase } from '@utils'
const components = [
  custom,
  input,
  select,
  inputNumber,
  radio,
  checkbox,
  time,
  date,
  rate,
  inputColor,
  Switch,
  slider,
  font,
  upload,
  cascader,
  coralLayout,
  column
]

const Config = {
  install (Vue) {
    if (this.installed) return
    this.installed = true

    components.map(component => {
      const name = kebabCase(component.name)
      // 检查当前name是否有唯一标识,没有加上,确保注册组件唯一
      !name.includes(KEY_COMPONENT_CONFIG_NAME) ? component.name = KEY_COMPONENT_CONFIG_NAME.concat(name) : ''
      Vue.component(component.name, component)
    })
  }
}

export default Config
