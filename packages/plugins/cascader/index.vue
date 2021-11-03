<template>
  <el-cascader v-model="text"
               :options="dic"
               :placeholder="placeholder"
               :props="allProps"
               :size="size"
               :clearable="disabled?false:clearable"
               :show-all-levels="showAllLevels"
               :filterable="filterable"
               :separator="separator"
               :disabled="disabled"
               :collapse-tags="tags"
               :style="customizeStyle"
               @focus="handleFocus"
               @blur="handleBlur"
               @click.native="handleClick"
  >
    <template slot-scope="{data,node}">
      <slot v-if="$scopedSlots.default"
            :data="data"
            :node="node"
      />
      <span v-else>{{ data[labelKey] }}</span>
    </template>
  </el-cascader>
</template>

<script>
import { bindEvent } from '@utils/plugins'
import { DIC_PROPS } from '@/global/variable'
export default {
  name: 'Cascader',
  props: {
    value: {},
    checkStrictly: {
      type: Boolean,
      default: false
    },
    emitPath: {
      type: Boolean,
      default: true
    },
    tags: {
      type: Boolean,
      default: false
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    lazy: {
      type: Boolean,
      default: false
    },
    lazyLoad: Function,
    filterable: {
      type: Boolean,
      default: false
    },
    expandTrigger: {
      type: String,
      default: 'click'
    },
    separator: {
      type: String
    },
    dic: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    props: {
      type: Object,
      default: () => DIC_PROPS
    },
    multiple: {
      type: Boolean,
      default: false
    },
    customizeStyle: {
      type: Object
    }
  },
  data () {
    return {
      text: undefined,
      propsDefault: DIC_PROPS
    }
  },
  computed: {
    labelKey: function () {
      return this.props.label || this.propsDefault.label
    },
    valueKey: function () {
      return this.props.value || this.propsDefault.value
    },
    childrenKey: function () {
      return this.props.children || this.propsDefault.children
    },
    allProps () {
      return {
        label: this.labelKey,
        value: this.valueKey,
        children: this.childrenKey,
        checkStrictly: this.checkStrictly,
        multiple: this.multiple,
        emitPath: this.emitPath,
        lazy: this.lazy,
        lazyLoad: (node, resolve) => {
          const callback = (list) => {
            const findDic = (list, value, children) => {
              list.forEach(ele => {
                if (ele[this.valueKey] == value) {
                  ele[this.childrenKey] = children
                } else if (ele[this.childrenKey]) {
                  findDic(ele[this.childrenKey])
                }
              })
            }
            findDic(this.dic, node[this.valueKey], list)
            resolve(list)
          }
          this.lazyLoad && this.lazyLoad(node, callback)
        },
        expandTrigger: this.expandTrigger
      }
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
    handleFocus (event) {
      bindEvent(this, 'focus', event)
    },
    handleBlur (event) {
      bindEvent(this, 'blur', event)
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
