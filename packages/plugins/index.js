import empty from './empty'

const components = [
  empty
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
