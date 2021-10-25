import beautifier from '@utils/jsonBeautifier'
import { KEY_COMPONENT_NAME } from '@/global/variable'
import { deepClone } from '@utils'

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
        if (val.storage) localStorage.setItem(KEY_COMPONENT_NAME.concat('form-history'), beautifier(val))
        else localStorage.removeItem(KEY_COMPONENT_NAME.concat('form-history'))
      },
      deep: true
    }
  },
  methods: {
    initHistory (data) {
      if (data.storage) {
        const history = localStorage.getItem(KEY_COMPONENT_NAME.concat('form-history'))
        if (history) {
          this.historySteps = eval('(' + history + ')')
          const { index, steps } = this.historySteps
          return deepClone(steps[index])
        }
      }
      this.historySteps = {
        ...this.historySteps,
        ...data
      }
      const { index, steps } = this.historySteps
      return deepClone(steps[index])
    },
    handleHistoryChange (data) {
      if (this.historySteps.index == this.historySteps.maxStep - 1) this.historySteps.steps.shift()
      else this.historySteps.index++
      this.historySteps.steps[this.historySteps.index] = deepClone(data)
      // 当历史步骤数据数组记录项大于当前索引时,重新截取设置历史步骤数据数组0到当前索引的数据
      if (this.historySteps.index < this.historySteps.steps.length - 1) {
        this.historySteps.steps = this.historySteps.steps.slice(0, this.historySteps.index + 1)
      }
    },
    handleUndo () {
      if (this.historySteps.index != 0) this.historySteps.index--
      return deepClone(this.historySteps.steps[this.historySteps.index])
    },
    handleRedo () {
      if (this.historySteps.index != (this.historySteps.steps.length - 1)) this.historySteps.index++
      return deepClone(this.historySteps.steps[this.historySteps.index])
    }
  }
}
