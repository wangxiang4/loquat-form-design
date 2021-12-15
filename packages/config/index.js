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
import childForm from './child-form'
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
  column,
  childForm
]

const Configs = {
  install (Vue) {
    components.forEach(component => {
      const name = kebabCase(component.name)
      component.name = KEY_COMPONENT_CONFIG_NAME.concat(name)
      Vue.component(component.name, component)
    })
  }
}

export default Configs
