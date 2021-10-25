<template>
  <el-switch v-model="text"
             :active-text="active[labelKey]"
             :active-value="active[valueKey]"
             :inactive-value="inactive[valueKey]"
             :inactive-text="inactive[labelKey]"
             :active-icon-class="activeIconClass"
             :inactive-icon-class="inactiveIconClass"
             :active-color="activeColor"
             :inactive-color="inactiveColor"
             :width="len"
             :disabled="disabled"
             :size="size"
             :style="customizeStyle"
             @click.native="handleClick"
  />
</template>

<script>
import { DIC_PROPS } from '@/global/variable'
import { bindEvent } from '@utils/plugins'
export default {
  name: 'Switch',
  props: {
    value: {},
    dic: {
      type: Array,
      default: () => []
    },
    activeIconClass: String,
    inactiveIconClass: String,
    activeColor: String,
    inactiveColor: String,
    len: Number,
    props: {
      type: Object,
      default: () => DIC_PROPS
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
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
    active () {
      return this.dic[1] || {}
    },
    inactive () {
      return this.dic[0] || {}
    },
    valueKey () {
      return this.props.value || this.propsDefault.value
    },
    labelKey () {
      return this.props.label || this.propsDefault.label
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

