import beautifier from '@utils/jsonBeautifier'
import { KEY_COMPONENT_NAME_HTML } from '@/global/variable'

export default {
  data () {
    return {
      historySteps: {
        index: 0,
        maxStep: 20,
        steps: [],
        storage: false
      }
    }
  },
  watch: {
    historySteps: {
      handler (val) {
        if (val.storage) localStorage.setItem(KEY_COMPONENT_NAME_HTML + 'form-history', beautifier(val))
        else localStorage.removeItem(KEY_COMPONENT_NAME_HTML + 'form-history')
      },
      deep: true
    }
  },
  methods: {
    initHistory (data) {
      if (data.storage) {
        const history = localStorage.getItem(KEY_COMPONENT_NAME_HTML + 'form-history')
        if (history) {
          this.historySteps = eval('(' + history + ')')
          const { index, steps } = this.historySteps
          return this.$loquat.deepClone(steps[index])
        }
      }
      this.historySteps = {
        ...this.historySteps,
        ...data
      }
      const { index, steps } = this.historySteps
      return this.$loquat.deepClone(steps[index])
    },
    handleHistoryChange (data) {
      if (this.historySteps.index == this.historySteps.maxStep - 1) this.historySteps.steps.shift()
      else this.historySteps.index++
      this.historySteps.steps[this.historySteps.index] = this.$loquat.deepClone(data)

      if (this.historySteps.index < this.historySteps.steps.length - 1) {
        this.historySteps.steps = this.historySteps.steps.slice(0, this.historySteps.index + 1)
      }
    },
    handleUndo () {
      if (this.historySteps.index != 0) this.historySteps.index--
      return this.$loquat.deepClone(this.historySteps.steps[this.historySteps.index])
    },
    handleRedo () {
      if (this.historySteps.index != (this.historySteps.steps.length - 1)) this.historySteps.index++
      return this.$loquat.deepClone(this.historySteps.steps[this.historySteps.index])
    }
  }
}
