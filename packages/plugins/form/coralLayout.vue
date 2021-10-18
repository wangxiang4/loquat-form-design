<template>
  <el-row v-if="!column.hide"
          :type="column.flex ? 'flex' : undefined"
          :gutter="column.gutter ? column.gutter : 0"
          :justify="column.justify"
          :align="column.align"
          :class="column.customClass"
  >
    <el-col v-for="(col, colIndex) in column.cols"
            :key="colIndex"
            :class="col.customClass"
            :md="col.md"
            :offset="col.offset"
            :push="col.push"
            :pull="col.pull"
    >
      <template v-for="(column, index) in col.list">
        <item :key="index"
              :column="column"
              :widgets="col.list"
              :loquat-form="loquatForm"
        />
      </template>
    </el-col>
  </el-row>
</template>
<script>
import item from './item'
export default {
  name: 'CoralLayout',
  components: { item },
  props: {
    column: {
      type: Object
    },
    widgets: {
      required: true,
      type: Array
    },
    loquatForm: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
    }
  }
}
</script>
