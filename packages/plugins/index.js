import empty from './empty'
import input from './input'
import form from './form'
import formItem from './form/item'
import select from './select'
import inputNumber from './input-number'
import radio from './radio'
import checkbox from './checkbox'
import { KEY_COMPONENT_NAME } from '@/global/variable'
const components = [
  empty,
  input,
  form,
  formItem,
  select,
  inputNumber,
  radio,
  checkbox
]

const Plugins = {
  install (Vue) {
    if (this.installed) return
    this.installed = true

    components.map(component => {
      Vue.component(KEY_COMPONENT_NAME + component.name, component)
    })
  }
}

export default Plugins
