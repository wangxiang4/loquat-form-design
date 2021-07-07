<template>
  <div class="widget-config">
    <el-form v-if="data && Object.keys(data).length > 0" label-position="top" size="small">
      <component :is="getComponent" :data="data"/>
    </el-form>
    <loquat-empty v-else desc="拖拽字段进行配置" style="margin-top: 100%;"/>
  </div>
</template>

<script>
import fields from './fields.js'

const dateArr = [
  'year', 'month', 'week', 'date', 'datetime', 'time', 'daterange', 'timerange', 'datetimerange', 'dates'
]

export default {
  name: 'WidgetConfig',
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      fields
    }
  },
  computed: {
    getComponent () {
      const prefix = 'config-'
      const { type, component } = this.data
      if ((!type || component) && type != 'ueditor') return prefix + 'custom'
      let result = 'input'

      if ([undefined, 'input', 'password', 'url'].includes(type)) result = 'input'
      else if (dateArr.includes(type)) result = 'date'
      else if (['array', 'img'].includes(type)) result = 'array'
      else if (['tree', 'cascader'].includes(type)) result = 'tree'
      else if (['radio', 'checkbox', 'select'].includes(type)) result = 'select'
      else result = type

      return prefix + result
    }
  },
  methods: {
    async handleChangeType (type) {
      if (type) {
        const config = await this.getConfigByType(type)
        config.prop = this.data.prop
        for (const key in config) {
          if (config && Object.prototype.hasOwnProperty.call(config, key) && !['icon', 'label', 'span'].includes(key)) {
            const val = config[key]
            this.$set(this.data, key, val)
          }
        }
      }
    },
    getConfigByType (type) {
      return new Promise((resolve, reject) => {
        fields.forEach(field => {
          field.list.forEach(config => {
            if (config.type == type) resolve(config)
          })
        })
        reject()
      })
    }
  }
}
</script>
