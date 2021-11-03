import empty from './empty'
import input from './input'
import form from './form'
import select from './select'
import inputNumber from './input-number'
import radio from './radio'
import checkbox from './checkbox'
import time from './time'
import date from './date'
import rate from './rate'
import color from './input-color'
import Switch from './switch'
import slider from './slider'
import font from './font'
import upload from './upload'
import cascader from './cascader'
import { kebabCase } from '@utils'
import { KEY_COMPONENT_NAME } from '@/global/variable'
const components = [
  empty,
  input,
  form,
  select,
  inputNumber,
  radio,
  checkbox,
  time,
  date,
  rate,
  color,
  Switch,
  slider,
  font,
  upload,
  cascader
]

const Plugins = {
  install (Vue) {
    components.forEach(component => {
      const name = kebabCase(component.name)
      component.name = KEY_COMPONENT_NAME.concat(name)
      Vue.component(component.name, component)
    })
  }
}

export default Plugins
