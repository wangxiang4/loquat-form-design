<template>
  <component :is="getComponent(getColumn.type, getColumn.component)"
             v-model="text"
             v-bind="plugin"
             :dic="dic"
             :column="getColumn"
             :props="plugin.props || props"
             :disabled="plugin.disabled || disabled"
             :readonly="plugin.readonly || readonly"
             :placeholder="plugin.placeholder || getPlaceholder(getColumn)"
             :size="plugin.size || size"
             :type="type || plugin.type"
             v-on="events"
             @keyup.enter.native="enterChange"
  >
    <span v-if="params.html" v-html="params.html"/>
    <template v-for="item in $scopedSlots[getColumn.prop + 'Type'] ? [getColumn] : []" slot-scope="scope">
      <slot :name="item.prop + 'Type'" v-bind="scope"/>
    </template>
  </component>
</template>

<script>
import { getComponent, getPlaceholder, clearTransformColumnDirtyData } from '@utils/dataFormat'
import { getObjType, deepClone, validateNull } from '@utils'
export default {
  name: 'Widget',
  props: {
    value: {},
    dic: {},
    props: {
      type: Object
    },
    enter: {
      type: Boolean,
      default: false
    },
    type: {
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
    preview: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      first: false,
      text: undefined
    }
  },
  computed: {
    getColumn () {
      const column = deepClone(this.column)
      if (!this.preview) clearTransformColumnDirtyData(column)
      return column
    },
    params () {
      let params = this.getColumn.params || {}
      if (getObjType(params) === 'string') {
        try {
          const execute = eval // 将this指向window
          const parse = execute('(' + params + ')')
          getObjType(parse) === 'object' ? params = parse : params = {}
        } catch (e) {
          params = {}
        }
      }
      return params
    },
    events () {
      return this.getColumn.events || {}
    },
    plugin () {
      const plugin = this.getColumn.plugin || {}
      return Object.assign(plugin, this.params)
    }
  },
  watch: {
    text: {
      handler (val) {
        if (this.first || !validateNull(val)) {
          this.first = true
          this.handleChange(val)
        } else {
          this.first = true
        }
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
    getComponent,
    getPlaceholder,
    enterChange () {
      if (this.enter) this.$emit('enter')
    },
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}

</script>
