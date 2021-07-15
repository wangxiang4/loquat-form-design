import empty from './empty'
import input from './input'
import form from './form'
import { KEY_COMPONENT_NAME } from '@/global/variable'
const components = [
  empty,
  input,
  form
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
