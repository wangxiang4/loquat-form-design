<template>
  <div class="loquat-time">
    <el-time-picker v-model="text"
                    :is-range="range"
                    :size="size"
                    :style="customizeStyle"
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
                    @change="handleChange"
                    @click.native="handleClick"
                    :disabled="disabled"
    />
  </div>
</template>

<script>
import { bindEvent } from '@utils/plugins'
export default {
  name: 'Time',
  inheritAttrs: false,
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
    customizeStyle: {
      type: Object
    },
    range: {
      type: Boolean,
      default: false
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
      if (Array.isArray(this.text) && this.$loquat.validateNull(this.text)) {
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
  mounted () { },
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
