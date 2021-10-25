<template>
  <div class="loquat-rate">
    <el-rate v-model="text"
             :max="max"
             :texts="texts"
             :allow-half="allowHalf"
             :show-text="showText"
             :low-threshold="lowThreshold"
             :high-threshold="highThreshold"
             :void-color="voidColor"
             :disabled-void-color="disabledVoidColor"
             :disabled-void-icon-class="disabledVoidIconClass"
             :show-score="showScore"
             :text-color="textColor"
             :icon-classes="iconClasses"
             :void-icon-class="voidIconClass"
             :disabled="disabled"
             :colors="colors"
             :score-template="scoreTemplate"
             :style="customizeStyle"
             @change="handleChange"
             @click.native="handleClick"
    />
    <template v-if="showEmpty">
      <el-button type="text"
                 class="loquat-rate__empty"
                 @click="handleChange(0)"
      >清空</el-button>
    </template>
  </div>
</template>

<script>
import { bindEvent } from '@utils/plugins'
export default {
  name: 'Rate',
  props: {
    value: {
      type: Number,
      default: 0
    },
    colors: {
      type: Array
    },
    max: {
      type: Number,
      default: 5
    },
    iconClasses: {
      type: Array
    },
    texts: {
      type: Array
    },
    showText: {
      type: Boolean,
      default: false
    },
    voidIconClass: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowHalf: {
      type: Boolean,
      default: false
    },
    lowThreshold: {
      type: Number
    },
    highThreshold: {
      type: Number
    },
    voidColor: {
      type: String
    },
    disabledVoidColor: {
      type: Number
    },
    disabledVoidIconClass: {
      type: String
    },
    showScore: {
      type: Boolean,
      default: false
    },
    textColor: {
      type: String
    },
    scoreTemplate: {
      type: String
    },
    showEmpty: {
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
