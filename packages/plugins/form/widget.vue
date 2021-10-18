<template>
  <component :is="getComponent(getColumn.type, getColumn.component)"
             ref="formPlugin"
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
import { getComponent, getPlaceholder } from '@utils/dataFormat'
import { getObjType } from '@utils'
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
      const column = this.$loquat.deepClone(this.column)
      const plugin = column.plugin || {}
      if (!this.preview) {
        switch (column.type) {
          case 'upload':
            // 处理上传数据
            delete plugin.headers
            delete plugin.data
            break
        }
        // 处理动作转换数据
        delete column.events
        // 处理远端请求数据转换
        delete column.remote
        delete column.dicData
        delete column.remoteType
        delete column.remoteFunc
        delete column.remoteOption
        delete column.remoteDataSource
        // 校验规则处理
        delete column.validateConfig
      }
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
