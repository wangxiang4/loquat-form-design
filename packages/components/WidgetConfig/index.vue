<template>
  <div class="widget-config">
    <el-form v-if="!validateNull(data)" label-position="top" size="small">
      <component :is="getComponentConfig(data.type, data.component)" :data="data"/>
    </el-form>
    <plugin-empty v-else desc="拖拽字段进行配置" style="margin-top: 100%;"/>
  </div>
</template>

<script>
import { validateNull } from '@utils'
import pluginEmpty from '@/plugins/empty'
import { getComponentConfig } from '@utils/dataFormat'
export default {
  name: 'WidgetConfig',
  components: { pluginEmpty },
  props: {
    data: {
      type: Object
    }
  },
  methods: {
    validateNull,
    getComponentConfig
  }
}
</script>
