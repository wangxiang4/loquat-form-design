<template>
  <el-slider v-model="text"
             :disabled="disabled"
             :vertical="vertical"
             :height="height"
             :step="step"
             :min="min"
             :max="max"
             :range="range"
             :show-stops="showStops"
             :show-input="showInput"
             :marks="marks"
             :format-tooltip="formatTooltip"
             :style="customizeStyle"
             @click.native="handleClick"
  />
</template>

<script>
import { bindEvent } from '@utils/plugins'
export default {
  name: 'Slider',
  props: {
    value: {
      type: Number,
      default: 0
    },
    step: {
      type: Number
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    marks: {
      type: Object
    },
    range: {
      type: Boolean,
      default: false
    },
    showInput: {
      type: Boolean,
      default: false
    },
    showStops: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    },
    formatTooltip: Function,
    height: String,
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
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>
