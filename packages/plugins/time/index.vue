<template>
  <div class="loquat-time">
    <el-time-picker v-model="text"
                    :is-range="range"
                    :size="size"
                    :editable="editable"
                    :default-value="defaultValue"
                    :range-separator="rangeSeparator"
                    :arrow-control="arrowControl"
                    :start-placeholder="startPlaceholder"
                    :end-placeholder="endPlaceholder"
                    :format="format"
                    :readonly="readonly"
                    :clearable="disabled?false:clearable"
                    :value-format="valueFormat"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :style="customizeStyle"
                    @change="handleChange"
                    @click.native="handleClick"
    />
  </div>
</template>

<script>
import { bindEvent } from '@utils/plugins'
import { validateNull } from '@utils'
export default {
  name: 'Time',
  props: {
    value: {},
    editable: {
      type: Boolean,
      default: true
    },
    startPlaceholder: {
      type: String,
      default: '开始时间'
    },
    endPlaceholder: {
      type: String,
      default: '结束时间'
    },
    rangeSeparator: {
      type: String
    },
    defaultValue: {
      type: [String, Array]
    },
    valueFormat: {
      default: ''
    },
    arrowControl: {
      type: Boolean,
      default: false
    },
    type: {
      default: ''
    },
    format: {
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    range: {
      type: Boolean,
      default: false
    },
    customizeStyle: {
      type: Object
    }
  },
  data () {
    return {
      text: undefined
    }
  },
  watch: {
    text (n) {
      this.handleChange(n)
      // 当范围选择数组为空时设置位字符串,因为el-time-picker内部规则,空数组会出问题
      if (Array.isArray(this.text) && validateNull(this.text)) {
        this.text = this.text.join(',')
      }
    },
    value: {
      handler () {
        this.initVal()
      }
    }
  },
  created () {
    this.initVal()
  },
  methods: {
    initVal () {
      this.text = this.value
    },
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
    handleClick (event) {
      bindEvent(this, 'click', event)
    }
  }
}
</script>
