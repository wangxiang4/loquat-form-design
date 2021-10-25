<template>
  <div v-show="text"
       class="loquat-font"
       :class="[
         typeClass,
         center ? 'is-center' : '',
         'is-' + effect
       ]"
  >
    <span v-if="$slots.default && !text"><slot/></span>
    <span v-if="text && !$slots.default">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'Font',
  props: {
    value: {},
    center: {
      type: Boolean,
      default: false
    },
    effectType: {
      type: String,
      default: 'default'
    },
    effect: {
      type: String,
      default: 'light',
      validator: function (value) {
        return ['light', 'dark'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      text: undefined
    }
  },
  computed: {
    typeClass () {
      return `loquat-font__${this.effectType}`
    }
  },
  watch: {
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
    }
  }
}
</script>
