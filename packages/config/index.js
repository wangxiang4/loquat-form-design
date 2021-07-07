import Custom from './custom.vue'
import Input from './input.vue'

const components = [
  Custom,
  Input
]

const Config = {
  install (Vue) {
    if (this.installed) return
    this.installed = true

    components.map(component => {
      Vue.component(component.name, component)
    })
  }
}

export default Config
