<template>
  <el-input v-model="text"
            class="loquat-input"
            :size="size"
            :clearable="disabled?false:clearable"
            :type="typeParam"
            :maxlength="maxlength"
            :minlength="minlength"
            :show-password="typeParam=='password'?showPassword:false"
            :autosize="{ minRows: minRows, maxRows: maxRows}"
            :prefix-icon="prefixIcon"
            :suffix-icon="suffixIcon"
            :readonly="readonly"
            :placeholder="placeholder"
            :show-word-limit="showWordLimit"
            :disabled="disabled"
            :autocomplete="autocomplete"
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
export default {
  name: 'LoquatInput',
  props: {
    value: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
    maxlength: {
      type: Number,
      default: undefined
    },
    minlength: {
      type: Number,
      default: undefined
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
      type: String,
      default: ''
    },
    suffixIcon: {
      type: String,
      default: ''
    },
    prependClick: {
      type: Function,
      default: () => { }
    },
    prepend: {
      type: String,
      default: ''
    },
    appendClick: {
      type: Function,
      default: () => { }
    },
    append: {
      type: String,
      default: ''
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
      type: String,
      default: 'off'
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
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}

function bindEvent (safe, name, event) {
  typeof safe[name] === 'function' && safe[name]({ value: safe.value, column: safe.column })
  safe.$emit(name, safe.value, event)
}

</script>
