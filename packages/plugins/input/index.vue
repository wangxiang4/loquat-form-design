<template>
  <el-input v-model="text"
            class="loquat-input"
            :size="size"
            :clearable="disabled?false:clearable"
            :type="typeParam"
            :maxlength="maxlength"
            :minlength="minlength"
            :show-password="showPassword"
            :autosize="{ minRows: minRows, maxRows: maxRows}"
            :prefix-icon="prefixIcon"
            :suffix-icon="suffixIcon"
            :readonly="readonly"
            :placeholder="placeholder"
            :show-word-limit="showWordLimit"
            :disabled="disabled"
            :autocomplete="autocomplete"
            :style="customizeStyle"
            @click.native="handleClick"
            @keyup.enter="isSearch?appendClick():''"
            @focus="handleFocus"
            @blur="handleBlur"
  >
    <template v-if="prepend" slot="prepend">
      <span @click="prependClick()">{{ prepend }}</span>
    </template>
    <template v-if="append" slot="append">
      <span @click="appendClick()">{{ append }}</span>
    </template>
    <el-button v-else-if="isSearch"
               slot="append"
               icon="el-icon-search"
               @click="appendClick()"
    />
  </el-input>
</template>

<script>
import { detailDataType } from '@utils'
import { bindEvent } from '@utils/plugins'
export default {
  name: 'Input',
  props: {
    value: {},
    clearable: {
      type: Boolean,
      default: true
    },
    maxlength: {
      type: [Number, String]
    },
    minlength: {
      type: [Number, String]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    showPassword: {
      type: Boolean,
      default: true
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      default: ' _blank'
    },
    prefixIcon: {
      type: String
    },
    suffixIcon: {
      type: String
    },
    prependClick: {
      type: Function,
      default: () => { }
    },
    prepend: {
      type: String
    },
    appendClick: {
      type: Function,
      default: () => { }
    },
    append: {
      type: String
    },
    minRows: {
      type: Number,
      default: 5
    },
    maxRows: {
      type: Number,
      default: 10
    },
    autocomplete: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
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
  computed: {
    isSearch () {
      return this.type == 'search'
    },
    typeParam: function () {
      if (this.type === 'textarea') {
        return 'textarea'
      } else if (this.type === 'password') {
        return 'password'
      } else if (this.type === 'number') {
        return 'number'
      } else {
        return 'text'
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
      value = detailDataType(value, this.type)
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>
