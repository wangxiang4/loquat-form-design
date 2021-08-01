<template>
  <div class="widget-config">
    <el-form v-if="!$loquat.validateNull(data)" label-position="top" size="small">
      <component :is="getComponentConfig(data.type, data.component)" :data="data" :home="home"/>
    </el-form>
    <loquat-empty v-else desc="拖拽字段进行配置" style="margin-top: 100%;"/>
  </div>
</template>

<script>
import { getComponentConfig } from '@utils/dataFormat'
export default {
  name: 'WidgetConfig',
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    home: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    getComponentConfig
  }
}
</script>
