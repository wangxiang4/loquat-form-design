<template>
  <el-input-number v-model.number="text"
                   class="loquat-input-number"
                   :precision="precision"
                   :placeholder="placeholder"
                   :size="size"
                   :min="minRows"
                   :max="maxRows"
                   :step="step"
                   :clearable="disabled?false:clearable"
                   :controls-position="controlsPosition"
                   :controls="controls"
                   :label="placeholder"
                   :disabled="disabled"
                   :style="customizeStyle"
                   @focus="handleFocus"
                   @blur="handleBlur"
                   @click.native="handleClick"
  />
</template>

<script>
import { bindEvent } from '@utils/plugins'
export default {
  name: 'InputNumber',
  props: {
    value: {},
    controls: {
      type: Boolean,
      default: true
    },
    step: {
      type: Number,
      default: 1
    },
    controlsPosition: {
      type: String,
      default: 'right'
    },
    precision: {
      type: Number
    },
    minRows: {
      type: Number,
      default: -Infinity
    },
    maxRows: {
      type: Number,
      default: Infinity
    },
    placeholder: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
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
    text: {
      handler (n) {
        this.handleChange(n)
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
    handleClick (event) {
      bindEvent(this, 'click', event)
    },
    handleFocus (event) {
      bindEvent(this, 'focus', event)
    },
    handleBlur (event) {
      bindEvent(this, 'blur', event)
    },
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>
