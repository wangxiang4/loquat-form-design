<template>
  <el-row v-if="!column.hide"
          :type="column.flex ? 'flex' : undefined"
          :gutter="column.gutter"
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
              :home="home"
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
    home: {
      required: true,
      type: Object
    }
  }
}
</script>
