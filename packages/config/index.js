import Custom from './custom.vue'
import Input from './input.vue'
import select from './select'
import { KEY_COMPONENT_CONFIG_NAME } from '@/global/variable'
const components = [
  Custom,
  Input,
  select
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
