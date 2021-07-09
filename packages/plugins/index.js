import empty from './empty'
import input from './input'
import form from './form'
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
      Vue.component(component.name, component)
    })
  }
}

export default Plugins
