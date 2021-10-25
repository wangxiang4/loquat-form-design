<template>
  <div class="loquat-input-color">
    <el-input v-model="text"
              :placeholder="placeholder"
              :size="size"
              :clearable="disabled?false:clearable"
              :disabled="disabled"
              :style="customizeStyle"
              @change="handleChange"
    >
      <template slot="append">
        <el-color-picker v-model="text"
                         :size="size"
                         :show-alpha="showAlpha"
                         :color-format="colorFormat"
                         :popper-class="popperClass"
                         :predefine="predefineColors"
                         @change="handleChange"
        />
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'InputColor',
  props: {
    value: {},
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
    showAlpha: {
      type: Boolean,
      default: false
    },
    colorFormat: {
      type: String
    },
    popperClass: {
      type: String
    },
    predefineColors: {
      type: Array,
      default: () => [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ]
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
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>
