<template>
  <component :is="getComponent(column.type, column.component)"
             ref="formItem"
             v-model="text"
             v-bind="column"
             :column="Object.assign(column, params)"
             :dic="dic"
             :disabled="column.disabled || disabled"
             :readonly="column.readonly || readonly"
             :placeholder="column.placeholder || getPlaceholder(column)"
             :props="column.props || props"
             :size="column.size || size"
             :type="type || column._type || column.type"
             v-on="events"
             @keyup.enter.native="enterChange"
  >
    <span v-if="params.html" v-html="params.html"/>
    <template v-for="item in $scopedSlots[column.prop + 'Type'] ? [column] : []" slot-scope="scope">
      <slot :name="item.prop + 'Type'" v-bind="scope"/>
    </template>
  </component>
</template>

<script>
import { getComponent, getPlaceholder } from '@utils/dataFormat'
export default {
  name: 'FormItem',
  props: {
    value: {},
    dic: {
      type: Array
    },
    props: {
      type: Object
    },
    clearable: {
      type: Boolean
    },
    enter: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    placeholder: {
      type: String
    },
    size: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    readonly: {
      type: Boolean
    },
    column: {
      type: Object,
      default: () => {
        return {}
      }
    },
    eventScript: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      first: false,
      text: undefined
    }
  },
  computed: {
    params () {
      return this.column.params || {}
    },
    events () {
      const events = this.$loquat.deepClone(this.column.events)
      for (const key in events) {
        if (events[key]) {
          const event = this.eventScript.find(item => item.name === events[key])
          events[key] = new Function(event.func)
        } else delete events[key]
      }
      return events || {}
    }
  },
  watch: {
    text: {
      handler (val) {
        if (this.first || !this.$loquat.validateNull(val)) {
          this.first = true
          this.$emit('input', val)
          this.$emit('change', val)
        } else {
          this.first = true
        }
      }
    },
    value: {
      immediate: true,
      handler (val) {
        this.text = val
      }
    }
  },
  methods: {
    getComponent,
    getPlaceholder,
    enterChange () {
      if (this.enter) this.$emit('enter')
    }
  }
}

</script>
