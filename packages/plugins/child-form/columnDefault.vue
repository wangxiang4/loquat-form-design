<template>
  <div>
    <el-table-column width="1px"/>
    <!-- 子表单操作列 -->
    <el-table-column v-if="!widgetChildForm.indexExecute"
                     :label="widgetChildForm.indexExecuteLabel || childFormDefaultConfig.indexExecuteLabel"
                     :fixed="widgetChildForm.indexExecuteFixed || undefined"
                     :width="widgetChildForm.indexExecuteWidth || childFormDefaultConfig.indexExecuteWidth"
                     align="center"
                     header-align="center"
    >
      <div slot-scope="scope" style="min-height: 52px">
        <el-button v-if="(!childForm.readonly || !childForm.disabled) && childForm.hoverMark[scope.row.$index]"
                   @click="childForm.rowCellDel(scope.row.$index)"
                   type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   circle
        />
        <div v-else>{{scope.row.$index+1}}</div>
      </div>
    </el-table-column>
    <el-table-column v-if="columns.length == 0"/>
  </div>
</template>

<script>
export default {
  name: 'ColumnDefault',
  inject: ['childFormProvide'],
  computed: {
    childForm () {
      return this.childFormProvide || {}
    },
    columns () {
      return this.childForm.columns || []
    },
    widgetChildForm () {
      return this.childForm.widgetChildForm || {}
    },
    childFormDefaultConfig () {
      return this.childForm.childFormDefaultConfig || {}
    }
  }
}
</script>
