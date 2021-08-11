<template>
  <component :is="getComponent(col.type, col.component)"
             ref="formItem"
             v-model="text"
             v-bind="col"
             :column="Object.assign(col, params)"
             :dic="dic"
             :disabled="col.disabled || disabled"
             :readonly="col.readonly || readonly"
             :placeholder="col.placeholder || getPlaceholder(col)"
             :props="col.props || props"
             :size="col.size || size"
             :type="type || col.type"
             v-on="events"
             @keyup.enter.native="enterChange"
  >
    <span v-if="params.html" v-html="params.html"/>
    <template v-for="item in $scopedSlots[col.prop + 'Type'] ? [col] : []" slot-scope="scope">
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
    col () {
      const col = this.$loquat.deepClone(this.column)
      // 排除表单设计时插件显示没有经过处理的报错字段
      if (!this.preview) {
        // 处理动作转换数据
        delete col.events
        // 处理远端请求数据转换
        delete col.static
        delete col.dicData
        delete col.remoteDataSource
        delete col.remoteType
        delete col.remoteFunc
        delete col.remoteOption
        // 校验规则处理
        delete col.validateConfig
      }
      return col
    },
    params () {
      return this.col.params || {}
    },
    events () {
      return this.col.events || {}
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
