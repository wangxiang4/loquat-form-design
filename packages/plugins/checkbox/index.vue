<template>
  <div class="loquat-checkbox">
    <template v-if="all">
      <el-checkbox v-model="checkAll"
                   :indeterminate="isIndeterminate"
                   @change="handleCheckAll"
      >全选</el-checkbox>
      <div style="margin: 5px 0;"/>
    </template>
    <el-checkbox-group v-model="text"
                       :disabled="disabled"
                       :size="size"
                       :min="min"
                       :max="max"
                       :style="customizeStyle"
                       @change="handleCheckChange"
                       @click.native="handleClick"
    >
      <component :is="componentName"
                 v-for="(item,index) in dic"
                 :key="index"
                 :style="inlineStyle"
                 :label="item[valueKey]"
                 :border="border"
                 :size="size"
                 :disabled="item[disabledKey]"
      >{{ showLabel ? item[labelKey] : item[valueKey] }}</component>
    </el-checkbox-group>
  </div>
</template>

<script>
import { DIC_PROPS } from '@/global/variable'
import { bindEvent } from '@utils/plugins'
export default {
  name: 'Checkbox',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    all: {
      type: Boolean,
      default: false
    },
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
    props: {
      type: Object,
      default: () => DIC_PROPS
    },
    inline: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number
    },
    max: {
      type: Number
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
      checkAll: false,
      isIndeterminate: false,
      name: 'checkbox',
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
    dic () {
      this.handleCheckChange(this.text)
    },
    text: {
      handler (val) {
        this.handleChange(val)
        this.handleCheckChange(val)
      },
      immediate: true
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
    },
    handleCheckAll (val) {
      if (!this.all) return
      this.text = val ? this.dic.map(ele => ele[this.valueKey]) : []
      this.isIndeterminate = false
    },
    handleCheckChange (value = []) {
      if (!this.all) return
      const checkedCount = value.length
      if (checkedCount === 0) return
      const dicLen = this.dic.length
      this.checkAll = checkedCount === dicLen
      this.isIndeterminate = checkedCount > 0 && checkedCount < dicLen
    }
  }
}
</script>

