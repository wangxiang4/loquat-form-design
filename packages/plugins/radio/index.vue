<template>
  <div class="loquat-radio">
    <el-radio-group v-model="text"
                    :size="size"
                    :disabled="disabled"
                    :style="customizeStyle"
                    @change="handleChange"
                    @click.native="handleClick"
    >
      <component :is="componentName"
                 v-for="(item,index) in dic"
                 :key="index"
                 :style="inlineStyle"
                 :label="item[valueKey]"
                 :border="border"
                 :readonly="readonly"
                 :disabled="item[disabledKey]"
      >{{ showLabel ? item[labelKey] : item[valueKey] }}</component>
    </el-radio-group>
  </div>
</template>

<script>
import { bindEvent } from '@utils/plugins'
import { DIC_PROPS } from '@/global/variable'
export default {
  name: 'Radio',
  props: {
    value: {},
    size: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    button: {
      type: Boolean,
      default: false
    },
    dic: {
      type: Array,
      default: () => []
    },
    border: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => DIC_PROPS
    },
    inline: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    customizeStyle: {
      type: Object
    }
  },
  data () {
    return {
      name: 'radio',
      text: undefined,
      propsDefault: DIC_PROPS
    }
  },
  computed: {
    componentName () {
      return `el-${this.name}${this.button ? '-button' : ''}`
    },
    valueKey () {
      return this.props.value || this.propsDefault.value
    },
    disabledKey () {
      return this.props.disabled || this.propsDefault.disabled
    },
    labelKey () {
      return this.props.label || this.propsDefault.label
    },
    inlineStyle () {
      return this.inline ? { display: 'inline-block' } : { display: 'block' }
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
