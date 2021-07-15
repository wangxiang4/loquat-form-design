<template>
  <div>
    <component :is="getComponent(item.type, item.component)"
               v-bind="Object.assign($loquat.deepClone(item), params, { size:item.size || 'small' })"
               :multiple="false"
               :placeholder="item.placeholder || getPlaceholder(item)"
    >
      <span v-if="params.html" v-html="params.html"/>
    </component>
  </div>
</template>
<script>
import { getComponent, getPlaceholder } from '@utils/dataFormat'
export default {
  name: 'WidgetFormItem',
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    params: {
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
    getComponent,
    getPlaceholder
  }
}
</script>
