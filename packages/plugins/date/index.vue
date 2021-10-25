<template>
  <div class="loquat-date">
    <el-date-picker v-model="text"
                    :type="type"
                    :size="size"
                    :editable="editable"
                    :unlink-panels="unlinkPanels"
                    :readonly="readonly"
                    :default-value="defaultValue"
                    :default-time="defaultTime"
                    :range-separator="rangeSeparator"
                    :start-placeholder="startPlaceholder"
                    :end-placeholder="endPlaceholder"
                    :format="format"
                    :clearable="disabled?false:clearable"
                    :picker-options="pickerOptions"
                    :value-format="valueFormat"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :style="customizeStyle"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    @click.native="handleClick"
    />
  </div>
</template>

<script>
import { bindEvent } from '@utils/plugins'
export default {
  name: 'Date',
  props: {
    value: {},
    editable: {
      type: Boolean,
      default: true
    },
    unlinkPanels: {
      type: Boolean,
      default: false
    },
    startPlaceholder: {
      type: String,
      default: '开始日期'
    },
    endPlaceholder: {
      type: String,
      default: '结束日期'
    },
    rangeSeparator: {
      type: String
    },
    defaultValue: {
      type: [String, Array]
    },
    defaultTime: {
      type: [String, Array]
    },
    pickerOptions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: 'date'
    },
    valueFormat: {
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
    handleBlur (event) {
      bindEvent(this, 'blur', event)
    },
    handleFocus (event) {
      bindEvent(this, 'focus', event)
    },
    handleClick (event) {
      bindEvent(this, 'click', event)
    },
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>

